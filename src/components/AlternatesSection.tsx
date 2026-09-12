import React from 'react';
import { ArrowLeftRight, Check, Ban, ExternalLink, ArrowRight } from 'lucide-react';
import { AlternateWord } from '../types';

interface AlternatesSectionProps {
  word: string;
  synonyms: AlternateWord[];
  antonyms: AlternateWord[];
  onSelectWord: (word: string) => void;
}

export const AlternatesSection: React.FC<AlternatesSectionProps> = ({
  word,
  synonyms,
  antonyms,
  onSelectWord,
}) => {
  return (
    <div
      id="alternates-section"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs mb-8"
    >
      <div className="flex items-center gap-3 pb-5 border-b border-stone-100 dark:border-stone-800">
        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-800 dark:text-amber-300">
          <ArrowLeftRight className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
            Alternates & Related Vocabulary
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Synonyms with fine shades of meaning and direct antonyms (click any word to explore)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Synonyms Column */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-md">
              <Check className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Synonyms (Similar Meaning)
            </h3>
            <span className="text-xs text-stone-400 font-mono">({synonyms.length})</span>
          </div>

          {synonyms.length > 0 ? (
            <div className="space-y-2.5">
              {synonyms.map((item, idx) => (
                <div
                  key={idx}
                  id={`synonym-item-${idx}`}
                  onClick={() => onSelectWord(item.word)}
                  className="group p-3.5 bg-stone-50 hover:bg-emerald-50/50 dark:bg-stone-800/50 dark:hover:bg-emerald-950/20 border border-stone-200/70 hover:border-emerald-300 dark:border-stone-700 dark:hover:border-emerald-800/60 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 capitalize text-sm">
                        {item.word}
                      </span>
                    </div>
                    {item.nuance && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                        {item.nuance}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-600 shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-400 italic py-2">No direct synonyms recorded.</p>
          )}
        </div>

        {/* Antonyms Column */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-md">
              <Ban className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Antonyms (Opposite Meaning)
            </h3>
            <span className="text-xs text-stone-400 font-mono">({antonyms.length})</span>
          </div>

          {antonyms.length > 0 ? (
            <div className="space-y-2.5">
              {antonyms.map((item, idx) => (
                <div
                  key={idx}
                  id={`antonym-item-${idx}`}
                  onClick={() => onSelectWord(item.word)}
                  className="group p-3.5 bg-stone-50 hover:bg-rose-50/50 dark:bg-stone-800/50 dark:hover:bg-rose-950/20 border border-stone-200/70 hover:border-rose-300 dark:border-stone-700 dark:hover:border-rose-800/60 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-rose-700 dark:group-hover:text-rose-300 capitalize text-sm">
                        {item.word}
                      </span>
                    </div>
                    {item.nuance && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                        {item.nuance}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-rose-600 shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-400 italic py-2">
              No direct antonyms for this specific word form.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
