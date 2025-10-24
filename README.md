# AI-Powered Talent Acquisition Platform

A comprehensive recruitment platform featuring AI-driven CV parsing, intelligent candidate matching, automated workflows, and seamless SuccessFactors integration.

## Features

### For TA Specialists
- **Centralized Dashboard**: View all active jobs, candidate pipelines, and AI ranking scores
- **Automated Job Posting**: Publish approved jobs to multiple channels from SuccessFactors
- **AI-Powered CV Parsing**: Automatically extract and structure candidate information
- **Intelligent Matching**: AI-based candidate-job matching with detailed scoring
- **Talent Pool Recommendations**: AI recommendations from internal talent pools

### For Hiring Managers
- **AI-Prioritized Shortlists**: View candidates ranked by AI match scores
- **Collaborative Tools**: Interview scheduling, feedback, and shortlisting within the platform
- **Analytics Dashboard**: Track hiring metrics, cycle times, and conversion rates
- **SuccessFactors Integration**: Direct integration with existing SF data

### For Candidates
- **AI Chatbot**: Interactive assistant for CV submission and application guidance
- **Smart Application**: Auto-parsed CV data, no repetitive form filling
- **Real-Time Updates**: Status tracking and personalized communication
- **Job Matching**: AI-recommended positions based on profile

### AI Capabilities
- **CV Parsing**: LLM-based extraction of skills, experience, education, certifications
- **Candidate Matching**: Multi-factor AI scoring (skills, experience, education, location)
- **Conversational AI**: Natural language chatbot for candidate engagement
- **Predictive Analytics**: Hiring cycle predictions and success probability

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐   │
│  │    TA    │  │    HM    │  │  Candidate Portal   │   │
│  │Dashboard │  │Dashboard │  │   + AI Chatbot      │   │
│  └──────────┘  └──────────┘  └────────────────────┘   │
└─────────────────────────┬───────────────────────────────┘
                          │
                    REST API + WebSocket
                          │
┌─────────────────────────┴───────────────────────────────┐
│              Backend (Node.js + Express)                 │
│  ┌──────────────────┐  ┌────────────────────────────┐  │
│  │  Job, Candidate  │  │  AI Processing Layer       │  │
│  │  Application     │  │  - CV Parser               │  │
│  │  Services        │  │  - Matching Engine         │  │
│  │                  │  │  - Chatbot NLU             │  │
│  └──────────────────┘  └────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Mock SuccessFactors Integration              │    │
│  └────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────┐
│              In-Memory Data Store                        │
│  Jobs | Candidates | Applications | CV Cache            │
└──────────────────────────────────────────────────────────┘
```

## Technology Stack

### Backend
- **Framework**: Node.js with Express.js and TypeScript
- **AI Integration**: OpenAI GPT-4 / Anthropic Claude
- **WebSocket**: Socket.IO for real-time chatbot
- **File Processing**: Multer for uploads, pdf-parse for CV extraction
- **Data Storage**: In-memory Maps (no database required)

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **WebSocket**: Socket.IO Client

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- OpenAI API Key or Anthropic API Key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd sp-power
```

2. **Backend Setup**
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your AI API keys
nano .env
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start Backend Server**
```bash
cd backend
npm run dev
```
The API will be available at `http://localhost:5000`

2. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:3000`

### Environment Configuration

Create `/backend/.env` with the following:

```env
# Server
PORT=5000
NODE_ENV=development

# AI Provider (openai or anthropic)
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
# OR
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# SuccessFactors (Mock)
SF_API_URL=https://api.successfactors.mock
SF_API_KEY=mock_key_123
SF_COMPANY_ID=demo_company

# CORS
CORS_ORIGIN=http://localhost:3000
```

## API Documentation

### REST Endpoints

#### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/active` - Get active jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `POST /api/jobs/:id/publish` - Publish job to channels
- `GET /api/jobs/:id/stats` - Get job statistics

#### Candidates
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate by ID
- `POST /api/candidates` - Create candidate
- `PUT /api/candidates/:id` - Update candidate
- `POST /api/candidates/:id/cv` - Upload and parse CV
- `GET /api/candidates/:id/recommendations` - Get job recommendations

#### Applications
- `GET /api/applications` - Get all applications
- `GET /api/applications/:id` - Get application by ID
- `POST /api/applications` - Create application
- `PUT /api/applications/:id/status` - Update application status
- `POST /api/applications/:id/notes` - Add note
- `POST /api/applications/:id/interviews` - Schedule interview
- `GET /api/applications/job/:jobId/ranked` - Get ranked applications for job

#### Analytics
- `GET /api/analytics` - Get comprehensive analytics
- `GET /api/analytics/dashboard` - Get dashboard summary
- `GET /api/analytics/jobs` - Get job metrics
- `GET /api/analytics/candidates` - Get candidate metrics
- `GET /api/analytics/ai` - Get AI performance metrics

### WebSocket Events (Chatbot)

**Client → Server:**
- `chat:init` - Initialize new chat session
- `chat:message` - Send message
- `chat:get_jobs` - Request job recommendations
- `chat:apply` - Apply for job
- `chat:status` - Check application status
- `chat:close` - Close session

**Server → Client:**
- `chat:session` - Session created
- `chat:message` - AI response
- `chat:jobs` - Job recommendations
- `chat:applications` - Application status
- `chat:error` - Error message

## Demo Data

The platform comes pre-seeded with demo data:
- **4 Users**: TA Specialist, 2 Hiring Managers, Admin
- **5 Jobs**: Various positions across Engineering and Product
- **3 Candidates**: With different skill sets and experience levels

## AI Integration

### CV Parsing
Uses LLM to extract:
- Personal information (name, contact, location)
- Skills (technical and soft skills)
- Work experience with achievements
- Education history
- Certifications and languages

### Candidate Matching
Multi-factor scoring algorithm:
- **Skill Match (60%)**: Required and preferred skills alignment
- **Experience Match (20%)**: Years of experience vs. requirements
- **Education Match (10%)**: Degree and field relevance
- **Location Match (10%)**: Geographic preferences

### AI Chatbot
- Natural language understanding
- Context-aware responses
- Data extraction from conversation
- Job recommendations
- Application assistance

## SuccessFactors Integration

Mock integration layer simulating:
- Job requisition synchronization
- Candidate data exchange
- Application status updates
- Bi-directional data flow

## Testing

### Manual Testing
1. **TA Dashboard**: Create jobs, review applications, use AI matching
2. **HM Dashboard**: View shortlisted candidates, schedule interviews
3. **Candidate Portal**: Browse jobs, upload CV, use chatbot, apply

### API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Get all jobs
curl http://localhost:5000/api/jobs

# Get dashboard summary
curl http://localhost:5000/api/analytics/dashboard
```

## Project Structure

```
sp-power/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── models/           # Data models and store
│   │   ├── routes/           # API routes
│   │   ├── config/           # Configuration (Socket.IO)
│   │   ├── utils/            # Utilities (seed data)
│   │   └── index.ts          # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API clients
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── vite.config.ts
├── docs/                     # Documentation
└── README.md
```

## Performance Considerations

- **In-Memory Storage**: Fast access, suitable for demo/POC
- **AI API Caching**: Fallback to rule-based matching if AI unavailable
- **Lazy Loading**: Frontend routes and components code-split
- **Optimistic Updates**: Immediate UI feedback

## Security Notes

For production deployment:
- Implement authentication (JWT, OAuth)
- Add authorization and role-based access control
- Secure file uploads with virus scanning
- Rate limiting on API endpoints
- HTTPS everywhere
- Sanitize user inputs
- Implement CSRF protection

## Scaling Considerations

To scale for production:
- Replace in-memory storage with PostgreSQL/MongoDB
- Add Redis for caching and session management
- Implement job queues for CV processing
- Use CDN for static assets
- Deploy with load balancer
- Implement API versioning
- Add comprehensive logging and monitoring

## Future Enhancements

- **Real SuccessFactors Integration**: Connect to actual SF APIs
- **Advanced Analytics**: Predictive hiring models, bias detection
- **Video Interviews**: Integrated video screening
- **Mobile App**: Native iOS and Android applications
- **Multi-language Support**: Internationalization
- **Advanced AI**: Automated interview scheduling, sentiment analysis
- **Assessment Integration**: Technical tests, personality assessments

## License

MIT License - See LICENSE file for details

## Support

For questions or issues:
- Create an issue in the repository
- Contact: support@company.com

## Contributors

Developed by the AI Innovation Team

---

**Note**: This is a demonstration platform showcasing AI-powered recruitment capabilities. It uses in-memory storage and is not intended for production use without proper database integration and security hardening.
