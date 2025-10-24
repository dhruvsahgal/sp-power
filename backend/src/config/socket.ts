import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { chatbotService } from '../services/chatbotService';

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    let sessionId: string | null = null;

    // Initialize chat session
    socket.on('chat:init', () => {
      const session = chatbotService.createSession();
      sessionId = session.id;

      socket.emit('chat:session', {
        sessionId: session.id,
        message: {
          role: 'assistant',
          content: "Hello! I'm your AI recruitment assistant. I can help you apply for jobs, upload your CV, and check your application status. How can I assist you today?",
          timestamp: new Date(),
        },
      });

      console.log(`[WebSocket] Session created: ${sessionId}`);
    });

    // Handle chat messages
    socket.on('chat:message', async (data: { sessionId: string; message: string }) => {
      try {
        if (!data.sessionId || !data.message) {
          socket.emit('chat:error', { error: 'Invalid message format' });
          return;
        }

        console.log(`[WebSocket] Message received for session ${data.sessionId}`);

        const response = await chatbotService.processMessage(data.sessionId, data.message);

        socket.emit('chat:message', response);
      } catch (error: any) {
        console.error('[WebSocket] Error processing message:', error);
        socket.emit('chat:error', { error: error.message });
      }
    });

    // Get job recommendations
    socket.on('chat:get_jobs', async (data: { sessionId: string }) => {
      try {
        const jobs = await chatbotService.getJobRecommendations(data.sessionId);
        socket.emit('chat:jobs', { jobs });
      } catch (error: any) {
        console.error('[WebSocket] Error getting jobs:', error);
        socket.emit('chat:error', { error: error.message });
      }
    });

    // Apply for job
    socket.on('chat:apply', async (data: { sessionId: string; jobId: string }) => {
      try {
        await chatbotService.applyForJob(data.sessionId, data.jobId);
        socket.emit('chat:message', {
          role: 'assistant',
          content: "Great! I've submitted your application. You'll receive updates as your application progresses. Is there anything else I can help you with?",
          timestamp: new Date(),
        });
      } catch (error: any) {
        console.error('[WebSocket] Error applying for job:', error);
        socket.emit('chat:error', { error: error.message });
      }
    });

    // Get application status
    socket.on('chat:status', async (data: { sessionId: string }) => {
      try {
        const status = chatbotService.getApplicationStatus(data.sessionId);
        socket.emit('chat:applications', { applications: status });
      } catch (error: any) {
        console.error('[WebSocket] Error getting status:', error);
        socket.emit('chat:error', { error: error.message });
      }
    });

    // Close session
    socket.on('chat:close', (data: { sessionId: string }) => {
      if (data.sessionId) {
        chatbotService.closeSession(data.sessionId);
        console.log(`[WebSocket] Session closed: ${data.sessionId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
      if (sessionId) {
        chatbotService.closeSession(sessionId);
      }
    });
  });

  console.log('[WebSocket] Socket.IO initialized');

  return io;
};
