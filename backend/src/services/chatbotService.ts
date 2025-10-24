import { v4 as uuidv4 } from 'uuid';
import { ChatSession, ChatMessage, Candidate } from '../models/types';
import { dataStore } from '../models/store';
import { aiService } from './aiService';
import { candidateService } from './candidateService';
import { jobService } from './jobService';
import { applicationService } from './applicationService';

class ChatbotService {
  /**
   * Create a new chat session
   */
  createSession(): ChatSession {
    const session: ChatSession = {
      id: uuidv4(),
      startedAt: new Date(),
      lastMessageAt: new Date(),
      messages: [],
      context: {
        stage: 'greeting',
        collectedData: {},
      },
      isActive: true,
    };

    dataStore.createChatSession(session);
    return session;
  }

  /**
   * Get chat session
   */
  getSession(sessionId: string): ChatSession | undefined {
    return dataStore.getChatSession(sessionId);
  }

  /**
   * Process user message and generate response
   */
  async processMessage(sessionId: string, userMessage: string): Promise<ChatMessage> {
    const session = dataStore.getChatSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Add user message to session
    const userMsg: ChatMessage = {
      id: uuidv4(),
      sessionId,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    session.messages.push(userMsg);

    // Prepare conversation history for AI
    const conversationHistory = session.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Get AI response
    const aiResponse = await aiService.processChatMessage(
      userMessage,
      conversationHistory,
      session.context
    );

    // Create assistant message
    const assistantMsg: ChatMessage = {
      id: uuidv4(),
      sessionId,
      role: 'assistant',
      content: aiResponse.response,
      timestamp: new Date(),
      metadata: {
        intent: aiResponse.intent,
        extractedData: aiResponse.extractedData,
      },
    };

    session.messages.push(assistantMsg);

    // Update context based on intent and extracted data
    await this.updateSessionContext(session, aiResponse);

    // Update session
    dataStore.updateChatSession(sessionId, {
      messages: session.messages,
      context: session.context,
      lastMessageAt: new Date(),
    });

    return assistantMsg;
  }

  /**
   * Update session context based on AI response
   */
  private async updateSessionContext(session: ChatSession, aiResponse: any): Promise<void> {
    const { intent, extractedData } = aiResponse;

    // Merge extracted data
    if (extractedData) {
      session.context.collectedData = {
        ...session.context.collectedData,
        ...extractedData,
      };
    }

    // Update stage based on intent
    if (intent === 'greeting' && session.context.stage === 'greeting') {
      session.context.stage = 'collecting_info';
    } else if (intent === 'cv_upload') {
      session.context.stage = 'cv_upload';
    } else if (intent === 'job_search') {
      session.context.stage = 'job_search';
    } else if (intent === 'status_check') {
      session.context.stage = 'status_check';
    }

    // Check if we have enough data to create a candidate profile
    if (
      session.context.collectedData.email &&
      session.context.collectedData.firstName &&
      session.context.collectedData.lastName &&
      !session.candidateId
    ) {
      // Create or find candidate
      let candidate = candidateService.getCandidateByEmail(session.context.collectedData.email);

      if (!candidate) {
        candidate = await candidateService.createCandidate({
          firstName: session.context.collectedData.firstName,
          lastName: session.context.collectedData.lastName,
          email: session.context.collectedData.email,
          phone: session.context.collectedData.phone || '',
          location: session.context.collectedData.location || '',
          skills: session.context.collectedData.skills || [],
          education: [],
          certifications: [],
          preferredLocations: [],
          preferredEmploymentTypes: [],
          totalExperience: session.context.collectedData.experience || 0,
          source: 'Chatbot',
        });
      }

      session.candidateId = candidate.id;
    }
  }

  /**
   * Handle CV upload via chatbot
   */
  async handleCVUpload(sessionId: string, cvText: string, cvBuffer: Buffer): Promise<void> {
    const session = dataStore.getChatSession(sessionId);
    if (!session || !session.candidateId) {
      throw new Error('Session not found or candidate not created');
    }

    await candidateService.parseAndStoreCV(session.candidateId, cvText, cvBuffer);

    // Update context
    dataStore.updateChatSession(sessionId, {
      context: {
        ...session.context,
        stage: 'job_search',
      },
    });
  }

  /**
   * Get job recommendations for session
   */
  async getJobRecommendations(sessionId: string): Promise<any[]> {
    const session = dataStore.getChatSession(sessionId);
    if (!session || !session.candidateId) {
      // Return popular jobs
      return jobService.getActiveJobs().slice(0, 5).map((job) => ({
        id: job.id,
        title: job.title,
        department: job.department,
        location: job.location,
        experienceLevel: job.experienceLevel,
      }));
    }

    const recommendations = await candidateService.getRecommendedJobs(session.candidateId, 5);
    return recommendations.map((rec) => ({
      id: rec.job.id,
      title: rec.job.title,
      department: rec.job.department,
      location: rec.job.location,
      experienceLevel: rec.job.experienceLevel,
      matchScore: rec.score,
      reason: rec.reason,
    }));
  }

  /**
   * Apply for job via chatbot
   */
  async applyForJob(sessionId: string, jobId: string): Promise<void> {
    const session = dataStore.getChatSession(sessionId);
    if (!session || !session.candidateId) {
      throw new Error('Session not found or candidate not created');
    }

    await applicationService.createApplication(
      jobId,
      session.candidateId,
      'Chatbot'
    );

    // Update context
    dataStore.updateChatSession(sessionId, {
      context: {
        ...session.context,
        stage: 'completed',
      },
    });
  }

  /**
   * Get application status for session
   */
  getApplicationStatus(sessionId: string): any[] {
    const session = dataStore.getChatSession(sessionId);
    if (!session || !session.candidateId) {
      return [];
    }

    const applications = candidateService.getCandidateApplications(session.candidateId);
    return applications.map((app) => {
      const job = dataStore.getJob(app.jobId);
      return {
        applicationId: app.id,
        jobTitle: job?.title || 'Unknown',
        status: app.status,
        appliedAt: app.appliedAt,
        matchScore: app.aiMatchScore,
      };
    });
  }

  /**
   * Close chat session
   */
  closeSession(sessionId: string): void {
    dataStore.updateChatSession(sessionId, {
      isActive: false,
    });
  }

  /**
   * Get active sessions count
   */
  getActiveSessionsCount(): number {
    return dataStore.getActiveChatSessions().length;
  }
}

export const chatbotService = new ChatbotService();
