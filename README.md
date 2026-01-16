# NexTrade - Stock Market Application

A modern, full-stack stock market application built with Next.js 15, featuring real-time stock data, personalized alerts, and comprehensive market insights.

## 🚀 Features

- **Real-time Stock Data**: Live stock prices and market data via Finnhub API
- **User Authentication**: Secure sign-up and sign-in with Better Auth
- **Google OAuth**: One-click sign-in with Google (with 30-day session persistence)
- **Personalized Watchlist**: Track your favorite stocks
- **Stock Alerts**: Set price alerts for your investments
- **Market News**: Stay updated with relevant market news
- **Responsive Design**: Beautiful UI with Tailwind CSS and Radix UI components
- **Performance Optimized**: Built with Next.js 15 and Turbopack

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Better Auth with MongoDB adapter
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Forms**: React Hook Form
- **Notifications**: Sonner
- **API Integration**: Finnhub API for stock data
- **Email**: Nodemailer with Inngest for background processing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- Finnhub API key
- Google OAuth credentials (for Google sign-in)

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth (for "Continue with Google")
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Finnhub API
FINNHUB_API_KEY=your_finnhub_api_key
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key

# Email (optional)
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stocks_app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run health:db` - Check database connection
- `npm run test:db` - Test database operations

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (root)/            # Protected pages
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── forms/             # Form components
│   └── ui/                # Base UI components
├── database/              # Database models and connection
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
│   ├── actions/           # Server actions
│   ├── better-auth/       # Authentication configuration
│   └── inngest/           # Background job processing
├── middleware/            # Next.js middleware
└── types/                 # TypeScript type definitions
```

## 🔧 Key Improvements Made

- **Enhanced Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Improved Authentication Flow**: Better sign-up/sign-in experience with proper redirects
- **Google OAuth Integration**: Fully functional "Continue with Google" with 30-day session persistence
- **Remember Me Feature**: Sessions are automatically remembered for 30 days for both email and Google sign-in
- **Form Validation**: Robust client-side validation with detailed error messages
- **Performance Optimizations**: Optimized imports, image formats, and caching strategies
- **Security**: Removed dangerous build error ignoring settings
- **Code Quality**: Better TypeScript types and improved code structure
- **User Experience**: Loading states, success messages, and better feedback

## 🔐 Google OAuth Setup

To enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure the OAuth consent screen
6. Set authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env.local` file

## 🚀 Deployment

The application is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

## 📄 License

This project is licensed under the MIT License.
