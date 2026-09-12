import React, { useState } from 'react';
import { Quote, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { SentenceExample } from '../types';
import { speakText } from '../utils/speech';

interface SentenceExamplesProps {
  word: string;
  examples: SentenceExample[];
}

export const SentenceExamples: React.FC<SentenceExamplesProps> = ({ word, examples }) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const handlePlaySentence = (sentence: string, index: number) => {
    setPlayingIndex(index);
    speakText(sentence, {
      rate: 0.95,
      onEnd: () => setPlayingIndex(null),
    });
  };

  // Helper to highlight the target word inside sentence text
  const renderHighlightedSentence = (sentence: string, targetWord: string) => {
    // Regex matching the word with possible suffixes like -s, -ed, -ing
    const regex = new RegExp(`(\\b${targetWord}\\w*\\b)`, 'gi');
    const parts = sentence.split(regex);

    return parts.map((part, i) => {
      if (regex.test(part)) {
        return (
          <mark
            key={i}
            className="bg-amber-200/80 dark:bg-amber-900/60 text-amber-950 dark:text-amber-100 font-bold px-1 rounded-sm"
          >
            {part}
          </mark>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const getContextColor = (context: string) => {
    switch (context) {
      case 'Elementary':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900';
      case 'Everyday':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900';
      case 'Academic':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900';
      case 'Literature':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700';
    }
  };

  return (
    <div
      id="sentence-examples-section"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs mb-8"
    >
      <div className="flex items-center gap-3 pb-5 border-b border-stone-100 dark:border-stone-800">
        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-800 dark:text-amber-300">
          <Quote className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
            Sentence Examples
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Real contextual sentences demonstrating proper usage across different styles
          </p>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {examples && examples.length > 0 ? (
          examples.map((item, index) => (
            <div
              key={index}
              id={`sentence-example-${index}`}
              className="p-5 bg-stone-50/80 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 rounded-xl hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  {/* Context pill */}
                  <span
                    className={`inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md border ${getContextColor(
                      item.context
                    )}`}
                  >
                    {item.context} Usage
                  </span>

                  {/* Sentence */}
                  <p className="text-base sm:text-lg text-stone-900 dark:text-stone-100 font-serif leading-relaxed">
                    "{renderHighlightedSentence(item.sentence, word)}"
                  </p>

                  {/* Explanation */}
                  {item.explanation && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{item.explanation}</span>
                    </p>
                  )}
                </div>

                {/* Listen button for this sentence */}
                <button
                  type="button"
                  onClick={() => handlePlaySentence(item.sentence, index)}
                  title="Listen to this sentence"
                  className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                    playingIndex === index
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm animate-pulse'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-stone-700'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-stone-500 py-4 text-center">
            No sentence examples available for this word.
          </p>
        )}
      </div>
    </div>
  );
};
