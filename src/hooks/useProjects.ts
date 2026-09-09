import { useState, useEffect } from 'react';
import { projectsData as staticProjectsData } from '../data/projects';
import { Project } from '../types';

export function useProjects(): Project[] {
  const [projects, setProjects] = useState<Project[]>(staticProjectsData);

  useEffect(() => {
    let isMounted = true;

    async function loadLiveProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setProjects(data);
          }
        }
      } catch {
        // Fallback silently to static data (e.g. on GitHub Pages static deployment)
      }
    }

    loadLiveProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return projects;
}

export function useProject(slug: string | undefined): Project | undefined {
  const projects = useProjects();
  return projects.find((p) => p.slug === slug);
}
