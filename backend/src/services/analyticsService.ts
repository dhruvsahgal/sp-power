import {
  Analytics,
  JobMetrics,
  CandidateMetrics,
  PerformanceMetrics,
  AIMetrics,
  Application,
} from '../models/types';
import { dataStore } from '../models/store';

class AnalyticsService {
  /**
   * Get comprehensive analytics
   */
  getAnalytics(): Analytics {
    return {
      jobMetrics: this.getJobMetrics(),
      candidateMetrics: this.getCandidateMetrics(),
      performanceMetrics: this.getPerformanceMetrics(),
      aiMetrics: this.getAIMetrics(),
    };
  }

  /**
   * Get job-specific metrics
   */
  getJobMetrics(): JobMetrics[] {
    const jobs = dataStore.getAllJobs();
    const metrics: JobMetrics[] = [];

    for (const job of jobs) {
      const applications = dataStore.getApplicationsByJob(job.id);

      const applicationsCount = applications.length;
      const shortlistedCount = applications.filter((app) => app.status === 'Shortlisted').length;
      const interviewCount = applications.filter(
        (app) => app.status === 'Interview Scheduled' || app.status === 'Interview Completed'
      ).length;
      const offerCount = applications.filter((app) => app.status === 'Offer Extended').length;
      const hireCount = applications.filter((app) => app.status === 'Offer Accepted').length;

      // Calculate time metrics (mock for now)
      const averageTimeToHire = hireCount > 0 ? 21 : 0; // 21 days average
      const averageTimeToShortlist = shortlistedCount > 0 ? 3 : 0; // 3 days average

      // Calculate conversion rates
      const conversionRates = {
        applicationToShortlist: applicationsCount > 0 ? (shortlistedCount / applicationsCount) * 100 : 0,
        shortlistToInterview: shortlistedCount > 0 ? (interviewCount / shortlistedCount) * 100 : 0,
        interviewToOffer: interviewCount > 0 ? (offerCount / interviewCount) * 100 : 0,
        offerToHire: offerCount > 0 ? (hireCount / offerCount) * 100 : 0,
      };

      // Top sources
      const sourceCounts = applications.reduce((acc, app) => {
        acc[app.source] = (acc[app.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topSources = Object.entries(sourceCounts)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Average match score
      const averageMatchScore =
        applications.length > 0
          ? Math.round(
              applications.reduce((sum, app) => sum + app.aiMatchScore, 0) / applications.length
            )
          : 0;

      metrics.push({
        jobId: job.id,
        jobTitle: job.title,
        applicationsCount,
        shortlistedCount,
        interviewCount,
        offerCount,
        hireCount,
        averageTimeToHire,
        averageTimeToShortlist,
        conversionRates,
        topSources,
        averageMatchScore,
      });
    }

    return metrics;
  }

  /**
   * Get candidate metrics
   */
  getCandidateMetrics(): CandidateMetrics {
    const candidates = dataStore.getAllCandidates();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const newThisWeek = candidates.filter((c) => c.createdAt >= weekAgo).length;
    const newThisMonth = candidates.filter((c) => c.createdAt >= monthAgo).length;

    const bySource = candidates.reduce((acc, candidate) => {
      acc[candidate.source] = (acc[candidate.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const applications = dataStore.getAllApplications();
    const byStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageExperience =
      candidates.length > 0
        ? Math.round(
            (candidates.reduce((sum, c) => sum + c.totalExperience, 0) / candidates.length) * 10
          ) / 10
        : 0;

    // Count skill occurrences
    const skillCounts: Record<string, number> = {};
    candidates.forEach((candidate) => {
      candidate.skills.forEach((skill) => {
        const lowerSkill = skill.toLowerCase();
        skillCounts[lowerSkill] = (skillCounts[lowerSkill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalCandidates: candidates.length,
      newThisWeek,
      newThisMonth,
      bySource,
      byStatus: byStatus as any,
      averageExperience,
      topSkills,
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    const applications = dataStore.getAllApplications();
    const hiredApplications = applications.filter((app) => app.status === 'Offer Accepted');

    // Calculate average time to hire (mock - would calculate from actual dates)
    const averageTimeToHire = hiredApplications.length > 0 ? 21 : 0; // 21 days

    // Average time to first response (mock)
    const averageTimeToFirstResponse = applications.length > 0 ? 2 : 0; // 2 days

    // Application completion rate
    const completedApplications = applications.filter(
      (app) =>
        app.status === 'Offer Accepted' ||
        app.status === 'Offer Declined' ||
        app.status === 'Rejected' ||
        app.status === 'Withdrawn'
    ).length;
    const applicationCompletionRate =
      applications.length > 0 ? (completedApplications / applications.length) * 100 : 0;

    // Offer acceptance rate
    const offersExtended = applications.filter((app) => app.status === 'Offer Extended' || app.status === 'Offer Accepted').length;
    const offersAccepted = applications.filter((app) => app.status === 'Offer Accepted').length;
    const offerAcceptanceRate = offersExtended > 0 ? (offersAccepted / offersExtended) * 100 : 0;

    return {
      averageTimeToHire,
      averageTimeToFirstResponse,
      applicationCompletionRate: Math.round(applicationCompletionRate),
      offerAcceptanceRate: Math.round(offerAcceptanceRate),
      candidateSatisfactionScore: 4.2, // Mock score
    };
  }

  /**
   * Get AI metrics
   */
  getAIMetrics(): AIMetrics {
    const candidates = dataStore.getAllCandidates();
    const applications = dataStore.getAllApplications();
    const chatSessions = dataStore.getActiveChatSessions();

    // CVs parsed
    const totalCVsParsed = candidates.filter((c) => c.parsedData).length;

    // Average parsing confidence
    const parsedCandidates = candidates.filter((c) => c.parsedData);
    const averageParsingConfidence =
      parsedCandidates.length > 0
        ? Math.round(
            (parsedCandidates.reduce((sum, c) => sum + (c.parsedData?.confidence || 0), 0) /
              parsedCandidates.length) *
              100
          ) / 100
        : 0;

    // Match accuracy (mock - would require feedback data)
    const averageMatchAccuracy = 0.82; // 82%

    // Chatbot metrics
    const allChatSessions = [...dataStore.getActiveChatSessions(), ...Array.from((dataStore as any).chatSessions?.values() || [])];
    const chatbotInteractions = allChatSessions.length;
    const completedSessions = allChatSessions.filter(
      (session) => session.context.stage === 'completed'
    ).length;
    const chatbotCompletionRate =
      chatbotInteractions > 0 ? (completedSessions / chatbotInteractions) * 100 : 0;

    // Match score distribution
    const matchScoreDistribution = {
      '0-25': applications.filter((app) => app.aiMatchScore <= 25).length,
      '26-50': applications.filter((app) => app.aiMatchScore > 25 && app.aiMatchScore <= 50)
        .length,
      '51-75': applications.filter((app) => app.aiMatchScore > 50 && app.aiMatchScore <= 75)
        .length,
      '76-100': applications.filter((app) => app.aiMatchScore > 75).length,
    };

    return {
      totalCVsParsed,
      averageParsingConfidence,
      averageMatchAccuracy,
      chatbotInteractions,
      chatbotCompletionRate: Math.round(chatbotCompletionRate),
      matchScoreDistribution,
    };
  }

  /**
   * Get analytics for specific job
   */
  getJobAnalytics(jobId: string): JobMetrics | undefined {
    const metrics = this.getJobMetrics();
    return metrics.find((m) => m.jobId === jobId);
  }

  /**
   * Get dashboard summary
   */
  getDashboardSummary() {
    const jobs = dataStore.getAllJobs();
    const candidates = dataStore.getAllCandidates();
    const applications = dataStore.getAllApplications();

    const activeJobs = jobs.filter((job) => job.status === 'Active').length;
    const totalApplications = applications.length;
    const newApplications = applications.filter((app) => app.status === 'New').length;
    const shortlistedCandidates = applications.filter((app) => app.status === 'Shortlisted').length;

    const avgMatchScore =
      applications.length > 0
        ? Math.round(
            applications.reduce((sum, app) => sum + app.aiMatchScore, 0) / applications.length
          )
        : 0;

    return {
      activeJobs,
      totalCandidates: candidates.length,
      totalApplications,
      newApplications,
      shortlistedCandidates,
      averageMatchScore: avgMatchScore,
    };
  }
}

export const analyticsService = new AnalyticsService();
