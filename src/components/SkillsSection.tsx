import React from 'react';
import { skillsData } from '../data/services';

export const SkillsSection: React.FC = () => {
  return (
    <section className="space-y-4 pt-6 border-t border-neutral-200/80" aria-labelledby="skills-heading">
      <div className="space-y-1">
        <h3
          id="skills-heading"
          className="text-base sm:text-lg font-bold tracking-tight text-neutral-900"
        >
          Skills
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500">
          Core technical proficiencies developed through real-world support and development.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {skillsData.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 sm:p-3.5 bg-white border border-neutral-200/90 rounded-lg text-neutral-800 text-xs sm:text-sm font-medium hover:border-neutral-400 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0"></span>
            <span>{skill}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
