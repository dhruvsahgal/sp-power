import {
  Job,
  Candidate,
  Application,
  User,
  ChatSession,
  SuccessFactorsSync,
} from './types';

// In-Memory Data Store
class DataStore {
  private jobs: Map<string, Job> = new Map();
  private candidates: Map<string, Candidate> = new Map();
  private applications: Map<string, Application> = new Map();
  private users: Map<string, User> = new Map();
  private chatSessions: Map<string, ChatSession> = new Map();
  private cvCache: Map<string, Buffer> = new Map(); // candidateId -> CV file buffer
  private syncHistory: SuccessFactorsSync[] = [];

  // Job Operations
  createJob(job: Job): Job {
    this.jobs.set(job.id, job);
    return job;
  }

  getJob(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  getAllJobs(): Job[] {
    return Array.from(this.jobs.values());
  }

  updateJob(id: string, updates: Partial<Job>): Job | undefined {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    const updated = { ...job, ...updates, updatedAt: new Date() };
    this.jobs.set(id, updated);
    return updated;
  }

  deleteJob(id: string): boolean {
    return this.jobs.delete(id);
  }

  getActiveJobs(): Job[] {
    return Array.from(this.jobs.values()).filter((job) => job.status === 'Active');
  }

  getJobsByManager(managerId: string): Job[] {
    return Array.from(this.jobs.values()).filter(
      (job) => job.hiringManagerId === managerId
    );
  }

  getJobsByTASpecialist(specialistId: string): Job[] {
    return Array.from(this.jobs.values()).filter(
      (job) => job.taSpecialistId === specialistId
    );
  }

  // Candidate Operations
  createCandidate(candidate: Candidate): Candidate {
    this.candidates.set(candidate.id, candidate);
    return candidate;
  }

  getCandidate(id: string): Candidate | undefined {
    return this.candidates.get(id);
  }

  getCandidateByEmail(email: string): Candidate | undefined {
    return Array.from(this.candidates.values()).find(
      (candidate) => candidate.email.toLowerCase() === email.toLowerCase()
    );
  }

  getAllCandidates(): Candidate[] {
    return Array.from(this.candidates.values());
  }

  updateCandidate(id: string, updates: Partial<Candidate>): Candidate | undefined {
    const candidate = this.candidates.get(id);
    if (!candidate) return undefined;
    const updated = { ...candidate, ...updates, updatedAt: new Date() };
    this.candidates.set(id, updated);
    return updated;
  }

  searchCandidates(query: string): Candidate[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.candidates.values()).filter(
      (candidate) =>
        candidate.firstName.toLowerCase().includes(lowerQuery) ||
        candidate.lastName.toLowerCase().includes(lowerQuery) ||
        candidate.email.toLowerCase().includes(lowerQuery) ||
        candidate.skills.some((skill) => skill.toLowerCase().includes(lowerQuery)) ||
        candidate.currentTitle?.toLowerCase().includes(lowerQuery)
    );
  }

  // Application Operations
  createApplication(application: Application): Application {
    this.applications.set(application.id, application);
    return application;
  }

  getApplication(id: string): Application | undefined {
    return this.applications.get(id);
  }

  getAllApplications(): Application[] {
    return Array.from(this.applications.values());
  }

  getApplicationsByJob(jobId: string): Application[] {
    return Array.from(this.applications.values()).filter(
      (app) => app.jobId === jobId
    );
  }

  getApplicationsByCandidate(candidateId: string): Application[] {
    return Array.from(this.applications.values()).filter(
      (app) => app.candidateId === candidateId
    );
  }

  getCandidateApplicationForJob(candidateId: string, jobId: string): Application | undefined {
    return Array.from(this.applications.values()).find(
      (app) => app.candidateId === candidateId && app.jobId === jobId
    );
  }

  updateApplication(id: string, updates: Partial<Application>): Application | undefined {
    const application = this.applications.get(id);
    if (!application) return undefined;
    const updated = { ...application, ...updates };
    this.applications.set(id, updated);
    return updated;
  }

  // User Operations
  createUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUsersByRole(role: User['role']): User[] {
    return Array.from(this.users.values()).filter((user) => user.role === role);
  }

  // Chat Session Operations
  createChatSession(session: ChatSession): ChatSession {
    this.chatSessions.set(session.id, session);
    return session;
  }

  getChatSession(id: string): ChatSession | undefined {
    return this.chatSessions.get(id);
  }

  updateChatSession(id: string, updates: Partial<ChatSession>): ChatSession | undefined {
    const session = this.chatSessions.get(id);
    if (!session) return undefined;
    const updated = { ...session, ...updates };
    this.chatSessions.set(id, updated);
    return updated;
  }

  getActiveChatSessions(): ChatSession[] {
    return Array.from(this.chatSessions.values()).filter(
      (session) => session.isActive
    );
  }

  // CV Cache Operations
  storeCVFile(candidateId: string, fileBuffer: Buffer): void {
    this.cvCache.set(candidateId, fileBuffer);
  }

  getCVFile(candidateId: string): Buffer | undefined {
    return this.cvCache.get(candidateId);
  }

  // SuccessFactors Sync Operations
  addSyncHistory(sync: SuccessFactorsSync): void {
    this.syncHistory.push(sync);
  }

  getSyncHistory(): SuccessFactorsSync[] {
    return this.syncHistory;
  }

  getLastSync(type: SuccessFactorsSync['syncType']): SuccessFactorsSync | undefined {
    return this.syncHistory
      .filter((sync) => sync.syncType === type)
      .sort((a, b) => b.lastSyncAt.getTime() - a.lastSyncAt.getTime())[0];
  }

  // Utility Operations
  clear(): void {
    this.jobs.clear();
    this.candidates.clear();
    this.applications.clear();
    this.chatSessions.clear();
    this.cvCache.clear();
    this.syncHistory = [];
    // Keep users for authentication
  }

  getStats() {
    return {
      jobs: this.jobs.size,
      candidates: this.candidates.size,
      applications: this.applications.size,
      users: this.users.size,
      chatSessions: this.chatSessions.size,
      cvsCached: this.cvCache.size,
    };
  }
}

// Singleton instance
export const dataStore = new DataStore();
