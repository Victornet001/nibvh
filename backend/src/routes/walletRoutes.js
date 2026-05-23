const express = require('express');
const router = express.Router();
const { getWallet, getTransactions, initializePayment, verifyPayment } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWallet);
router.get('/transactions', protect, getTransactions);
router.post('/fund', protect, initializePayment);
router.get('/verify/:reference', protect, verifyPayment);

module.exports = router;