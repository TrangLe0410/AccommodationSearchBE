const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
import 'dotenv/config';
import initRoutes from './src/routes/index.js';

import connectDatabase from './src/config/connectDatabase.js';

const { Message, Notification } = require('./src/models');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
// Initialize Express app
const app = express();

// Configure CORS
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize routes
initRoutes(app);

// Connect to the database
connectDatabase();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io server
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
    },
});

app.set('io', io);

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on('send_message', async (data) => {
        const currentTimeInVietnam = moment().tz('Asia/Ho_Chi_Minh').format();
        try {
            const newMessage = await Message.create({
                id: uuidv4(),
                conversationId: data.conversationId,
                userId: data.userId,
                message: data.message,
                time: currentTimeInVietnam,
                unread: true,
            });

            // Emit new message to the room
            io.to(data.conversationId).emit('receive_message', newMessage);

            // Fetch the latest message for the room
            const latestMessage = await Message.findOne({
                where: { conversationId: data.conversationId },
                order: [['time', 'DESC']]
            });

            // Emit the latest message for the sidebar update
            io.emit('last_message_update', {
                conversationId: data.conversationId,
                message: newMessage
            });
            io.emit('new_message', {
                conversationId: data.conversationId,
                message: newMessage
            });

            console.log('Message created successfully');
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('mark_as_read', async (data) => {
        try {
            await Message.update({ unread: false }, {
                where: { conversationId: data.conversationId }
            });

            // Emit an event to update the unread count on the frontend
            io.emit('update_unread_count', {
                conversationId: data.conversationId,
                unreadCount: 0
            });


            console.log('Messages marked as read successfully');
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    });

    socket.on('send_notification', async (data) => {
        try {
            // Save notification to database with unread status
            await Notification.create({
                userId: data.userId,
                content: data.content,
                appointmentId: data.appointmentId,
                read: false
            });

            // Emit socket event to notify clients about new notification
            io.emit('new_notification_created');

            console.log('Notification created successfully');
        } catch (error) {
            console.error('Error saving notification:', error);
        }
    });


    socket.on('mark_notifications_as_read', async (data) => {
        try {
            // Update unread notifications to read for the user
            await Notification.update(
                { read: true },
                { where: { userId: data.userId, read: false } }
            );
            // Gửi sự kiện socket để thông báo cho tất cả các client khác về việc đã cập nhật trạng thái của thông báo
            io.emit('notifications_marked_as_read', { userId: data.userId });

        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    });






    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

// Start server
const port = process.env.PORT || 8888;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
