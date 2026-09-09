import React from 'react';
import { servicesData } from '../data/services';
import { SkillsSection } from './SkillsSection';
import { ToolsSection } from './ToolsSection';

export const ServicesSection: React.FC = () => {
  return (
    <div className="py-8 sm:py-10 space-y-12" aria-label="Services and capabilities">
      {/* Primary Services Section */}
      <section className="space-y-6" aria-labelledby="services-heading">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-neutral-200/80 pb-3">
          <h2
            id="services-heading"
            className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900"
          >
            Services
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 sm:mt-0 font-medium">
            Technical support &amp; custom software
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {servicesData.map((service, index) => (
            <div
              key={service.id}
              className="p-5 sm:p-6 bg-white border border-neutral-200/90 rounded-xl space-y-2.5 hover:border-neutral-400 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-neutral-900">
                  {service.title}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-[6px] bg-neutral-100 text-neutral-500 border border-neutral-200/60 shrink-0">
                  0{index + 1}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <SkillsSection />

      {/* Tools & Technologies */}
      <ToolsSection />
    </div>
  );
};
