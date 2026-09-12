import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MicOff, X, Sparkles, Loader2, Volume2 } from 'lucide-react';
import { isSpeechRecognitionSupported, createSpeechRecognizer } from '../utils/speech';

interface SearchBarProps {
  currentWord: string;
  onSearch: (word: string) => void;
  isLoading: boolean;
}

const QUICK_DISCOVERY_WORDS = [
  'dictionary',
  'curiosity',
  'resilient',
  'flourish',
  'luminous',
  'empathy',
  'courage',
  'knowledge',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  currentWord,
  onSearch,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState(currentWord);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setInputValue(currentWord);
  }, [currentWord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setVoiceError(null);
      onSearch(inputValue.trim());
    }
  };

  const startVoiceInput = () => {
    setVoiceError(null);
    if (!isSpeechRecognitionSupported()) {
      setVoiceError('Speech recognition is not supported in this browser. Please type the word.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop?.();
      setIsListening(false);
      return;
    }

    const recognition = createSpeechRecognizer(
      (transcript) => {
        setIsListening(false);
        // Clean transcript (e.g. remove trailing period, punctuation)
        const cleanWord = transcript.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim();
        if (cleanWord) {
          setInputValue(cleanWord);
          onSearch(cleanWord);
        }
      },
      (error) => {
        setIsListening(false);
        setVoiceError(error);
      },
      () => {
        setIsListening(false);
      }
    );

    if (recognition) {
      recognitionRef.current = recognition;
      try {
        recognition.start();
        setIsListening(true);
      } catch (err: any) {
        setVoiceError('Could not start microphone. Please try again.');
        setIsListening(false);
      }
    }
  };

  const clearInput = () => {
    setInputValue('');
    setVoiceError(null);
  };

  return (
    <div id="search-section" className="w-full max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div
          id="search-input-container"
          className={`flex items-center w-full bg-white dark:bg-stone-900 border-2 transition-all duration-200 rounded-2xl shadow-sm hover:shadow-md ${
            isListening
              ? 'border-red-500 ring-4 ring-red-100 dark:ring-red-950/40'
              : 'border-stone-200 dark:border-stone-800 focus-within:border-amber-600 focus-within:ring-4 focus-within:ring-amber-100 dark:focus-within:ring-amber-950/30'
          }`}
        >
          {/* Left search icon */}
          <div className="pl-4 pr-2 text-stone-400 dark:text-stone-500 flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>

          {/* The input textbox */}
          <input
            id="dictionary-search-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type any English word or click the mic to speak..."
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
            className="w-full py-4 text-lg font-medium text-stone-900 dark:text-stone-100 bg-transparent placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none"
          />

          {/* Clear button if text exists */}
          {inputValue && !isLoading && (
            <button
              id="clear-search-button"
              type="button"
              onClick={clearInput}
              title="Clear text"
              className="p-2 mr-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Microphone button */}
          <button
            id="voice-search-button"
            type="button"
            onClick={startVoiceInput}
            title={isListening ? 'Stop listening' : 'Click to say the word with microphone'}
            className={`p-3 mr-2 rounded-xl transition-all flex items-center justify-center ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700 hover:text-amber-800 dark:hover:text-amber-300'
            }`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 animate-bounce" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Search action button */}
          <button
            id="submit-search-button"
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="mr-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-medium text-sm rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            Search
          </button>
        </div>

        {/* Listening indicator badge */}
        {isListening && (
          <div
            id="voice-listening-alert"
            className="mt-3 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-center justify-between text-sm text-red-700 dark:text-red-300 animate-fadeIn"
          >
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="font-medium">Listening... Please speak the English word clearly into your microphone</span>
            </div>
            <button
              type="button"
              onClick={() => setIsListening(false)}
              className="text-xs underline hover:text-red-900 dark:hover:text-red-100"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Error notification for speech */}
        {voiceError && (
          <div
            id="voice-error-alert"
            className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between"
          >
            <span>{voiceError}</span>
            <button
              type="button"
              onClick={() => setVoiceError(null)}
              className="ml-2 font-bold hover:text-amber-950"
            >
              ×
            </button>
          </div>
        )}
      </form>

      {/* Suggested Discovery Words for Students */}
      <div id="quick-discovery-pills" className="mt-3 flex items-center flex-wrap gap-2 text-xs">
        <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Try words:
        </span>
        {QUICK_DISCOVERY_WORDS.map((word) => (
          <button
            key={word}
            id={`quick-word-${word}`}
            type="button"
            onClick={() => {
              setInputValue(word);
              onSearch(word);
            }}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              currentWord.toLowerCase() === word
                ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-200 font-semibold'
                : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/80 dark:hover:bg-stone-700/80 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
            }`}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
};
