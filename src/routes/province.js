import express from 'express'
import * as controllers from '../controllers/province'
import db from '../../data/db.json';
const router = express.Router()

router.get('/all', controllers.getProvinces)
router.get('/provinces', (req, res) => {
    res.json(db.province);
});
router.get('/districts/:provinceId', (req, res) => {
    const { provinceId } = req.params;
    const districts = db.district.filter(d => d.idProvince === provinceId);
    res.json(districts);
});
router.get('/communes/:districtId', (req, res) => {
    const { districtId } = req.params;
    const communes = db.commune.filter(c => c.idDistrict === districtId);
    res.json(communes);
});
export default router