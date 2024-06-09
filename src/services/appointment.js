import db from '../models/modelIndex.js';
import { v4 as generateId } from 'uuid';

export const createNewAppointmentService = async (appointmentRequesterID, posterId, postId, appointmentData) => {
    try {
        const appointmentId = generateId();
        const appointmentNew = await db.Appointment.create({
            id: appointmentId,
            appointmentRequesterID,
            posterId,
            postId: postId,
            appointmentDate: appointmentData.appointmentDate,
            appointmentTime: appointmentData.appointmentTime,
            content: appointmentData.content,
            status: 'Pending'
        });
        return appointmentNew;
    } catch (error) {
        throw error;
    }
};

export const deleteAppointment = (appointmentId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Appointment.destroy({
            where: { id: appointmentId }

        })
        resolve({
            err: response > 0 ? 0 : 1,
            msg: response > 0 ? 'Delete appointment succsess' : 'No post delete',
        })

    } catch (error) {
        reject(error)
    }
})
export const getAppointmentsByRequester = async (appointmentRequesterID) => {
    try {
        const appointments = await db.Appointment.findAll({
            attributes: ['id', 'appointmentRequesterID', 'posterId', 'postId', 'appointmentDate', 'appointmentTime', 'content', 'status', 'createdAt', 'updatedAt'],
            where: { appointmentRequesterID },
            order: [['createdAt', 'DESC']],
        });
        return appointments;
    } catch (error) {
        throw error;
    }
};
export const getAppointmentsByPoster = async (posterId) => {
    try {
        const appointments = await db.Appointment.findAll({
            attributes: ['id', 'appointmentRequesterID', 'posterId', 'postId', 'appointmentDate', 'appointmentTime', 'content', 'status', 'createdAt', 'updatedAt'],
            where: { posterId },
            order: [['createdAt', 'DESC']],
        });
        return appointments;
    } catch (error) {
        throw error;
    }
};
export const getAppointmentById = async (appointmentId) => {
    try {
        const appointment = await db.Appointment.findByPk(appointmentId, {
            attributes: ['id', 'appointmentRequesterID', 'posterId', 'postId', 'appointmentDate', 'appointmentTime', 'content', 'status', 'createdAt', 'updatedAt'],
        });
        return appointment;
    } catch (error) {
        throw error;
    }
};

export const approveAppointmentService = async (appointmentId) => {
    try {
        const appointment = await db.Appointment.findByPk(appointmentId, {
            attributes: ['id', 'appointmentRequesterID', 'posterId', 'postId', 'appointmentDate', 'appointmentTime', 'content', 'status', 'createdAt', 'updatedAt'],
        });
        if (!appointment) {
            return {
                err: 1,
                msg: 'appointment not found'
            };
        }

        if (appointment.status !== 'Pending') {
            return {
                err: 1,
                msg: 'appointment cannot be approved'
            };
        }
        await appointment.update({ status: 'Approved' });

        return {
            err: 0,
            msg: 'appointment approved successfully'
        };
    } catch (error) {
        throw error;
    }
};

export const cancelAppointmentService = async (appointmentId) => {
    try {
        const appointment = await db.Appointment.findByPk(appointmentId, {
            attributes: ['id', 'appointmentRequesterID', 'posterId', 'postId', 'appointmentDate', 'appointmentTime', 'content', 'status', 'createdAt', 'updatedAt'],
        });

        if (!appointment) {
            return {
                err: 1,
                msg: 'appointment not found'
            };
        }

        if (appointment.status !== 'Pending') {
            return {
                err: 1,
                msg: 'appointment cannot be Canceled'
            };
        }
        await appointment.update({ status: 'Canceled' });

        return {
            err: 0,
            msg: 'appointment Canceled successfully'
        };
    } catch (error) {
        throw error;
    }
};


