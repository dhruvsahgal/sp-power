import { dataStore } from '../models/store';
import { User, Job, Candidate } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Seed database with demo data
 */
export const seedData = () => {
  console.log('[Seed] Starting data seeding...');

  // Create users
  const taSpecialist: User = {
    id: 'user-ta-001',
    email: 'ta.specialist@company.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'TA Specialist',
    department: 'Human Resources',
    phone: '+1-555-0101',
    createdAt: new Date(),
    isActive: true,
  };

  const hiringManager1: User = {
    id: 'user-hm-001',
    email: 'john.smith@company.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'Hiring Manager',
    department: 'Engineering',
    phone: '+1-555-0102',
    createdAt: new Date(),
    isActive: true,
  };

  const hiringManager2: User = {
    id: 'user-hm-002',
    email: 'emily.davis@company.com',
    firstName: 'Emily',
    lastName: 'Davis',
    role: 'Hiring Manager',
    department: 'Product',
    phone: '+1-555-0103',
    createdAt: new Date(),
    isActive: true,
  };

  const admin: User = {
    id: 'user-admin-001',
    email: 'admin@company.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'Admin',
    phone: '+1-555-0100',
    createdAt: new Date(),
    isActive: true,
  };

  dataStore.createUser(taSpecialist);
  dataStore.createUser(hiringManager1);
  dataStore.createUser(hiringManager2);
  dataStore.createUser(admin);

  console.log('[Seed] Created 4 users');

  // Create jobs
  const jobs: Job[] = [
    {
      id: 'job-001',
      requisitionId: 'REQ-2024-001',
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      employmentType: 'Full-time',
      experienceLevel: 'Senior',
      description: 'We are seeking an experienced Full Stack Engineer to join our growing engineering team.',
      requirements: [
        '5+ years of professional software development experience',
        'Strong proficiency in React and Node.js',
        'Experience with cloud platforms (AWS/Azure/GCP)',
        'Excellent problem-solving skills',
      ],
      responsibilities: [
        'Design and develop scalable web applications',
        'Collaborate with cross-functional teams',
        'Mentor junior developers',
        'Participate in code reviews and technical discussions',
      ],
      skills: {
        required: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL', 'REST APIs'],
        preferred: ['AWS', 'Docker', 'Kubernetes', 'GraphQL', 'MongoDB'],
      },
      salaryRange: { min: 120000, max: 180000, currency: 'USD' },
      status: 'Active',
      publishedChannels: ['Career Site', 'LinkedIn', 'Indeed'],
      hiringManagerId: hiringManager1.id,
      taSpecialistId: taSpecialist.id,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      numberOfPositions: 2,
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'job-002',
      requisitionId: 'REQ-2024-002',
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      employmentType: 'Full-time',
      experienceLevel: 'Mid',
      description: 'Join our product team to drive innovation and deliver exceptional user experiences.',
      requirements: [
        '3+ years of product management experience',
        'Strong analytical and problem-solving skills',
        'Experience with agile methodologies',
        'Excellent communication skills',
      ],
      responsibilities: [
        'Define product vision and strategy',
        'Work closely with engineering and design teams',
        'Conduct user research and gather feedback',
        'Prioritize features and manage product roadmap',
      ],
      skills: {
        required: ['Product Management', 'Agile', 'User Research', 'Data Analysis', 'Stakeholder Management'],
        preferred: ['SQL', 'Figma', 'JIRA', 'A/B Testing', 'SaaS Experience'],
      },
      salaryRange: { min: 100000, max: 140000, currency: 'USD' },
      status: 'Active',
      publishedChannels: ['Career Site', 'LinkedIn'],
      hiringManagerId: hiringManager2.id,
      taSpecialistId: taSpecialist.id,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      numberOfPositions: 1,
      applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'job-003',
      requisitionId: 'REQ-2024-003',
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'New York, NY',
      employmentType: 'Full-time',
      experienceLevel: 'Mid',
      description: 'We are looking for a talented Frontend Developer to create beautiful, responsive user interfaces.',
      requirements: [
        '3+ years of frontend development experience',
        'Expert knowledge of React and modern JavaScript',
        'Strong understanding of web performance optimization',
        'Experience with responsive design',
      ],
      responsibilities: [
        'Build and maintain user-facing features',
        'Optimize applications for maximum speed and scalability',
        'Collaborate with designers and backend developers',
        'Write clean, maintainable code',
      ],
      skills: {
        required: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Git'],
        preferred: ['Next.js', 'Tailwind CSS', 'Redux', 'Testing Library', 'Webpack'],
      },
      salaryRange: { min: 90000, max: 130000, currency: 'USD' },
      status: 'Active',
      publishedChannels: ['Career Site', 'LinkedIn', 'Indeed', 'Glassdoor'],
      hiringManagerId: hiringManager1.id,
      taSpecialistId: taSpecialist.id,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      numberOfPositions: 1,
    },
    {
      id: 'job-004',
      requisitionId: 'REQ-2024-004',
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Austin, TX',
      employmentType: 'Full-time',
      experienceLevel: 'Senior',
      description: 'Join our infrastructure team to build and maintain scalable, reliable systems.',
      requirements: [
        '5+ years of DevOps/Infrastructure experience',
        'Strong experience with AWS or Azure',
        'Expertise in containerization and orchestration',
        'Experience with CI/CD pipelines',
      ],
      responsibilities: [
        'Design and implement infrastructure as code',
        'Manage and optimize cloud infrastructure',
        'Implement monitoring and alerting systems',
        'Improve deployment processes and automation',
      ],
      skills: {
        required: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'],
        preferred: ['Python', 'Ansible', 'Prometheus', 'ELK Stack', 'Networking'],
      },
      salaryRange: { min: 130000, max: 170000, currency: 'USD' },
      status: 'Active',
      publishedChannels: ['Career Site', 'LinkedIn'],
      hiringManagerId: hiringManager1.id,
      taSpecialistId: taSpecialist.id,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      numberOfPositions: 1,
    },
    {
      id: 'job-005',
      requisitionId: 'REQ-2024-005',
      title: 'Junior Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      employmentType: 'Full-time',
      experienceLevel: 'Entry',
      description: 'Great opportunity for early-career engineers to learn and grow with mentorship from senior team members.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '0-2 years of professional experience',
        'Strong foundation in programming fundamentals',
        'Eagerness to learn and grow',
      ],
      responsibilities: [
        'Write clean, efficient code under guidance of senior engineers',
        'Participate in code reviews',
        'Learn and adopt best practices',
        'Contribute to team projects',
      ],
      skills: {
        required: ['JavaScript', 'Python', 'Git', 'Data Structures', 'Algorithms'],
        preferred: ['React', 'Node.js', 'SQL', 'Testing'],
      },
      salaryRange: { min: 70000, max: 95000, currency: 'USD' },
      status: 'Active',
      publishedChannels: ['Career Site', 'University Job Boards'],
      hiringManagerId: hiringManager1.id,
      taSpecialistId: taSpecialist.id,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      numberOfPositions: 3,
    },
  ];

  jobs.forEach((job) => dataStore.createJob(job));
  console.log(`[Seed] Created ${jobs.length} jobs`);

  // Create sample candidates
  const candidates: Candidate[] = [
    {
      id: 'cand-001',
      firstName: 'Alex',
      lastName: 'Rodriguez',
      email: 'alex.rodriguez@email.com',
      phone: '+1-555-1001',
      location: 'San Francisco, CA',
      linkedinUrl: 'https://linkedin.com/in/alexrodriguez',
      currentCompany: 'Tech Corp',
      currentTitle: 'Senior Software Engineer',
      totalExperience: 7,
      education: [
        {
          institution: 'Stanford University',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2012',
          endDate: '2016',
          current: false,
          gpa: 3.8,
        },
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Python', 'SQL'],
      certifications: ['AWS Certified Solutions Architect'],
      preferredLocations: ['San Francisco, CA', 'Remote'],
      preferredEmploymentTypes: ['Full-time'],
      salaryExpectation: { min: 140000, max: 170000, currency: 'USD' },
      source: 'LinkedIn',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      lastActivityAt: new Date(),
    },
    {
      id: 'cand-002',
      firstName: 'Maya',
      lastName: 'Patel',
      email: 'maya.patel@email.com',
      phone: '+1-555-1002',
      location: 'New York, NY',
      linkedinUrl: 'https://linkedin.com/in/mayapatel',
      currentCompany: 'Product Innovations',
      currentTitle: 'Product Manager',
      totalExperience: 5,
      education: [
        {
          institution: 'MIT',
          degree: 'Master of Business Administration',
          fieldOfStudy: 'Technology Management',
          startDate: '2016',
          endDate: '2018',
          current: false,
        },
      ],
      skills: ['Product Management', 'Agile', 'User Research', 'Data Analysis', 'SQL', 'JIRA', 'Figma'],
      certifications: ['Certified Scrum Product Owner'],
      preferredLocations: ['New York, NY', 'Remote'],
      preferredEmploymentTypes: ['Full-time'],
      salaryExpectation: { min: 110000, max: 145000, currency: 'USD' },
      source: 'Career Site',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      lastActivityAt: new Date(),
    },
    {
      id: 'cand-003',
      firstName: 'James',
      lastName: 'Chen',
      email: 'james.chen@email.com',
      phone: '+1-555-1003',
      location: 'Austin, TX',
      linkedinUrl: 'https://linkedin.com/in/jameschen',
      currentCompany: 'Cloud Systems Inc',
      currentTitle: 'DevOps Engineer',
      totalExperience: 6,
      education: [
        {
          institution: 'University of Texas',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Engineering',
          startDate: '2013',
          endDate: '2017',
          current: false,
        },
      ],
      skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Python', 'CI/CD', 'Linux', 'Monitoring'],
      certifications: ['AWS Certified DevOps Engineer', 'CKA'],
      preferredLocations: ['Austin, TX', 'Remote'],
      preferredEmploymentTypes: ['Full-time'],
      salaryExpectation: { min: 135000, max: 165000, currency: 'USD' },
      source: 'Indeed',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      lastActivityAt: new Date(),
    },
  ];

  candidates.forEach((candidate) => dataStore.createCandidate(candidate));
  console.log(`[Seed] Created ${candidates.length} candidates`);

  console.log('[Seed] Data seeding completed successfully!');
  console.log('[Seed] Summary:');
  console.log(`  - Users: 4`);
  console.log(`  - Jobs: ${jobs.length}`);
  console.log(`  - Candidates: ${candidates.length}`);
};
