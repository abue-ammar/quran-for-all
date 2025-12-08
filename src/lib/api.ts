import type {
  AudioFilesResponse,
  ChapterResponse,
  ChaptersResponse,
  JuzsResponse,
  VersesResponse,
} from "@/types";

// API Base URLs
const QURAN_API_BASE = "https://api.quran.com/api/v4";
const AUDIO_CDN_BASE = "https://api.qurancdn.com/api/qdc/audio/reciters";

// Default reciter ID (Mishary Rashid Alafasy)
const DEFAULT_RECITER_ID = 7;

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all chapters (surahs)
 * @param language - Language code for translated names (e.g., 'en', 'ur', 'ar')
 */
export async function fetchChapters(
  language?: string
): Promise<ChaptersResponse> {
  const url = new URL(`${QURAN_API_BASE}/chapters`);
  if (language) {
    url.searchParams.set("language", language);
  }
  return fetchApi<ChaptersResponse>(url.toString());
}

/**
 * Fetch a single chapter by ID
 * @param chapterId - Chapter ID (1-114)
 * @param language - Language code for translated names (e.g., 'en', 'ur', 'ar')
 */
export async function fetchChapter(
  chapterId: number,
  language?: string
): Promise<ChapterResponse> {
  const url = new URL(`${QURAN_API_BASE}/chapters/${chapterId}`);
  if (language) {
    url.searchParams.set("language", language);
  }
  return fetchApi<ChapterResponse>(url.toString());
}

/**
 * Fetch all juzs
 */
export async function fetchJuzs(): Promise<JuzsResponse> {
  return fetchApi<JuzsResponse>(`${QURAN_API_BASE}/juzs`);
}

/**
 * Fetch verses for a chapter with optional translation
 */
export async function fetchVersesByChapter(
  chapterId: number,
  translationId: number,
  page: number = 1,
  perPage: number = 300
): Promise<VersesResponse> {
  const url = new URL(`${QURAN_API_BASE}/verses/by_chapter/${chapterId}`);
  url.searchParams.set("translations", translationId.toString());
  url.searchParams.set("per_page", perPage.toString());
  url.searchParams.set("page", page.toString());
  url.searchParams.set("fields", "text_indopak,verse_key");
  url.searchParams.set("words", "true");
  url.searchParams.set("word_fields", "text_indopak,char_type_name");

  return fetchApi<VersesResponse>(url.toString());
}

/**
 * Fetch audio files for a chapter with verse timings
 */
export async function fetchChapterAudio(
  chapterId: number,
  reciterId: number = DEFAULT_RECITER_ID
): Promise<AudioFilesResponse> {
  const url = `${AUDIO_CDN_BASE}/${reciterId}/audio_files?chapter=${chapterId}&segments=true`;
  return fetchApi<AudioFilesResponse>(url);
}

/**
 * Query keys for React Query
 */
export const queryKeys = {
  chapters: (language?: string) => ["chapters", language] as const,
  chapter: (id: number, language?: string) =>
    ["chapter", id, language] as const,
  juzs: ["juzs"] as const,
  verses: (chapterId: number, translationId: number) =>
    ["verses", chapterId, translationId] as const,
  chapterAudio: (chapterId: number, reciterId?: number) =>
    ["chapterAudio", chapterId, reciterId ?? DEFAULT_RECITER_ID] as const,
};
