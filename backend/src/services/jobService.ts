import { v4 as uuidv4 } from 'uuid';
import { Job, ApiResponse } from '../models/types';
import { dataStore } from '../models/store';
import { successFactorsService } from './successFactorsService';

class JobService {
  /**
   * Create a new job posting
   */
  async createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
    const job: Job = {
      ...jobData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dataStore.createJob(job);

    // Sync to SuccessFactors if job is active
    if (job.status === 'Active') {
      await successFactorsService.syncJobToSF(job);
    }

    return job;
  }

  /**
   * Get job by ID
   */
  getJob(id: string): Job | undefined {
    return dataStore.getJob(id);
  }

  /**
   * Get all jobs with optional filters
   */
  getAllJobs(filters?: {
    status?: Job['status'];
    department?: string;
    location?: string;
    hiringManagerId?: string;
    taSpecialistId?: string;
  }): Job[] {
    let jobs = dataStore.getAllJobs();

    if (filters) {
      if (filters.status) {
        jobs = jobs.filter((job) => job.status === filters.status);
      }
      if (filters.department) {
        jobs = jobs.filter((job) => job.department === filters.department);
      }
      if (filters.location) {
        jobs = jobs.filter((job) => job.location.includes(filters.location));
      }
      if (filters.hiringManagerId) {
        jobs = jobs.filter((job) => job.hiringManagerId === filters.hiringManagerId);
      }
      if (filters.taSpecialistId) {
        jobs = jobs.filter((job) => job.taSpecialistId === filters.taSpecialistId);
      }
    }

    return jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Update job
   */
  async updateJob(id: string, updates: Partial<Job>): Promise<Job | undefined> {
    const job = dataStore.updateJob(id, updates);

    // Sync to SuccessFactors
    if (job) {
      await successFactorsService.syncJobToSF(job);
    }

    return job;
  }

  /**
   * Delete job
   */
  deleteJob(id: string): boolean {
    return dataStore.deleteJob(id);
  }

  /**
   * Get active jobs
   */
  getActiveJobs(): Job[] {
    return dataStore.getActiveJobs();
  }

  /**
   * Publish job to channels
   */
  async publishJob(jobId: string, channels: string[]): Promise<Job | undefined> {
    const job = dataStore.getJob(jobId);
    if (!job) return undefined;

    const updated = await this.updateJob(jobId, {
      publishedChannels: channels,
      status: 'Active',
    });

    return updated;
  }

  /**
   * Close job
   */
  async closeJob(jobId: string): Promise<Job | undefined> {
    return await this.updateJob(jobId, {
      status: 'Closed',
      closedAt: new Date(),
    });
  }

  /**
   * Search jobs
   */
  searchJobs(query: string): Job[] {
    const lowerQuery = query.toLowerCase();
    return dataStore.getAllJobs().filter(
      (job) =>
        job.title.toLowerCase().includes(lowerQuery) ||
        job.department.toLowerCase().includes(lowerQuery) ||
        job.description.toLowerCase().includes(lowerQuery) ||
        job.skills.required.some((skill) => skill.toLowerCase().includes(lowerQuery)) ||
        job.skills.preferred.some((skill) => skill.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get job statistics
   */
  getJobStats(jobId: string) {
    const applications = dataStore.getApplicationsByJob(jobId);

    return {
      totalApplications: applications.length,
      newApplications: applications.filter((app) => app.status === 'New').length,
      underReview: applications.filter((app) => app.status === 'Under Review').length,
      shortlisted: applications.filter((app) => app.status === 'Shortlisted').length,
      interviewed: applications.filter(
        (app) => app.status === 'Interview Scheduled' || app.status === 'Interview Completed'
      ).length,
      offered: applications.filter((app) => app.status === 'Offer Extended').length,
      hired: applications.filter((app) => app.status === 'Offer Accepted').length,
      averageMatchScore:
        applications.length > 0
          ? Math.round(
              applications.reduce((sum, app) => sum + app.aiMatchScore, 0) / applications.length
            )
          : 0,
    };
  }
}

export const jobService = new JobService();
