import { Request, Response } from 'express';
import { candidateService } from '../services/candidateService';
import pdf from 'pdf-parse';

export const candidateController = {
  // Create candidate
  createCandidate: async (req: Request, res: Response) => {
    try {
      const candidate = await candidateService.createCandidate(req.body);
      res.status(201).json({ success: true, data: candidate });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get all candidates
  getAllCandidates: async (req: Request, res: Response) => {
    try {
      const filters = {
        skills: req.query.skills
          ? (req.query.skills as string).split(',')
          : undefined,
        experienceMin: req.query.experienceMin
          ? parseInt(req.query.experienceMin as string)
          : undefined,
        experienceMax: req.query.experienceMax
          ? parseInt(req.query.experienceMax as string)
          : undefined,
        location: req.query.location as string | undefined,
      };

      const candidates = candidateService.getAllCandidates(filters);
      res.json({ success: true, data: candidates });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get candidate by ID
  getCandidate: async (req: Request, res: Response) => {
    try {
      const candidate = candidateService.getCandidate(req.params.id);
      if (!candidate) {
        return res.status(404).json({ success: false, error: 'Candidate not found' });
      }
      res.json({ success: true, data: candidate });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update candidate
  updateCandidate: async (req: Request, res: Response) => {
    try {
      const candidate = candidateService.updateCandidate(req.params.id, req.body);
      if (!candidate) {
        return res.status(404).json({ success: false, error: 'Candidate not found' });
      }
      res.json({ success: true, data: candidate });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Search candidates
  searchCandidates: async (req: Request, res: Response) => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ success: false, error: 'Search query required' });
      }
      const candidates = candidateService.searchCandidates(query);
      res.json({ success: true, data: candidates });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Upload and parse CV
  uploadCV: async (req: Request, res: Response) => {
    try {
      const { candidateId } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }

      let cvText = '';

      // Extract text based on file type
      if (file.mimetype === 'application/pdf') {
        const pdfData = await pdf(file.buffer);
        cvText = pdfData.text;
      } else if (file.mimetype === 'text/plain') {
        cvText = file.buffer.toString('utf-8');
      } else {
        return res.status(400).json({
          success: false,
          error: 'Unsupported file type. Please upload PDF or TXT',
        });
      }

      const parsedData = await candidateService.parseAndStoreCV(
        candidateId,
        cvText,
        file.buffer
      );

      res.json({
        success: true,
        data: parsedData,
        message: 'CV uploaded and parsed successfully',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get candidate applications
  getCandidateApplications: async (req: Request, res: Response) => {
    try {
      const applications = candidateService.getCandidateApplications(req.params.id);
      res.json({ success: true, data: applications });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get recommended jobs
  getRecommendedJobs: async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const recommendations = await candidateService.getRecommendedJobs(req.params.id, limit);
      res.json({ success: true, data: recommendations });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get CV file
  getCVFile: async (req: Request, res: Response) => {
    try {
      const cvBuffer = candidateService.getCVFile(req.params.id);
      if (!cvBuffer) {
        return res.status(404).json({ success: false, error: 'CV file not found' });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=cv_${req.params.id}.pdf`);
      res.send(cvBuffer);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get profile completeness
  getProfileCompleteness: async (req: Request, res: Response) => {
    try {
      const candidate = candidateService.getCandidate(req.params.id);
      if (!candidate) {
        return res.status(404).json({ success: false, error: 'Candidate not found' });
      }

      const completeness = candidateService.getProfileCompleteness(candidate);
      res.json({ success: true, data: { completeness } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
