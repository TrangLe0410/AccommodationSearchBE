import * as postService from '../services/post'

export const getPosts = async (req, res) => {
    try {
        const response = await postService.getPostsService()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}
export const getPostsLimit = async (req, res) => {
    const { page, priceNumber, areaNumber, ...query } = req.query
    try {
        const response = await postService.getPostsLimitService(page, query, { priceNumber, areaNumber })
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}

export const getNewPosts = async (req, res) => {
    try {
        const response = await postService.getNewPostService()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}


export const createNewPost = async (req, res) => {
    try {
        const { categoryCode, title, priceNumber, areaNumber, label } = req.body
        const { id } = req.user
        if (!categoryCode || !id || !title || !priceNumber || !areaNumber || !label) return res.status(400).json({
            err: 1,
            msg: 'Missing inputs'
        })
        const response = await postService.createNewPostService(req.body, id)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}

export const getPostsLimitAdmin = async (req, res) => {
    const { page, ...query } = req.query
    const { id } = req.user
    try {
        if (!id) return res.status(400).json({
            err: 1,
            msg: 'Mising inputs'
        })
        const response = await postService.getPostsLimitAdminService(page, id, query)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}

export const updatePost = async (req, res) => {
    const { postId, overviewId, imagesId, attributesId, ...payload } = req.body
    const { id } = req.user
    try {
        if (!postId || !id || !overviewId || !imagesId || !attributesId) return res.status(400).json({
            err: 1,
            msg: 'Mising inputs'
        })
        const response = await postService.updatePost(req.body)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}

export const deletePost = async (req, res) => {
    const { postId } = req.query
    const { id } = req.user
    try {
        if (!postId || !id) return res.status(400).json({
            err: 1,
            msg: 'Mising inputs'
        })
        const response = await postService.deletePost(postId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}


export const approvePost = async (req, res) => {
    const { postId } = req.body;
    const { id } = req.user; // Assume user ID is required for authentication
    try {
        if (!postId || !id) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing inputs'
            });
        }
        const response = await postService.approvePostService(postId, id);

        // Trả về kết quả
        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        });
    }
};

export const cancelPost = async (req, res) => {
    const { postId } = req.body;
    const { id } = req.user; // Assume user ID is required for authentication
    try {
        if (!postId || !id) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing inputs'
            });
        }
        const response = await postService.cancelPostService(postId, id);

        // Trả về kết quả
        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        });
    }
};

export const getPostsByStar = async (req, res) => {
    try {
        const response = await postService.getPostsByStarService();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        });
    }
};


export const getRelatedPosts = async (req, res) => {
    const { postId } = req.query
    try {
        const response = await postService.getRelatedPostsService(postId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed to get related posts: ' + error
        });
    }
};
export const markPost = async (req, res) => {
    // const {  } = req.query;
    const { userId, postId } = req.body;

    try {
        if (!userId || !postId) {
            return res.status(400).json({ err: 1, msg: 'Missing inputs' });
        }

        const response = await postService.markPostService(userId, postId);

        if (response.err === 1) {
            // Nếu bài đăng đã được lưu, trả về thông báo tương ứng
            return res.status(200).json({ msg: response.msg });
        }

        // Nếu bài đăng chưa được lưu, trả về thông báo thành công
        res.status(201).json({ message: 'Post marked successfully' });

    } catch (error) {
        console.error('Failed to mark post:', error);
        res.status(500).json({ err: -1, msg: 'Failed to mark post' });
    }
};

export const getMarkedPosts = async (req, res) => {
    const { id: userId } = req.user; // Assuming user ID is obtained from req.user

    try {
        if (!userId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing user ID',
            });
        }

        const response = await postService.getMarkedPostsService(userId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed to retrieve marked posts: ' + error,
        });
    }
};

export const updatePostStarController = async (req, res) => {
    try {
        // Gọi hàm service để cập nhật trường star cho các bài đăng
        const updateResult = await postService.updatePostStar();

        // Trả về kết quả thành công nếu không có lỗi từ service
        return res.status(200).json({
            err: 0,
            msg: updateResult.msg
        });
    } catch (error) {
        // Xử lý lỗi nếu có bất kỳ lỗi nào từ service
        console.error('Failed to update stars:', error);
        return res.status(500).json({
            err: -1,
            msg: 'Failed to update stars: ' + error.message
        });
    }
};


export const hidePost = async (req, res) => {
    const { postId } = req.query;
    const { id } = req.user; // Assume user ID is required for authentication
    try {
        if (!postId || !id) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing inputs'
            });
        }
        const response = await postService.hidePostService(postId, id);

        // Trả về kết quả
        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        });
    }
};

export const visiblePost = async (req, res) => {
    const { postId } = req.query;
    const { id } = req.user; // Assume user ID is required for authentication
    try {
        if (!postId || !id) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing inputs'
            });
        }
        const response = await postService.visiblePostService(postId, id);

        // Trả về kết quả
        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        });
    }
};


export const countPosts = async (req, res) => {
    try {
        const response = await postService.countPostsService(); // Call countPostsService from your service layer
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error counting posts:', error);
        return res.status(500).json({
            err: -1,
            msg: 'Failed to count posts: ' + error
        });
    }
};

export const countPostsThisMonth = async (req, res) => {
    try {
        const response = await postService.countPostsThisMonthService();
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error counting posts this month:', error);
        return res.status(500).json({
            err: -1,
            msg: 'Failed to count posts this month: ' + error.message
        });
    }
};

export const countPostsByMonth = async (req, res) => {
    try {
        const year = req.query.year || new Date().getFullYear(); // Lấy năm từ query, nếu không có thì lấy năm hiện tại
        const response = await postService.countPostsByMonthService(year);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error counting posts by month:', error);
        return res.status(500).json({
            err: -1,
            msg: 'Failed to count posts by month: ' + error.message
        });
    }
};

export const getDistrictPostCountController = async (req, res) => {
    try {
        // Gọi hàm service để lấy dữ liệu
        const districtStats = await postService.getDistrictPostCountService();

        // Trả về kết quả thành công
        return res.json({
            err: 0,
            msg: 'Get district post count successfully',
            districtStats,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: 1, msg: 'Internal server error' });
    }
};