import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { DictionaryEntry } from './types';
import { SearchBar } from './components/SearchBar';
import { WordHeader } from './components/WordHeader';
import { PictureCard } from './components/PictureCard';
import { GrammarSection } from './components/GrammarSection';
import { SentenceExamples } from './components/SentenceExamples';
import { AlternatesSection } from './components/AlternatesSection';
import { TranslationSection } from './components/TranslationSection';
import { RecentWords } from './components/RecentWords';

export default function App() {
  const [currentWord, setCurrentWord] = useState('dictionary');
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Local storage for recent and bookmarked words
  const [recentWords, setRecentWords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dictionary_recent_words');
      return saved ? JSON.parse(saved) : ['dictionary', 'curiosity', 'resilient'];
    } catch {
      return ['dictionary'];
    }
  });

  const [bookmarkedWords, setBookmarkedWords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dictionary_saved_words');
      return saved ? JSON.parse(saved) : ['dictionary'];
    } catch {
      return [];
    }
  });

  const fetchWord = async (wordToSearch: string) => {
    if (!wordToSearch || !wordToSearch.trim()) return;
    const cleanWord = wordToSearch.trim().toLowerCase();

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/dictionary/${encodeURIComponent(cleanWord)}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Could not find "${cleanWord}". Please check spelling.`);
      }

      const data: DictionaryEntry = await response.json();
      setEntry(data);
      setCurrentWord(cleanWord);

      // Update recent words
      setRecentWords((prev) => {
        const filtered = prev.filter((w) => w.toLowerCase() !== cleanWord);
        const updated = [cleanWord, ...filtered].slice(0, 10);
        try {
          localStorage.setItem('dictionary_recent_words', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } catch (err: any) {
      console.error('Fetch dictionary error:', err);
      setErrorMessage(err.message || 'An error occurred while looking up the word. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial word on mount
  useEffect(() => {
    fetchWord(currentWord);
  }, []);

  const handleToggleBookmark = () => {
    if (!entry) return;
    const wordKey = entry.word.toLowerCase();
    setBookmarkedWords((prev) => {
      let updated: string[];
      if (prev.includes(wordKey)) {
        updated = prev.filter((w) => w !== wordKey);
      } else {
        updated = [wordKey, ...prev];
      }
      try {
        localStorage.setItem('dictionary_saved_words', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearRecent = () => {
    setRecentWords([]);
    try {
      localStorage.removeItem('dictionary_recent_words');
    } catch {}
  };

  const isCurrentBookmarked = entry ? bookmarkedWords.includes(entry.word.toLowerCase()) : false;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans antialiased transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600 text-white rounded-xl shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 tracking-tight">
                Online English Dictionary
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 px-2 py-0.5 rounded-full font-medium">
                22 Indian Languages & Voice Input
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium">
            <button
              type="button"
              onClick={() => {
                const randomWords = ['serendipity', 'resilient', 'luminous', 'curiosity', 'flourish', 'empathy', 'eloquent', 'persevere'];
                const chosen = randomWords[Math.floor(Math.random() * randomWords.length)];
                fetchWord(chosen);
              }}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Look up a random vocabulary word"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Random Word</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Search Header Hero */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Look up any English word
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl mx-auto">
            Type or click the microphone to speak. Explore definitions, pronunciation, grammar, visuals, examples, alternates, and 22 Indian language translations.
          </p>
        </div>

        {/* The One Input Textbox with Voice Mic */}
        <SearchBar
          currentWord={currentWord}
          onSearch={(word) => fetchWord(word)}
          isLoading={isLoading}
        />

        {/* Error Alert */}
        {errorMessage && (
          <div
            id="search-error-banner"
            className="mb-8 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl flex items-start gap-3 text-red-800 dark:text-red-200 max-w-3xl mx-auto"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <span className="font-semibold block">Word Lookup Note</span>
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => fetchWord(currentWord)}
              className="px-3 py-1 bg-red-100 dark:bg-red-900/60 hover:bg-red-200 text-red-900 dark:text-red-100 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        {/* Loading State Spinner */}
        {isLoading && (
          <div id="loading-state-indicator" className="py-16 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-200 dark:border-amber-950 border-t-amber-600 rounded-full animate-spin"></div>
            <div className="text-center space-y-1">
              <div className="text-base font-medium text-stone-800 dark:text-stone-200 font-serif capitalize">
                Analyzing "{currentWord}"...
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Compiling definitions, grammar, pronunciation, examples, alternates, and 22 Indian language translations.
              </p>
            </div>
          </div>
        )}

        {/* Dictionary Results Display */}
        {!isLoading && entry && (
          <div id="dictionary-result-content" className="space-y-2 animate-fadeIn">
            {/* 1. Word Header & Pronunciation & Meaning */}
            <WordHeader
              entry={entry}
              isBookmarked={isCurrentBookmarked}
              onToggleBookmark={handleToggleBookmark}
            />

            {/* 2. Visual Picture for the Word */}
            <PictureCard word={entry.word} picture={entry.picture} />

            {/* 3. Grammar Parts of the Word */}
            <GrammarSection word={entry.word} grammar={entry.grammar} />

            {/* 4. Sentence Examples */}
            <SentenceExamples word={entry.word} examples={entry.sentenceExamples} />

            {/* 5. Alternates (Synonyms & Antonyms) */}
            <AlternatesSection
              word={entry.word}
              synonyms={entry.alternates?.synonyms || []}
              antonyms={entry.alternates?.antonyms || []}
              onSelectWord={(altWord) => fetchWord(altWord)}
            />

            {/* 6. Translations in 22 Indian Languages */}
            <TranslationSection word={entry.word} translations={entry.translations} />

            {/* 7. Study History & Saved Words */}
            <RecentWords
              recentWords={recentWords}
              bookmarkedWords={bookmarkedWords}
              onSelectWord={(w) => fetchWord(w)}
              onClearRecent={handleClearRecent}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-8 text-center text-xs text-stone-400 dark:text-stone-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Online English Dictionary with Comprehensive Grammar, Audio Pronunciation, and 22 Scheduled Indian Languages.
          </p>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span>Speech Recognition • Synthesis • Multilingual</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
