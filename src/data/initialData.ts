import { SkillTheme } from '../types';

export const INITIAL_THEMES: SkillTheme[] = [
  {
    id: 'vcs-workflows',
    name: 'Version Control & Team Workflows',
    icon: 'Cpu',
    description: 'Universal tools for collaborative development.',
    subCategories: [
      {
        id: 'git-fundamentals',
        name: 'Git Fundamentals',
        level: 0,
        maxLevel: 5,
        skills: [
          { id: 'git-commits', name: 'Commits & Branching Strategies' },
          { id: 'git-merging', name: 'Merging Mechanics' },
          { id: 'git-conflicts', name: '3-way Conflict Resolution' },
        ]
      },
      {
        id: 'git-internals',
        name: 'Git Internals',
        level: 0,
        maxLevel: 5,
        skills: [
          { id: 'git-objects', name: '.git Folder (Blobs, Trees, Objects)' },
          { id: 'git-hashes', name: 'Cryptographic Hashes' },
        ]
      },
      {
        id: 'engineering-hygiene',
        name: 'Engineering Hygiene',
        level: 0,
        maxLevel: 5,
        skills: [
          { id: 'vcs-flows', name: 'Trunk-based vs Git Flow' },
          { id: 'pr-formatting', name: 'PR Formatting & Async Review' },
          { id: 'semver', name: 'Semantic Versioning (SemVer)' },
        ]
      }
    ]
  },
  {
    id: 'data-persistence-basics',
    name: 'Data & Persistence Basics',
    icon: 'Database',
    description: 'Essential data management for every dev.',
    subCategories: [
      {
        id: 'rdbms-foundations',
        name: 'Relational DB Foundations',
        level: 0,
        maxLevel: 5,
        skills: [
          { id: 'db-crud', name: 'Basic CRUD Operations' },
          { id: 'db-joins', name: 'JOIN & Aggregation Queries' },
        ]
      },
      {
        id: 'indexing-acid',
        name: 'Indexing & ACID',
        level: 0,
        maxLevel: 5,
        skills: [
          { id: 'btree-lookups', name: 'B-Tree Lookups' },
          { id: 'acid-principles', name: 'ACID (Data Safety)' },
        ]
      },
      {
        id: 'data-serialization',
        name: 'Data Serialization',
        level: 0,
        maxLevel: 5,
        skills: [
          { id: 'serialization-formats', name: 'JSON / XML' },
          { id: 'schema-validation', name: 'Schema Validation' },
          { id: 'db-migrations-basic', name: 'Basic Schema Migrations' },
        ]
      }
    ]
  },
  {
    id: 'networking-web-mechanics',
    name: 'Networking & Web Mechanics',
    icon: 'Globe',
    description: 'How the internet actually works.',
    subCategories: [
      {
        id: 'protocols-lifecycle',
        name: 'Protocols & Lifecycle',
        level: 0,
        maxLevel: 5,
        skills: [
          { id: 'http-methods', name: 'HTTP/HTTPS (GET, POST, etc.)' },
          { id: 'status-codes', name: 'Status Codes' },
          { id: 'dns-resolution', name: 'DNS Resolution' },
        ]
      },
      {
        id: 'api-design-core',
        name: 'API Design',
        level: 0,
        maxLevel: 5,
        skills: [
          { id: 'rest-contract', name: 'RESTful Principles' },
          { id: 'statelessness', name: 'Statelessness & Payloads' },
        ]
      },
      {
        id: 'web-security-basics',
        name: 'Web Security Basics',
        level: 0,
        maxLevel: 5,
        skills: [
          { id: 'cors-csp', name: 'CORS & CSP' },
          { id: 'cookie-security', name: 'Cookie & Header Security' },
        ]
      }
    ]
  }
];

export const INITIAL_PROFILE = {
  firstName: 'Alex',
  lastName: 'Developer',
  country: 'United States',
  email: 'alex@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  education: 'BS Computer Science, University of Tech',
  visaStatus: 'Citizen',
  yearsOfExperience: 5,
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com',
  bio: 'Passionate full-stack engineer with a focus on scalable web applications and developer experience.',
  selectedTrackIds: [],
};

export const INITIAL_EXPERIENCE = [
  {
    id: '1',
    company: 'Tech Solutions',
    role: 'Senior Software Engineer',
    startDate: '2022-01',
    endDate: 'Present',
    description: 'Leading development of distributed microservices architecture.',
    technologies: ['Go', 'Kubernetes', 'gRPC'],
  },
  {
    id: '2',
    company: 'Startup Inc',
    role: 'Software Engineer',
    startDate: '2019-06',
    endDate: '2021-12',
    description: 'Built the MVP for the core product. Handled full-stack development.',
    technologies: ['Vue.js', 'Python', 'Django'],
  }
];
