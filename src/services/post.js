import db from '../models'
const { Op } = require("sequelize");
import { v4 as generateId } from 'uuid'
import generateCode from '../ultis/generateCode'
import moment from 'moment'
import generateDate from '../ultis/genarateDate';
export const getPostsService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest: true,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone', 'avatar'] },
                { model: db.Overview, as: 'overviews' },
                { model: db.Label, as: 'labelData', attributes: { exclude: ['createdAt', 'updateAt'] } },
            ],
            order: [['createdAt', 'DESC']],
            // attributes: ['id', 'title', 'star', 'address', 'description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Getting posts is failed.',
            response
        })

    } catch (error) {
        reject(error)
    }
})

export const getPostsLimitService = (page, { limitPost, order, ...query }, { priceNumber, areaNumber }) => new Promise(async (resolve, reject) => {
    try {
        let offset = (!page || +page <= 1) ? 0 : (+page - 1)
        const queries = { ...query }
        const limit = +limitPost || +process.env.LIMIT
        queries.limit = limit
        if (priceNumber) query.priceNumber = { [Op.between]: priceNumber }
        if (areaNumber) query.areaNumber = { [Op.between]: areaNumber }
        if (order) queries.order = [order]
        const response = await db.Post.findAndCountAll({
            where: query,
            raw: true,
            nest: true,
            offset: offset * limit,
            ...queries,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone', 'avatar'] },
                { model: db.Overview, as: 'overviews' },
                { model: db.Label, as: 'labelData', attributes: { exclude: ['createdAt', 'updateAt'] } },
            ],
            // order: [['createdAt', 'DESC']],
            // attributes: ['id', 'title', 'star', 'address', 'description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Create post succsess' : 'Getting posts is failed.',
            response
        })

    } catch (error) {
        reject(error)
    }
})

export const getNewPostService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest: true,
            offset: 0,
            order: [['createdAt', 'DESC']],
            limit: +process.env.LIMIT,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
            ],
            // attributes: ['id', 'title', 'star', 'createdAt']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Getting posts is failed.',
            response
        })

    } catch (error) {
        reject(error)
    }
})



export const createNewPostService = async (body, userId) => {
    try {
        const attributesId = generateId();
        const imagesId = generateId();
        const overviewId = generateId();
        const labelCode = generateCode(body.label);
        const hashtag = `#${Math.floor(Math.random() * Math.pow(10, 6))}`;
        const currentDate = generateDate();

        let provinceCode = null;
        if (body.address) {
            const addressArr = body.address.split(',');
            if (addressArr.length >= 2) {
                provinceCode = generateCode(addressArr[addressArr.length - 2].trim());
            }
        }

        await Promise.all([
            db.Post.create({
                id: generateId(),
                title: body.title,
                labelCode,
                address: body.address || null,
                attributesId,
                categoryCode: body.categoryCode || null,
                description: JSON.stringify(body.description) || null,
                userId,
                overviewId,
                imagesId,
                areaCode: body.areaCode || null,
                priceCode: body.priceCode || null,
                provinceCode,
                priceNumber: body.priceNumber,
                areaNumber: body.areaNumber,
                status: 'pending'
            }),
            db.Attribute.create({
                id: attributesId,
                price: +body.priceNumber < 1 ? `${+body.priceNumber * 1000} đồng/tháng` : `${body.priceNumber} triệu/tháng`,
                acreage: `${body.areaNumber} m2`,
                published: moment(new Date).format('DD/MM/YYYY'),
                hashtag
            }),
            db.Image.create({
                id: imagesId,
                image: JSON.stringify(body.images)
            }),
            db.Overview.create({
                id: overviewId,
                code: hashtag,
                area: body.label,
                type: body.category,
                target: body.target || '',
                bonus: 'Tin thường',
                created: currentDate.today,
                expired: currentDate.expireDay,
            }),
            db.Province.findOrCreate({
                where: {
                    value: body.address ? body.address.split(',').slice(-2)[0].trim() : null
                },
                defaults: {
                    code: provinceCode || null,
                    value: body.address ? body.address.split(',').slice(-2)[0].trim() : null
                }
            }),
            db.Label.findOrCreate({
                where: {
                    code: labelCode
                },
                defaults: {
                    code: labelCode,
                    value: body.label
                }
            })
        ]);

        return {
            err: 0,
            msg: 'OK',
        };
    } catch (error) {
        throw error;
    }
};

export const getPostsLimitAdminService = (page, id, query) => new Promise(async (resolve, reject) => {
    try {
        let offset = (!page || +page <= 1) ? 0 : (+page - 1)
        const queries = { ...query, userId: id }

        const response = await db.Post.findAndCountAll({
            where: queries,
            raw: true,
            nest: true,
            offset: offset * +process.env.LIMIT,
            limit: +process.env.LIMIT,
            order: [['createdAt', 'DESC']],
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone', 'avatar'] },
                { model: db.Overview, as: 'overviews' },

            ],
            // attributes: ['id', 'title', 'star', 'address', 'description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Retrieve posts success' : 'Failed to retrieve posts',
            response
        })

    } catch (error) {
        reject(error)
    }
})

export const updatePost = ({ postId, overviewId, imagesId, attributesId, ...body }) => new Promise(async (resolve, reject) => {
    try {
        const labelCode = generateCode(body.label)
        let provinceCode = null;
        if (body.address) {
            const addressArr = body.address.split(',');
            if (addressArr.length >= 2) {
                provinceCode = generateCode(addressArr[addressArr.length - 2].trim());
            }
        }


        await db.Post.update({
            title: body.title,
            labelCode,
            address: body.address || null,
            categoryCode: body.categoryCode || null,
            description: JSON.stringify(body.description) || null,
            areaCode: body.areaCode || null,
            priceCode: body.priceCode || null,
            provinceCode,
            priceNumber: body.priceNumber,
            areaNumber: body.areaNumber
        }, {
            where: { id: postId }
        })

        await db.Attribute.update({
            price: +body.priceNumber < 1 ? `${+body.priceNumber * 1000} đồng/tháng` : `${body.priceNumber} triệu/tháng`,
            acreage: `${body.areaNumber} m2`,
        }, {
            where: { id: attributesId }
        })
        await db.Image.update({
            image: JSON.stringify(body.images)
        }, {
            where: { id: imagesId }
        })
        await db.Overview.update({
            area: body.label,
            type: body?.category,
            target: body?.target,
        }, {
            where: { id: overviewId }
        })

        db.Province.findOrCreate({
            where: {
                value: body.address ? body.address.split(',').slice(-2)[0].trim() : null
            },
            defaults: {
                code: provinceCode || null,
                value: body.address ? body.address.split(',').slice(-2)[0].trim() : null
            }
        }),
            await db.Label.findOrCreate({
                where: {
                    code: labelCode
                },
                defaults: {
                    code: labelCode,
                    value: body.label
                }

            })
        resolve({
            err: 0,
            msg: 'Update is succsess',
        })

    } catch (error) {
        reject(error)
    }
})

export const deletePost = (postId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.destroy({
            where: { id: postId }

        })
        resolve({
            err: response > 0 ? 0 : 1,
            msg: response > 0 ? 'Delete post succsess' : 'No post delete',
        })

    } catch (error) {
        reject(error)
    }
})

export const getPostById = async (postId) => {
    try {
        const post = await db.Post.findOne({
            where: {
                id: postId
            }
        });
        return post;
    } catch (error) {
        throw error;
    }
};


export const approvePostService = async (postId, userId) => {
    try {
        const post = await db.Post.findOne({ where: { id: postId } });
        if (!post) {
            return {
                err: 1,
                msg: 'Post not found'
            };
        }

        if (post.status !== 'Pending') {
            return {
                err: 1,
                msg: 'Post cannot be approved'
            };
        }
        await post.update({ status: 'Approved' });

        return {
            err: 0,
            msg: 'Post approved successfully'
        };
    } catch (error) {
        throw error;
    }
};
export const cancelPostService = async (postId, userId) => {
    try {
        const post = await db.Post.findOne({ where: { id: postId } });
        if (!post) {
            return {
                err: 1,
                msg: 'Post not found'
            };
        }

        if (post.status !== 'Pending') {
            return {
                err: 1,
                msg: 'Post cannot be canceled'
            };
        }
        await post.update({ status: 'Canceled' });

        return {
            err: 0,
            msg: 'Post canceled successfully'
        };
    } catch (error) {
        throw error;
    }
};

export const getPostsByStarService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest: true,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone', 'avatar'] },
                { model: db.Overview, as: 'overviews' },
                { model: db.Label, as: 'labelData', attributes: { exclude: ['createdAt', 'updateAt'] } },
            ],
            order: [['star', 'DESC']],
        });
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Retrieve posts by star success' : 'Failed to retrieve posts by star',
            response
        });
    } catch (error) {
        reject(error);
    }
});

export const getRelatedPostsService = async (postId) => {
    try {
        // Lấy thông tin của bài đăng hiện tại
        const currentPost = await db.Post.findOne({
            where: { id: postId },
            attributes: ['provinceCode', 'categoryCode', 'priceNumber', 'areaNumber']
        });

        if (!currentPost) {
            return {
                err: 1,
                msg: 'Current post not found'
            };
        }


        const relatedPosts = await db.Post.findAll({
            where: {
                id: { [Op.not]: postId }, // Loại trừ bài đăng hiện tại
                provinceCode: currentPost.provinceCode,
                categoryCode: currentPost.categoryCode,
                priceNumber: {
                    [Op.between]: [currentPost.priceNumber - 1, currentPost.priceNumber + 1] // Ví dụ: Phạm vi +/- 100
                },
                areaNumber: {
                    [Op.between]: [currentPost.areaNumber - 5, currentPost.areaNumber + 5] // Ví dụ: Phạm vi +/- 100
                }

            },
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone', 'avatar'] },
                { model: db.Overview, as: 'overviews' },
                { model: db.Label, as: 'labelData', attributes: { exclude: ['createdAt', 'updateAt'] } }
            ],
            order: [['createdAt', 'DESC']]
        });

        return {
            err: 0,
            msg: 'Related posts retrieved successfully',
            relatedPosts
        };

    } catch (error) {
        throw error;
    }
};

export const markPostService = async (userId, postId) => {
    try {
        // Kiểm tra xem bài đăng đã được lưu trước đó hay chưa
        const existingSavedPost = await db.SavedPost.findOne({
            where: {
                postId: postId
            }
        });

        // Nếu bài đăng đã được lưu, trả về thông báo tương ứng
        if (existingSavedPost) {
            return {
                err: 1,
                msg: 'This post has already been saved'
            };
        }

        // Nếu bài đăng chưa được lưu, tiến hành tạo đánh dấu mới
        const id = generateId();
        await db.SavedPost.create({
            id: id,
            userId,
            postId
        });

        // Trả về thông báo thành công
        return {
            err: 0,
            msg: 'Post marked successfully'
        };

    } catch (error) {
        throw error;
    }
};
export const getMarkedPostsService = async (userId) => {
    try {
        const markedPosts = await db.SavedPost.findAll({
            where: { userId },
            include: [
                {
                    model: db.Post,
                    as: 'post',
                    include: [
                        { model: db.Image, as: 'images', attributes: ['image'] },
                        { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                        { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone', 'avatar'] },
                        { model: db.Overview, as: 'overviews' },
                        { model: db.Label, as: 'labelData', attributes: { exclude: ['createdAt', 'updateAt'] } },
                    ],
                },
            ],
        });

        return {
            err: 0,
            msg: 'Marked posts retrieved successfully',
            markedPosts,
        };
    } catch (error) {
        throw error;
    }
};

export const updatePostStar = async () => {
    try {
        const postsWithComments = await db.Post.findAll({
            include: [
                { model: db.Comment, as: 'comments' }
            ]
        });

        // Duyệt qua từng bài đăng
        for (const post of postsWithComments) {
            let totalRate = 0;

            // Tính tổng số rate trong các comment của bài đăng
            if (post.comments.length > 0) {
                totalRate = post.comments.reduce((acc, comment) => acc + parseFloat(comment.rate), 0);
                totalRate /= post.comments.length; // Tính trung bình
            }

            // Cập nhật trường star của bài đăng
            await db.Post.update({ star: totalRate.toString() }, {
                where: { id: post.id }
            });
        }

        return {
            err: 0,
            msg: 'Stars updated successfully'
        };
    } catch (error) {
        throw error;
    }
};

export const hidePostService = async (postId, userId) => {
    try {
        const post = await db.Post.findOne({ where: { id: postId } });
        if (!post) {
            return {
                err: 1,
                msg: 'Post not found'
            };
        }

        if (post.visibility !== 'Visible') {
            return {
                err: 1,
                msg: 'Post cannot be hided'
            };
        }
        await post.update({ visibility: 'Hidden' });

        return {
            err: 0,
            msg: 'Post Hidden successfully'
        };
    } catch (error) {
        throw error;
    }
};

export const visiblePostService = async (postId, userId) => {
    try {
        const post = await db.Post.findOne({ where: { id: postId } });
        if (!post) {
            return {
                err: 1,
                msg: 'Post not found'
            };
        }

        if (post.visibility !== 'Hidden') {
            return {
                err: 1,
                msg: 'Post cannot be Visible'
            };
        }
        await post.update({ visibility: 'Visible' });

        return {
            err: 0,
            msg: 'Post Visible successfully'
        };
    } catch (error) {
        throw error;
    }
};