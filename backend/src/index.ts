import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import routes from './routes';
import { initializeSocket } from './config/socket';
import { seedData } from './utils/seedData';
import { dataStore } from './models/store';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'AI-powered Talent Acquisition Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      jobs: '/api/jobs',
      candidates: '/api/candidates',
      applications: '/api/applications',
      analytics: '/api/analytics',
    },
    websocket: {
      chatbot: 'ws://localhost:5000 (Socket.IO)',
    },
    documentation: '/docs',
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Create HTTP server
const httpServer = createServer(app);

// Initialize WebSocket (Socket.IO)
const io = initializeSocket(httpServer);

// Seed data on startup
try {
  seedData();
  console.log('[Server] Database seeded with demo data');
} catch (error) {
  console.error('[Server] Error seeding data:', error);
}

// Start server
httpServer.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('AI-Powered Talent Acquisition Platform');
  console.log('='.repeat(60));
  console.log(`[Server] HTTP Server running on port ${PORT}`);
  console.log(`[Server] API: http://localhost:${PORT}/api`);
  console.log(`[Server] WebSocket: ws://localhost:${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Server] AI Provider: ${process.env.AI_PROVIDER || 'openai'}`);
  console.log('='.repeat(60));
  console.log('[Server] Data Store Stats:', dataStore.getStats());
  console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('[Server] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('[Server] Server closed');
    process.exit(0);
  });
});

export default app;
