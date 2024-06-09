import authRouter from './auth.js';
import insertRouter from './insert.js';
import categoryRouter from './category.js';
import priceRouter from './price.js';
import areaRouter from './area.js';
import postRouter from './post.js';
import provinceRouter from './province.js';
import userRouter from './user.js';
import appointmentRouter from './appointment.js';
import commentRouter from './comment.js';
import statisticalRouter from './statistical.js';
import messageRoutes from './messageRoutes.js';
import conversationRoutes from './conversationRoutes.js';
import notificationRouter from './notification.js';
import paymentRouter from './payment.js';
const initRoutes = (app) => {
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/insert', insertRouter);
    app.use('/api/v1/category', categoryRouter);
    app.use('/api/v1/price', priceRouter);
    app.use('/api/v1/area', areaRouter);
    app.use('/api/v1/post', postRouter);
    app.use('/api/v1/province', provinceRouter);
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/appointment', appointmentRouter);
    app.use('/api/v1/comment', commentRouter);
    app.use('/api/v1/statistical', statisticalRouter);
    app.use('/api/v1/conversations', conversationRoutes);
    app.use('/api/v1/messages', messageRoutes);
    app.use('/api/v1/notification', notificationRouter);
    app.use('/api/v1/payment', paymentRouter);

    return app.use('/', (req, res) => {
        res.send('server on...');
    });
};

export default initRoutes;