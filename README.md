# SpendWise 💸  
A full-stack expense tracking application with advanced analytics, recurring transactions, and automated background jobs.

SpendWise helps users track income and expenses, analyze spending patterns, manage recurring transactions, and receive automated financial reports — all in one place.

---

## ✨ Key Features

### 🔐 Authentication & User Management
- Email & password authentication using JWT
- Secure user sessions
- Upload profile photo (Cloudinary)

### 💼 Transactions & Expenses
- Create, edit, duplicate, and delete transactions
- Bulk delete transactions
- CSV import for transactions
- Advanced filtering & search
- Pagination support
- Date range filters (Last 7 days, Last 30 days, custom range, etc.)

### ♻️ Recurring Transactions (Cron Jobs)
- Define recurring income or expense transactions
- Automated processing using cron jobs
- Recurring logic runs independently of user requests

### 📊 Analytics & Insights
- Advanced analytics using MongoDB Aggregation Pipeline
- Expense breakdown (pie chart)
- Income vs expense trends (line chart)
- Category-based insights

### 📄 Automated Reports
- Monthly financial reports
- Auto-generated and emailed to users
- Background cron-based execution

### 📤 Receipt Handling
- Upload receipts
- AI-based receipt scanning (OCR)

---

## 🏗️ Architecture Overview

SpendWise uses a **multi-process backend architecture** to ensure scalability and reliability.

### Backend is split into two runtime processes:

#### 1️⃣ API Server
- Handles HTTP requests
- Authentication & authorization
- Transaction and analytics APIs
- User-driven operations

#### 2️⃣ Background Worker
- Runs scheduled cron jobs
- Handles recurring transactions
- Generates and emails monthly reports
- Runs independently from the API server

Both processes:
- Share the same codebase
- Use the same database
- Run as separate Node.js processes

This prevents cron jobs from running multiple times when the API server scales.

---

## 🧠 Tech Stack

### Backend
- Node.js
- TypeScript
- Express
- MongoDB & Mongoose
- JWT Authentication
- node-cron
- Cloudinary
- MongoDB Aggregation Pipeline
- Resend (Transactional Email Service)

### Frontend
- React
- TypeScript
- Chart libraries for data visualization

---

## 📁 Project Structure

spendwise/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── crons/
│ │ ├── enums/
│ │ ├── middlewares/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── services/
│ │ ├── utils/
│ │ ├── validators/
│ │ └── index.ts
│ ├── package.json
│ └── tsconfig.json
│
├── client/
│ └── (frontend source)
│
└── README.md


---

## ⚙️ Backend Responsibilities

### API Server
- Handles all incoming HTTP requests
- Authentication & authorization
- CRUD operations for transactions
- Analytics & reporting APIs
- File uploads and validations

### Background Worker
- Executes cron jobs on defined schedules
- Processes recurring transactions
- Generates monthly reports
- Sends automated emails
- Directly interacts with the database (no HTTP layer)

---

## 🔄 Cron Jobs

SpendWise uses cron jobs for:
- Processing recurring transactions
- Generating monthly reports
- Automated email delivery

Cron jobs:
- Are not triggered by user requests
- Run on schedules defined by the system
- Execute in a dedicated worker process

---

## 🚀 Frontend Overview

The frontend provides:
- Authentication flows
- Transaction management UI
- Analytics dashboards
- Interactive charts
- Profile management

(Frontend documentation and setup will be expanded separately.)

---

## 🔮 Future Improvements

- Job retries & failure handling
- Queue-based background processing
- Notification system
- Performance optimizations
- Advanced budgeting features

---

## 📌 Notes

- The backend and worker run as separate Node.js processes.
- Cron jobs are isolated from API instances to avoid duplicate execution.
- Designed with scalability and maintainability in mind.

---

**SpendWise** — Track smarter. Spend wiser.

