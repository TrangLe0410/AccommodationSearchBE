import db from '../models'

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
            attributes: ['id', 'name', 'phone', 'zalo', 'fbUrl', 'role', 'avatar']
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
