# Getting Started with AI-Powered Talent Acquisition Platform

## Quick Start Guide

This guide will help you set up and run the platform in under 10 minutes.

### Step 1: Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher): [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **AI API Key**: Either OpenAI or Anthropic Claude API key

### Step 2: Get an AI API Key

#### Option A: OpenAI (Recommended for beginners)
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-...`)

#### Option B: Anthropic Claude
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy the key

### Step 3: Install Dependencies

Open your terminal and navigate to the project directory:

```bash
cd sp-power

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 4: Configure Environment

1. Navigate to the backend folder:
```bash
cd backend
```

2. The `.env` file already exists. Open it and add your API key:
```bash
nano .env  # or use any text editor
```

3. Update these lines:
```env
AI_PROVIDER=openai  # or 'anthropic'
OPENAI_API_KEY=your_actual_api_key_here  # paste your key here
```

4. Save and close the file

### Step 5: Start the Backend

In the `backend` directory:

```bash
npm run dev
```

You should see:
```
AI-Powered Talent Acquisition Platform
========================================
[Server] HTTP Server running on port 5000
[Server] WebSocket: ws://localhost:5000
[Seed] Database seeded with demo data
```

Keep this terminal window open!

### Step 6: Start the Frontend

Open a **new terminal window**, navigate to the project:

```bash
cd sp-power/frontend
npm run dev
```

You should see:
```
  VITE v5.0.5  ready in XXX ms

  ➜  Local:   http://localhost:3000/
```

### Step 7: Access the Platform

Open your web browser and go to: **http://localhost:3000**

You should see the home page with three portal options:
- TA Specialist Dashboard
- Hiring Manager Dashboard
- Candidate Portal

## Demo Flow

### As a TA Specialist
1. Click "TA Specialist" on the home page
2. View the dashboard with active jobs and new applications
3. Navigate to "Jobs" to see all job postings
4. Navigate to "Candidates" to view candidate profiles
5. Check "Analytics" for insights

### As a Hiring Manager
1. Click "Hiring Manager" on the home page
2. View AI-prioritized candidate matches
3. See match scores and candidate strengths
4. Navigate to "My Jobs" to see your requisitions
5. Check "Shortlisted" for candidates ready for interview

### As a Candidate
1. Click "Candidate" on the home page
2. Browse available jobs with detailed descriptions
3. Use the AI Assistant (chatbot) to ask questions
4. Apply for positions (CV upload functionality)
5. Track your application status

## Demo Data

The platform comes pre-loaded with:
- **5 Jobs** across Engineering and Product departments
- **3 Sample Candidates** with various skill sets
- **4 Users** (TA Specialist, 2 Hiring Managers, Admin)

All data is stored in memory and will reset when you restart the backend.

## Testing AI Features

### Test CV Parsing
1. Go to Candidate Portal
2. Try the chatbot or job application
3. The AI will parse and extract information from text

### Test Candidate Matching
1. Go to TA Dashboard or HM Dashboard
2. View candidate applications
3. Each will have an AI-generated match score (0-100)
4. Check the detailed match analysis

### Test Chatbot
1. Go to Candidate Portal → AI Assistant
2. Type messages like:
   - "I'm looking for software engineering jobs"
   - "What jobs are available?"
   - "Help me apply"
3. The chatbot will respond intelligently

## Troubleshooting

### Backend won't start
**Error: "AI API key not configured"**
- Make sure you added your API key to `.env`
- Check that you saved the file
- Restart the backend server

**Error: "Port 5000 already in use"**
- Another application is using port 5000
- Change `PORT=5000` to `PORT=5001` in `.env`
- Update frontend proxy in `frontend/vite.config.ts`

### Frontend won't start
**Error: "Port 3000 already in use"**
- Another application is using port 3000
- Kill the process or use a different port

**Cannot connect to API**
- Make sure backend is running first
- Check that backend is on port 5000
- Check browser console for errors

### AI responses not working
**Slow responses or errors:**
- Check your API key is valid
- Ensure you have API credits/quota
- Check your internet connection
- Try switching AI providers in `.env`

### No data showing
- Backend should seed data automatically on startup
- Check terminal for "[Seed] Data seeding completed successfully!"
- Restart the backend if needed

## Architecture Overview

```
Frontend (React)     ←→     Backend (Node.js)     ←→     AI APIs
   Port 3000                    Port 5000              (OpenAI/Claude)
```

The frontend makes HTTP requests to the backend API, and the backend uses AI APIs for intelligent features like CV parsing and matching.

## Next Steps

1. **Explore the codebase**: Check `/backend/src` and `/frontend/src`
2. **Read the docs**: See `README.md` for detailed documentation
3. **Customize**: Modify the seed data in `/backend/src/utils/seedData.ts`
4. **Extend**: Add new features using the existing architecture

## Support

If you encounter issues:
1. Check this guide first
2. Review error messages in terminal
3. Check browser console (F12) for frontend errors
4. Verify API keys are correct
5. Ensure all dependencies installed successfully

## API Endpoints Reference

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Get Jobs:**
```bash
curl http://localhost:5000/api/jobs
```

**Get Dashboard Summary:**
```bash
curl http://localhost:5000/api/analytics/dashboard
```

Happy recruiting! 🚀
