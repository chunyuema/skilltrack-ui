export type SkillLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  maxLevel: number; // Usually 5
  description?: string;
  prerequisites?: string[];
}

export interface SkillSubCategory {
  id: string;
  name: string;
  skills: Skill[];
}

export interface Track {
  id: string;
  name: string;
  track_type: 'CORE' | 'DOMAIN' | 'SPECIAL';
}

export interface SkillTheme {
  id: string;
  name: string;
  track?: Track;
  icon?: string;
  description?: string;
  subCategories: SkillSubCategory[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | "Present";
  description: string;
  technologies: string[];
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  country: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  visaStatus: string;
  yearsOfExperience: number;
  githubUrl: string;
  linkedinUrl: string;
  bio: string;
  selectedTrackIds: string[];
}

export interface AppState {
  profile: UserProfile;
  experiences: Experience[];
  themes: SkillTheme[];
}
