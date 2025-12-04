import {
  fetchChapter,
  fetchChapterAudio,
  fetchChapters,
  fetchJuzs,
  fetchVersesByChapter,
  queryKeys,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch all chapters
 * @param language - Language code for translated names (e.g., 'en', 'ur', 'ar')
 */
export function useChapters(language?: string) {
  return useQuery({
    queryKey: queryKeys.chapters(language),
    queryFn: () => fetchChapters(language),
    staleTime: 1000 * 60 * 60, // 1 hour - chapters data rarely changes
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    select: (data) => data.chapters,
  });
}

/**
 * Hook to fetch a single chapter
 * @param chapterId - Chapter ID (1-114)
 * @param language - Language code for translated names (e.g., 'en', 'ur', 'ar')
 */
export function useChapter(chapterId: number, language?: string) {
  return useQuery({
    queryKey: queryKeys.chapter(chapterId, language),
    queryFn: () => fetchChapter(chapterId, language),
    enabled: chapterId > 0 && chapterId <= 114,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    select: (data) => data.chapter,
  });
}

/**
 * Hook to fetch all juzs
 */
export function useJuzs() {
  return useQuery({
    queryKey: queryKeys.juzs,
    queryFn: fetchJuzs,
    staleTime: 1000 * 60 * 60, // 1 hour - juzs data rarely changes
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    select: (data) => data.juzs,
  });
}

/**
 * Hook to fetch verses for a chapter
 */
export function useVerses(chapterId: number, translationId: number) {
  return useQuery({
    queryKey: queryKeys.verses(chapterId, translationId),
    queryFn: () => fetchVersesByChapter(chapterId, translationId),
    enabled: chapterId > 0 && chapterId <= 114,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    select: (data) => data.verses,
  });
}

/**
 * Hook to fetch audio for a chapter
 */
export function useChapterAudio(chapterId: number, reciterId?: number) {
  return useQuery({
    queryKey: queryKeys.chapterAudio(chapterId, reciterId),
    queryFn: () => fetchChapterAudio(chapterId, reciterId),
    enabled: chapterId > 0 && chapterId <= 114,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    select: (data) => {
      const audioFile = data.audio_files?.[0];
      if (!audioFile) return null;
      return {
        audio_url: audioFile.audio_url,
        duration: audioFile.duration,
        verse_timings: audioFile.verse_timings || [],
      };
    },
  });
}
