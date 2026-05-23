# NIBVH — Nigeria Identity & Business Verification Hub
## 🌐 Live Demo
👉 [https://nibvh.vercel.app](https://nibvh.vercel.app)

A full-stack SaaS platform for verifying Nigerian identity and business records (BVN, NIN, CAC) using licensed KYC API providers.

## 🚀 Live Features

- ✅ BVN Verification
- ✅ NIN Verification
- ✅ CAC Business Verification
- ✅ PDF Report Generation (Standard, ID Card, Compliance)
- ✅ Wallet & Credits System
- ✅ Paystack Payment Integration
- ✅ Admin Dashboard (Users, Pricing, Stats)
- ✅ JWT Authentication
- ✅ NDPR Compliant
- ✅ Mobile Responsive

## 🛠 Tech Stack

**Frontend**
- React.js
- React Router
- Axios
- React Hot Toast
- React Icons

**Backend**
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Puppeteer (PDF Generation)
- Bcryptjs

**External Services**
- Prembly (KYC API)
- Paystack (Payments)

## 📁 Project Structure

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL
- Prembly API account
- Paystack account

### Backend Setup

1. Clone the repository
2. Navigate to backend folder
```bash
cd backend
npm install
```

3. Create `.env` file

4. Create database
```bash
psql -U postgres
CREATE DATABASE nibvh_db;
```

5. Run the server
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder
```bash
cd frontend
npm install
npm start
```

## 🔗 API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/auth/profile` — Get profile

### Verification
- `POST /api/verify/bvn` — Verify BVN
- `POST /api/verify/nin` — Verify NIN
- `POST /api/verify/cac` — Verify CAC
- `GET /api/verify/history` — Get history

### Wallet
- `GET /api/wallet` — Get wallet balance
- `POST /api/wallet/fund` — Fund wallet
- `GET /api/wallet/transactions` — Get transactions

### PDF Reports
- `GET /api/pdf/standard/:id` — Standard report
- `GET /api/pdf/idcard/:id` — ID Card report
- `GET /api/pdf/compliance/:id` — Compliance report

### Admin
- `GET /api/admin/stats` — Dashboard stats
- `GET /api/admin/users` — All users
- `PUT /api/admin/pricing` — Update pricing
- `POST /api/admin/wallet/credit` — Credit user wallet

## 💰 Business Model

| Verification | Cost (Prembly) | Platform Price | Profit |
|---|---|---|---|
| BVN | ~₦50 | ₦150 | ₦100 |
| NIN | ~₦50 | ₦150 | ₦100 |
| CAC | ~₦150 | ₦400 | ₦250 |

## 📄 Compliance

- NDPR compliant
- Licensed KYC providers only
- User consent required before verification
- Data not modified or generated

## 👨‍💻 Author

Built with ❤️ in Nigeria

## 📝 License

MIT License