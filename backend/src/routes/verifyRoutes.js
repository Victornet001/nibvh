const express = require('express');
const router = express.Router();
const { verifyBVN, verifyNIN, verifyCAC, getHistory } = require('../controllers/verifyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/bvn', protect, verifyBVN);
router.post('/nin', protect, verifyNIN);
router.post('/cac', protect, verifyCAC);
router.get('/history', protect, getHistory);

module.exports = router;