# Quick Reference Card

## 🚀 Start the Platform

### 1. Backend
```bash
cd backend
npm run dev
```
**URL**: http://localhost:5000/api

### 2. Frontend
```bash
cd frontend
npm run dev
```
**URL**: http://localhost:3000

## 📁 Project Structure

```
sp-power/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic & AI
│   │   ├── models/           # Types & data store
│   │   ├── routes/           # API endpoints
│   │   ├── config/           # WebSocket setup
│   │   └── utils/            # Seed data
│   ├── package.json
│   └── .env                  # Add your AI API key here!
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # Dashboard components
│   │   ├── services/         # API client
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx
│   └── package.json
│
└── docs/
    ├── README.md                    # Full documentation
    ├── GETTING_STARTED.md           # Setup guide
    ├── IMPLEMENTATION_SUMMARY.md    # What was built
    └── QUICK_REFERENCE.md           # This file
```

## 🔑 Essential Endpoints

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get All Jobs
```bash
curl http://localhost:5000/api/jobs
```

### Get Dashboard Summary
```bash
curl http://localhost:5000/api/analytics/dashboard
```

### Get Active Jobs
```bash
curl http://localhost:5000/api/jobs/active
```

### Get Candidates
```bash
curl http://localhost:5000/api/candidates
```

## 🎭 User Roles & Access

### TA Specialist Dashboard
- **URL**: http://localhost:3000/ta
- **Features**: Job management, candidate review, AI insights
- **Demo User**: Sarah Johnson

### Hiring Manager Dashboard
- **URL**: http://localhost:3000/hm
- **Features**: AI-ranked candidates, interview scheduling
- **Demo User**: John Smith

### Candidate Portal
- **URL**: http://localhost:3000/candidate
- **Features**: Job search, AI chatbot, applications
- **Demo**: Open to all

## 🧪 Demo Data

**Pre-loaded with:**
- 5 Jobs (Software Engineer, Product Manager, etc.)
- 3 Candidates (with realistic profiles)
- 4 Users (TA, Hiring Managers, Admin)

## 🤖 AI Features

### CV Parsing
Extracts: Skills, Experience, Education, Certifications

### Matching Algorithm
- Skills Match: 60%
- Experience Match: 20%
- Education Match: 10%
- Location Match: 10%

### Chatbot
Natural language understanding for candidate assistance

## ⚙️ Configuration

**Backend .env file:**
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
PORT=5000
```

## 🐛 Troubleshooting

**Backend won't start?**
- Check AI API key in `.env`
- Ensure port 5000 is free
- Run `npm install` in backend/

**Frontend won't connect?**
- Ensure backend is running first
- Check port 3000 is free
- Run `npm install` in frontend/

**AI not working?**
- Verify API key is valid
- Check API quota/credits
- Try alternate provider

## 📊 Tech Stack

**Backend**
- Node.js + Express
- TypeScript
- Socket.IO
- OpenAI/Anthropic APIs

**Frontend**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios

**Storage**
- In-memory (demo)
- Ready for PostgreSQL/MongoDB

## 🎯 Quick Test Scenarios

### Test 1: Browse Jobs (Candidate)
1. Go to http://localhost:3000
2. Click "Candidate Portal"
3. Navigate to "Browse Jobs"
4. View job details

### Test 2: AI Matching (TA/HM)
1. Go to TA or HM Dashboard
2. View applications/candidates
3. Check AI match scores (0-100)
4. Review match details

### Test 3: Chatbot (Candidate)
1. Go to Candidate Portal
2. Click "AI Assistant"
3. Type: "What jobs are available?"
4. Receive AI response

### Test 4: API Health
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

## 📈 Key Metrics Dashboard

**TA Dashboard shows:**
- Active Jobs Count
- Total Candidates
- New Applications
- Average Match Score

**HM Dashboard shows:**
- My Active Jobs
- Pending Reviews
- Interviews This Week
- Top Candidate Matches

**Analytics includes:**
- Hiring cycle times
- Conversion rates
- AI accuracy metrics
- Source effectiveness

## 🔗 Important Links

- **Backend API**: http://localhost:5000/api
- **Frontend App**: http://localhost:3000
- **API Health**: http://localhost:5000/api/health
- **WebSocket**: ws://localhost:5000

## 💡 Pro Tips

1. **Keep terminal windows open** for both backend and frontend
2. **Check browser console** (F12) for debugging
3. **View terminal logs** for API requests and AI calls
4. **Restart backend** if you change .env file
5. **Seed data auto-loads** on backend start

## 📞 Support

- Check GETTING_STARTED.md for detailed setup
- Review README.md for architecture details
- See IMPLEMENTATION_SUMMARY.md for what's built

---

**Last Updated**: October 24, 2025
**Version**: 1.0.0
**Status**: Demo Ready ✅
