import fs from 'fs';
import path from 'path';
import { projectsData as initialProjectsData } from '../src/data/projects';
import { Project } from '../src/types';

const PROJECTS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'projects.ts');
const PUBLIC_PROJECTS_DIR = path.join(process.cwd(), 'public', 'images', 'projects');

// In-memory working cache
let currentProjects: Project[] = [...initialProjectsData];

// Ensure projects image directory exists
export function ensureProjectImageDirectory(slug: string): string {
  const dirPath = path.join(PUBLIC_PROJECTS_DIR, slug);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return dirPath;
}

export function getAllProjects(): Project[] {
  return currentProjects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return currentProjects.find((p) => p.slug === slug);
}

export function getProjectById(id: string): Project | undefined {
  return currentProjects.find((p) => p.id === id);
}

export function validateProject(project: Partial<Project>, isNew: boolean, existingId?: string): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!project.title || project.title.trim().length === 0) {
    errors.title = 'Project title is required';
  }

  if (!project.description || project.description.trim().length === 0) {
    errors.description = 'Project short description is required';
  }

  const validTypes = ['Web App', 'Mobile App', 'Desktop App', 'Automation', 'IT Solution', 'Other'];
  if (!project.type || !validTypes.includes(project.type)) {
    errors.type = 'Valid project type is required';
  }

  if (!project.year || project.year.trim().length === 0) {
    errors.year = 'Project year is required';
  }

  const validStatuses = ['Completed', 'In Progress', 'Maintenance', 'Archived'];
  if (!project.status || !validStatuses.includes(project.status)) {
    errors.status = 'Valid project status is required';
  }

  if (!project.coverImage || project.coverImage.trim().length === 0) {
    errors.coverImage = 'Cover image is required';
  }

  if (!project.slug || project.slug.trim().length === 0) {
    errors.slug = 'Slug is required';
  } else if (!/^[a-z0-9-]+$/.test(project.slug)) {
    errors.slug = 'Slug must only contain lowercase letters, numbers, and hyphens';
  } else {
    const slugConflict = currentProjects.find((p) => p.slug === project.slug && p.id !== existingId);
    if (slugConflict) {
      errors.slug = 'This slug is already used by another project';
    }
  }

  if (isNew) {
    const id = project.id || project.slug;
    const idConflict = currentProjects.find((p) => p.id === id);
    if (idConflict) {
      errors.id = 'This project ID already exists';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function serializeProjectsToTypeScript(projects: Project[]): string {
  const formattedProjects = JSON.stringify(projects, null, 2);

  return `import { Project } from '../types';

export const projectsData: Project[] = ${formattedProjects};
`;
}

export function saveProjectsFile(projects: Project[]): void {
  currentProjects = [...projects];
  const fileContent = serializeProjectsToTypeScript(projects);
  fs.writeFileSync(PROJECTS_FILE_PATH, fileContent, 'utf-8');
}

export function addProject(project: Project): Project {
  ensureProjectImageDirectory(project.slug);
  const updated = [project, ...currentProjects];
  saveProjectsFile(updated);
  return project;
}

export function updateProject(id: string, updatedData: Partial<Project>): Project | null {
  const index = currentProjects.findIndex((p) => p.id === id);
  if (index === -1) {
    return null;
  }

  const existing = currentProjects[index];
  const updated: Project = {
    ...existing,
    ...updatedData,
    id: existing.id, // preserve ID unless explicitly changed
    company: updatedData.company && updatedData.company.trim().length > 0 ? updatedData.company.trim() : undefined,
  };

  ensureProjectImageDirectory(updated.slug);

  const newProjectsList = [...currentProjects];
  newProjectsList[index] = updated;
  saveProjectsFile(newProjectsList);
  return updated;
}

export function deleteProject(id: string): boolean {
  const exists = currentProjects.some((p) => p.id === id);
  if (!exists) {
    return false;
  }

  const updated = currentProjects.filter((p) => p.id !== id);
  saveProjectsFile(updated);
  return true;
}

export function saveBase64Image(slug: string, fileName: string, base64Data: string): string {
  ensureProjectImageDirectory(slug);

  // Strip prefix data:image/...;base64, if present
  const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Clean, 'base64');

  // Sanitize filename
  const cleanName = fileName.toLowerCase().replace(/[^a-z0-9_.-]/g, '-');
  const filePath = path.join(PUBLIC_PROJECTS_DIR, slug, cleanName);

  fs.writeFileSync(filePath, buffer);

  // Return the relative URL compatible with the Vite and GitHub Pages static setup
  return `./images/projects/${slug}/${cleanName}`;
}
