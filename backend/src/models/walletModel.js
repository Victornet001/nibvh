const pool = require('../config/db');

const createWallet = async (userId) => {
  const result = await pool.query(
    'INSERT INTO wallets (user_id, balance) VALUES ($1, 0.00) RETURNING *',
    [userId]
  );
  return result.rows[0];
};

const getWalletByUserId = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM wallets WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
};

const updateWalletBalance = async (userId, amount) => {
  const result = await pool.query(
    'UPDATE wallets SET balance = balance + $1 WHERE user_id = $2 RETURNING *',
    [amount, userId]
  );
  return result.rows[0];
};

const saveTransaction = async (userId, amount, type, description, reference, status) => {
  const result = await pool.query(
    'INSERT INTO transactions (user_id, amount, type, description, reference, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [userId, amount, type, description, reference, status]
  );
  return result.rows[0];
};

const getTransactionsByUser = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

const getPricing = async () => {
  const result = await pool.query('SELECT * FROM pricing');
  return result.rows;
};

const updatePricing = async (verificationType, price) => {
  const result = await pool.query(
    'UPDATE pricing SET price = $1, updated_at = NOW() WHERE verification_type = $2 RETURNING *',
    [price, verificationType]
  );
  return result.rows[0];
};

module.exports = {
  createWallet,
  getWalletByUserId,
  updateWalletBalance,
  saveTransaction,
  getTransactionsByUser,
  getPricing,
  updatePricing
};