// routes/notification.js
const express = require('express');
const router = express.Router();

import Stripe from 'stripe';
import verifyToken from '../middlewares/verifyToken.js';
const stripe = Stripe(process.env.STRIPE_KEY)

router.use(verifyToken);

const { Payment, User } = require('../models');

router.post("/create-checkout-session", async (req, res) => {
    try {
        const { price } = req.body;
        const { id: userId } = req.user; // Lấy thông tin người dùng từ token

        // Tạo khách hàng mới trong Stripe
        const customer = await stripe.customers.create({
            metadata: {
                userId: userId, // Lưu thông tin người dùng vào metadata
            },
        });

        // Định nghĩa sản phẩm thanh toán
        const line_items = [{
            price_data: {
                currency: "vnd",
                product_data: {
                    name: "Số tiền nạp",
                    description: "Nộp tiền vào tài khoản",
                },
                unit_amount: parseInt(price), // Chuyển đổi giá trị tiền tệ và đơn vị tiền
            },
            quantity: 1, // Số lượng sản phẩm
        }];

        // Tạo phiên thanh toán trên Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            customer: customer.id,
            success_url: `${process.env.CLIENT_URL}/he-thong/nap-tien?success=true`,
            cancel_url: `${process.env.CLIENT_URL}/he-thong/nap-tien?canceled=true`,
        });

        // Lưu thông tin thanh toán vào cơ sở dữ liệu
        const payment = await Payment.create({
            userId: userId,
            money: parseInt(price), // Lưu giá trị tiền tệ chính xác
            status_transaction: true,
            content_transaction: 'Nạp tiền vào tài khoản',
            sessionId: session.id,
            datetime_transaction: new Date()
        });

        // Cập nhật số dư người dùng ngay tại đây
        const user = await User.findByPk(userId);
        if (user) {
            user.balance += parseInt(price); // Cộng số tiền vào số dư
            await user.save();
        }

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "An error occurred while creating the checkout session" });
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





module.exports = router;



