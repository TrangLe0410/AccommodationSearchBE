const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Message, Conversation } = require('../models');
const moment = require('moment-timezone');
const { Op } = require("sequelize");
const router = express.Router();
import verifyToken from '../middlewares/verifyToken.js';

router.use(verifyToken);
// Gửi tin nhắn mới
router.post("/sendMessage", async (req, res) => {
    try {
        const { conversationId, userId, message } = req.body;
        const currentTimeInVietnam = moment().tz('Asia/Ho_Chi_Minh').format();

        // Thực hiện lưu tin nhắn vào cơ sở dữ liệu ở đây
        const newMessage = await Message.create({
            id: uuidv4(),
            conversationId,
            userId,
            message,
            time: currentTimeInVietnam,
        });

        // Gửi tin nhắn đến tất cả các người dùng trong phòng
        req.app.get('io').to(conversationId).emit('receive_message', newMessage);

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Error saving message' });
    }
});

router.get("/get-messages-by-room", async (req, res) => {
    try {
        // Lấy conversationId từ query
        const { conversationId } = req.query;

        // Kiểm tra xem conversationId có tồn tại không
        if (!conversationId) {
            return res.status(400).json({ error: 'conversationId is required' });
        }

        // Truy vấn cơ sở dữ liệu để lấy tin nhắn trong conversationId
        const messages = await Message.findAll({
            where: {
                conversationId: conversationId
            },
            order: [['createdAt', 'ASC']] // Sắp xếp theo thời gian tăng dần
        });

        // Trả về danh sách tin nhắn
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ error: 'Error retrieving messages' });
    }
});


router.get("/get-latest-message-by-room", async (req, res) => {
    try {
        // Get the conversationId from the query
        const { conversationId } = req.query;

        // Check if conversationId exists
        if (!conversationId) {
            return res.status(400).json({ error: 'conversationId is required' });
        }

        // Query the database to get the latest message in the conversationId
        const latestMessage = await Message.findOne({
            where: { conversationId },
            order: [['createdAt', 'DESC']] // Get the latest message based on createdAt
        });

        // Return the latest message
        res.status(200).json(latestMessage);
    } catch (error) {
        console.error('Error retrieving latest message:', error);
        res.status(500).json({ error: 'Error retrieving latest message' });
    }
});

router.get('/unread-messages', async (req, res) => {
    try {
        const { conversationId } = req.query;
        const { id: receiverUserId } = req.user;

        if (!conversationId || !receiverUserId) {
            return res.status(400).json({ error: 'conversationId and receiverUserId are required' });
        }

        // Lấy số tin nhắn chưa đọc trong phòng chat dựa trên conversationId
        const unreadMessagesCount = await Message.count({
            where: {
                conversationId: conversationId,
                userId: { [Op.ne]: receiverUserId },
                unread: true
            }
        });

        res.status(200).json({ unreadMessagesCount });
    } catch (error) {
        console.error('Error fetching unread messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/total-unread-messages-for-user', async (req, res) => {
    try {
        const { id: receiverUserId } = req.user;

        // Kiểm tra xem userId có tồn tại không
        if (!receiverUserId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        // Lấy danh sách tất cả các phòng mà người nhận tham gia
        const userConversations = await Conversation.findAll({
            where: {
                [Op.or]: [{ user1Id: receiverUserId }, { user2Id: receiverUserId }]
            }
        });

        // Tổng hợp số tin nhắn chưa đọc từ tất cả các phòng
        let totalUnreadMessages = 0;
        for (const conversation of userConversations) {
            const unreadMessagesCount = await Message.count({
                where: { conversationId: conversation.id, userId: { [Op.ne]: receiverUserId }, unread: true }
            });
            totalUnreadMessages += unreadMessagesCount;
        }

        res.status(200).json({ totalUnreadMessages });
    } catch (error) {
        console.error('Error fetching total unread messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
