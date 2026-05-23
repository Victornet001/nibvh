const express = require('express');
const router = express.Router();
const { generateStandardReport, generateIDCardReport, generateComplianceReport } = require('../controllers/pdfController');
const { protect } = require('../middleware/authMiddleware');

router.get('/standard/:verificationId', protect, generateStandardReport);
router.get('/idcard/:verificationId', protect, generateIDCardReport);
router.get('/compliance/:verificationId', protect, generateComplianceReport);

module.exports = router;