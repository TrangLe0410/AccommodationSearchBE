import express from 'express';
import * as commentController from '../controllers/comment'
import verifyToken from '../middlewares/verifyToken';

const router = express.Router();

router.use(verifyToken);

router.post('/create-comment', commentController.createNewComment);
router.get('/comments/:postId', commentController.getCommentsByPostId);
router.get('/user/:userId', commentController.getUserById);
router.delete('/delete-comment', commentController.deleteComment);
router.put('/hide-comment', commentController.hideComment);
export default router;