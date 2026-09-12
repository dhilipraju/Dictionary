import React, { useState } from 'react';
import { Languages, Volume2, Globe, Search, LayoutGrid, Check, Copy } from 'lucide-react';
import { IndianLanguageCode, LanguageTranslation, INDIAN_LANGUAGES } from '../types';
import { speakText } from '../utils/speech';

interface TranslationSectionProps {
  word: string;
  translations: Record<IndianLanguageCode, LanguageTranslation>;
}

export const TranslationSection: React.FC<TranslationSectionProps> = ({ word, translations }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<IndianLanguageCode>('hindi');
  const [languageSearch, setLanguageSearch] = useState('');
  const [showAllGrid, setShowAllGrid] = useState(false);
  const [playingLang, setPlayingLang] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  // Selected translation data (fallback if missing)
  const currentTranslation: LanguageTranslation | undefined = translations?.[selectedLanguage];
  const selectedLangMeta = INDIAN_LANGUAGES.find((l) => l.code === selectedLanguage);

  const handlePlayTranslationAudio = (text: string, speechCode?: string) => {
    if (!text) return;
    setPlayingLang(selectedLanguage);
    speakText(text, {
      lang: speechCode || 'hi-IN',
      rate: 0.9,
      onEnd: () => setPlayingLang(null),
    });
  };

  const handleCopyTranslatedWord = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  // Filter languages based on search input
  const filteredLanguages = INDIAN_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(languageSearch.toLowerCase())
  );

  return (
    <div
      id="translations-section"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs mb-8"
    >
      {/* Header with Switch to All Languages View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-800 dark:text-amber-300">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
              Indian Language Translations
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Complete translations across all 22 Eighth Schedule Indian languages
            </p>
          </div>
        </div>

        {/* View Toggle: Single Focus vs All 22 Comparative Grid */}
        <button
          type="button"
          id="toggle-all-translations-button"
          onClick={() => setShowAllGrid(!showAllGrid)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            showAllGrid
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>{showAllGrid ? 'Focus Selected Language' : 'Compare All 22 Languages'}</span>
        </button>
      </div>

      {/* Language Selector Bar */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <label
            htmlFor="language-dropdown-select"
            className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-amber-600" />
            Select Translation Language ({INDIAN_LANGUAGES.length} Languages available):
          </label>

          {/* Quick Search for Language */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={languageSearch}
              onChange={(e) => setLanguageSearch(e.target.value)}
              placeholder="Filter languages..."
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        {/* Language Selection Chips */}
        <div
          id="language-chips-container"
          className="flex items-center gap-1.5 overflow-x-auto pb-3 pt-1 scrollbar-thin"
        >
          {filteredLanguages.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                id={`lang-chip-${lang.code}`}
                type="button"
                onClick={() => {
                  setSelectedLanguage(lang.code);
                  setShowAllGrid(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm font-semibold'
                    : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/80 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span>{lang.name}</span>
                <span className={`ml-1.5 text-[11px] opacity-80 ${isSelected ? 'text-amber-100' : 'text-stone-400'}`}>
                  {lang.nativeName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Display: Active Selected Language Card */}
      {!showAllGrid && currentTranslation ? (
        <div
          id="active-translation-card"
          className="mt-6 p-6 sm:p-8 bg-linear-to-br from-amber-50/50 via-white to-stone-50 dark:from-stone-800/40 dark:via-stone-900 dark:to-stone-800/20 border border-amber-200/80 dark:border-stone-700/80 rounded-2xl shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-stone-200/60 dark:border-stone-700/60">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 rounded-md text-xs font-bold uppercase tracking-wider">
                  {selectedLangMeta?.name || currentTranslation.languageName}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Script: {currentTranslation.script || selectedLangMeta?.script}
                </span>
              </div>

              {/* Translated Word in Native Script */}
              <div className="flex items-baseline gap-4 flex-wrap mt-2">
                <span
                  id="translated-word-script"
                  className="text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 tracking-wide"
                >
                  {currentTranslation.translatedWord}
                </span>

                {/* Romanized Transliteration */}
                {currentTranslation.transliteration && (
                  <span
                    id="translated-word-transliteration"
                    className="text-lg sm:text-xl font-medium text-amber-800 dark:text-amber-300 italic"
                  >
                    ({currentTranslation.transliteration})
                  </span>
                )}
              </div>
            </div>

            {/* Translation Audio & Copy Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="listen-translation-button"
                onClick={() =>
                  handlePlayTranslationAudio(
                    currentTranslation.translatedWord,
                    selectedLangMeta?.speechCode
                  )
                }
                title={`Listen in ${selectedLangMeta?.name}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  playingLang === selectedLanguage
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen ({selectedLangMeta?.name})</span>
              </button>

              <button
                type="button"
                id="copy-translation-button"
                onClick={() => handleCopyTranslatedWord(currentTranslation.translatedWord)}
                title="Copy native script"
                className="p-2.5 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 rounded-xl transition-colors"
              >
                {copiedScript ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Definition in Target Language */}
          <div className="mt-6 space-y-4">
            {currentTranslation.definitionInLanguage && (
              <div className="p-4 bg-white/80 dark:bg-stone-800/80 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-1">
                  Definition in {selectedLangMeta?.name}:
                </span>
                <p className="text-base text-stone-800 dark:text-stone-200 font-medium leading-relaxed">
                  {currentTranslation.definitionInLanguage}
                </p>
              </div>
            )}

            {/* Example Sentence in Target Language */}
            {currentTranslation.exampleSentenceInLanguage && (
              <div className="p-4 bg-white/80 dark:bg-stone-800/80 rounded-xl border border-stone-200/60 dark:border-stone-700/60 space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                  Example Sentence in {selectedLangMeta?.name}:
                </span>
                <p className="text-base text-stone-900 dark:text-stone-100 font-medium">
                  "{currentTranslation.exampleSentenceInLanguage}"
                </p>
                {currentTranslation.exampleSentenceTranslation && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 italic">
                    Meaning: "{currentTranslation.exampleSentenceTranslation}"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Comparative View: All 22 Indian Languages Grid */}
      {showAllGrid && (
        <div id="all-22-languages-grid" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Comparative Matrix: All 22 Indian Languages for "{word}"
            </h3>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Showing {INDIAN_LANGUAGES.length} languages
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INDIAN_LANGUAGES.map((lang) => {
              const item = translations?.[lang.code];
              const isSelected = selectedLanguage === lang.code;

              return (
                <div
                  key={lang.code}
                  id={`grid-card-${lang.code}`}
                  onClick={() => {
                    setSelectedLanguage(lang.code);
                    setShowAllGrid(false);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 shadow-xs ring-2 ring-amber-200 dark:ring-amber-900/40'
                      : 'bg-stone-50/70 hover:bg-white dark:bg-stone-800/50 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wide">
                      {lang.name} ({lang.nativeName})
                    </span>
                    <span className="text-[10px] text-stone-400 bg-stone-200/60 dark:bg-stone-700/60 px-1.5 py-0.5 rounded">
                      {lang.script}
                    </span>
                  </div>

                  {item ? (
                    <div className="space-y-1">
                      <div className="text-xl font-bold text-stone-900 dark:text-stone-100">
                        {item.translatedWord}
                      </div>
                      {item.transliteration && (
                        <div className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                          {item.transliteration}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-stone-400 italic">Translating...</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
