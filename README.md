# 💰 Spendwise

> A modern AI-powered expense tracker built with the MERN stack.

🔗 **Live Demo:** [LINK]  
🎥 **Project Walkthrough(planned):** [LINK]

---

## 📌 Overview

**Spendwise** is a full-stack expense tracking application that helps users manage their income, expenses, and savings with powerful analytics and automated monthly reports.

It is designed for:
- Individuals who want better financial awareness  
- Students tracking budgets  
- Professionals monitoring spending habits  
- Anyone who wants structured financial insights  

The application includes AI integration for receipt scanning and financial insights. While the AI connection is implemented, some AI features require valid API billing credentials to return results.

---

## 🚀 Features

### 🔐 Authentication & Security
- User registration & login
- Password hashing using `bcrypt`
- JWT-based authentication
- Secure cookies
- Encrypted Redux persistence
- Passport strategy (JWT)
- 🔜 GitHub OAuth login (planned)

---

### 📊 Dashboard & Analytics

- Available Balance
- Total Income
- Total Expenses
- Savings Rate
- Daily expense charts
- Category-based breakdown
- Top 5 spending categories
- Aggregation pipeline for advanced analytics

Charts powered by `Recharts`.

---

### 💳 Expense Management

- Full CRUD operations for:
  - Transactions
  - User profile
- Profile image upload (Cloudinary)
- Pagination
- Filtering
- React TanStack Table integration
- CSV bulk import support
- Receipt scanning with AI (requires valid API billing)

---

### 🤖 AI Integration

Integrated using `@google/genai`.

Features:
- AI-powered receipt scanning
- AI-based monthly spending insights
- Financial suggestions in reports

⚠️ Note: AI responses require active billing credentials to function.

---

### 📧 Automated Monthly Reports

- Cron-based monthly email summary
- Includes:
  - Total spending
  - Income vs expenses
  - Category breakdown
  - AI-generated insights
- Email delivery powered by `Resend`
- Background worker system

---

### 🌙 UI & Experience

- Dark mode / Light mode
- Responsive design
- Modern UI using:
  - Radix UI
  - TailwindCSS
  - Lucide Icons
- Clean dashboard layout
- Toast notifications

---

## 🛠 Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Redux Toolkit
- Redux Persist
- React Router
- TanStack Table
- Recharts
- TailwindCSS
- React Hook Form + Zod
- Radix UI

### Backend
- Node.js
- Express 5
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Passport (JWT Strategy)
- bcrypt
- Multer + Cloudinary
- Node-Cron
- Resend (Email Service)
- Google GenAI SDK

---

## 📁 Project Structure

```
backend/
│
├── src/
│   ├── @types/
│   ├── config/
│   ├── controllers/
│   ├── crons/
│   ├── enums/
│   ├── mailers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── index.ts
│   └── worker.ts
│
├── package.json
└── tsconfig.json

client/
│
├── src/
│   ├── @types/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── constant/
│   ├── context/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
└── vite.config.ts
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/RishabhKumarDev/spendwise.git
cd Spendwise
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create a `.env` file based on the provided `.env.example` and fill in your values.

Start development server:

```
npm run dev
```

Start cron worker (monthly reports):

```
npm run cron
```

Production build:

```
npm run build
npm start
```

---

### 3️⃣ Frontend Setup

```
cd client
npm install
npm run dev
```

Build for production:

```
npm run build
npm run preview
```

---

## 🔐 Environment Variables

Refer to `.env.example` for required variables.

Typical variables include:

```
PORT=
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
GOOGLE_GENAI_API_KEY=
FRONTEND_URL=
```


## 📈 Future Improvements

- GitHub OAuth login
- Payment & billing system
- Subscription plans
- Enhanced AI financial modeling
- Admin analytics (if needed)

---

## 🧪 Testing

No automated test suite currently implemented.

---

## 📜 License

ISC

---

## 🙌 Final Notes

Spendwise is both:
- A functional production-ready application
- A learning milestone project

It demonstrates:
- Full-stack architecture
- Authentication & security
- Data aggregation
- Cron jobs & background workers
- AI integration
- Real-world deployment practices


**Built with focus, learning, and consistency.**
