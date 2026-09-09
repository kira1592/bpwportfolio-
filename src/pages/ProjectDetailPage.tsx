import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Check } from 'lucide-react';
import { projectsData } from '../data/projects';
import { ProjectGallery } from '../components/ProjectGallery';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const project = projectsData.find((p) => p.slug === slug);

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Project Not Found</h2>
        <p className="text-sm text-neutral-600">
          The requested project does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-[10px] text-sm font-medium hover:border-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="py-8 sm:py-12 space-y-10" aria-labelledby="project-title">
      {/* Top Back Navigation */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200/80 hover:border-neutral-400 px-3.5 py-1.5 rounded-[10px] transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Header Info */}
      <div className="space-y-4 border-b border-neutral-200/80 pb-8">
        <div className="space-y-2">
          <h1
            id="project-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900"
          >
            {project.title}
          </h1>
          {project.company && (
            <p className="text-sm sm:text-base font-medium text-neutral-500">
              For: {project.company}
            </p>
          )}
        </div>

        <p className="text-base sm:text-lg text-neutral-700 leading-relaxed max-w-3xl">
          {project.description}
        </p>

        {/* Live URL or Repository Links if available */}
        {(project.liveUrl || project.githubUrl) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs sm:text-sm font-medium rounded-[10px] hover:bg-neutral-800 transition-colors"
              >
                <span>Live System</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 border border-neutral-300 text-xs sm:text-sm font-medium rounded-[10px] hover:border-neutral-900 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Repository</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Structured Project Metadata Grid: 16px radius card */}
      <section className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6" aria-label="Project metadata">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4 border-b border-neutral-100 pb-2">
          Project Specifications
        </h2>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div>
            <dt className="text-neutral-500 font-medium">Type</dt>
            <dd className="font-semibold text-neutral-900 mt-1">{project.type}</dd>
          </div>
          <div>
            <dt className="text-neutral-500 font-medium">Year</dt>
            <dd className="font-semibold text-neutral-900 mt-1">{project.year}</dd>
          </div>
          <div>
            <dt className="text-neutral-500 font-medium">Status</dt>
            <dd className="mt-1">
              <span className="inline-block px-2.5 py-0.5 text-xs font-medium border border-neutral-200/80 bg-neutral-50 text-neutral-800 rounded-[6px]">
                {project.status}
              </span>
            </dd>
          </div>
          {project.company && (
            <div>
              <dt className="text-neutral-500 font-medium">Client / Org</dt>
              <dd className="font-semibold text-neutral-900 mt-1">{project.company}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Structured Functional Capability ("What it can do") */}
      <section className="space-y-8" aria-label="Project functional breakdown">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 border-b border-neutral-200/80 pb-2">
          Overview &amp; Capabilities
        </h2>

        {/* Purpose */}
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-600">
            Purpose
          </h3>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            {project.details.purpose}
          </p>
        </div>

        {/* Main Functions: 12px rounded function cards */}
        <div className="space-y-3">
          <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-600">
            Main Functions
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.details.mainFunctions.map((fn, idx) => (
              <li
                key={idx}
                className="p-3.5 sm:p-4 bg-white border border-neutral-200/90 rounded-xl text-xs sm:text-sm text-neutral-800 font-medium flex items-start gap-2.5 hover:border-neutral-400 transition-colors"
              >
                <Check className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <span>{fn}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Workflow: 12px rounded card */}
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-600">
            Workflow
          </h3>
          <div className="p-4 sm:p-5 bg-white border border-neutral-200/90 rounded-xl text-xs sm:text-sm text-neutral-700 leading-relaxed">
            {project.details.workflow}
          </div>
        </div>

        {/* Practical Benefit: 12px rounded callout */}
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-600">
            Practical Benefit
          </h3>
          <p className="text-sm sm:text-base text-neutral-800 font-medium leading-relaxed bg-neutral-100/60 p-4 sm:p-5 rounded-xl border border-neutral-200/80 border-l-4 border-l-neutral-900">
            {project.details.practicalBenefit}
          </p>
        </div>

        {/* Technologies Used: 8px rounded chips */}
        <div className="space-y-3 pt-4 border-t border-neutral-200/80">
          <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-600">
            Technologies Used
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-white border border-neutral-200/90 rounded-lg text-xs sm:text-sm font-medium text-neutral-800 hover:border-neutral-400 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot Gallery Component */}
      <div className="pt-4">
        <ProjectGallery
          images={project.screenshots}
          projectTitle={project.title}
        />
      </div>

      {/* Bottom Back Navigation: 10px rounded button */}
      <div className="pt-8 border-t border-neutral-200/80 flex justify-between items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-900 border border-neutral-300/90 hover:border-neutral-900 bg-white px-4 py-2.5 rounded-[10px] transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back</span>
        </button>

        <Link
          to="/"
          className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Return to Portfolio Home
        </Link>
      </div>
    </article>
  );
};
