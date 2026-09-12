import React, { useState } from 'react';
import { Image as ImageIcon, ZoomIn, X, Info, Sparkles } from 'lucide-react';
import { PictureInfo } from '../types';

interface PictureCardProps {
  word: string;
  picture: PictureInfo;
}

export const PictureCard: React.FC<PictureCardProps> = ({ word, picture }) => {
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Generate a reliable fallback image url or SVG representation if needed
  const fallbackUnsplash = `https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80`;
  const imageSource = hasError ? fallbackUnsplash : picture.imageUrl;

  return (
    <div
      id="picture-section"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs mb-8 transition-all"
    >
      <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-950/60 rounded-xl text-amber-800 dark:text-amber-300">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Visual Picture for "{word}"
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Educational imagery to aid memory and contextual association
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsZoomed(true)}
          className="p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
          title="Zoom picture"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Picture Frame */}
      <div className="relative bg-stone-100 dark:bg-stone-950 overflow-hidden flex items-center justify-center min-h-[260px] max-h-[420px]">
        {/* Loading skeleton */}
        {!imageLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100 dark:bg-stone-900 animate-pulse">
            <div className="flex flex-col items-center gap-2 text-stone-400">
              <ImageIcon className="w-8 h-8 animate-bounce" />
              <span className="text-xs">Loading picture for {word}...</span>
            </div>
          </div>
        )}

        <img
          id="word-picture-image"
          src={imageSource}
          alt={`Visual representation of ${word}`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            if (!hasError) {
              setHasError(true);
            }
          }}
          onClick={() => setIsZoomed(true)}
          className={`w-full h-full object-cover max-h-[380px] cursor-zoom-in transition-all duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Overlay word badge */}
        <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-semibold capitalize tracking-wide shadow-md">
          {word}
        </div>
      </div>

      {/* Picture Caption & Concept Summary */}
      <div className="p-4 sm:p-5 bg-stone-50/50 dark:bg-stone-900/50 space-y-2">
        <p id="picture-caption" className="text-sm text-stone-800 dark:text-stone-200 font-medium">
          {picture.caption || `Visual concept demonstrating the meaning of ${word}.`}
        </p>

        {picture.conceptDescription && (
          <div className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-400">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>{picture.conceptDescription}</span>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          id="picture-zoom-modal"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between border-b border-stone-800 text-stone-200">
              <span className="font-serif text-lg capitalize">{word} - Full Visual</span>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto max-h-[70vh] flex items-center justify-center bg-black">
              <img
                src={imageSource}
                alt={word}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 bg-stone-950 text-stone-300 text-sm">
              {picture.caption}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
