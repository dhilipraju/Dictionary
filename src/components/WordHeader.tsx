import React, { useState } from 'react';
import { Volume2, Volume1, Bookmark, BookmarkCheck, Copy, Check, Sparkles } from 'lucide-react';
import { DictionaryEntry } from '../types';
import { speakText } from '../utils/speech';

interface WordHeaderProps {
  entry: DictionaryEntry;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const WordHeader: React.FC<WordHeaderProps> = ({
  entry,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [accent, setAccent] = useState<'en-US' | 'en-GB'>('en-US');
  const [copied, setCopied] = useState(false);

  const handlePlayPronunciation = (speedOverride?: number) => {
    setIsPlaying(true);
    speakText(entry.word, {
      lang: accent,
      rate: speedOverride ?? playbackSpeed,
      onEnd: () => setIsPlaying(false),
    });
  };

  const handleCopy = () => {
    const textToCopy = `${entry.word} (${entry.phoneticIPA})\nDefinition: ${entry.primaryMeaning}\nStudent explanation: ${entry.studentFriendlyDefinition}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="word-header-card" className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
      {/* Top row: Word title, Pronunciation button, bookmarks */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center flex-wrap gap-3">
            <h1
              id="entry-word-title"
              className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 dark:text-stone-100 capitalize tracking-tight"
            >
              {entry.word}
            </h1>

            {/* Parts of speech badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {entry.grammar.partsOfSpeech.map((pos) => (
                <span
                  key={pos}
                  className="px-3 py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-semibold rounded-full uppercase tracking-wider"
                >
                  {pos}
                </span>
              ))}
            </div>
          </div>

          {/* Phonetics & Syllable structure */}
          <div className="flex items-center flex-wrap gap-4 mt-3 text-stone-600 dark:text-stone-300">
            {/* IPA notation */}
            <span
              id="phonetic-ipa"
              className="font-mono text-base sm:text-lg text-amber-800 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30 px-2.5 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-900/40"
              title="International Phonetic Alphabet"
            >
              {entry.phoneticIPA}
            </span>

            {/* Respelling */}
            {entry.phoneticRespelling && (
              <span id="phonetic-respelling" className="text-sm font-medium text-stone-500 dark:text-stone-400">
                Sounds like: <strong className="text-stone-800 dark:text-stone-200">{entry.phoneticRespelling}</strong>
              </span>
            )}

            {/* Syllables with stressed syllable highlight */}
            {entry.grammar.syllables && entry.grammar.syllables.length > 0 && (
              <div id="syllables-breakdown" className="flex items-center gap-1 text-sm bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-lg">
                <span className="text-xs text-stone-400 font-medium mr-1">Syllables:</span>
                {entry.grammar.syllables.map((syl, idx) => {
                  const isStressed = idx === entry.grammar.stressedSyllableIndex;
                  return (
                    <React.Fragment key={idx}>
                      <span
                        className={`${
                          isStressed
                            ? 'font-bold text-amber-700 dark:text-amber-300 underline decoration-amber-500 decoration-2'
                            : 'text-stone-700 dark:text-stone-300'
                        }`}
                        title={isStressed ? 'Stressed syllable' : undefined}
                      >
                        {syl}
                      </span>
                      {idx < entry.grammar.syllables.length - 1 && (
                        <span className="text-stone-400 select-none">•</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls: Audio listen, speed, bookmark, copy */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
          {/* Main Pronunciation button */}
          <button
            id="listen-pronunciation-button"
            type="button"
            onClick={() => handlePlayPronunciation()}
            title="Listen to pronunciation"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-xs ${
              isPlaying
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
            <span>{isPlaying ? 'Playing...' : 'Pronounce'}</span>
          </button>

          {/* Slow speed toggle button for phonetic learners */}
          <button
            id="slow-audio-button"
            type="button"
            onClick={() => handlePlayPronunciation(0.7)}
            title="Play slowly for phonetic clarity"
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-medium transition-colors"
          >
            <Volume1 className="w-3.5 h-3.5 text-stone-500" />
            <span>Slow</span>
          </button>

          {/* Accent toggle button */}
          <button
            id="accent-toggle-button"
            type="button"
            onClick={() => setAccent(accent === 'en-US' ? 'en-GB' : 'en-US')}
            title="Switch English accent"
            className="px-2.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-xl text-xs font-mono font-medium transition-colors"
          >
            {accent === 'en-US' ? '🇺🇸 US' : '🇬🇧 UK'}
          </button>

          {/* Bookmark Word */}
          <button
            id="bookmark-word-button"
            type="button"
            onClick={onToggleBookmark}
            title={isBookmarked ? 'Remove from saved words' : 'Save word for revision'}
            className={`p-2.5 rounded-xl border transition-colors ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300'
                : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400'
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* Copy summary */}
          <button
            id="copy-definition-button"
            type="button"
            onClick={handleCopy}
            title="Copy word and meaning"
            className="p-2.5 bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 rounded-xl transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Definitions Area */}
      <div className="mt-6 space-y-4">
        {/* Primary Meaning */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1.5">
            Primary Meaning
          </h2>
          <p id="primary-meaning-text" className="text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-serif leading-relaxed">
            {entry.primaryMeaning}
          </p>
        </div>

        {/* Student-Friendly Explanation */}
        {entry.studentFriendlyDefinition && (
          <div
            id="student-friendly-box"
            className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl flex items-start gap-3"
          >
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/60 rounded-lg text-emerald-700 dark:text-emerald-300 mt-0.5 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-0.5">
                Simple Student Explanation
              </div>
              <p className="text-sm sm:text-base text-emerald-950 dark:text-emerald-100 leading-normal">
                {entry.studentFriendlyDefinition}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
