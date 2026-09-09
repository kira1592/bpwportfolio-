import React from 'react';
import profilePhoto from '../assets/images/bhone_profile_photo_1788972240168.jpg';

export const Hero: React.FC = () => {
  return (
    <header className="pt-12 sm:pt-16 pb-3 sm:pb-4">
      <div className="flex flex-col items-start gap-6">
        {/* Profile Photo: 50% Circular, crisp subtle border */}
        <div className="relative">
          <img
            src={profilePhoto}
            alt="Bhone Pyae Wai"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-neutral-300/90 object-cover object-top bg-neutral-100 ring-4 ring-neutral-100/80"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Identity & Professional Titles */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold tracking-tight text-neutral-900">
            Bhone Pyae Wai
          </h1>
          <p className="text-base sm:text-lg font-medium text-neutral-700 tracking-tight">
            IT Technician &amp; Developer
          </p>
        </div>

        {/* Professional Description: Editorial, natural, client-oriented */}
        <div className="max-w-2xl text-sm sm:text-base text-neutral-600 leading-relaxed space-y-2.5">
          <p>
            I diagnose and resolve technical systems issues, build practical web applications, and configure dependable hardware and network infrastructure for businesses.
          </p>
          <p>
            My work focuses on pragmatic solutions that simplify daily operations, eliminate repetitive manual tasks, and keep computing environments reliable and secure.
          </p>
        </div>
      </div>
    </header>
  );
};
