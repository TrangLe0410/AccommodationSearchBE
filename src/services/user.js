import db from '../models/modelIndex.js'
const { Op } = require("sequelize");
// GET CURRENT
export const getOne = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { id },
            raw: true,
            attributes: {
                exclude: ['password']
            }
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Failed to get user',
            response
        })
    } catch (error) {
        reject(error)
    }
})
export const getUserService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findAll({
            raw: true,
            attributes: ['id', 'name', 'phone', 'zalo', 'fbUrl', 'role', 'avatar', 'balance', 'status']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Failed to get prices.',
            response
        })
    } catch (error) {
        reject(error)
    }
})
export const getUserById = async (userId) => {
    try {
        const user = await db.User.findOne({
            where: {
                id: userId
            }
        });
        return user;
    } catch (error) {
        throw error;
    }
};


export const updateProfile = async (userId, newData) => {
    try {
        const user = await db.User.findByPk(userId); // Tìm người dùng trong cơ sở dữ liệu

        if (!user) {
            throw new Error('User not found');
        }

        // Cập nhật thông tin cá nhân
        if (newData.avatar) {
            user.avatar = newData.avatar;
        }
        if (newData.name) {
            user.name = newData.name;
        }
        if (newData.phone) {
            user.phone = newData.phone;
        }
        if (newData.zalo) {
            user.zalo = newData.zalo;
        }
        if (newData.address) {
            user.address = newData.address;
        }

        await user.save(); // Lưu thông tin đã cập nhật vào cơ sở dữ liệu

        return user;
    } catch (error) {
        throw error;
    }
};
export const countUserService = async () => {
    try {
        const count = await db.User.count(); // Use `count` method to get total posts
        return {
            err: 0,
            msg: 'OK',
            count: count
        };
    } catch (error) {
        throw error; // Re-throw the error for proper handling in the calling function
    }
};

export const countUsersByRegistrationDate = async () => {
    try {
        const startDate = new Date('2024-06-01T00:00:00Z');
        const endDate = new Date(); // Current date and time

        const count = await db.User.count({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        return {
            err: 0,
            msg: 'OK',
            count: count
        };
    } catch (error) {
        throw error; // Re-throw the error for proper handling in the calling function
    }
};


export const lockUserAccount = async (userId) => {
    try {
        const user = await db.User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.status = 'locked';
        await user.save();

        return {
            err: 0,
            msg: 'User account locked successfully',
            user
        };
    } catch (error) {
        throw error;
    }
};

export const unLockUserAccount = async (userId) => {
    try {
        const user = await db.User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.status = 'active';
        await user.save();

        return {
            err: 0,
            msg: 'User account active successfully',
            user
        };
    } catch (error) {
        throw error;
    }
};