import db from '../models/modelIndex.js'
const { Op } = require("sequelize");
import moment from 'moment'



export const calculateAverageRentByPostIdService = async (postId) => {
    try {
        // Lấy thông tin bài đăng hiện tại
        const currentPost = await db.Post.findOne({
            where: {
                id: postId
            },
            attributes: ['provinceCode', 'categoryCode', 'priceNumber'],
            include: [
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
            ],
        });

        if (!currentPost) {
            return {
                err: 1,
                msg: 'Post not found'
            };
        }

        // Lấy tất cả bài đăng thuộc quận có cùng provinceCode và categoryCode
        const posts = await db.Post.findAll({
            where: {
                provinceCode: currentPost.provinceCode,
                categoryCode: currentPost.categoryCode,

            },
            include: [
                { model: db.Attribute, as: 'attributes', attributes: ['price'] },
            ],
        });

        if (posts.length === 0) {
            return {
                err: 1,
                msg: 'No other posts found in the specified district and category'
            };
        }



        const totalRent = posts.reduce((sum, post) => {
            let priceString = post.attributes.price;

            let price = 0;
            if (priceString.includes('triệu')) {
                // Nếu giá có đơn vị triệu/tháng
                price = parseFloat(priceString.replace(' triệu/tháng', ''));

            } else if (priceString.includes('đồng')) {
                // Nếu giá có đơn vị đồng/tháng
                price = parseFloat(priceString.replace('đồng/tháng', '')) / 1000; // Chuyển từ đồng sang triệu

            }
            return sum + price;
        }, 0);

        const averageRent = totalRent / posts.length;

        // Làm tròn kết quả sau dấu phẩy 1 số
        const roundedAverageRent = parseFloat(averageRent.toFixed(1));

        // Chuyển kết quả trung bình thuê về định dạng "x.x triệu/tháng"
        const formattedAverageRent = roundedAverageRent.toFixed(1) + " triệu/tháng";

        return {
            err: 0,
            msg: 'Calculate average rent successfully',
            averageRent: formattedAverageRent
        };

    } catch (error) {
        throw error;
    }
};

export const calculateAverageRentByAllProvinceService = async (postId) => {
    try {
        // Lấy bài đăng cụ thể dựa trên postId
        const specificPost = await db.Post.findOne({
            where: { id: postId },
            attributes: ['categoryCode', 'provinceCode'],
        });

        if (!specificPost) {
            return {
                err: 1,
                msg: 'Post not found'
            };
        }

        const { categoryCode, provinceCode } = specificPost;

        // Lấy tất cả bài đăng theo categoryCode
        const posts = await db.Post.findAll({
            attributes: ['provinceCode', 'categoryCode'],
            include: [
                { model: db.Attribute, as: 'attributes', attributes: ['price'] },
            ],
            where: {
                categoryCode: categoryCode,
                provinceCode: { [Op.ne]: provinceCode } // Loại bỏ bài đăng có cùng provinceCode với bài đăng hiện tại
            }
        });

        if (posts.length === 0) {
            return {
                err: 1,
                msg: 'No posts found'
            };
        }

        // Lấy tất cả tỉnh/thành phố
        const provinces = await db.Province.findAll({
            attributes: ['code', 'value'],
        });

        // Tạo mapping từ code sang value cho tỉnh/thành phố
        const provinceMap = {};
        provinces.forEach(province => {
            provinceMap[province.code] = province.value;
        });

        // Group posts by provinceCode
        const rentDataByDistrict = {};
        posts.forEach(post => {
            const key = post.provinceCode;
            if (!rentDataByDistrict[key]) {
                rentDataByDistrict[key] = {
                    totalRent: 0,
                    count: 0,
                    provinceCode: post.provinceCode
                };
            }

            let priceString = post.attributes.price;
            let price = 0;
            if (priceString.includes('triệu')) {
                price = parseFloat(priceString.replace(' triệu/tháng', ''));
            } else if (priceString.includes('đồng')) {
                price = parseFloat(priceString.replace('đồng/tháng', '')) / 1000;
            }

            rentDataByDistrict[key].totalRent += price;
            rentDataByDistrict[key].count += 1;
        });

        // Calculate average rent for each group and count the number of posts
        const averageRents = {};
        for (const key in rentDataByDistrict) {
            const { totalRent, count, provinceCode } = rentDataByDistrict[key];
            const averageRent = totalRent / count;
            const roundedAverageRent = parseFloat(averageRent.toFixed(1));
            const formattedAverageRent = roundedAverageRent.toFixed(1) + " triệu/tháng";
            const provinceName = provinceMap[provinceCode] || 'Unknown Province';
            averageRents[provinceName] = {
                averageRent: formattedAverageRent,
                postCount: count
            };
        }

        return {
            err: 0,
            msg: 'Calculate average rent for all districts successfully',
            averageRents
        };

    } catch (error) {
        throw error;
    }
};


export const calculateAverageRentByProvinceAndDateService = async (postId, year) => {
    try {
        // Lấy thông tin bài đăng hiện tại
        const currentPost = await db.Post.findOne({
            where: {
                id: postId
            },
            attributes: ['provinceCode', 'categoryCode', 'priceNumber'],
            include: [
                { model: db.Attribute, as: 'attributes', attributes: ['published'] },
            ],
        });

        if (!currentPost) {
            return {
                err: 1,
                msg: 'Post not found'
            };
        }

        const { provinceCode, categoryCode } = currentPost;

        // Lấy tất cả các bài đăng thuộc quận có cùng provinceCode và categoryCode
        const posts = await db.Post.findAll({
            where: {
                provinceCode: provinceCode,
                categoryCode: categoryCode
            },
            include: [
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'published'] },
            ],
        });

        if (posts.length === 0) {
            return {
                err: 1,
                msg: 'No posts found in the specified district and category'
            };
        }

        // Tạo một đối tượng để lưu trữ tổng giá thuê và số lượng phòng trọ cho từng tháng
        const rentByMonth = {};

        // Lặp qua tất cả các bài đăng
        posts.forEach(post => {
            let publishedDate;
            if (post.attributes.published === 'Hôm nay') {
                publishedDate = moment(); // Lấy ngày tháng hiện tại
            } else {
                publishedDate = moment(post.attributes.published, 'DD/MM/YYYY', true);
            }

            const postYear = publishedDate.year();

            // Kiểm tra xem bài đăng có trong năm truyền vào không
            if (postYear === parseInt(year, 10)) {
                const month = publishedDate.month() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
                const priceString = post.attributes.price;

                let price = 0;
                if (priceString.includes('triệu')) {
                    // Nếu giá có đơn vị triệu/tháng
                    price = parseFloat(priceString.replace(' triệu/tháng', ''));
                } else if (priceString.includes('đồng')) {
                    // Nếu giá có đơn vị đồng/tháng
                    price = parseFloat(priceString.replace(' đồng/tháng', '')) / 1000; // Chuyển từ đồng sang triệu
                }

                // Nếu chưa tồn tại thì khởi tạo
                if (!rentByMonth[month]) {
                    rentByMonth[month] = {
                        totalRent: price,
                        numOfRooms: 1
                    };
                } else {
                    // Nếu đã tồn tại thì cập nhật tổng giá thuê và số lượng phòng trọ
                    rentByMonth[month].totalRent += price;
                    rentByMonth[month].numOfRooms++;
                }
            }
        });

        // Tính giá thuê trung bình cho từng tháng
        const averageRentByMonth = {};
        for (let month = 1; month <= 12; month++) {
            if (rentByMonth[month]) {
                // Làm tròn kết quả đến một số thập phân sau dấu chấm
                const roundedRent = parseFloat((rentByMonth[month].totalRent / rentByMonth[month].numOfRooms).toFixed(1));
                averageRentByMonth[month] = roundedRent;
            }
        }

        return {
            err: 0,
            msg: 'Calculate average rent by month successfully',
            averageRentByMonth: averageRentByMonth
        };

    } catch (error) {
        throw error;
    }
};

