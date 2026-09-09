import React from 'react';
import { contactData } from '../data/contact';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 sm:mt-24 border-t border-neutral-200/80 py-8 sm:py-12 text-xs sm:text-sm text-neutral-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-semibold text-neutral-900">Bhone Pyae Wai</p>
          <p className="text-neutral-500 text-xs">IT Technician &amp; Developer</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
          <a
            href={`mailto:${contactData.email}`}
            className="hover:text-neutral-900 transition-colors"
          >
            {contactData.email}
          </a>
          <a
            href={`tel:${contactData.phone}`}
            className="hover:text-neutral-900 transition-colors"
          >
            {contactData.phone}
          </a>
          <span className="text-neutral-400">
            &copy; {currentYear} All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};
