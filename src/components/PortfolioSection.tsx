import React from 'react';
import { projectsData } from '../data/projects';
import { ProjectCard } from './ProjectCard';

export const PortfolioSection: React.FC = () => {
  return (
    <section className="py-8 sm:py-10 space-y-6" aria-labelledby="portfolio-heading">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-neutral-200/80 pb-3">
        <h2
          id="portfolio-heading"
          className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900"
        >
          Selected Work
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1 sm:mt-0 font-medium">
          Practical applications &amp; systems ({projectsData.length} projects)
        </p>
      </div>

      {/* Project Grid: Latest to Oldest */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {projectsData.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};
