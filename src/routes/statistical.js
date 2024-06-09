import express from 'express'
import * as statisticalController from '../controllers/statistical.js'
import verifyToken from '../middlewares/verifyToken.js'
const router = express.Router()

router.get('/average-rent', statisticalController.calculateAverageRentByPostId);
router.get('/average-rent-by-all-province', statisticalController.calculateAverageRentByAllProvince);
router.get('/calculate-average-rent-by-province-and-date', statisticalController.calculateAverageRentByProvinceAndDate);

router.get('/compare-average-rent-between-years', statisticalController.compareAverageRentByYear);
export default router