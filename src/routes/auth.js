import express from 'express'
import * as authController from '../controllers/auth'
import verifyToken from '../middlewares/verifyToken'
const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/protectedRoute', verifyToken, (req, res) => {
    // Middleware verifyToken đã chứng thực mã token, vì vậy chúng ta có thể truy cập thông tin người dùng qua req.user
    const user = req.user
    // Thực hiện các hành động cần thiết, chẳng hạn kiểm tra quyền truy cập của người dùng và phản hồi
    res.status(200).json({ user })
})

export default router