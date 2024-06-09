import * as commentService from '../services/comment.js';
import * as userService from '../services/user.js'
export const createNewComment = async (req, res) => {
    const { userId, postId, content, rate } = req.body; // Thêm trường rate
    try {
        if (!userId || !postId || !content || rate === undefined) { // Kiểm tra nếu trường rate không được gửi
            return res.status(400).json({ err: 1, msg: 'Missing inputs or rate' });
        }
        await commentService.createNewCommentService(userId, postId, content, rate); // Truyền rate vào hàm tạo mới bình luận
        res.status(201).json({ message: 'Comment created successfully' });
    } catch (error) {
        console.error('Failed to create comment:', error);
        res.status(500).json({ err: -1, msg: 'Failed to create comment' });
    }
};
export const getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await commentService.getCommentsByPostId(postId);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Failed to get comments:', error);
        res.status(500).json({ err: -1, msg: 'Failed to get comments' });
    }
};

export const getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await userService.getUserById(userId);
        res.status(200).json(user);
    } catch (error) {
        console.error('Failed to get user:', error);
        res.status(500).json({ err: -1, msg: 'Failed to get user' });
    }
};

export const deleteComment = async (req, res) => {
    const { commentId } = req.query;
    const { id: userId } = req.user; // Lấy id của người dùng hiện tại


    try {
        // Gọi service để xóa bình luận
        await commentService.deleteCommentService(commentId, userId);


        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Failed to delete comment:', error);
        res.status(500).json({ err: -1, msg: 'Failed to delete comment' });
    }
};

export const hideComment = async (req, res) => {
    const { commentId } = req.query;
    const { id: userId } = req.user; // Get the current user's id

    try {
        // Call the service to hide the comment
        await commentService.hideCommentService(commentId, userId);

        res.status(200).json({ message: 'Comment hidden successfully' });
    } catch (error) {
        console.error('Failed to hide comment:', error);
        res.status(500).json({ err: -1, msg: 'Failed to hide comment' });
    }
};
