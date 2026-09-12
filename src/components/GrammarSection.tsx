import React from 'react';
import { BookOpen, Layers, GitBranch, History, Bookmark, Sparkles } from 'lucide-react';
import { GrammarDetails } from '../types';

interface GrammarSectionProps {
  word: string;
  grammar: GrammarDetails;
}

export const GrammarSection: React.FC<GrammarSectionProps> = ({ word, grammar }) => {
  return (
    <div
      id="grammar-section"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs mb-8"
    >
      <div className="flex items-center gap-3 pb-5 border-b border-stone-100 dark:border-stone-800">
        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-800 dark:text-amber-300">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
            Grammar Parts & Linguistic Analysis
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Part of speech, grammatical classification, word inflections, and root origins
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Left Column: Classification & Inflections */}
        <div className="space-y-5">
          {/* Part of Speech & Category */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Classification & Parts of Speech</span>
            </div>
            <div className="flex items-center flex-wrap gap-2 mb-2">
              {grammar.partsOfSpeech.map((pos) => (
                <span
                  key={pos}
                  className="px-3 py-1 bg-amber-600 text-white font-semibold text-xs rounded-lg uppercase"
                >
                  {pos}
                </span>
              ))}
              {grammar.grammaticalCategory && (
                <span className="px-3 py-1 bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium rounded-lg">
                  {grammar.grammaticalCategory}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Grammatical role defining how the word functions inside sentence syntax.
            </p>
          </div>

          {/* Inflections / Tenses / Plural forms */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3">
              <GitBranch className="w-4 h-4 text-amber-600" />
              <span>Grammatical Forms & Inflections</span>
            </div>
            <div className="space-y-2 text-sm">
              {grammar.pluralForm && (
                <div className="flex items-center justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                  <span className="text-stone-500 dark:text-stone-400 text-xs">Plural Form:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 font-mono">
                    {grammar.pluralForm}
                  </span>
                </div>
              )}

              {grammar.pastTense && (
                <div className="flex items-center justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                  <span className="text-stone-500 dark:text-stone-400 text-xs">Past Tense (V2):</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 font-mono">
                    {grammar.pastTense}
                  </span>
                </div>
              )}

              {grammar.pastParticiple && (
                <div className="flex items-center justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                  <span className="text-stone-500 dark:text-stone-400 text-xs">Past Participle (V3):</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 font-mono">
                    {grammar.pastParticiple}
                  </span>
                </div>
              )}

              {grammar.presentParticiple && (
                <div className="flex items-center justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                  <span className="text-stone-500 dark:text-stone-400 text-xs">Present Participle (-ing):</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 font-mono">
                    {grammar.presentParticiple}
                  </span>
                </div>
              )}

              {grammar.comparative && (
                <div className="flex items-center justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                  <span className="text-stone-500 dark:text-stone-400 text-xs">Comparative:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 font-mono">
                    {grammar.comparative}
                  </span>
                </div>
              )}

              {grammar.superlative && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-stone-500 dark:text-stone-400 text-xs">Superlative:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 font-mono">
                    {grammar.superlative}
                  </span>
                </div>
              )}

              {!grammar.pluralForm && !grammar.pastTense && !grammar.comparative && (
                <div className="text-xs text-stone-500 py-1">
                  Standard base form. No irregular inflectional changes.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Etymology & Collocations */}
        <div className="space-y-5">
          {/* Root & Etymology */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              <History className="w-4 h-4 text-amber-600" />
              <span>Etymology & Root Origins</span>
            </div>
            <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
              {grammar.rootAndEtymology || `Originates from classical linguistic roots in English.`}
            </p>
          </div>

          {/* Collocations & Prepositions */}
          {grammar.collocations && grammar.collocations.length > 0 && (
            <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                <Bookmark className="w-4 h-4 text-amber-600" />
                <span>Common Collocations & Pairings</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {grammar.collocations.map((collocation, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 rounded-md font-medium"
                  >
                    "{collocation}"
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
