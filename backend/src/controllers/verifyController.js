const axios = require('axios');
const { saveVerification, getVerificationsByUser } = require('../models/verificationModel');
const { getWalletByUserId, updateWalletBalance, saveTransaction, getPricing } = require('../models/walletModel');
require('dotenv').config();

const PREMBLY_HEADERS = {
  'x-api-key': process.env.PREMBLY_API_KEY,
  'app-id': process.env.PREMBLY_APP_ID,
  'Content-Type': 'application/json',
};

const checkAndDeductBalance = async (userId, verificationType) => {
  // Get current pricing
  const pricing = await getPricing();
  const priceObj = pricing.find(p => p.verification_type === verificationType);
  if (!priceObj) throw new Error('Pricing not found');

  const price = parseFloat(priceObj.price);

  // Get user wallet
  const wallet = await getWalletByUserId(userId);
  if (!wallet) throw new Error('Wallet not found');

  const balance = parseFloat(wallet.balance);
  if (balance < price) throw new Error('Insufficient wallet balance');

  // Deduct balance
  await updateWalletBalance(userId, -price);

  // Save transaction record
  await saveTransaction(
    userId,
    price,
    'debit',
    `${verificationType} verification charge`,
    `VRF-${Date.now()}`,
    'completed'
  );

  return price;
};

const verifyBVN = async (req, res) => {
  const { bvn, dob } = req.body;
  const userId = req.user.id;

  if (!bvn || !dob) {
    return res.status(400).json({ message: 'BVN and date of birth are required' });
  }

  try {
    // Check and deduct wallet balance
    await checkAndDeductBalance(userId, 'BVN');

    const response = await axios.post(
      'https://api.prembly.com/identitypass/verification/bvn',
      { number: bvn, dob },
      { headers: PREMBLY_HEADERS }
    );

    const data = response.data;
    const status = data.status === true ? 'valid' : 'invalid';
    const saved = await saveVerification(userId, 'BVN', bvn, data, status);

    res.json({
      message: 'BVN verification complete',
      verificationId: saved.id,
      status,
      data: data.data || {}
    });
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    res.status(500).json({ message: 'Verification failed', error: errMsg });
  }
};

const verifyNIN = async (req, res) => {
  const { nin } = req.body;
  const userId = req.user.id;

  if (!nin) {
    return res.status(400).json({ message: 'NIN is required' });
  }

  try {
    await checkAndDeductBalance(userId, 'NIN');

    const response = await axios.post(
      'https://api.prembly.com/identitypass/verification/nin',
      { number: nin },
      { headers: PREMBLY_HEADERS }
    );

    const data = response.data;
    const status = data.status === true ? 'valid' : 'invalid';
    const saved = await saveVerification(userId, 'NIN', nin, data, status);

    res.json({
      message: 'NIN verification complete',
      verificationId: saved.id,
      status,
      data: data.data || {}
    });
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    res.status(500).json({ message: 'Verification failed', error: errMsg });
  }
};

const verifyCAC = async (req, res) => {
  const { rc_number } = req.body;
  const userId = req.user.id;

  if (!rc_number) {
    return res.status(400).json({ message: 'RC Number is required' });
  }

  try {
    await checkAndDeductBalance(userId, 'CAC');

    const response = await axios.post(
      'https://api.prembly.com/identitypass/verification/cac',
      { rc_number },
      { headers: PREMBLY_HEADERS }
    );

    const data = response.data;
    const status = data.status === true ? 'valid' : 'invalid';
    const saved = await saveVerification(userId, 'CAC', rc_number, data, status);

    res.json({
      message: 'CAC verification complete',
      verificationId: saved.id,
      status,
      data: data.data || {}
    });
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    res.status(500).json({ message: 'Verification failed', error: errMsg });
  }
};

const getHistory = async (req, res) => {
  try {
    const verifications = await getVerificationsByUser(req.user.id);
    res.json({ verifications });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch history', error: error.message });
  }
};

module.exports = { verifyBVN, verifyNIN, verifyCAC, getHistory };