const axios = require('axios');
const { getWalletByUserId, updateWalletBalance, saveTransaction, getTransactionsByUser } = require('../models/walletModel');
require('dotenv').config();

const getWallet = async (req, res) => {
  try {
    const wallet = await getWalletByUserId(req.user.id);
    res.json({ wallet });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch wallet', error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await getTransactionsByUser(req.user.id);
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch transactions', error: error.message });
  }
};

const initializePayment = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  if (!amount || amount < 100) {
    return res.status(400).json({ message: 'Minimum funding amount is N100' });
  }

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: req.user.email,
        amount: amount * 100,
        metadata: { userId, type: 'wallet_funding' }
      },
      {
        headers: {
          Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      message: 'Payment initialized',
      paymentUrl: response.data.data.authorization_url,
      reference: response.data.data.reference
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment initialization failed', error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const { reference } = req.params;
  const userId = req.user.id;

  try {
    const response = await axios.get(
      'https://api.paystack.co/transaction/verify/' + reference,
      {
        headers: {
          Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY
        }
      }
    );

    const data = response.data.data;

    if (data.status === 'success') {
      const amount = data.amount / 100;
      await updateWalletBalance(userId, amount);
      await saveTransaction(userId, amount, 'credit', 'Wallet funding via Paystack', reference, 'completed');
      res.json({ message: 'Wallet funded successfully', amount });
    } else {
      res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};

module.exports = { getWallet, getTransactions, initializePayment, verifyPayment };