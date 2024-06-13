// routes/notification.js
const express = require('express');
const router = express.Router();

import Stripe from 'stripe';
import verifyToken from '../middlewares/verifyToken';
const stripe = Stripe(process.env.STRIPE_KEY)
const { Payment, User, PaymentHistory } = require('../models');



router.get("/all-payment-history", async (req, res) => {
    try {
        const paymentHistories = await PaymentHistory.findAll({
            order: [['datetime_transaction', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email'] // Thêm thông tin người dùng
                },
            ],
            attributes: ['id', 'postId', 'typePost', 'typeActive', 'money', 'status', 'paymentMethod', 'datetime_transaction', 'balanceBeforePayment']
        });

        res.status(200).json({ paymentHistories });
    } catch (error) {
        console.error("Error fetching all payment history:", error);
        res.status(500).json({ error: "An error occurred while fetching all payment history" });
    }
});
router.use(verifyToken);



router.post("/create-checkout-session", async (req, res) => {
    try {
        const { price } = req.body;
        const amount = parseInt(price, 10);

        if (isNaN(amount)) {
            return res.status(400).json({ error: "Invalid amount provided" });
        }

        const { id: userId } = req.user;

        const customer = await stripe.customers.create({
            metadata: {
                userId: userId.toString(),
            },
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: "vnd",
                    product_data: {
                        name: "Nạp tiền vào tài khoản",
                        description: `Số tiền ${amount} VND`,
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: "payment",
            customer: customer.id,
            success_url: `${process.env.CLIENT_URL}/he-thong/nap-tien?session_id={CHECKOUT_SESSION_ID}&success=true`,
            cancel_url: `${process.env.CLIENT_URL}/he-thong/nap-tien?canceled=true`,
        });

        res.status(200).json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "An error occurred while creating the checkout session" });
    }
});

router.post("/payment-success", async (req, res) => {
    try {
        const { session_id } = req.body;
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const { id: userId } = req.user;
            if (!userId) {
                return res.status(400).json({ error: "User ID is missing in the session metadata" });
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const amount = session.amount_total; // Convert amount from cents to VND
            user.balance += amount;
            await user.save();

            await Payment.create({
                userId: userId,
                money: amount,
                status_transaction: true,
                content_transaction: 'Nạp tiền vào tài khoản',
                sessionId: session.id,
                datetime_transaction: new Date()
            });

            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false });
        }
    } catch (error) {
        console.error("Error confirming payment:", error);
        res.status(500).json({ error: "An error occurred while confirming the payment" });
    }
});




router.get("/transaction-history", async (req, res) => {
    try {
        const { id: userId } = req.user; // Lấy thông tin người dùng từ token

        // Truy vấn lịch sử giao dịch của người dùng từ cơ sở dữ liệu
        const transactions = await Payment.findAll({
            where: { userId: userId },
            order: [['datetime_transaction', 'DESC']],
            attributes: ['id', 'money', 'status_transaction', 'content_transaction', 'datetime_transaction'],
        });

        res.status(200).json({ transactions });
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        res.status(500).json({ error: "An error occurred while fetching transaction history" });
    }
});

router.post("/payment-credit-card", async (req, res) => {
    try {
        const { amount, postId, typePost, action } = req.body;
        const { id: userId } = req.user;
        const parsedAmount = parseInt(amount, 10);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const customer = await stripe.customers.create({
            metadata: {
                userId: userId.toString(),
            },
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: "vnd",
                    product_data: {
                        name: "Thanh toán qua thẻ tín dụng",
                        description: `Số tiền ${parsedAmount} VND`,
                    },
                    unit_amount: parsedAmount,
                },
                quantity: 1,
            }],
            mode: "payment",
            customer: customer.id,
            success_url: `${process.env.CLIENT_URL}/he-thong/quan-ly-bai-dang?session_id={CHECKOUT_SESSION_ID}&success=true`,
            cancel_url: `${process.env.CLIENT_URL}/he-thong/quan-ly-bai-dang?canceled=true`,
        });

        // Tạo mới payment history với số dư trước khi thanh toán
        const paymentHistory = await PaymentHistory.create({
            userId,
            postId,
            typePost,
            typeActive: action === 'show' ? 'newPost' : 'showPost',
            money: parsedAmount,
            status: 'Đã thanh toán',
            paymentMethod: 'creditCard',
            balanceBeforePayment: user.balance // Ghi số dư trước khi thanh toán
        });

        res.status(200).json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error("Error creating credit card payment session:", error);
        res.status(500).json({ error: "An error occurred while creating the credit card payment session" });
    }
});

router.post("/confirm-payment-credit-card", async (req, res) => {
    try {
        const { session_id, action } = req.body;
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const paymentHistory = await PaymentHistory.findOne({ where: { sessionId: session_id } });
            if (paymentHistory) {
                if (action === 'hide') {
                    paymentHistory.typeActive = 'hidePost';
                } else {
                    paymentHistory.typeActive = 'newPost';
                }
                paymentHistory.status = 'Đã thanh toán';
                await paymentHistory.save();
            }

            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false });
        }
    } catch (error) {
        console.error("Error confirming payment:", error);
        res.status(500).json({ error: "An error occurred while confirming the payment" });
    }
});

router.post("/payment-account-balance", async (req, res) => {
    try {
        const { amount, postId, typePost, action } = req.body;
        const { id: userId } = req.user;
        const parsedAmount = parseInt(amount, 10);

        if (isNaN(parsedAmount) || parsedAmount < 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.balance < parsedAmount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        // Tạo mới payment history với số dư trước khi thanh toán
        const paymentHistory = await PaymentHistory.create({
            userId,
            postId,
            typePost,
            typeActive: action === 'show' ? 'newPost' : 'showPost',
            money: parsedAmount,
            status: 'Đã thanh toán',
            paymentMethod: 'accountBalance',
            balanceBeforePayment: user.balance // Ghi số dư trước khi thanh toán
        });

        user.balance -= parsedAmount;
        await user.save();

        res.status(200).json({ message: "Payment successful" });
    } catch (error) {
        console.error("Error processing account balance payment:", error);
        res.status(500).json({ error: "An error occurred while processing the payment" });
    }
});


router.get("/payment-history", async (req, res) => {
    try {
        const { id: userId } = req.user;

        const paymentHistory = await PaymentHistory.findAll({
            where: { userId: userId },
            order: [['datetime_transaction', 'DESC']],
            attributes: ['id', 'postId', 'typePost', 'typeActive', 'money', 'status', 'paymentMethod', 'datetime_transaction', 'balanceBeforePayment'],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email'] // Include user details if needed
                }
            ]
        });

        res.status(200).json({ paymentHistory });
    } catch (error) {
        console.error("Error fetching payment history:", error);
        res.status(500).json({ error: "An error occurred while fetching payment history" });
    }
});




module.exports = router;



