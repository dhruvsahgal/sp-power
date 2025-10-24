import { ParsedCVData, Job, Candidate, MatchDetails } from '../models/types';
import axios from 'axios';

interface AIConfig {
  provider: 'openai' | 'anthropic';
  apiKey: string;
}

class AIService {
  private config: AIConfig;

  constructor() {
    const provider = (process.env.AI_PROVIDER || 'openai') as 'openai' | 'anthropic';
    const apiKey =
      provider === 'openai'
        ? process.env.OPENAI_API_KEY || ''
        : process.env.ANTHROPIC_API_KEY || '';

    this.config = { provider, apiKey };
  }

  /**
   * Parse CV/Resume text and extract structured information
   */
  async parseCV(cvText: string): Promise<ParsedCVData> {
    const prompt = `You are an expert CV/Resume parser. Extract the following information from the provided CV text and return it as a JSON object:

{
  "summary": "Brief professional summary (2-3 sentences)",
  "skills": ["array", "of", "technical", "and", "soft", "skills"],
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or null if current",
      "current": true/false,
      "description": "Brief description",
      "achievements": ["achievement1", "achievement2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Type",
      "fieldOfStudy": "Field",
      "startDate": "YYYY",
      "endDate": "YYYY",
      "current": false,
      "gpa": 3.8
    }
  ],
  "certifications": ["cert1", "cert2"],
  "languages": ["English", "Spanish"],
  "achievements": ["notable achievements or awards"]
}

CV Text:
${cvText}

Return ONLY valid JSON, no other text.`;

    try {
      const response = await this.callAI(prompt, 2000);
      const parsed = this.extractJSON(response);

      return {
        ...parsed,
        extractedAt: new Date(),
        confidence: 0.85, // Could implement confidence scoring logic
      };
    } catch (error) {
      console.error('CV parsing error:', error);
      // Return basic structure on error
      return {
        summary: 'Could not parse CV',
        skills: [],
        experience: [],
        education: [],
        certifications: [],
        languages: ['English'],
        extractedAt: new Date(),
        confidence: 0.3,
      };
    }
  }

  /**
   * Match candidate to job and provide AI-powered scoring and reasoning
   */
  async matchCandidateToJob(candidate: Candidate, job: Job): Promise<MatchDetails> {
    const prompt = `You are an expert recruiter analyzing candidate-job fit. Analyze the match between this candidate and job, then return a JSON object with detailed scoring.

Candidate Profile:
- Name: ${candidate.firstName} ${candidate.lastName}
- Current Role: ${candidate.currentTitle || 'Not specified'}
- Total Experience: ${candidate.totalExperience} years
- Skills: ${candidate.skills.join(', ')}
- Education: ${candidate.education.map(e => `${e.degree} in ${e.fieldOfStudy} from ${e.institution}`).join('; ')}
- Location: ${candidate.location}

Job Requirements:
- Title: ${job.title}
- Experience Level: ${job.experienceLevel}
- Required Skills: ${job.skills.required.join(', ')}
- Preferred Skills: ${job.skills.preferred.join(', ')}
- Requirements: ${job.requirements.join('; ')}
- Location: ${job.location}

Provide a detailed match analysis in the following JSON format:
{
  "overallScore": 85,
  "skillMatch": {
    "score": 80,
    "matchedSkills": ["skill1", "skill2"],
    "missingSkills": ["skill3"]
  },
  "experienceMatch": {
    "score": 90,
    "yearsRequired": 5,
    "yearsActual": ${candidate.totalExperience},
    "levelMatch": true
  },
  "educationMatch": {
    "score": 85,
    "meetsRequirements": true
  },
  "locationMatch": {
    "score": 100,
    "matches": true
  },
  "reasoning": "Detailed explanation of the match quality",
  "strengths": ["strength1", "strength2", "strength3"],
  "concerns": ["concern1", "concern2"],
  "recommendation": "Strong Match|Good Match|Moderate Match|Weak Match"
}

Return ONLY valid JSON, no other text.`;

    try {
      const response = await this.callAI(prompt, 1500);
      const matchDetails = this.extractJSON(response);
      return matchDetails;
    } catch (error) {
      console.error('Matching error:', error);
      // Return basic scoring on error
      return this.basicMatch(candidate, job);
    }
  }

  /**
   * Process chatbot conversation and extract intent/data
   */
  async processChatMessage(
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }>,
    context: any
  ): Promise<{ response: string; intent?: string; extractedData?: any }> {
    const prompt = `You are a helpful AI recruitment assistant chatbot. Help candidates:
1. Upload their CV and provide profile information
2. Search and browse available jobs
3. Apply for positions
4. Check application status

Current conversation stage: ${context.stage || 'greeting'}

Conversation history:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

User: ${userMessage}

Respond naturally and helpfully. If the user provides information (name, email, skills, etc.), acknowledge it. Guide them through the application process.

If you detect structured data (name, email, phone, skills), include it in your response in this format:
EXTRACTED_DATA: {"field": "value", ...}

Response:`;

    try {
      const response = await this.callAI(prompt, 500);

      // Extract any structured data
      const extractedDataMatch = response.match(/EXTRACTED_DATA:\s*({.*?})/s);
      let extractedData;
      let cleanResponse = response;

      if (extractedDataMatch) {
        try {
          extractedData = JSON.parse(extractedDataMatch[1]);
          cleanResponse = response.replace(/EXTRACTED_DATA:.*$/s, '').trim();
        } catch (e) {
          console.error('Failed to parse extracted data:', e);
        }
      }

      // Detect intent from message
      const intent = this.detectIntent(userMessage, context);

      return {
        response: cleanResponse,
        intent,
        extractedData,
      };
    } catch (error) {
      console.error('Chat processing error:', error);
      return {
        response: "I'm here to help! You can upload your CV, search for jobs, or ask about your application status. How can I assist you?",
      };
    }
  }

  /**
   * Generate job recommendations for a candidate
   */
  async recommendJobs(candidate: Candidate, availableJobs: Job[]): Promise<Array<{ job: Job; score: number; reason: string }>> {
    if (availableJobs.length === 0) return [];

    // For performance, limit to top 10 jobs for AI analysis
    const jobsToAnalyze = availableJobs.slice(0, 10);

    const recommendations: Array<{ job: Job; score: number; reason: string }> = [];

    for (const job of jobsToAnalyze) {
      try {
        const matchDetails = await this.matchCandidateToJob(candidate, job);
        recommendations.push({
          job,
          score: matchDetails.overallScore,
          reason: matchDetails.reasoning,
        });
      } catch (error) {
        console.error(`Failed to match job ${job.id}:`, error);
      }
    }

    // Sort by score descending
    return recommendations.sort((a, b) => b.score - a.score);
  }

  /**
   * Call the AI provider API
   */
  private async callAI(prompt: string, maxTokens: number = 1000): Promise<string> {
    if (this.config.provider === 'openai') {
      return this.callOpenAI(prompt, maxTokens);
    } else {
      return this.callAnthropic(prompt, maxTokens);
    }
  }

  private async callOpenAI(prompt: string, maxTokens: number): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      throw new Error('Failed to call OpenAI API');
    }
  }

  private async callAnthropic(prompt: string, maxTokens: number): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.config.apiKey,
            'anthropic-version': '2023-06-01',
          },
        }
      );

      return response.data.content[0].text;
    } catch (error: any) {
      console.error('Anthropic API error:', error.response?.data || error.message);
      throw new Error('Failed to call Anthropic API');
    }
  }

  /**
   * Extract JSON from AI response
   */
  private extractJSON(response: string): any {
    // Try to find JSON in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No valid JSON found in response');
  }

  /**
   * Detect user intent from message
   */
  private detectIntent(message: string, context: any): string | undefined {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('apply') || lowerMessage.includes('job')) {
      return 'job_search';
    }
    if (lowerMessage.includes('status') || lowerMessage.includes('application')) {
      return 'status_check';
    }
    if (lowerMessage.includes('cv') || lowerMessage.includes('resume') || lowerMessage.includes('upload')) {
      return 'cv_upload';
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'greeting';
    }

    return undefined;
  }

  /**
   * Basic matching fallback when AI is unavailable
   */
  private basicMatch(candidate: Candidate, job: Job): MatchDetails {
    const candidateSkills = new Set(candidate.skills.map(s => s.toLowerCase()));
    const requiredSkills = job.skills.required.map(s => s.toLowerCase());
    const preferredSkills = job.skills.preferred.map(s => s.toLowerCase());

    const matchedRequired = requiredSkills.filter(s => candidateSkills.has(s));
    const matchedPreferred = preferredSkills.filter(s => candidateSkills.has(s));
    const missingRequired = requiredSkills.filter(s => !candidateSkills.has(s));

    const skillScore = requiredSkills.length > 0
      ? (matchedRequired.length / requiredSkills.length) * 100
      : 50;

    const experienceScore = this.calculateExperienceScore(
      candidate.totalExperience,
      job.experienceLevel
    );

    const overallScore = Math.round((skillScore * 0.6 + experienceScore * 0.4));

    let recommendation: MatchDetails['recommendation'];
    if (overallScore >= 80) recommendation = 'Strong Match';
    else if (overallScore >= 60) recommendation = 'Good Match';
    else if (overallScore >= 40) recommendation = 'Moderate Match';
    else recommendation = 'Weak Match';

    return {
      overallScore,
      skillMatch: {
        score: Math.round(skillScore),
        matchedSkills: [...matchedRequired, ...matchedPreferred],
        missingSkills: missingRequired,
      },
      experienceMatch: {
        score: experienceScore,
        yearsRequired: this.getRequiredYears(job.experienceLevel),
        yearsActual: candidate.totalExperience,
        levelMatch: experienceScore >= 60,
      },
      educationMatch: {
        score: candidate.education.length > 0 ? 70 : 30,
        meetsRequirements: candidate.education.length > 0,
      },
      locationMatch: {
        score: 100,
        matches: true,
      },
      reasoning: `Candidate has ${matchedRequired.length}/${requiredSkills.length} required skills and ${candidate.totalExperience} years of experience.`,
      strengths: [
        ...matchedRequired.slice(0, 3).map(s => `Has ${s} skill`),
        `${candidate.totalExperience} years of experience`,
      ],
      concerns: missingRequired.length > 0
        ? [`Missing required skills: ${missingRequired.join(', ')}`]
        : [],
      recommendation,
    };
  }

  private calculateExperienceScore(yearsExp: number, level: string): number {
    const required = this.getRequiredYears(level);
    if (yearsExp >= required) return 100;
    if (yearsExp >= required * 0.7) return 80;
    if (yearsExp >= required * 0.5) return 60;
    if (yearsExp >= required * 0.3) return 40;
    return 20;
  }

  private getRequiredYears(level: string): number {
    const map: Record<string, number> = {
      Entry: 0,
      Mid: 3,
      Senior: 6,
      Lead: 8,
      Executive: 12,
    };
    return map[level] || 3;
  }
}

export const aiService = new AIService();
