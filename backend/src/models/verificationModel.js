const pool = require('../config/db');

const saveVerification = async (userId, type, inputValue, responseJson, status) => {
  const result = await pool.query(
    'INSERT INTO verifications (user_id, type, input_value, response_json, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, type, inputValue, JSON.stringify(responseJson), status]
  );
  return result.rows[0];
};

const getVerificationsByUser = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM verifications WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

const getVerificationById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM verifications WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const getAllVerifications = async () => {
  const result = await pool.query(
    `SELECT v.*, u.name, u.email 
     FROM verifications v 
     JOIN users u ON v.user_id = u.id 
     ORDER BY v.created_at DESC`
  );
  return result.rows;
};

module.exports = { saveVerification, getVerificationsByUser, getVerificationById, getAllVerifications };