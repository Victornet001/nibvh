const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const verifyRoutes = require('./src/routes/verifyRoutes');
const walletRoutes = require('./src/routes/walletRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const pdfRoutes = require('./src/routes/pdfRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'NIBVH API is running successfully' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pdf', pdfRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`NIBVH Server running on port ${PORT}`);
});