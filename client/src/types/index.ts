export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  countryCode: string;
  phone: string;
  location: string;
  experience: string;
  tagline: string;
  summary: string;
  linkedin: string;
  github: string;
  medium: string;
  profileImage?: string;
  resumeLink?: string;
}

export interface Jobs {
  title: string;
  company: string;
  location: string;
  type: string;
  period: string;
  responsibilities: string[];
  icon?: string;
  companyLogo?: string;
  image?: string;
}

export interface SkillCategories {
  category: string;
  items: string[];
  icon?: string;
}

export interface Projects {
  title: string;
  period: string;
  description: string;
  highlights: string[];
  impacts: string[];
  role?: string;
  company?: string;
  technologies: string[];
  images?: string[]; // Array of image URLs
  image?: string; // Kept for backward compatibility
  githubUrl?: string;
  liveUrl?: string;
}

export interface Educations {
  degree: string;
  institution: string;
  period: string;
  description?: string;
  type?: string;
  logo?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SocialLinks {
  name: string;
  link: string;
  icon?: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type OwnerInfo = { name: string; email: string };
