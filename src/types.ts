export type IndianLanguageCode =
  | 'assamese'
  | 'bengali'
  | 'bodo'
  | 'dogri'
  | 'gujarati'
  | 'hindi'
  | 'kannada'
  | 'kashmiri'
  | 'konkani'
  | 'maithili'
  | 'malayalam'
  | 'manipuri'
  | 'marathi'
  | 'nepali'
  | 'odia'
  | 'punjabi'
  | 'sanskrit'
  | 'santali'
  | 'sindhi'
  | 'tamil'
  | 'telugu'
  | 'urdu';

export interface LanguageMeta {
  code: IndianLanguageCode;
  name: string;
  nativeName: string;
  script: string;
  speechCode?: string; // BCP 47 code for Web Speech API
}

export interface LanguageTranslation {
  languageCode: IndianLanguageCode;
  languageName: string;
  translatedWord: string;
  script: string;
  transliteration: string;
  definitionInLanguage: string;
  exampleSentenceInLanguage: string;
  exampleSentenceTranslation: string;
}

export interface GrammarDetails {
  partsOfSpeech: string[]; // e.g. ["Noun", "Verb"]
  syllables: string[]; // e.g. ["dic", "tion", "ar", "y"]
  stressedSyllableIndex: number;
  pluralForm?: string;
  pastTense?: string;
  pastParticiple?: string;
  presentParticiple?: string;
  thirdPersonSingular?: string;
  comparative?: string;
  superlative?: string;
  grammaticalCategory: string; // e.g. "Countable Noun", "Transitive Verb"
  rootAndEtymology: string; // Origin and linguistic breakdown
  collocations: string[]; // Common word pairings
}

export interface SentenceExample {
  sentence: string;
  context: 'Elementary' | 'Everyday' | 'Academic' | 'Literature';
  explanation: string;
}

export interface AlternateWord {
  word: string;
  relation: 'synonym' | 'antonym';
  nuance: string; // explanation of how this alternate differs
}

export interface PictureInfo {
  imageUrl: string;
  caption: string;
  credit?: string;
  svgFallbackIcon?: string;
  conceptDescription: string;
}

export interface DictionaryEntry {
  word: string;
  phoneticIPA: string;
  phoneticRespelling: string;
  primaryMeaning: string;
  studentFriendlyDefinition: string;
  grammar: GrammarDetails;
  picture: PictureInfo;
  sentenceExamples: SentenceExample[];
  alternates: {
    synonyms: AlternateWord[];
    antonyms: AlternateWord[];
  };
  translations: Record<IndianLanguageCode, LanguageTranslation>;
}

export const INDIAN_LANGUAGES: LanguageMeta[] = [
  { code: 'hindi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', speechCode: 'hi-IN' },
  { code: 'bengali', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', speechCode: 'bn-IN' },
  { code: 'tamil', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', speechCode: 'ta-IN' },
  { code: 'telugu', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', speechCode: 'te-IN' },
  { code: 'marathi', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', speechCode: 'mr-IN' },
  { code: 'gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', speechCode: 'gu-IN' },
  { code: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', speechCode: 'kn-IN' },
  { code: 'malayalam', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', speechCode: 'ml-IN' },
  { code: 'punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', speechCode: 'pa-IN' },
  { code: 'odia', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia', speechCode: 'or-IN' },
  { code: 'urdu', name: 'Urdu', nativeName: 'اردو', script: 'Perso-Arabic', speechCode: 'ur-IN' },
  { code: 'assamese', name: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali-Assamese', speechCode: 'as-IN' },
  { code: 'sanskrit', name: 'Sanskrit', nativeName: 'संस्कृतम्', script: 'Devanagari', speechCode: 'sa-IN' },
  { code: 'nepali', name: 'Nepali', nativeName: 'नेपाली', script: 'Devanagari', speechCode: 'ne-NP' },
  { code: 'konkani', name: 'Konkani', nativeName: 'कोंकणी', script: 'Devanagari', speechCode: 'kok-IN' },
  { code: 'kashmiri', name: 'Kashmiri', nativeName: 'کٲشُر / कॉशुर', script: 'Perso-Arabic / Devanagari', speechCode: 'ks-IN' },
  { code: 'maithili', name: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari', speechCode: 'mai-IN' },
  { code: 'sindhi', name: 'Sindhi', nativeName: 'سنڌي / सिंधी', script: 'Perso-Arabic / Devanagari', speechCode: 'sd-IN' },
  { code: 'dogri', name: 'Dogri', nativeName: 'डोगरी', script: 'Devanagari', speechCode: 'doi-IN' },
  { code: 'manipuri', name: 'Manipuri', nativeName: 'মণিপুরী / ꯃꯤꯇꯩꯂꯣꯟ', script: 'Bengali / Meetei Mayek', speechCode: 'mni-IN' },
  { code: 'bodo', name: 'Bodo', nativeName: 'बड़ो', script: 'Devanagari', speechCode: 'brx-IN' },
  { code: 'santali', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki', speechCode: 'sat-IN' },
];
