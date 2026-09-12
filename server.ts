import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-memory cache for fast repeat lookups
const dictionaryCache = new Map<string, any>();

// Seed cache with high-detail curated entry for "dictionary" & "curiosity"
const defaultCuratedEntries: Record<string, any> = {
  dictionary: {
    word: "dictionary",
    phoneticIPA: "/ˈdɪk.ʃən.ər.i/",
    phoneticRespelling: "DIK-shuh-nair-ee",
    primaryMeaning: "A book or electronic resource that lists words of a language in alphabetical order and gives their meaning, pronunciation, grammar, and translations.",
    studentFriendlyDefinition: "A special book or digital guide that helps you discover what words mean, how to spell and pronounce them, and how to use them properly.",
    grammar: {
      partsOfSpeech: ["Noun"],
      syllables: ["dic", "tion", "ar", "y"],
      stressedSyllableIndex: 0,
      pluralForm: "dictionaries",
      grammaticalCategory: "Countable Noun",
      rootAndEtymology: "From Medieval Latin 'dictionarium', from Latin 'dictio' (speaking, word), from 'dicere' (to speak). First coined in English around 1525.",
      collocations: ["consult a dictionary", "look up in a dictionary", "bilingual dictionary", "online dictionary", "pocket dictionary"]
    },
    picture: {
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80",
      caption: "An open, leather-bound dictionary revealing thousands of defined words on printed pages.",
      conceptDescription: "A large reference book displaying structured columns of vocabulary, definitions, and phonetics."
    },
    sentenceExamples: [
      {
        sentence: "When Aarav encountered an unfamiliar term in his science textbook, he immediately checked the online dictionary.",
        context: "Elementary",
        explanation: "Shows practical use by a student clarifying difficult vocabulary."
      },
      {
        sentence: "Our teacher advised us to use a dictionary regularly to expand our vocabulary and improve spelling.",
        context: "Everyday",
        explanation: "Demonstrates common classroom advice for language learners."
      },
      {
        sentence: "Samuel Johnson spent nine arduous years assembling his landmark English dictionary in 1755.",
        context: "Literature",
        explanation: "Historical reference illustrating the creation of standard dictionaries."
      }
    ],
    alternates: {
      synonyms: [
        { word: "lexicon", relation: "synonym", nuance: "Often refers to the vocabulary of a specific subject, person, or ancient language." },
        { word: "glossary", relation: "synonym", nuance: "Usually an alphabetical list of specialized terms found at the end of a book." },
        { word: "thesaurus", relation: "synonym", nuance: "Focuses specifically on groups of synonyms and antonyms rather than full definitions." },
        { word: "vocabulary", relation: "synonym", nuance: "The total inventory of words known or used by a person." }
      ],
      antonyms: []
    },
    translations: {
      assamese: {
        languageCode: "assamese",
        languageName: "Assamese",
        translatedWord: "অভিধান",
        script: "অসমীয়া",
        transliteration: "Abhidhan",
        definitionInLanguage: "শব্দৰ অৰ্থ, উচ্চাৰণ আৰু ব্যাকৰণ ব্যাখ্যা কৰা পুথি।",
        exampleSentenceInLanguage: "অচিনাকী শব্দটোৰ অৰ্থ জানিবলৈ মই অভিধানখন চালোঁ।",
        exampleSentenceTranslation: "I checked the dictionary to know the meaning of the unfamiliar word."
      },
      bengali: {
        languageCode: "bengali",
        languageName: "Bengali",
        translatedWord: "অভিধান",
        script: "বাংলা",
        transliteration: "Abhidhan",
        definitionInLanguage: "শব্দকোষ বা যে গ্রন্থে শব্দের অর্থ, ব্যুৎপত্তি ও প্রয়োগ বিধৃত থাকে।",
        exampleSentenceInLanguage: "নতুন ইংরেজি শব্দের অর্থ খুঁজে পেতে আমি অভিধান ব্যবহার করি।",
        exampleSentenceTranslation: "I use a dictionary to find meanings of new English words."
      },
      bodo: {
        languageCode: "bodo",
        languageName: "Bodo",
        translatedWord: "सोदोब बिहुं",
        script: "बड़ो",
        transliteration: "Sodob Bihung",
        definitionInLanguage: "सोदोबफोरनि ओंथि आरो बाहायनाय फोरमायग्रा बिजाब।",
        exampleSentenceInLanguage: "गोदान सोदोबनि ओंथि नागिरनो आं सोदोब बिहुं बाहायो।",
        exampleSentenceTranslation: "I use a dictionary to look for the meaning of new words."
      },
      dogri: {
        languageCode: "dogri",
        languageName: "Dogri",
        translatedWord: "शबदकोश",
        script: "डोगरी",
        transliteration: "Shabadkosh",
        definitionInLanguage: "अल्फ़ाज़ें दे अर्थ ते उच्चारण दस्सने आली किताब।",
        exampleSentenceInLanguage: "नमें लफ्ज दा मतलब दिक्खने लेई मिगी शब्दकोश चाहिदा ऐ।",
        exampleSentenceTranslation: "I need a dictionary to check the meaning of a new word."
      },
      gujarati: {
        languageCode: "gujarati",
        languageName: "Gujarati",
        translatedWord: "શબ્દકોશ",
        script: "ગુજરાતી",
        transliteration: "Shabdakosh",
        definitionInLanguage: "શબ્દોના અર્થ, ઉચ્ચારણ અને વ્યાકરણ સમજાવતું પુસ્તક.કોશ.",
        exampleSentenceInLanguage: "વિદ્યાર્થીઓએ તેમની ભાષા સુધારવા શબ્દકોશનો ઉપયોગ કરવો જોઈએ.",
        exampleSentenceTranslation: "Students should use a dictionary to improve their language."
      },
      hindi: {
        languageCode: "hindi",
        languageName: "Hindi",
        translatedWord: "शब्दकोश",
        script: "हिन्दी",
        transliteration: "Shabdkosh",
        definitionInLanguage: "शब्दों के अर्थ, उच्चारण, व्याकरण और प्रयोग बताने वाली पुस्तक या डिजिटल स्रोत।",
        exampleSentenceInLanguage: "अध्यापक ने छात्रों को कठिन शब्दों के लिए शब्दकोश देखने की सलाह दी।",
        exampleSentenceTranslation: "The teacher advised students to look in the dictionary for difficult words."
      },
      kannada: {
        languageCode: "kannada",
        languageName: "Kannada",
        translatedWord: "ನಿಘಂಟು",
        script: "ಕನ್ನಡ",
        transliteration: "Nighantu",
        definitionInLanguage: "ಪದಗಳ ಅರ್ಥ, ಉಚ್ಚಾರಣೆ ಮತ್ತು ವ್ಯಾಕರಣವನ್ನು ವಿವರಿಸುವ ಗ್ರಂಥ.",
        exampleSentenceInLanguage: "ಹೊಸ ಪದದ ಅರ್ಥವನ್ನು ತಿಳಿಯಲು ನಾನು ನಿಘಂಟನ್ನು ನೋಡಿದೆನು.",
        exampleSentenceTranslation: "I looked into the dictionary to understand the new word's meaning."
      },
      kashmiri: {
        languageCode: "kashmiri",
        languageName: "Kashmiri",
        translatedWord: "لَفٕظ کوش / लफ़्ज़कोश",
        script: "کٲشُر",
        transliteration: "Lafzkosh",
        definitionInLanguage: "سو کتاب یَتھ منٛز لَفژن ہُنٛد معنی تہٕ گرائمر آسہِ۔",
        exampleSentenceInLanguage: "نوٚو لَفٕظ سمجھنہٕ خٲطرٕ پروٚو مےٚ لَفٕظ کوش۔",
        exampleSentenceTranslation: "I read the dictionary to understand the new word."
      },
      konkani: {
        languageCode: "konkani",
        languageName: "Konkani",
        translatedWord: "उतरावळ / शब्दकोश",
        script: "कोंकणी",
        transliteration: "Utraval / Shabdakosh",
        definitionInLanguage: "उतरांचे अर्थ आनी व्याकरण सांगपी पुस्तक.",
        exampleSentenceInLanguage: "नव्या उतराचो अर्थ सोदपाक हांवें उतरावळ पळयली.",
        exampleSentenceTranslation: "I consulted the dictionary to find the meaning of the new word."
      },
      maithili: {
        languageCode: "maithili",
        languageName: "Maithili",
        translatedWord: "शब्दकोश",
        script: "मैथिली",
        transliteration: "Shabdakosh",
        definitionInLanguage: "शब्द सभक अर्थ, व्युत्पत्ति आ प्रयोगक संग्रह पोथी।",
        exampleSentenceInLanguage: "हम कठिन शब्दक अर्थ बुझबाक लेल शब्दकोश उलटलि।",
        exampleSentenceTranslation: "I opened the dictionary to understand the difficult word's meaning."
      },
      malayalam: {
        languageCode: "malayalam",
        languageName: "Malayalam",
        translatedWord: "നിഘണ്ടു",
        script: "മലയാളം",
        transliteration: "Nighandu",
        definitionInLanguage: "വാക്കുകളുടെ അർത്ഥവും വ്യാകരണവും വ്യക്തമാക്കുന്ന പുസ്തകം.",
        exampleSentenceInLanguage: "ഈ വാക്കിന്റെ ശരിയായ അർത്ഥം അറിയാൻ ഞാൻ നിഘണ്ടു പരിശോധിച്ചു.",
        exampleSentenceTranslation: "I checked the dictionary to know the accurate meaning of this word."
      },
      manipuri: {
        languageCode: "manipuri",
        languageName: "Manipuri",
        translatedWord: "ৱাহৈরোই",
        script: "মণিপুরী / ꯃꯤꯇꯩꯂꯣꯟ",
        transliteration: "Wahei-roi",
        definitionInLanguage: "ৱাহৈশিংগী অশেংবা অর্থ অমসুং ব্যাকরণ তাকপা লাইরিক।",
        exampleSentenceInLanguage: "অনৌবা ৱাহৈগী অর্থ খঙনবগীদমক ঐনা ৱাহৈরোই য়েংখি।",
        exampleSentenceTranslation: "I looked into the dictionary to know the meaning of the new word."
      },
      marathi: {
        languageCode: "marathi",
        languageName: "Marathi",
        translatedWord: "शब्दकोश",
        script: "मराठी",
        transliteration: "Shabdakosh",
        definitionInLanguage: "शब्दांचे अर्थ, उच्चार आणि व्याकरण स्पष्ट करणारा ग्रंथ.",
        exampleSentenceInLanguage: "वाचन करताना अनोळखी शब्दांचे अर्थ शब्दकोशात सहज मिळतात.",
        exampleSentenceTranslation: "While reading, meanings of unfamiliar words are easily found in a dictionary."
      },
      nepali: {
        languageCode: "nepali",
        languageName: "Nepali",
        translatedWord: "शब्दकोश",
        script: "नेपाली",
        transliteration: "Shabdakosh",
        definitionInLanguage: "शब्दहरूको अर्थ, उच्चारण र व्याकरण सिकाउने पुस्तक।",
        exampleSentenceInLanguage: "मैले नयाँ शब्दको अर्थ थाहा पाउन शब्दकोश पल्टाएँ।",
        exampleSentenceTranslation: "I flipped through the dictionary to learn the meaning of the new word."
      },
      odia: {
        languageCode: "odia",
        languageName: "Odia",
        translatedWord: "ଅଭିଧାନ / ଶବ୍ଦକୋଷ",
        script: "ଓଡ଼ିଆ",
        transliteration: "Abhidhana / Shabdakosha",
        definitionInLanguage: "ଶବ୍ଦଗୁଡ଼ିକର ଅର୍ଥ ଏବଂ ବ୍ୟାକରଣ ବୁଝାଉଥିବା ପୁସ୍ତକ।",
        exampleSentenceInLanguage: "କଠିନ ଶବ୍ଦର ଅର୍ଥ ଖୋଜିବା ପାଇଁ ମୁଁ ଅଭିଧାନ ବ୍ୟବହାର କଲି।",
        exampleSentenceTranslation: "I used the dictionary to search for the meaning of the difficult word."
      },
      punjabi: {
        languageCode: "punjabi",
        languageName: "Punjabi",
        translatedWord: "ਸ਼ਬਦਕੋਸ਼",
        script: "ਪੰਜਾਬੀ",
        transliteration: "Shabadkosh",
        definitionInLanguage: "ਸ਼ਬਦਾਂ ਦੇ ਅਰਥ, ਉਚਾਰਨ ਅਤੇ ਵਿਆਕਰਣ ਦੱਸਣ ਵਾਲੀ ਪੁਸਤਕ।",
        exampleSentenceInLanguage: "ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਨਵੇਂ ਸ਼ਬਦ ਸਿੱਖਣ ਲਈ ਸ਼ਬਦਕੋਸ਼ ਜ਼ਰੂਰ ਵੇਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
        exampleSentenceTranslation: "Students must consult a dictionary to learn new words."
      },
      sanskrit: {
        languageCode: "sanskrit",
        languageName: "Sanskrit",
        translatedWord: "शब्दकोशः / अमरकोशः",
        script: "संस्कृतम्",
        transliteration: "Shabdakoshah / Amaradoshah",
        definitionInLanguage: "शब्दानाम् अर्थानां च सङ्ग्रहग्रन्थः।",
        exampleSentenceInLanguage: "छात्रः नूतनपदस्य ज्ञानार्थं शब्दकोशं पश्यति।",
        exampleSentenceTranslation: "The student checks the dictionary to gain knowledge of the new word."
      },
      santali: {
        languageCode: "santali",
        languageName: "Santali",
        translatedWord: "ᱟᱹᱲᱟᱹ ᱢᱩᱨᱟᱹᱭ",
        script: "ᱥᱟᱱᱛᱟᱲᱤ",
        transliteration: "Aṛa Murai",
        definitionInLanguage: "ᱟᱹᱲᱟᱹ ᱨᱮᱱᱟᱜ ᱢᱮᱱᱮᱛ ᱟᱨ ᱨᱚᱱᱚᱲ ᱥᱚᱫᱚᱨᱟᱱ ᱯᱩᱛᱷᱤ᱾",
        exampleSentenceInLanguage: "ᱱᱟᱶᱟ ᱟᱹᱲᱟᱹ ᱨᱮᱱᱟᱜ ᱢᱮᱱᱮᱛ ᱧᱟᱢ ᱞᱟᱹᱜᱤᱫ ᱤᱧ ᱟᱹᱲᱟᱹ ᱢᱩᱨᱟᱹᱭ ᱧᱮᱞ ᱠᱮᱫᱟ᱾",
        exampleSentenceTranslation: "I saw the dictionary to find the meaning of the new word."
      },
      sindhi: {
        languageCode: "sindhi",
        languageName: "Sindhi",
        translatedWord: "لغت / لغات",
        script: "سنڌي",
        transliteration: "Lughat",
        definitionInLanguage: "اُهو ڪتاب جنهن ۾ لفظن جا مفهوم ۽ گرامر سمجهايل هجن.",
        exampleSentenceInLanguage: "منهنجي استاد مونکي نوان لفظ لغت مان ڳولڻ سيکاريا.",
        exampleSentenceTranslation: "My teacher taught me to find new words from the dictionary."
      },
      tamil: {
        languageCode: "tamil",
        languageName: "Tamil",
        translatedWord: "அகராதி",
        script: "தமிழ்",
        transliteration: "Agaraadhi",
        definitionInLanguage: "சொற்களின் பொருள், இலக்கணம் மற்றும் உச்சரிப்பை அகரவரிசையில் விளக்கும் நூல்.",
        exampleSentenceInLanguage: "புதிய ஆங்கிலச் சொற்களின் பொருளை அறிய மாணவர்கள் அகராதியைத் தேட வேண்டும்.",
        exampleSentenceTranslation: "Students should look up the dictionary to learn the meaning of new English words."
      },
      telugu: {
        languageCode: "telugu",
        languageName: "Telugu",
        translatedWord: "నిఘంటువు",
        script: "తెలుగు",
        transliteration: "Nighantuvu",
        definitionInLanguage: "పదాల అర్థాలు, వ్యాకరణం మరియు ఉచ్చారణను అక్షర క్రమంలో వివరించే గ్రంథం.",
        exampleSentenceInLanguage: "కష్టమైన పదాలకు సరైన అర్థం తెలుసుకోవడానికి నిఘంటువును ఉపయోగిస్తాము.",
        exampleSentenceTranslation: "We use a dictionary to learn the correct meaning of difficult words."
      },
      urdu: {
        languageCode: "urdu",
        languageName: "Urdu",
        translatedWord: "لغت",
        script: "اردو",
        transliteration: "Lughat",
        definitionInLanguage: "وہ کتاب جس میں الفاظ کے معانی، تلفظ اور گرائمر کی وضاحت درج ہو۔",
        exampleSentenceInLanguage: "کسی بھی نئے لفظ کا درست تلفظ اور معنی معلوم کرنے کے لیے لغت دیکھیں۔",
        exampleSentenceTranslation: "Check the dictionary to find the correct pronunciation and meaning of any new word."
      }
    }
  }
};

// Prompt generator for Gemini to get a comprehensive JSON payload
function buildGeminiPrompt(searchWord: string): string {
  return `You are an expert educational lexicographer and polyglot linguistic scholar for students.
Analyze the English word: "${searchWord.trim()}".
Return a single strictly valid JSON object matching the detailed dictionary structure below.

IMPORTANT REQUIREMENTS:
1. Provide accurate phonetic IPA (e.g. "/ˈkændɪ/") and readable respelling (e.g. "KAN-dee").
2. Provide simple, clear primary definition and a student-friendly explanation.
3. Grammar analysis:
   - partsOfSpeech (e.g. ["Noun", "Verb"])
   - syllables array (e.g. ["dic", "tion", "ar", "y"])
   - stressedSyllableIndex (0-based integer for where the stress falls)
   - pluralForm (if noun), pastTense (if verb), pastParticiple, presentParticiple, comparative/superlative (if adjective)
   - grammaticalCategory (e.g. "Countable Noun", "Transitive Verb")
   - rootAndEtymology (linguistic origin, roots, prefix/suffix)
   - collocations (3-5 common combinations)
4. Picture details:
   - Provide an imagery description suitable for educational visual comprehension.
   - caption: vivid description of what a photo representing this word shows.
   - conceptDescription: concise summary of the visual representation.
   - imageUrl: provide a high quality Unsplash photo URL relevant to this concept (e.g. https://images.unsplash.com/photo-... or https://source.unsplash.com/featured/?${encodeURIComponent(searchWord)})
5. Sentence examples:
   - 3 to 4 varied sentence examples with context ("Elementary", "Everyday", "Academic", "Literature") and explanation.
6. Alternates:
   - synonyms: 3 to 6 synonyms, each with a brief note explaining the subtle shade of meaning/nuance.
   - antonyms: 2 to 5 antonyms (if applicable, else empty array) with nuance.
7. Translations: MUST include exact, authentic translations for ALL 22 Scheduled Indian Languages:
   - assamese
   - bengali
   - bodo
   - dogri
   - gujarati
   - hindi
   - kannada
   - kashmiri
   - konkani
   - maithili
   - malayalam
   - manipuri
   - marathi
   - nepali
   - odia
   - punjabi
   - sanskrit
   - santali
   - sindhi
   - tamil
   - telugu
   - urdu

For each of these 22 languages, provide:
- languageCode (exact lowercase key above)
- languageName (e.g. "Assamese", "Hindi", "Tamil")
- translatedWord (in genuine native script, e.g. বাংলা, देवनागरी, தமிழ்)
- script (e.g. "Devanagari", "Tamil", "Bengali")
- transliteration (Romanized phonetics in English letters so any student can read it aloud)
- definitionInLanguage (short definition or meaning in that target language)
- exampleSentenceInLanguage (a sample sentence in the native script using the translated word)
- exampleSentenceTranslation (English translation of that sentence)

Ensure your response is valid JSON only, without markdown wrappers if possible, or inside \`\`\`json \`\`\`.
Do not omit any of the 22 languages.`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Dictionary lookup endpoint
  app.get("/api/dictionary/:word", async (req, res) => {
    const rawWord = req.params.word;
    if (!rawWord || !rawWord.trim()) {
      return res.status(400).json({ error: "Word parameter is required" });
    }

    const cleanWord = rawWord.trim().toLowerCase();

    // Check pre-curated default entries
    if (defaultCuratedEntries[cleanWord]) {
      return res.json(defaultCuratedEntries[cleanWord]);
    }

    // Check memory cache
    if (dictionaryCache.has(cleanWord)) {
      return res.json(dictionaryCache.get(cleanWord));
    }

    try {
      const ai = getAiClient();
      const prompt = buildGeminiPrompt(cleanWord);

      const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
      let lastError: any = null;
      let responseText = "";

      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: "You are a master lexicographer, grammar expert, and multilingual Indian language translator. Output valid JSON only.",
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          });
          responseText = response.text || "{}";
          if (responseText && responseText.trim().length > 10) {
            break;
          }
        } catch (mErr: any) {
          console.warn(`Model ${modelName} call failed:`, mErr?.message || mErr);
          lastError = mErr;
          // small pause before next attempt
          await new Promise((r) => setTimeout(r, 600));
        }
      }

      if (!responseText || responseText.trim().length <= 10) {
        throw lastError || new Error("No response generated from models");
      }

      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (parseErr) {
        // Attempt cleanup if wrapped in markdown
        const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedData = JSON.parse(cleaned);
      }

      // Ensure word attribute matches
      parsedData.word = parsedData.word || cleanWord;

      // Normalize translations structure (handle array or object keyed by code)
      if (Array.isArray(parsedData.translations)) {
        const transMap: Record<string, any> = {};
        for (const item of parsedData.translations) {
          if (item && item.languageCode) {
            transMap[item.languageCode.toLowerCase()] = item;
          }
        }
        parsedData.translations = transMap;
      } else if (parsedData.translations && typeof parsedData.translations === "object") {
        const normalizedMap: Record<string, any> = {};
        for (const [key, val] of Object.entries(parsedData.translations)) {
          normalizedMap[key.toLowerCase()] = val;
        }
        parsedData.translations = normalizedMap;
      } else {
        parsedData.translations = {};
      }

      // Ensure grammar object structure
      if (!parsedData.grammar) {
        parsedData.grammar = { partsOfSpeech: ["Word"], syllables: [cleanWord], stressedSyllableIndex: 0, grammaticalCategory: "Standard", rootAndEtymology: "", collocations: [] };
      }
      if (typeof parsedData.grammar.partsOfSpeech === "string") {
        parsedData.grammar.partsOfSpeech = [parsedData.grammar.partsOfSpeech];
      }
      if (!Array.isArray(parsedData.grammar.partsOfSpeech)) {
        parsedData.grammar.partsOfSpeech = ["Word"];
      }
      if (!Array.isArray(parsedData.grammar.syllables)) {
        parsedData.grammar.syllables = [cleanWord];
      }
      if (!Array.isArray(parsedData.sentenceExamples)) {
        parsedData.sentenceExamples = [];
      }
      if (!parsedData.alternates) {
        parsedData.alternates = { synonyms: [], antonyms: [] };
      }
      if (!Array.isArray(parsedData.alternates.synonyms)) {
        parsedData.alternates.synonyms = [];
      }
      if (!Array.isArray(parsedData.alternates.antonyms)) {
        parsedData.alternates.antonyms = [];
      }

      // Fallback image handling
      if (!parsedData.picture || !parsedData.picture.imageUrl) {
        parsedData.picture = {
          imageUrl: `https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80`,
          caption: `Visual representation of ${cleanWord}`,
          conceptDescription: `Concept illustrating ${cleanWord}`,
        };
      }

      // Cache the result
      dictionaryCache.set(cleanWord, parsedData);

      return res.json(parsedData);
    } catch (error: any) {
      console.error("Dictionary lookup error for word:", cleanWord, error);
      return res.status(500).json({
        error: "Failed to retrieve dictionary data. Please check your spelling and try again.",
        details: error?.message || "Unknown error",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dictionary server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
