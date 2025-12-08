// Storage keys
export const STORAGE_KEYS = {
  SELECTED_LANGUAGE: "quran-selected-language",
} as const;

// Language with best translator - manually curated for quality
export type LanguageOption = {
  code: string;
  name: string;
  nativeName: string;
  translationId: number;
  translatorName: string;
};

// Best translations for each major language (curated for accuracy and readability)
export const LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    translationId: 20,
    translatorName: "Saheeh International",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    translationId: 161,
    translatorName: "Muhiuddin Khan",
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    translationId: 97,
    translatorName: "Fateh Muhammad Jalandhry",
  },

  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    translationId: 77,
    translatorName: "Diyanet Isleri",
  },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    translationId: 33,
    translatorName: "Indonesian Ministry",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    translationId: 31,
    translatorName: "Muhammad Hamidullah",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    translationId: 27,
    translatorName: "Bubenheim & Elyas",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    translationId: 83,
    translatorName: "Isa Garcia",
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    translationId: 45,
    translatorName: "Elmir Kuliev",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    translationId: 122,
    translatorName: "Suhel Farooq Khan",
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    translationId: 37,
    translatorName: "Cheriyamundam Abdul Hameed",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    translationId: 133,
    translatorName: "Jan Turst Foundation",
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    translationId: 43,
    translatorName: "Samir El-Hayek",
  },
  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    translationId: 144,
    translatorName: "Sofian S. Siregar",
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    translationId: 153,
    translatorName: "Hamza Piccardo",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    translationId: 35,
    translatorName: "Ryoichi Mita",
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    translationId: 36,
    translatorName: "Unknown",
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    translationId: 56,
    translatorName: "Ma Jian",
  },
  {
    code: "fa",
    name: "Persian",
    nativeName: "فارسی",
    translationId: 29,
    translatorName: "Hussain Ansarian",
  },
  {
    code: "ms",
    name: "Malay",
    nativeName: "Bahasa Melayu",
    translationId: 39,
    translatorName: "Abdullah Basmeih",
  },
  {
    code: "th",
    name: "Thai",
    nativeName: "ไทย",
    translationId: 151,
    translatorName: "King Fahad Quran Complex",
  },
  {
    code: "sw",
    name: "Swahili",
    nativeName: "Kiswahili",
    translationId: 176,
    translatorName: "Ali Muhsin Al-Barwani",
  },
  {
    code: "so",
    name: "Somali",
    nativeName: "Soomaali",
    translationId: 46,
    translatorName: "Mahmud Muhammad Abduh",
  },
  {
    code: "ha",
    name: "Hausa",
    nativeName: "Hausa",
    translationId: 32,
    translatorName: "Abubakar Mahmud Gumi",
  },
  {
    code: "am",
    name: "Amharic",
    nativeName: "አማርኛ",
    translationId: 87,
    translatorName: "Sadiq & Sani",
  },
];

// Default language
export const DEFAULT_LANGUAGE = LANGUAGES[0];

// Get language by code
export function getLanguageByCode(code: string): LanguageOption | undefined {
  return LANGUAGES.find((l) => l.code === code);
}

// Get saved language code from localStorage
export function getSavedLanguageCode(): string {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE.code;

  const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_LANGUAGE);
  if (saved && getLanguageByCode(saved)) {
    return saved;
  }
  return DEFAULT_LANGUAGE.code;
}

// Save language code to localStorage
export function saveLanguageCode(code: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGE, code);
}
