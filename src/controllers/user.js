import * as services from '../services/user'

export const getCurrent = async (req, res) => {
    const { id } = req.user
    try {
        const response = await services.getOne(id)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at category controller: ' + error
        })
    }
}
export const getAllUser = async (req, res) => {
    try {
        const response = await services.getUserService()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}

export const updateProfile = async (req, res) => {
    const { id, role } = req.user;
    const { avatar, name, phone, zalo, address } = req.body; // Lấy thông tin mới từ body request

    try {
        const updatedUser = await services.updateProfile(id, {
            avatar,
            name,
            phone,
            zalo,
            address,
            role
        });

        return res.status(200).json({
            err: 0,
            msg: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed to update profile: ' + error
        });
    }
};