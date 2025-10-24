import { Request, Response } from 'express';
import { jobService } from '../services/jobService';
import { Job } from '../models/types';

export const jobController = {
  // Create new job
  createJob: async (req: Request, res: Response) => {
    try {
      const job = await jobService.createJob(req.body);
      res.status(201).json({ success: true, data: job });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get all jobs
  getAllJobs: async (req: Request, res: Response) => {
    try {
      const filters = {
        status: req.query.status as Job['status'] | undefined,
        department: req.query.department as string | undefined,
        location: req.query.location as string | undefined,
        hiringManagerId: req.query.hiringManagerId as string | undefined,
        taSpecialistId: req.query.taSpecialistId as string | undefined,
      };

      const jobs = jobService.getAllJobs(filters);
      res.json({ success: true, data: jobs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get job by ID
  getJob: async (req: Request, res: Response) => {
    try {
      const job = jobService.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }
      res.json({ success: true, data: job });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update job
  updateJob: async (req: Request, res: Response) => {
    try {
      const job = await jobService.updateJob(req.params.id, req.body);
      if (!job) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }
      res.json({ success: true, data: job });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Delete job
  deleteJob: async (req: Request, res: Response) => {
    try {
      const deleted = jobService.deleteJob(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }
      res.json({ success: true, message: 'Job deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get active jobs
  getActiveJobs: async (req: Request, res: Response) => {
    try {
      const jobs = jobService.getActiveJobs();
      res.json({ success: true, data: jobs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Publish job
  publishJob: async (req: Request, res: Response) => {
    try {
      const { channels } = req.body;
      const job = await jobService.publishJob(req.params.id, channels);
      if (!job) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }
      res.json({ success: true, data: job, message: 'Job published successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Close job
  closeJob: async (req: Request, res: Response) => {
    try {
      const job = await jobService.closeJob(req.params.id);
      if (!job) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }
      res.json({ success: true, data: job, message: 'Job closed successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Search jobs
  searchJobs: async (req: Request, res: Response) => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ success: false, error: 'Search query required' });
      }
      const jobs = jobService.searchJobs(query);
      res.json({ success: true, data: jobs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get job statistics
  getJobStats: async (req: Request, res: Response) => {
    try {
      const stats = jobService.getJobStats(req.params.id);
      res.json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
