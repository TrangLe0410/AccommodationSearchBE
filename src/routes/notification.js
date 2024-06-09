// routes/notification.js
const express = require('express');
const router = express.Router();
const { Notification } = require('../models/notification.js');
import verifyToken from '../middlewares/verifyToken.js';

router.use(verifyToken);
router.post('/create-notification', async (req, res) => {
    try {
        const { userId, content, appointmentId } = req.body; // Thêm appointmentId từ req.body
        const notification = await Notification.create({ userId, content, appointmentId }); // Thêm appointmentId khi tạo notification
        res.status(201).json(notification);
    } catch (error) {
        console.error('Error saving notification:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get-notification', async (req, res) => {
    try {
        // Lấy thông báo của người dùng từ cơ sở dữ liệu
        const notifications = await Notification.findAll({
            where: { userId: req.user.id }, // Đảm bảo chỉ lấy thông báo của người dùng hiện tại
            order: [['createdAt', 'DESC']],
        });
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/unread-notification-count', async (req, res) => {
    try {
        // Lấy số lượng thông báo chưa đọc của người dùng từ cơ sở dữ liệu
        const unreadCount = await Notification.count({
            where: { userId: req.user.id, read: false }, // Đảm bảo chỉ đếm số lượng thông báo chưa đọc của người dùng hiện tại
        });
        res.json({ count: unreadCount });
    } catch (error) {
        console.error('Error fetching unread notification count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;
