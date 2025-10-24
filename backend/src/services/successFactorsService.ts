import { Job, Application, Candidate, SuccessFactorsSync } from '../models/types';
import { dataStore } from '../models/store';
import axios from 'axios';

/**
 * Mock SuccessFactors Integration Service
 * In a real implementation, this would integrate with SAP SuccessFactors APIs
 */
class SuccessFactorsService {
  private apiUrl: string;
  private apiKey: string;
  private companyId: string;

  constructor() {
    this.apiUrl = process.env.SF_API_URL || 'https://api.successfactors.mock';
    this.apiKey = process.env.SF_API_KEY || 'mock_key';
    this.companyId = process.env.SF_COMPANY_ID || 'demo_company';
  }

  /**
   * Sync job to SuccessFactors
   */
  async syncJobToSF(job: Job): Promise<void> {
    try {
      console.log(`[SF] Syncing job ${job.id} to SuccessFactors...`);

      // Mock API call - in real implementation, this would call SF API
      const mockResponse = await this.mockSFAPICall('POST', '/jobs', {
        jobRequisitionId: job.requisitionId,
        title: job.title,
        department: job.department,
        location: job.location,
        status: job.status,
        hiringManager: job.hiringManagerId,
      });

      console.log(`[SF] Job ${job.id} synced successfully`);

      // Record sync
      dataStore.addSyncHistory({
        lastSyncAt: new Date(),
        status: 'Success',
        syncType: 'Jobs',
        recordsSynced: 1,
      });
    } catch (error) {
      console.error(`[SF] Failed to sync job ${job.id}:`, error);
      dataStore.addSyncHistory({
        lastSyncAt: new Date(),
        status: 'Failed',
        syncType: 'Jobs',
        recordsSynced: 0,
        errors: [(error as Error).message],
      });
    }
  }

  /**
   * Sync application to SuccessFactors
   */
  async syncApplicationToSF(application: Application): Promise<void> {
    try {
      console.log(`[SF] Syncing application ${application.id} to SuccessFactors...`);

      const candidate = dataStore.getCandidate(application.candidateId);
      const job = dataStore.getJob(application.jobId);

      // Mock API call
      const mockResponse = await this.mockSFAPICall('POST', '/applications', {
        applicationId: application.id,
        jobRequisitionId: job?.requisitionId,
        candidateId: application.candidateId,
        candidateName: candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown',
        status: application.status,
        appliedDate: application.appliedAt,
        aiMatchScore: application.aiMatchScore,
      });

      console.log(`[SF] Application ${application.id} synced successfully`);

      dataStore.addSyncHistory({
        lastSyncAt: new Date(),
        status: 'Success',
        syncType: 'Applications',
        recordsSynced: 1,
      });
    } catch (error) {
      console.error(`[SF] Failed to sync application ${application.id}:`, error);
      dataStore.addSyncHistory({
        lastSyncAt: new Date(),
        status: 'Failed',
        syncType: 'Applications',
        recordsSynced: 0,
        errors: [(error as Error).message],
      });
    }
  }

  /**
   * Sync candidate to SuccessFactors
   */
  async syncCandidateToSF(candidate: Candidate): Promise<void> {
    try {
      console.log(`[SF] Syncing candidate ${candidate.id} to SuccessFactors...`);

      // Mock API call
      const mockResponse = await this.mockSFAPICall('POST', '/candidates', {
        candidateId: candidate.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone,
        skills: candidate.skills,
        experience: candidate.totalExperience,
      });

      console.log(`[SF] Candidate ${candidate.id} synced successfully`);

      dataStore.addSyncHistory({
        lastSyncAt: new Date(),
        status: 'Success',
        syncType: 'Candidates',
        recordsSynced: 1,
      });
    } catch (error) {
      console.error(`[SF] Failed to sync candidate ${candidate.id}:`, error);
      dataStore.addSyncHistory({
        lastSyncAt: new Date(),
        status: 'Failed',
        syncType: 'Candidates',
        recordsSynced: 0,
        errors: [(error as Error).message],
      });
    }
  }

  /**
   * Import jobs from SuccessFactors
   */
  async importJobsFromSF(): Promise<Job[]> {
    try {
      console.log('[SF] Importing jobs from SuccessFactors...');

      // Mock API call - would fetch real job requisitions in production
      const mockJobs = await this.mockSFAPICall('GET', '/jobs');

      // In real implementation, transform SF data to our Job format
      // For now, return empty array as this is a mock

      console.log(`[SF] Imported ${mockJobs.length || 0} jobs`);

      dataStore.addSyncHistory({
        lastSyncAt: new Date(),
        status: 'Success',
        syncType: 'Jobs',
        recordsSynced: mockJobs.length || 0,
      });

      return [];
    } catch (error) {
      console.error('[SF] Failed to import jobs:', error);
      dataStore.addSyncHistory({
        lastSyncAt: new Date(),
        status: 'Failed',
        syncType: 'Jobs',
        recordsSynced: 0,
        errors: [(error as Error).message],
      });
      return [];
    }
  }

  /**
   * Get sync history
   */
  getSyncHistory(): SuccessFactorsSync[] {
    return dataStore.getSyncHistory();
  }

  /**
   * Get last sync status
   */
  getLastSync(type: SuccessFactorsSync['syncType']): SuccessFactorsSync | undefined {
    return dataStore.getLastSync(type);
  }

  /**
   * Mock SuccessFactors API call
   * In production, this would make real HTTP requests to SF API
   */
  private async mockSFAPICall(method: string, endpoint: string, data?: any): Promise<any> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Mock successful response
    return {
      success: true,
      message: `Mock ${method} ${endpoint} successful`,
      data: data,
    };

    // Uncomment below to make real API calls when SF credentials are available
    /*
    try {
      const response = await axios({
        method,
        url: `${this.apiUrl}${endpoint}`,
        data,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`SF API Error: ${error.message}`);
    }
    */
  }
}

export const successFactorsService = new SuccessFactorsService();
