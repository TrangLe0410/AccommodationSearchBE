import db from '../models';
import { v4 as generateId } from 'uuid';

export const createNewCommentService = async (userId, postId, content, rate) => {
    try {
        const commentId = generateId();
        await db.Comment.create({
            id: commentId,
            userId,
            postId,
            content,
            lastUpdate: new Date().toISOString(),
            rate: rate // Thêm trường rate
        });
    } catch (error) {
        throw error;
    }
};
export const getCommentsByPostId = async (postId) => {
    try {
        const comments = await db.Comment.findAll({
            where: {
                postId: postId
            },
            include: [
                { model: db.User, as: 'user' } // Include user information
            ],
            order: [['createdAt', 'DESC']],
        });
        return comments;
    } catch (error) {
        throw error;
    }
};

export const deleteCommentService = async (commentId, userId) => {
    try {
        // Tìm bình luận cần xóa
        const comment = await db.Comment.findOne({ where: { id: commentId } });

        if (!comment) {
            throw new Error('Comment not found');
        }

        // Kiểm tra xem người dùng hiện tại có phải là tác giả của bình luận không
        if (comment.userId !== userId) {
            throw new Error('You are not authorized to delete this comment');
        }

        // Xóa bình luận từ cơ sở dữ liệu
        await comment.destroy();
    } catch (error) {
        throw error.message; // Trả về thông báo lỗi
    }
};


export const hideCommentService = async (commentId, userId) => {
    try {
        // Find the comment to be hidden
        const comment = await db.Comment.findOne({ where: { id: commentId } });

        if (!comment) {
            throw new Error('Comment not found');
        }

        // Check if the current user is the author of the comment
        if (comment.userId !== userId) {
            throw new Error('You are not authorized to hide this comment');
        }

        // Update the 'hidden' field to true
        await comment.update({ hidden: true });
    } catch (error) {
        throw error.message; // Return the error message
    }
};
