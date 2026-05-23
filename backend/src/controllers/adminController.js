const { getAllUsers, updateUserRole } = require('../models/userModel');
const { getAllVerifications } = require('../models/verificationModel');
const { updateWalletBalance, saveTransaction, getPricing, updatePricing } = require('../models/walletModel');
const pool = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    const verificationsResult = await pool.query('SELECT COUNT(*) FROM verifications');
    const revenueResult = await pool.query("SELECT SUM(amount) FROM transactions WHERE type = 'credit' AND status = 'completed'");
    const todayResult = await pool.query("SELECT COUNT(*) FROM verifications WHERE created_at >= NOW() - INTERVAL '24 hours'");

    res.json({
      totalUsers: parseInt(usersResult.rows[0].count),
      totalVerifications: parseInt(verificationsResult.rows[0].count),
      totalRevenue: parseFloat(revenueResult.rows[0].sum) || 0,
      todayVerifications: parseInt(todayResult.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch stats', error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch users', error: error.message });
  }
};

const getVerifications = async (req, res) => {
  try {
    const verifications = await getAllVerifications();
    res.json({ verifications });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch verifications', error: error.message });
  }
};

const updatePricingAdmin = async (req, res) => {
  const { verification_type, price } = req.body;

  if (!verification_type || !price) {
    return res.status(400).json({ message: 'Verification type and price are required' });
  }

  try {
    const updated = await updatePricing(verification_type, price);
    res.json({ message: 'Pricing updated successfully', pricing: updated });
  } catch (error) {
    res.status(500).json({ message: 'Could not update pricing', error: error.message });
  }
};

const getPricingAdmin = async (req, res) => {
  try {
    const pricing = await getPricing();
    res.json({ pricing });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch pricing', error: error.message });
  }
};

const creditUserWallet = async (req, res) => {
  const { userId, amount, description } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ message: 'User ID and amount are required' });
  }

  try {
    await updateWalletBalance(userId, amount);
    await saveTransaction(userId, amount, 'credit', description || 'Admin credit', `ADM-${Date.now()}`, 'completed');
    res.json({ message: 'Wallet credited successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Could not credit wallet', error: error.message });
  }
};

module.exports = { getDashboardStats, getUsers, getVerifications, updatePricingAdmin, getPricingAdmin, creditUserWallet };