# Student Commute Optimizer - Development Setup Guide

This guide will help you set up the Student Commute Optimizer application on your local development environment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or later) - [Download](https://nodejs.org/)
- **MongoDB** (v6.0 or later) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/downloads)
- **A code editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

## 🚀 Quick Start

### 1. Clone the Repository (if from Git)

```bash
git clone <repository-url>
cd FS Student Commute Optimizer
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### 3. Database Setup

#### Option A: Local MongoDB
1. Start your local MongoDB instance
2. The application will connect to `mongodb://localhost:27017/student-commute-optimizer`

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster and get your connection string
3. Update the `MONGODB_URI` in your environment variables

### 4. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/student-commute-optimizer

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12

# Email Service (for email verification)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=Student Commute Optimizer
EMAIL_FROM_ADDRESS=noreply@studentcommute.app

# Geocoding Service (OpenRouteService - free tier)
OPENROUTESERVICE_API_KEY=your-api-key-here

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Logging
LOG_LEVEL=debug
LOG_DIR=logs
```

**Important:** 
- Replace `your-super-secret-jwt-key-change-this` with a secure random string
- Get a free API key from [OpenRouteService](https://openrouteservice.org/dev/#/signup)
- Configure email settings if you want email verification to work

### 5. Start the Backend Server

```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

### 6. Frontend Setup

Open a new terminal window and navigate to the frontend directory:

```bash
cd ../frontend
npm install
```

### 7. Frontend Configuration

Create a `.env.local` file in the frontend directory:

```bash
# Frontend environment variables
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Student Commute Optimizer
```

### 8. Start the Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🔧 Development Commands

### Backend Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

## 📁 Project Structure

```
FS Student Commute Optimizer/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Express middleware
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic services
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions
│   │   ├── websocket/        # WebSocket handlers
│   │   └── server.ts         # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/                   # React/Next.js frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Next.js pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── contexts/        # React contexts
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   ├── package.json
│   └── tsconfig.json
├── README.md                   # Main project documentation
├── API_SPECIFICATION.md       # API documentation
└── SETUP_GUIDE.md            # This file
```

## 🧪 Testing the Setup

### 1. Backend Health Check

Visit `http://localhost:5000/health` in your browser. You should see:

```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "version": "v1",
    "environment": "development"
  }
}
```

### 2. Frontend Accessibility

Visit `http://localhost:3000` in your browser. You should see the Student Commute Optimizer welcome page.

### 3. WebSocket Connection

Check the browser console for WebSocket connection logs when you visit the frontend.

## 🔐 API Keys and External Services

### OpenRouteService (Required for route calculation)

1. Visit [OpenRouteService](https://openrouteservice.org/dev/#/signup)
2. Create a free account
3. Generate an API key
4. Add it to your `.env` file as `OPENROUTESERVICE_API_KEY`

**Free tier limits:**
- 2,000 requests per day
- 40 requests per minute

### Email Service (Optional, for email verification)

#### Gmail Setup:
1. Enable 2-factor authentication on your Gmail account
2. Generate an app-specific password
3. Use these credentials in your `.env` file

#### Alternative Email Services:
- **SendGrid**: Professional email service with generous free tier
- **Mailgun**: Email service for developers
- **AWS SES**: Amazon's email service

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error

**Error:** `MongoNetworkError: failed to connect to server`

**Solutions:**
1. Ensure MongoDB is running: `mongod` (for local installation)
2. Check if MongoDB is running on the correct port (27017)
3. Verify your `MONGODB_URI` in the `.env` file

#### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Kill the process using the port: `pkill -f "node.*5000"`
2. Or change the port in your `.env` file

#### API Key Issues

**Error:** `Geocoding service unavailable`

**Solutions:**
1. Verify your `OPENROUTESERVICE_API_KEY` is correct
2. Check your API usage limits
3. Ensure you're not exceeding rate limits

#### TypeScript Compilation Errors

**Solutions:**
1. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
2. Clear TypeScript cache: `npx tsc --build --clean`
3. Restart your TypeScript language server in your editor

### Performance Tips

1. **Database Indexing**: The app automatically creates necessary indexes on startup
2. **Caching**: Consider adding Redis for production deployments
3. **Monitoring**: Check the logs in the `logs/` directory for issues

## 📚 Next Steps

Once your development environment is set up:

1. **Read the API Documentation**: Check out `API_SPECIFICATION.md`
2. **Explore the Code**: Start with `backend/src/server.ts` and `frontend/src/pages/index.tsx`
3. **Run Tests**: Execute the test suites to ensure everything works
4. **Make Your First Changes**: Try modifying the welcome page or adding a new API endpoint

## 🆘 Getting Help

If you encounter issues:

1. Check the application logs in `backend/logs/`
2. Review the browser console for frontend errors
3. Ensure all environment variables are properly set
4. Verify that all services (MongoDB, etc.) are running

## 🚀 Deployment Preparation

When you're ready to deploy:

1. **Environment Variables**: Set production values for all environment variables
2. **Database**: Use a production MongoDB instance (MongoDB Atlas recommended)
3. **Security**: Ensure CORS, rate limiting, and authentication are properly configured
4. **Monitoring**: Set up error tracking and performance monitoring
5. **SSL/TLS**: Configure HTTPS for production

Happy coding! 🎉