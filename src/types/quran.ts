// Chapter/Surah types
export type Chapter = {
  id: number;
  name_simple: string;
  name_arabic: string;
  name_complex: string;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  verses_count: number;
  pages: number[];
  translated_name?: {
    language_name: string;
    name: string;
  };
};

// Juz types
export type Juz = {
  id: number;
  juz_number: number;
  verse_mapping: Record<string, string>;
  first_verse_id: number;
  last_verse_id: number;
  verses_count: number;
};

export type Translation = {
  id: number;
  text: string;
  resource_id: number;
  resource_name?: string;
};

// Word types
export type Word = {
  id: number;
  position: number;
  text_uthmani: string;
  text_imlaei?: string;
  text_indopak?: string;
  char_type_name: "word" | "end" | "pause";
  audio_url?: string;
  location?: string;
  translation?: {
    text: string;
    language_name: string;
  };
  transliteration?: {
    text: string;
    language_name: string;
  };
};

// Verse types
export type Verse = {
  id: number;
  verse_key: string;
  verse_number: number;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: number | null;
  page_number: number;
  juz_number: number;
  text_uthmani: string;
  text_imlaei?: string;
  words?: Word[];
  translations?: Translation[];
};

// Audio types
export type WordSegment = [number, number, number]; // [wordPosition, startMs, endMs]

export type VerseTiming = {
  verse_key: string;
  timestamp_from: number;
  timestamp_to: number;
  duration: number;
  segments: WordSegment[];
};

export type ChapterAudio = {
  audio_url: string;
  duration: number;
  verse_timings: VerseTiming[];
};

export type AudioFile = {
  id: number;
  chapter_id: number;
  file_size: number;
  format: string;
  audio_url: string;
  duration: number;
  verse_timings: VerseTiming[];
};

// API Response types
export type ChaptersResponse = {
  chapters: Chapter[];
};

export type JuzsResponse = {
  juzs: Juz[];
};

export type VersesResponse = {
  verses: Verse[];
  pagination: {
    per_page: number;
    current_page: number;
    next_page: number | null;
    total_pages: number;
    total_records: number;
  };
};

export type ChapterResponse = {
  chapter: Chapter;
};

export type AudioFilesResponse = {
  audio_files: AudioFile[];
};
