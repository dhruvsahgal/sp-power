import axios from 'axios';
import type {
  Job,
  Candidate,
  Application,
  Analytics,
  DashboardSummary,
  ApplicationStatus,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Job API
export const jobAPI = {
  getAll: (params?: Record<string, any>) =>
    api.get<{ success: boolean; data: Job[] }>('/jobs', { params }),
  getById: (id: string) =>
    api.get<{ success: boolean; data: Job }>(`/jobs/${id}`),
  create: (data: Partial<Job>) =>
    api.post<{ success: boolean; data: Job }>('/jobs', data),
  update: (id: string, data: Partial<Job>) =>
    api.put<{ success: boolean; data: Job }>(`/jobs/${id}`, data),
  delete: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/jobs/${id}`),
  getActive: () =>
    api.get<{ success: boolean; data: Job[] }>('/jobs/active'),
  search: (query: string) =>
    api.get<{ success: boolean; data: Job[] }>('/jobs/search', { params: { query } }),
  publish: (id: string, channels: string[]) =>
    api.post<{ success: boolean; data: Job }>(`/jobs/${id}/publish`, { channels }),
  close: (id: string) =>
    api.post<{ success: boolean; data: Job }>(`/jobs/${id}/close`),
  getStats: (id: string) =>
    api.get<{ success: boolean; data: any }>(`/jobs/${id}/stats`),
};

// Candidate API
export const candidateAPI = {
  getAll: (params?: Record<string, any>) =>
    api.get<{ success: boolean; data: Candidate[] }>('/candidates', { params }),
  getById: (id: string) =>
    api.get<{ success: boolean; data: Candidate }>(`/candidates/${id}`),
  create: (data: Partial<Candidate>) =>
    api.post<{ success: boolean; data: Candidate }>('/candidates', data),
  update: (id: string, data: Partial<Candidate>) =>
    api.put<{ success: boolean; data: Candidate }>(`/candidates/${id}`, data),
  search: (query: string) =>
    api.get<{ success: boolean; data: Candidate[] }>('/candidates/search', { params: { query } }),
  uploadCV: (candidateId: string, file: File) => {
    const formData = new FormData();
    formData.append('cv', file);
    return api.post(`/candidates/${candidateId}/cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getApplications: (id: string) =>
    api.get<{ success: boolean; data: Application[] }>(`/candidates/${id}/applications`),
  getRecommendations: (id: string, limit?: number) =>
    api.get<{ success: boolean; data: any[] }>(`/candidates/${id}/recommendations`, {
      params: { limit },
    }),
  getProfileCompleteness: (id: string) =>
    api.get<{ success: boolean; data: { completeness: number } }>(`/candidates/${id}/profile-completeness`),
};

// Application API
export const applicationAPI = {
  getAll: (params?: Record<string, any>) =>
    api.get<{ success: boolean; data: Application[] }>('/applications', { params }),
  getById: (id: string) =>
    api.get<{ success: boolean; data: Application }>(`/applications/${id}`),
  create: (data: {
    jobId: string;
    candidateId: string;
    source: string;
    coverLetter?: string;
  }) => api.post<{ success: boolean; data: Application }>('/applications', data),
  updateStatus: (
    id: string,
    status: ApplicationStatus,
    changedBy: string,
    comment?: string
  ) =>
    api.put<{ success: boolean; data: Application }>(`/applications/${id}/status`, {
      status,
      changedBy,
      comment,
    }),
  addNote: (
    id: string,
    authorId: string,
    authorName: string,
    content: string,
    isPrivate?: boolean
  ) =>
    api.post<{ success: boolean; data: Application }>(`/applications/${id}/notes`, {
      authorId,
      authorName,
      content,
      isPrivate,
    }),
  scheduleInterview: (id: string, interviewData: any) =>
    api.post<{ success: boolean; data: Application }>(
      `/applications/${id}/interviews`,
      interviewData
    ),
  addFeedback: (id: string, interviewId: string, feedback: any) =>
    api.post<{ success: boolean; data: Application }>(
      `/applications/${id}/interviews/feedback`,
      { interviewId, feedback }
    ),
  getByJobRanked: (jobId: string, minScore?: number) =>
    api.get<{ success: boolean; data: Application[] }>(
      `/applications/job/${jobId}/ranked`,
      { params: { minScore } }
    ),
  getShortlisted: (jobId: string) =>
    api.get<{ success: boolean; data: Application[] }>(
      `/applications/job/${jobId}/shortlisted`
    ),
  bulkUpdate: (
    applicationIds: string[],
    status: ApplicationStatus,
    changedBy: string,
    comment?: string
  ) =>
    api.post<{ success: boolean; data: Application[] }>(
      '/applications/bulk-update',
      { applicationIds, status, changedBy, comment }
    ),
  getStats: (params?: Record<string, any>) =>
    api.get<{ success: boolean; data: any }>('/applications/stats', { params }),
};

// Analytics API
export const analyticsAPI = {
  getAll: () =>
    api.get<{ success: boolean; data: Analytics }>('/analytics'),
  getJobMetrics: () =>
    api.get<{ success: boolean; data: any }>('/analytics/jobs'),
  getCandidateMetrics: () =>
    api.get<{ success: boolean; data: any }>('/analytics/candidates'),
  getPerformanceMetrics: () =>
    api.get<{ success: boolean; data: any }>('/analytics/performance'),
  getAIMetrics: () =>
    api.get<{ success: boolean; data: any }>('/analytics/ai'),
  getJobAnalytics: (jobId: string) =>
    api.get<{ success: boolean; data: any }>(`/analytics/jobs/${jobId}`),
  getDashboardSummary: () =>
    api.get<{ success: boolean; data: DashboardSummary }>('/analytics/dashboard'),
};

export default api;
