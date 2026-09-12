/**
 * Web Speech API utilities for Pronunciation and Voice Input
 */

// Speech Recognition Type Definitions for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createSpeechRecognizer(
  onResult: (transcript: string) => void,
  onError: (error: string) => void,
  onEnd: () => void
) {
  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionClass) {
    onError('Speech recognition is not supported in this browser.');
    return null;
  }

  try {
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript.trim();
        onResult(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error event:', event);
      if (event.error === 'not-allowed') {
        onError('Microphone access was denied. Please allow microphone permissions.');
      } else if (event.error === 'no-speech') {
        onError('No speech was detected. Please try speaking again.');
      } else {
        onError(`Speech recognition error: ${event.error || 'unknown'}`);
      }
    };

    recognition.onend = () => {
      onEnd();
    };

    return recognition;
  } catch (err: any) {
    onError(err?.message || 'Failed to initialize speech recognition.');
    return null;
  }
}

export function speakText(
  text: string,
  options: {
    lang?: string;
    rate?: number;
    pitch?: number;
    onEnd?: () => void;
  } = {}
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported in this browser.');
    return;
  }

  // Cancel ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang || 'en-US';
  utterance.rate = options.rate ?? 1.0;
  utterance.pitch = options.pitch ?? 1.0;

  if (options.onEnd) {
    utterance.onend = options.onEnd;
    utterance.onerror = () => options.onEnd?.();
  }

  // Find preferred voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const matchedVoice = voices.find(
      (v) => v.lang.toLowerCase() === (options.lang || 'en-US').toLowerCase()
    ) || voices.find((v) => v.lang.startsWith((options.lang || 'en-US').slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
}
