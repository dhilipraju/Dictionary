import React from 'react';
import { History, Bookmark, Trash2, ArrowRight } from 'lucide-react';

interface RecentWordsProps {
  recentWords: string[];
  bookmarkedWords: string[];
  onSelectWord: (word: string) => void;
  onClearRecent: () => void;
}

export const RecentWords: React.FC<RecentWordsProps> = ({
  recentWords,
  bookmarkedWords,
  onSelectWord,
  onClearRecent,
}) => {
  if (recentWords.length === 0 && bookmarkedWords.length === 0) {
    return null;
  }

  return (
    <div
      id="recent-words-panel"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Study History & Saved Vocabulary
          </h3>
        </div>

        {recentWords.length > 0 && (
          <button
            type="button"
            onClick={onClearRecent}
            className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear history</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
        {/* Recent searches */}
        {recentWords.length > 0 && (
          <div>
            <span className="text-[11px] font-semibold text-stone-400 block mb-2">
              Recently Searched:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {recentWords.map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => onSelectWord(word)}
                  className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-200 rounded-lg text-xs font-medium transition-colors capitalize"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bookmarked words */}
        {bookmarkedWords.length > 0 && (
          <div>
            <span className="text-[11px] font-semibold text-stone-400 block mb-2 flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-amber-600" />
              Saved Words for Revision:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {bookmarkedWords.map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => onSelectWord(word)}
                  className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 rounded-lg text-xs font-medium transition-colors capitalize"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
