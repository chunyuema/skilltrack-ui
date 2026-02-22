import { AppState, SkillTheme } from '../types';
import { INITIAL_THEMES, INITIAL_EXPERIENCE, INITIAL_PROFILE } from './initialData';

// Helper to randomize skill levels for mock users
const randomizeSkills = (themes: SkillTheme[]): SkillTheme[] => {
  return themes.map(theme => ({
    ...theme,
    subCategories: theme.subCategories.map(sub => ({
      ...sub,
      skills: sub.skills.map(skill => ({
        ...skill,
        level: Math.floor(Math.random() * 6) as any // 0-5
      }))
    }))
  }));
};

export const MOCK_USERS: (AppState & { id: string })[] = [
  {
    id: 'user_1',
    profile: {
      ...INITIAL_PROFILE,
      fullName: 'Sarah Jenkins',
      title: 'Staff Backend Engineer',
      bio: 'Distributed systems expert. Love Rust and Go.',
      yearsOfExperience: 8,
      email: 'sarah.j@example.com'
    },
    experiences: [
      {
        id: 'exp_1',
        company: 'CloudScale.io',
        role: 'Staff Engineer',
        startDate: '2021-03',
        endDate: 'Present',
        description: 'Architecting the next gen control plane.',
        technologies: ['Go', 'Kubernetes', 'gRPC']
      },
      {
        id: 'exp_2',
        company: 'DataFlow',
        role: 'Senior Engineer',
        startDate: '2018-06',
        endDate: '2021-02',
        description: 'Built high-throughput ingestion pipelines.',
        technologies: ['Java', 'Kafka', 'Flink']
      }
    ],
    themes: randomizeSkills(INITIAL_THEMES)
  },
  {
    id: 'user_2',
    profile: {
      ...INITIAL_PROFILE,
      fullName: 'Mike Chen',
      title: 'Frontend Architect',
      bio: 'Obsessed with performance and pixel perfection.',
      yearsOfExperience: 6,
      email: 'mike.c@example.com'
    },
    experiences: [
      {
        id: 'exp_3',
        company: 'Creative Agency',
        role: 'Lead Frontend',
        startDate: '2020-01',
        endDate: 'Present',
        description: 'Leading the design system team.',
        technologies: ['React', 'TypeScript', 'WebGL']
      }
    ],
    themes: randomizeSkills(INITIAL_THEMES)
  },
  {
    id: 'user_3',
    profile: {
      ...INITIAL_PROFILE,
      fullName: 'Jessica Alba',
      title: 'DevOps Engineer',
      bio: 'Automating everything. Infrastructure as Code enthusiast.',
      yearsOfExperience: 4,
      email: 'jess.ops@example.com'
    },
    experiences: [
      {
        id: 'exp_4',
        company: 'FinTech Corp',
        role: 'DevOps Engineer',
        startDate: '2022-05',
        endDate: 'Present',
        description: 'Managing AWS infrastructure and CI/CD pipelines.',
        technologies: ['Terraform', 'AWS', 'GitHub Actions']
      }
    ],
    themes: randomizeSkills(INITIAL_THEMES)
  }
];
