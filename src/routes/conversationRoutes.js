const express = require('express');
const { v4: uuidv4 } = require('uuid');
import db from '../models/modelIndex.js';
import { Op } from 'sequelize';
import verifyToken from '../middlewares/verifyToken.js';
const router = express.Router();
router.use(verifyToken);

// Tạo phòng chat mới
router.post('/', async (req, res) => {
    const { user1Id, user2Id } = req.body;

    if (!user1Id || !user2Id) {
        return res.status(400).json({ error: 'user1Id and user2Id are required' });
    }

    try {
        // Kiểm tra nếu đã tồn tại một phòng chat giữa hai người dùng với cả hai user1Id và user2Id đều trùng
        const existingConversation = await db.Conversation.findOne({
            where: {
                [Op.or]: [
                    { user1Id, user2Id },
                    { user1Id: user2Id, user2Id: user1Id }
                ]
            }
        });

        if (existingConversation) {
            return res.status(400).json({ error: 'Conversation already exists' });
        }

        // Tạo phòng chat mới nếu không tồn tại
        const newConversation = await db.Conversation.create({
            id: uuidv4(),
            user1Id,
            user2Id
        });

        res.status(201).json(newConversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/room-chat', async (req, res) => {
    const { userId } = req.user.id;

    try {
        // Tìm các phòng chat mà người dùng tham gia với userId là user1Id hoặc user2Id
        const userConversations = await db.Conversation.findAll({
            $or: [{ user1Id: userId }, { user2Id: userId }]
        });

        res.status(200).json(userConversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/room-chat-by-user', async (req, res) => {
    const userId = req.user.id;

    try {
        // Tìm các phòng chat mà người dùng tham gia với userId là user1Id hoặc user2Id
        const userConversations = await db.Conversation.findAll({
            where: {
                [Op.or]: [{ user1Id: userId }, { user2Id: userId }]
            },
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(userConversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;