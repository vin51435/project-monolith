'use client';

import React, { useState } from 'react';
import { Dumbbell, ZoomIn } from 'lucide-react';

interface ExerciseImageProps {
  src: string;
  alt: string;
  onEnlarge?: () => void;
  className?: string;
}

export default function ExerciseImage({
  src,
  alt,
  onEnlarge,
  className = '',
}: ExerciseImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      onClick={onEnlarge}
      className={`relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden bg-white border border-slate-700/80 flex items-center justify-center p-2.5 transition-all shadow-inner group ${
        onEnlarge ? 'cursor-pointer hover:border-indigo-500/80' : ''
      } ${className}`}
    >
      {/* Skeleton / Shimmer Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-500 gap-2 animate-pulse">
          <div className="p-3 rounded-2xl bg-slate-200/90 border border-slate-300">
            <Dumbbell className="w-6 h-6 text-slate-500" />
          </div>
          <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">
            Loading Form Guide...
          </span>
        </div>
      )}

      {/* Actual Exercise Demonstration Image with White Backdrop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`h-full w-auto max-w-full object-contain rounded-xl transition-opacity duration-300 bg-white ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Fallback if image fails to load */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-500 gap-1.5 p-4 text-center">
          <Dumbbell className="w-6 h-6 text-slate-600" />
          <span className="text-xs font-semibold text-slate-700">Visual Demonstration</span>
          <span className="text-[10px] text-slate-500">{alt}</span>
        </div>
      )}

      {/* Tap to Enlarge Badge */}
      {onEnlarge && isLoaded && (
        <span className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-950/90 text-[10px] text-slate-300 font-semibold border border-slate-700/80 shadow-md backdrop-blur-sm group-hover:text-indigo-300 group-hover:border-indigo-500/50 transition">
          <ZoomIn className="w-3 h-3 text-indigo-400" />
          <span>Enlarge</span>
        </span>
      )}
    </div>
  );
}
