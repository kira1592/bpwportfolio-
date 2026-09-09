export type ProjectType =
  | 'Web App'
  | 'Mobile App'
  | 'Desktop App'
  | 'Automation'
  | 'IT Solution'
  | 'Other';

export type ProjectStatus =
  | 'Completed'
  | 'In Progress'
  | 'Maintenance'
  | 'Archived';

export interface ProjectImage {
  url: string;
  caption?: string;
}

export interface ProjectDetails {
  purpose: string;
  mainFunctions: string[];
  workflow: string;
  practicalBenefit: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  company?: string;
  description: string;
  type: ProjectType;
  year: string;
  status: ProjectStatus;
  coverImage: string;
  screenshots: ProjectImage[];
  technologies: string[];
  details: ProjectDetails;
  liveUrl?: string;
  githubUrl?: string;
}

export type TabKey = 'portfolio' | 'services' | 'contact';

export interface ContactConfig {
  email: string;
  phone: string;
  viber: string;
  facebook: string;
  facebookUsername?: string;
  heading: string;
  invitation: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
}
