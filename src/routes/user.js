import express from 'express'
import verifyToken from '../middlewares/verifyToken'
import * as userController from '../controllers/user'

const router = express.Router()
router.get('/count-allUser', userController.countUser)
router.get('/count-by-moth', userController.countUsersFromMay2024);
router.use(verifyToken)
router.get('/get-current', userController.getCurrent)
router.get('/get-all-user', userController.getAllUser)
router.put('/update-profile', userController.updateProfile)

export default router