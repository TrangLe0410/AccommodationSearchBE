import express from 'express'
import * as appointmentController from '../controllers/appointment.js'
import verifyToken from '../middlewares/verifyToken.js'
const router = express.Router()

router.use(verifyToken)
router.post('/create-appointment', appointmentController.createNewAppointment);
router.get('/getAppointmentsByRequester', appointmentController.getAppointmentsByRequester);
router.get('/getAppointmentsByPoster', appointmentController.getAppointmentsByPoster);
router.delete('/delete-appointment', appointmentController.deleteAppointment)
// router.put('/confirm-appointment', appointmentController.confirmAppointment);
router.get('/getAppointmentById', appointmentController.getAppointmentById)
router.put('/approve-appointment', appointmentController.approveAppointment)
router.put('/cancel-appointment', appointmentController.cancelAppointment)

export default router