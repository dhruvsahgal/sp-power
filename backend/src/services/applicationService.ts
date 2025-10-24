import { v4 as uuidv4 } from 'uuid';
import { Application, ApplicationStatus, StatusHistory, Note, Interview } from '../models/types';
import { dataStore } from '../models/store';
import { aiService } from './aiService';
import { successFactorsService } from './successFactorsService';

class ApplicationService {
  /**
   * Create a new application
   */
  async createApplication(
    jobId: string,
    candidateId: string,
    source: string,
    coverLetter?: string
  ): Promise<Application> {
    // Check if application already exists
    const existing = dataStore.getCandidateApplicationForJob(candidateId, jobId);
    if (existing) {
      throw new Error('Application already exists for this job');
    }

    const candidate = dataStore.getCandidate(candidateId);
    const job = dataStore.getJob(jobId);

    if (!candidate || !job) {
      throw new Error('Candidate or Job not found');
    }

    // Calculate AI match score
    const matchDetails = await aiService.matchCandidateToJob(candidate, job);

    const application: Application = {
      id: uuidv4(),
      jobId,
      candidateId,
      status: 'New',
      appliedAt: new Date(),
      aiMatchScore: matchDetails.overallScore,
      aiMatchDetails: matchDetails,
      statusHistory: [
        {
          status: 'New',
          changedBy: 'System',
          changedAt: new Date(),
          comment: 'Application submitted',
        },
      ],
      notes: [],
      interviews: [],
      source,
      coverLetter,
    };

    dataStore.createApplication(application);

    // Sync to SuccessFactors
    await successFactorsService.syncApplicationToSF(application);

    return application;
  }

  /**
   * Get application by ID
   */
  getApplication(id: string): Application | undefined {
    return dataStore.getApplication(id);
  }

  /**
   * Get all applications with optional filters
   */
  getAllApplications(filters?: {
    jobId?: string;
    candidateId?: string;
    status?: ApplicationStatus;
    minMatchScore?: number;
  }): Application[] {
    let applications = dataStore.getAllApplications();

    if (filters) {
      if (filters.jobId) {
        applications = applications.filter((app) => app.jobId === filters.jobId);
      }
      if (filters.candidateId) {
        applications = applications.filter((app) => app.candidateId === filters.candidateId);
      }
      if (filters.status) {
        applications = applications.filter((app) => app.status === filters.status);
      }
      if (filters.minMatchScore !== undefined) {
        applications = applications.filter((app) => app.aiMatchScore >= filters.minMatchScore!);
      }
    }

    return applications.sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime());
  }

  /**
   * Update application status
   */
  async updateStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    changedBy: string,
    comment?: string
  ): Promise<Application | undefined> {
    const application = dataStore.getApplication(applicationId);
    if (!application) return undefined;

    const statusHistory: StatusHistory = {
      status: newStatus,
      changedBy,
      changedAt: new Date(),
      comment,
    };

    const updated = dataStore.updateApplication(applicationId, {
      status: newStatus,
      statusHistory: [...application.statusHistory, statusHistory],
    });

    // Sync to SuccessFactors
    if (updated) {
      await successFactorsService.syncApplicationToSF(updated);
    }

    return updated;
  }

  /**
   * Add note to application
   */
  addNote(
    applicationId: string,
    authorId: string,
    authorName: string,
    content: string,
    isPrivate: boolean = false
  ): Application | undefined {
    const application = dataStore.getApplication(applicationId);
    if (!application) return undefined;

    const note: Note = {
      id: uuidv4(),
      authorId,
      authorName,
      content,
      createdAt: new Date(),
      isPrivate,
    };

    return dataStore.updateApplication(applicationId, {
      notes: [...application.notes, note],
    });
  }

  /**
   * Schedule interview
   */
  scheduleInterview(
    applicationId: string,
    interviewData: Omit<Interview, 'id' | 'status'>
  ): Application | undefined {
    const application = dataStore.getApplication(applicationId);
    if (!application) return undefined;

    const interview: Interview = {
      ...interviewData,
      id: uuidv4(),
      status: 'Scheduled',
    };

    return dataStore.updateApplication(applicationId, {
      interviews: [...application.interviews, interview],
      status: 'Interview Scheduled',
    });
  }

  /**
   * Add interview feedback
   */
  addInterviewFeedback(
    applicationId: string,
    interviewId: string,
    feedback: Interview['feedback'][0]
  ): Application | undefined {
    const application = dataStore.getApplication(applicationId);
    if (!application) return undefined;

    const updatedInterviews = application.interviews.map((interview) => {
      if (interview.id === interviewId) {
        return {
          ...interview,
          status: 'Completed' as const,
          feedback: [...(interview.feedback || []), feedback],
        };
      }
      return interview;
    });

    return dataStore.updateApplication(applicationId, {
      interviews: updatedInterviews,
      status: 'Interview Completed',
    });
  }

  /**
   * Get applications by job with ranking
   */
  getApplicationsByJobRanked(jobId: string, minScore: number = 0): Application[] {
    return dataStore
      .getApplicationsByJob(jobId)
      .filter((app) => app.aiMatchScore >= minScore)
      .sort((a, b) => b.aiMatchScore - a.aiMatchScore);
  }

  /**
   * Get shortlisted applications for a job
   */
  getShortlistedApplications(jobId: string): Application[] {
    return dataStore
      .getApplicationsByJob(jobId)
      .filter((app) => app.status === 'Shortlisted')
      .sort((a, b) => b.aiMatchScore - a.aiMatchScore);
  }

  /**
   * Bulk update application status
   */
  async bulkUpdateStatus(
    applicationIds: string[],
    newStatus: ApplicationStatus,
    changedBy: string,
    comment?: string
  ): Promise<Application[]> {
    const updated: Application[] = [];

    for (const id of applicationIds) {
      const app = await this.updateStatus(id, newStatus, changedBy, comment);
      if (app) {
        updated.push(app);
      }
    }

    return updated;
  }

  /**
   * Get application statistics
   */
  getApplicationStats(filters?: { jobId?: string }) {
    const applications = filters?.jobId
      ? dataStore.getApplicationsByJob(filters.jobId)
      : dataStore.getAllApplications();

    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    const scoreRanges = {
      '0-25': 0,
      '26-50': 0,
      '51-75': 0,
      '76-100': 0,
    };

    applications.forEach((app) => {
      if (app.aiMatchScore <= 25) scoreRanges['0-25']++;
      else if (app.aiMatchScore <= 50) scoreRanges['26-50']++;
      else if (app.aiMatchScore <= 75) scoreRanges['51-75']++;
      else scoreRanges['76-100']++;
    });

    return {
      total: applications.length,
      byStatus: statusCounts,
      byScoreRange: scoreRanges,
      averageScore:
        applications.length > 0
          ? Math.round(
              applications.reduce((sum, app) => sum + app.aiMatchScore, 0) / applications.length
            )
          : 0,
    };
  }
}

export const applicationService = new ApplicationService();
