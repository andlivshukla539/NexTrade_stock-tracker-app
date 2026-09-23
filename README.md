<div align="center">
  <img src="public/favicon.ico" alt="NexTrade Logo" width="100" />
  <h1>NexTrade</h1>
  <p><strong>A Premium, Full-Stack Stock Market Trading Simulator & Portfolio Manager</strong></p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

## ✨ Overview

NexTrade is a state-of-the-art, beautifully designed stock market simulator and portfolio management application. It features a premium "glassmorphism" UI, real-time market quotes via Finnhub, AI-driven company insights using Google Gemini, and seamless authentication via Better Auth. 

Whether you're looking to practice trading in a risk-free environment, track a live watchlist, or analyze market sentiment, NexTrade offers an elite user experience with physics-based cursor animations and zero-delay navigation.

## 🚀 Key Features

- **Live Market Data:** Real-time stock quotes and symbol lookup powered by the Finnhub API.
- **Simulated Trading Engine:** Execute buy and sell orders, track your portfolio value, and monitor your P&L dynamically.
- **AI Company Insights:** Get instant, AI-generated concise summaries of any publicly traded company powered by **Google Gemini 2.0**.
- **AI Sentiment Analysis:** Live news headlines are analyzed by AI to classify them instantly as Bullish, Bearish, or Neutral.
- **Dynamic Watchlists & Alerts:** Save stocks to custom lists and set background price alerts (powered by **Inngest**).
- **Premium UI/UX:** A stunning dark mode interface utilizing Glassmorphism, smooth `framer-motion` page transitions, a trailing custom cursor, and `nextjs-toploader` for instant navigation feedback.
- **Robust Authentication:** Secure Google OAuth and Email/Password login powered by **Better Auth**.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS, Radix UI, Framer Motion
- **Backend:** Node.js, Next.js Server Actions & API Routes
- **Database:** PostgreSQL (hosted on Neon DB) with Prisma ORM
- **Background Jobs:** Inngest (for Cron Jobs and Price Alerts)
- **AI & Integrations:** Google Gemini SDK, Finnhub API, Razorpay (Test Mode)
- **Authentication:** Better Auth

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/andlivshukla539/NexTrade_stock-tracker-app.git
cd NexTrade_stock-tracker-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory and add the following keys:
```env
# Database
DATABASE_URL="postgresql://user:password@hostname/neondb?sslmode=verify-full"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your_super_secret_key"
BETTER_AUTH_URL="http://localhost:3000"

# APIs
FINNHUB_API_KEY="your_finnhub_api_key"
GEMINI_API_KEY="your_google_gemini_api_key"
```

### 4. Initialize the Database
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📈 Architecture Note

NexTrade was recently refactored to eliminate legacy MongoDB/Mongoose patchworks, unifying all data models (Users, Balances, Portfolios, Watchlists, Alerts, and Transactions) strictly under **PostgreSQL + Prisma** for perfect relational integrity.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).