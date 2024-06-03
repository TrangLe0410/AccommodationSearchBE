import * as authService from '../services/auth'
import jwt from 'jsonwebtoken'
export const register = async (req, res) => {
    const { name, phone, email, password } = req.body
    try {
        if (!name || !phone || !email || !password) return res.status(400).json({
            err: 1,
            msg: 'Missing inputs !'
        })
        const response = await authService.registerService(req.body)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller: ' + error
        })
    }
}

export const login = async (req, res) => {
    const { phone, password } = req.body
    try {
        if (!phone || !password) return res.status(400).json({
            err: 1,
            msg: 'Missing inputs!'
        })

        const response = await authService.loginService(req.body)
        if (response.err === 0) {
            // Gửi mã token JWT thành công, bạn cần kiểm tra vai trò ở đây
            const tokenData = jwt.decode(response.token);
            const userRole = await authService.getUserRole(tokenData.id); // Lấy vai trò của người dùng từ cơ sở dữ liệu
            const redirectUrl = userRole === 'admin' ? '/dashboard' : '/*';
            return res.status(200).json({ ...response, redirectUrl });
        } else {
            return res.status(400).json(response);
        }

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller: ' + error
        })
    }
}