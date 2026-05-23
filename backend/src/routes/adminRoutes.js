const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  getVerifications,
  updatePricingAdmin,
  getPricingAdmin,
  creditUserWallet
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.get('/verifications', getVerifications);
router.get('/pricing', getPricingAdmin);
router.put('/pricing', updatePricingAdmin);
router.post('/wallet/credit', creditUserWallet);

module.exports = router;