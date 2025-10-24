import { Router } from 'express';
import { jobController } from '../controllers/jobController';
import { candidateController } from '../controllers/candidateController';
import { applicationController } from '../controllers/applicationController';
import { analyticsController } from '../controllers/analyticsController';
import multer from 'multer';

const router = Router();

// Configure multer for file uploads (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  },
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Job routes
router.post('/jobs', jobController.createJob);
router.get('/jobs', jobController.getAllJobs);
router.get('/jobs/active', jobController.getActiveJobs);
router.get('/jobs/search', jobController.searchJobs);
router.get('/jobs/:id', jobController.getJob);
router.put('/jobs/:id', jobController.updateJob);
router.delete('/jobs/:id', jobController.deleteJob);
router.post('/jobs/:id/publish', jobController.publishJob);
router.post('/jobs/:id/close', jobController.closeJob);
router.get('/jobs/:id/stats', jobController.getJobStats);

// Candidate routes
router.post('/candidates', candidateController.createCandidate);
router.get('/candidates', candidateController.getAllCandidates);
router.get('/candidates/search', candidateController.searchCandidates);
router.get('/candidates/:id', candidateController.getCandidate);
router.put('/candidates/:id', candidateController.updateCandidate);
router.post('/candidates/:candidateId/cv', upload.single('cv'), candidateController.uploadCV);
router.get('/candidates/:id/cv', candidateController.getCVFile);
router.get('/candidates/:id/applications', candidateController.getCandidateApplications);
router.get('/candidates/:id/recommendations', candidateController.getRecommendedJobs);
router.get('/candidates/:id/profile-completeness', candidateController.getProfileCompleteness);

// Application routes
router.post('/applications', applicationController.createApplication);
router.get('/applications', applicationController.getAllApplications);
router.get('/applications/stats', applicationController.getApplicationStats);
router.get('/applications/:id', applicationController.getApplication);
router.put('/applications/:id/status', applicationController.updateStatus);
router.post('/applications/:id/notes', applicationController.addNote);
router.post('/applications/:id/interviews', applicationController.scheduleInterview);
router.post('/applications/:id/interviews/feedback', applicationController.addInterviewFeedback);
router.get('/applications/job/:jobId/ranked', applicationController.getApplicationsByJobRanked);
router.get('/applications/job/:jobId/shortlisted', applicationController.getShortlistedApplications);
router.post('/applications/bulk-update', applicationController.bulkUpdateStatus);

// Analytics routes
router.get('/analytics', analyticsController.getAnalytics);
router.get('/analytics/jobs', analyticsController.getJobMetrics);
router.get('/analytics/candidates', analyticsController.getCandidateMetrics);
router.get('/analytics/performance', analyticsController.getPerformanceMetrics);
router.get('/analytics/ai', analyticsController.getAIMetrics);
router.get('/analytics/jobs/:jobId', analyticsController.getJobAnalytics);
router.get('/analytics/dashboard', analyticsController.getDashboardSummary);

export default router;
