import React from 'react';
import { toolsAndTechData } from '../data/services';

export const ToolsSection: React.FC = () => {
  return (
    <section className="space-y-4 pt-6 border-t border-neutral-200/80" aria-labelledby="tools-heading">
      <div className="space-y-1">
        <h3
          id="tools-heading"
          className="text-base sm:text-lg font-bold tracking-tight text-neutral-900"
        >
          Tools &amp; Technologies
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500">
          Systems, frameworks, languages, and platforms utilized across projects.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {toolsAndTechData.map((tech, index) => (
          <span
            key={index}
            className="inline-block px-3 py-1.5 bg-white border border-neutral-200/90 rounded-lg text-xs sm:text-sm text-neutral-800 font-medium tracking-normal hover:border-neutral-400 hover:text-neutral-950 transition-colors"
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
};
