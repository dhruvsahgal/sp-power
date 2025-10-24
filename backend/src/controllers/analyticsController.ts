import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';

export const analyticsController = {
  // Get comprehensive analytics
  getAnalytics: async (req: Request, res: Response) => {
    try {
      const analytics = analyticsService.getAnalytics();
      res.json({ success: true, data: analytics });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get job metrics
  getJobMetrics: async (req: Request, res: Response) => {
    try {
      const metrics = analyticsService.getJobMetrics();
      res.json({ success: true, data: metrics });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get candidate metrics
  getCandidateMetrics: async (req: Request, res: Response) => {
    try {
      const metrics = analyticsService.getCandidateMetrics();
      res.json({ success: true, data: metrics });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get performance metrics
  getPerformanceMetrics: async (req: Request, res: Response) => {
    try {
      const metrics = analyticsService.getPerformanceMetrics();
      res.json({ success: true, data: metrics });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get AI metrics
  getAIMetrics: async (req: Request, res: Response) => {
    try {
      const metrics = analyticsService.getAIMetrics();
      res.json({ success: true, data: metrics });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get job analytics
  getJobAnalytics: async (req: Request, res: Response) => {
    try {
      const analytics = analyticsService.getJobAnalytics(req.params.jobId);
      if (!analytics) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }
      res.json({ success: true, data: analytics });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get dashboard summary
  getDashboardSummary: async (req: Request, res: Response) => {
    try {
      const summary = analyticsService.getDashboardSummary();
      res.json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
