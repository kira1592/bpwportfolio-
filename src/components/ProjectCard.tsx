import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link
      to={`/project/${project.slug}`}
      className="group block rounded-2xl border border-neutral-200/90 hover:border-neutral-400 bg-white p-3 sm:p-3.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
      aria-label={`View project details for ${project.title}`}
    >
      {/* Cover Image Container: 12px corner radius, breathing room inside 16px card */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200/60">
        <img
          src={project.coverImage}
          alt={`Screenshot preview of ${project.title}`}
          className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Card Content Area */}
      <div className="p-3 sm:p-3.5 pt-4 space-y-2.5">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 group-hover:text-black transition-colors">
              {project.title}
            </h3>
            <span className="text-xs font-medium text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all duration-200 shrink-0">
              View Project →
            </span>
          </div>

          {/* Company Format: "For: Company Name" (omitted if undefined) */}
          {project.company && (
            <p className="text-xs sm:text-sm font-medium text-neutral-500">
              For: {project.company}
            </p>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3">
          {project.description}
        </p>
      </div>
    </Link>
  );
};
