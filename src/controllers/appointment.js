import * as appointmentService from '../services/appointment';
import * as userService from '../services/user'
import * as postService from '../services/post'
export const createNewAppointment = async (req, res) => {
    const { appointmentRequesterID, posterId, postId, appointmentDate, appointmentTime, content } = req.body;
    try {
        if (!appointmentRequesterID || !posterId || !postId || !appointmentDate || !appointmentTime || !content) {
            return res.status(400).json({ err: 1, msg: 'Missing inputs' });
        }
        // Truyền userId vào hàm tạo lịch hẹn mới
        await appointmentService.createNewAppointmentService(appointmentRequesterID, posterId, postId, { appointmentDate, appointmentTime, content });
        res.status(201).json({ message: 'Appointment created successfully' });
    } catch (error) {
        console.error('Failed to create appointment:', error);
        res.status(500).json({ err: -1, msg: 'Failed to create appointment' });
    }
};

export const deleteAppointment = async (req, res) => {
    const { appointmentId } = req.query
    const { id } = req.user
    try {
        if (!appointmentId || !id) return res.status(400).json({
            err: 1,
            msg: 'Mising inputs'
        })
        const response = await appointmentService.deleteAppointment(appointmentId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}
export const getAppointmentsByRequester = async (req, res) => {
    const { appointmentRequesterID } = req.query;
    try {
        if (!appointmentRequesterID) {
            return res.status(400).json({ err: 1, msg: 'Missing appointmentRequesterID' });
        }

        const appointments = await appointmentService.getAppointmentsByRequester(appointmentRequesterID);
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Failed to get appointments:', error);
        res.status(500).json({ err: -1, msg: 'Failed to get appointments' });
    }
};
export const getAppointmentsByPoster = async (req, res) => {
    const { posterId } = req.query;
    try {
        if (!posterId) {
            return res.status(400).json({ err: 1, msg: 'posterId' });
        }

        const appointments = await appointmentService.getAppointmentsByPoster(posterId);
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Failed to get appointments:', error);
        res.status(500).json({ err: -1, msg: 'Failed to get appointments' });
    }
};

// export const confirmAppointment = async (req, res) => {
//     const { appointmentId } = req.query;
//     try {
//         if (!appointmentId) {
//             return res.status(400).json({ err: 1, msg: 'Missing appointmentId' });
//         }

//         // Lấy thông tin của lịch hẹn
//         const appointment = await appointmentService.getAppointmentById(appointmentId);

//         if (!appointment) {
//             return res.status(404).json({ err: 1, msg: 'Appointment not found' });
//         }

//         // Kiểm tra nếu trạng thái hiện tại không phải là "Pending", không thực hiện cập nhật
//         if (appointment.status !== 'Pending') {
//             return res.status(400).json({ err: 1, msg: 'Appointment is not pending' });
//         }

//         // Cập nhật trạng thái của lịch hẹn sang "Approved"
//         await appointment.update({ status: 'Approved' });

//         res.status(200).json({ message: 'Appointment confirmed successfully' });
//     } catch (error) {
//         console.error('Failed to confirm appointment:', error);
//         res.status(500).json({ err: -1, msg: 'Failed to confirm appointment' });
//     }
// };


export const getAppointmentById = async (req, res) => {
    const { appointmentId } = req.query;
    try {
        if (!appointmentId) {
            return res.status(400).json({ err: 1, msg: 'Missing getAppointmentById' });
        }

        const appointment = await appointmentService.getAppointmentById(appointmentId);
        res.status(200).json(appointment);
    } catch (error) {
        console.error('Failed to get appointments:', error);
        res.status(500).json({ err: -1, msg: 'Failed to get appointments' });
    }
};
export const approveAppointment = async (req, res) => {
    const { appointmentId } = req.query;

    try {
        if (!appointmentId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing inputs'
            });
        }
        const response = await appointmentService.approveAppointmentService(appointmentId);

        // Trả về kết quả
        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        });
    }
};

export const cancelAppointment = async (req, res) => {
    const { appointmentId } = req.query;

    try {
        if (!appointmentId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing inputs'
            });
        }
        const response = await appointmentService.cancelAppointmentService(appointmentId);

        // Trả về kết quả
        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        });
    }
};