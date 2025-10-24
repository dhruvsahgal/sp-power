// Re-export backend types for frontend use
export interface Job {
  id: string;
  requisitionId: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: {
    required: string[];
    preferred: string[];
  };
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'Draft' | 'Active' | 'On Hold' | 'Closed' | 'Cancelled';
  publishedChannels: string[];
  hiringManagerId: string;
  taSpecialistId: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  numberOfPositions: number;
  applicationDeadline?: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  currentCompany?: string;
  currentTitle?: string;
  totalExperience: number;
  education: Education[];
  skills: string[];
  certifications: string[];
  preferredLocations: string[];
  preferredEmploymentTypes: string[];
  salaryExpectation?: {
    min: number;
    max: number;
    currency: string;
  };
  resumeUrl?: string;
  resumeText?: string;
  parsedData?: ParsedCVData;
  source: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: number;
}

export interface ParsedCVData {
  summary?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications: string[];
  languages: string[];
  achievements?: string[];
  extractedAt: string;
  confidence: number;
}

export interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements?: string[];
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  appliedAt: string;
  aiMatchScore: number;
  aiMatchDetails: MatchDetails;
  statusHistory: StatusHistory[];
  notes: Note[];
  interviews: Interview[];
  assignedTo?: string;
  source: string;
  coverLetter?: string;
  screeningAnswers?: Record<string, string>;
}

export type ApplicationStatus =
  | 'New'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Interview Completed'
  | 'Offer Extended'
  | 'Offer Accepted'
  | 'Offer Declined'
  | 'Rejected'
  | 'Withdrawn';

export interface MatchDetails {
  overallScore: number;
  skillMatch: {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
  };
  experienceMatch: {
    score: number;
    yearsRequired: number;
    yearsActual: number;
    levelMatch: boolean;
  };
  educationMatch: {
    score: number;
    meetsRequirements: boolean;
  };
  locationMatch: {
    score: number;
    matches: boolean;
  };
  reasoning: string;
  strengths: string[];
  concerns: string[];
  recommendation: 'Strong Match' | 'Good Match' | 'Moderate Match' | 'Weak Match';
}

export interface StatusHistory {
  status: ApplicationStatus;
  changedBy: string;
  changedAt: string;
  comment?: string;
}

export interface Note {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  isPrivate: boolean;
}

export interface Interview {
  id: string;
  type: 'Phone Screen' | 'Technical' | 'Behavioral' | 'Panel' | 'Final';
  scheduledAt: string;
  duration: number;
  interviewers: string[];
  location?: string;
  meetingLink?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  feedback?: InterviewFeedback[];
}

export interface InterviewFeedback {
  interviewerId: string;
  interviewerName: string;
  rating: number;
  strengths: string[];
  concerns: string[];
  recommendation: 'Strong Hire' | 'Hire' | 'Maybe' | 'No Hire';
  comments: string;
  submittedAt: string;
}

export interface Analytics {
  jobMetrics: JobMetrics[];
  candidateMetrics: CandidateMetrics;
  performanceMetrics: PerformanceMetrics;
  aiMetrics: AIMetrics;
}

export interface JobMetrics {
  jobId: string;
  jobTitle: string;
  applicationsCount: number;
  shortlistedCount: number;
  interviewCount: number;
  offerCount: number;
  hireCount: number;
  averageTimeToHire: number;
  averageTimeToShortlist: number;
  conversionRates: {
    applicationToShortlist: number;
    shortlistToInterview: number;
    interviewToOffer: number;
    offerToHire: number;
  };
  topSources: Array<{ source: string; count: number }>;
  averageMatchScore: number;
}

export interface CandidateMetrics {
  totalCandidates: number;
  newThisWeek: number;
  newThisMonth: number;
  bySource: Record<string, number>;
  byStatus: Record<ApplicationStatus, number>;
  averageExperience: number;
  topSkills: Array<{ skill: string; count: number }>;
}

export interface PerformanceMetrics {
  averageTimeToHire: number;
  averageTimeToFirstResponse: number;
  applicationCompletionRate: number;
  offerAcceptanceRate: number;
  candidateSatisfactionScore?: number;
}

export interface AIMetrics {
  totalCVsParsed: number;
  averageParsingConfidence: number;
  averageMatchAccuracy: number;
  chatbotInteractions: number;
  chatbotCompletionRate: number;
  matchScoreDistribution: {
    '0-25': number;
    '26-50': number;
    '51-75': number;
    '76-100': number;
  };
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface DashboardSummary {
  activeJobs: number;
  totalCandidates: number;
  totalApplications: number;
  newApplications: number;
  shortlistedCandidates: number;
  averageMatchScore: number;
}
