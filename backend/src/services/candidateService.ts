import { v4 as uuidv4 } from 'uuid';
import { Candidate, Application, ParsedCVData } from '../models/types';
import { dataStore } from '../models/store';
import { aiService } from './aiService';
import { jobService } from './jobService';

class CandidateService {
  /**
   * Create a new candidate
   */
  async createCandidate(candidateData: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt' | 'lastActivityAt'>): Promise<Candidate> {
    // Check if candidate with email already exists
    const existing = dataStore.getCandidateByEmail(candidateData.email);
    if (existing) {
      return existing;
    }

    const candidate: Candidate = {
      ...candidateData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivityAt: new Date(),
    };

    dataStore.createCandidate(candidate);
    return candidate;
  }

  /**
   * Get candidate by ID
   */
  getCandidate(id: string): Candidate | undefined {
    return dataStore.getCandidate(id);
  }

  /**
   * Get candidate by email
   */
  getCandidateByEmail(email: string): Candidate | undefined {
    return dataStore.getCandidateByEmail(email);
  }

  /**
   * Get all candidates
   */
  getAllCandidates(filters?: {
    skills?: string[];
    experienceMin?: number;
    experienceMax?: number;
    location?: string;
  }): Candidate[] {
    let candidates = dataStore.getAllCandidates();

    if (filters) {
      if (filters.skills && filters.skills.length > 0) {
        candidates = candidates.filter((candidate) =>
          filters.skills!.some((skill) =>
            candidate.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
          )
        );
      }
      if (filters.experienceMin !== undefined) {
        candidates = candidates.filter((candidate) => candidate.totalExperience >= filters.experienceMin!);
      }
      if (filters.experienceMax !== undefined) {
        candidates = candidates.filter((candidate) => candidate.totalExperience <= filters.experienceMax!);
      }
      if (filters.location) {
        candidates = candidates.filter((candidate) =>
          candidate.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
    }

    return candidates.sort((a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime());
  }

  /**
   * Update candidate
   */
  updateCandidate(id: string, updates: Partial<Candidate>): Candidate | undefined {
    return dataStore.updateCandidate(id, {
      ...updates,
      lastActivityAt: new Date(),
    });
  }

  /**
   * Search candidates
   */
  searchCandidates(query: string): Candidate[] {
    return dataStore.searchCandidates(query);
  }

  /**
   * Parse and store CV
   */
  async parseAndStoreCV(candidateId: string, cvText: string, cvBuffer: Buffer): Promise<ParsedCVData> {
    const parsedData = await aiService.parseCV(cvText);

    // Update candidate with parsed data
    const candidate = dataStore.getCandidate(candidateId);
    if (candidate) {
      this.updateCandidate(candidateId, {
        parsedData,
        skills: parsedData.skills.length > 0 ? parsedData.skills : candidate.skills,
        education: parsedData.education.length > 0 ? parsedData.education : candidate.education,
        certifications: parsedData.certifications.length > 0 ? parsedData.certifications : candidate.certifications,
        resumeText: cvText,
      });
    }

    // Store CV file
    dataStore.storeCVFile(candidateId, cvBuffer);

    return parsedData;
  }

  /**
   * Get candidate applications
   */
  getCandidateApplications(candidateId: string): Application[] {
    return dataStore.getApplicationsByCandidate(candidateId);
  }

  /**
   * Get candidate's recommended jobs
   */
  async getRecommendedJobs(candidateId: string, limit: number = 5) {
    const candidate = dataStore.getCandidate(candidateId);
    if (!candidate) return [];

    const activeJobs = jobService.getActiveJobs();
    const recommendations = await aiService.recommendJobs(candidate, activeJobs);

    return recommendations.slice(0, limit);
  }

  /**
   * Get candidate CV file
   */
  getCVFile(candidateId: string): Buffer | undefined {
    return dataStore.getCVFile(candidateId);
  }

  /**
   * Get candidate profile completeness
   */
  getProfileCompleteness(candidate: Candidate): number {
    let score = 0;
    const weights = {
      basicInfo: 20,
      skills: 20,
      experience: 20,
      education: 15,
      resume: 15,
      certifications: 5,
      preferences: 5,
    };

    // Basic info (name, email, phone, location)
    if (candidate.firstName && candidate.lastName && candidate.email && candidate.phone && candidate.location) {
      score += weights.basicInfo;
    }

    // Skills
    if (candidate.skills.length >= 5) {
      score += weights.skills;
    } else if (candidate.skills.length > 0) {
      score += (candidate.skills.length / 5) * weights.skills;
    }

    // Experience
    if (candidate.totalExperience > 0 && candidate.currentCompany && candidate.currentTitle) {
      score += weights.experience;
    }

    // Education
    if (candidate.education.length > 0) {
      score += weights.education;
    }

    // Resume
    if (candidate.resumeText || candidate.resumeUrl) {
      score += weights.resume;
    }

    // Certifications
    if (candidate.certifications.length > 0) {
      score += weights.certifications;
    }

    // Preferences
    if (candidate.preferredLocations.length > 0 || candidate.preferredEmploymentTypes.length > 0) {
      score += weights.preferences;
    }

    return Math.round(score);
  }
}

export const candidateService = new CandidateService();
