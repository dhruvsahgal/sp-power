import { Request, Response } from 'express';
import { applicationService } from '../services/applicationService';
import { ApplicationStatus } from '../models/types';

export const applicationController = {
  // Create application
  createApplication: async (req: Request, res: Response) => {
    try {
      const { jobId, candidateId, source, coverLetter } = req.body;

      if (!jobId || !candidateId) {
        return res.status(400).json({
          success: false,
          error: 'jobId and candidateId are required',
        });
      }

      const application = await applicationService.createApplication(
        jobId,
        candidateId,
        source || 'Career Site',
        coverLetter
      );

      res.status(201).json({ success: true, data: application });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get all applications
  getAllApplications: async (req: Request, res: Response) => {
    try {
      const filters = {
        jobId: req.query.jobId as string | undefined,
        candidateId: req.query.candidateId as string | undefined,
        status: req.query.status as ApplicationStatus | undefined,
        minMatchScore: req.query.minMatchScore
          ? parseInt(req.query.minMatchScore as string)
          : undefined,
      };

      const applications = applicationService.getAllApplications(filters);
      res.json({ success: true, data: applications });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get application by ID
  getApplication: async (req: Request, res: Response) => {
    try {
      const application = applicationService.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ success: false, error: 'Application not found' });
      }
      res.json({ success: true, data: application });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update application status
  updateStatus: async (req: Request, res: Response) => {
    try {
      const { status, changedBy, comment } = req.body;

      if (!status || !changedBy) {
        return res.status(400).json({
          success: false,
          error: 'status and changedBy are required',
        });
      }

      const application = await applicationService.updateStatus(
        req.params.id,
        status,
        changedBy,
        comment
      );

      if (!application) {
        return res.status(404).json({ success: false, error: 'Application not found' });
      }

      res.json({ success: true, data: application });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Add note
  addNote: async (req: Request, res: Response) => {
    try {
      const { authorId, authorName, content, isPrivate } = req.body;

      if (!authorId || !authorName || !content) {
        return res.status(400).json({
          success: false,
          error: 'authorId, authorName, and content are required',
        });
      }

      const application = applicationService.addNote(
        req.params.id,
        authorId,
        authorName,
        content,
        isPrivate || false
      );

      if (!application) {
        return res.status(404).json({ success: false, error: 'Application not found' });
      }

      res.json({ success: true, data: application });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Schedule interview
  scheduleInterview: async (req: Request, res: Response) => {
    try {
      const interviewData = req.body;

      const application = applicationService.scheduleInterview(req.params.id, interviewData);

      if (!application) {
        return res.status(404).json({ success: false, error: 'Application not found' });
      }

      res.json({ success: true, data: application, message: 'Interview scheduled successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Add interview feedback
  addInterviewFeedback: async (req: Request, res: Response) => {
    try {
      const { interviewId, feedback } = req.body;

      if (!interviewId || !feedback) {
        return res.status(400).json({
          success: false,
          error: 'interviewId and feedback are required',
        });
      }

      const application = applicationService.addInterviewFeedback(
        req.params.id,
        interviewId,
        feedback
      );

      if (!application) {
        return res.status(404).json({ success: false, error: 'Application not found' });
      }

      res.json({ success: true, data: application, message: 'Feedback added successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get applications by job with ranking
  getApplicationsByJobRanked: async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const minScore = req.query.minScore ? parseInt(req.query.minScore as string) : 0;

      const applications = applicationService.getApplicationsByJobRanked(jobId, minScore);
      res.json({ success: true, data: applications });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get shortlisted applications
  getShortlistedApplications: async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const applications = applicationService.getShortlistedApplications(jobId);
      res.json({ success: true, data: applications });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Bulk update status
  bulkUpdateStatus: async (req: Request, res: Response) => {
    try {
      const { applicationIds, status, changedBy, comment } = req.body;

      if (!applicationIds || !Array.isArray(applicationIds) || !status || !changedBy) {
        return res.status(400).json({
          success: false,
          error: 'applicationIds (array), status, and changedBy are required',
        });
      }

      const applications = await applicationService.bulkUpdateStatus(
        applicationIds,
        status,
        changedBy,
        comment
      );

      res.json({ success: true, data: applications, message: 'Applications updated successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get application statistics
  getApplicationStats: async (req: Request, res: Response) => {
    try {
      const filters = req.query.jobId ? { jobId: req.query.jobId as string } : undefined;
      const stats = applicationService.getApplicationStats(filters);
      res.json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
