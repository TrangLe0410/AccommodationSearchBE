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


export const countUser = async (req, res) => {
    try {
        const response = await services.countUserService(); // Call countPostsService from your service layer
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error counting posts:', error);
        return res.status(500).json({
            err: -1,
            msg: 'Failed to count posts: ' + error
        });
    }
};

export const countUsersFromMay2024 = async (req, res) => {
    try {
        const result = await services.countUsersByRegistrationDate();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            err: 1,
            msg: 'Failed to count users',
            error: error.message
        });
    }
};


export const lockUser = async (req, res) => {
    const { userId } = req.query;

    try {
        const response = await services.lockUserAccount(userId);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error locking user account:', error);
        return res.status(500).json({
            err: -1,
            msg: 'Failed to lock user account: ' + error.message
        });
    }
};

export const unLockUser = async (req, res) => {
    const { userId } = req.query;

    try {
        const response = await services.unLockUserAccount(userId);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error active user account:', error);
        return res.status(500).json({
            err: -1,
            msg: 'Failed to active user account: ' + error.message
        });
    }
};