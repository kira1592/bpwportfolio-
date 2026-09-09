import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectImage } from '../types';

interface ProjectGalleryProps {
  images: ProjectImage[];
  projectTitle: string;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  images,
  projectTitle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images[currentIndex];

  return (
    <section className="space-y-4" aria-label={`${projectTitle} screenshot gallery`}>
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900">
          Screenshots &amp; Interface Views
        </h3>
        <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-[6px] border border-neutral-200/70">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Main Viewport: 12px radius */}
      <div className="relative aspect-[16/10] w-full bg-neutral-100 border border-neutral-200/90 rounded-xl overflow-hidden select-none">
        <img
          src={currentImage.url}
          alt={currentImage.caption || `${projectTitle} screenshot ${currentIndex + 1}`}
          className="w-full h-full object-cover object-top transition-opacity duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Carousel Arrow Controls: 10px rounded buttons */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 sm:inset-x-4 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={handlePrev}
              className="pointer-events-auto p-2 bg-white/95 hover:bg-white text-neutral-900 border border-neutral-300/90 rounded-[10px] transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="pointer-events-auto p-2 bg-white/95 hover:bg-white text-neutral-900 border border-neutral-300/90 rounded-[10px] transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
              aria-label="Next screenshot"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Caption bar */}
      {currentImage.caption && (
        <p className="text-xs sm:text-sm text-neutral-600 italic border-l-2 border-neutral-400 pl-3 py-0.5">
          {currentImage.caption}
        </p>
      )}

      {/* Thumbnails Navigation: 8px rounded thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3 pt-1">
          {images.map((img, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative aspect-[16/10] overflow-hidden rounded-lg border transition-all text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 ${
                  isSelected
                    ? 'border-neutral-900 ring-1 ring-neutral-900 opacity-100'
                    : 'border-neutral-200/80 opacity-60 hover:opacity-100'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};
