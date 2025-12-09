import { LanguageSelector } from "@/components/language-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VerseCard } from "@/components/verse-card";
import {
  useAudioPlayer,
  useChapter,
  useChapterAudio,
  useVerses,
} from "@/hooks";
import {
  DEFAULT_LANGUAGE,
  getLanguageByCode,
  getSavedLanguageCode,
  saveLanguageCode,
} from "@/lib/constants";
import { ArrowLeft, Pause, Play, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export function SurahPage() {
  const navigate = useNavigate();
  const { surahId } = useParams<{ surahId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const chapterId = parseInt(surahId || "1", 10);
  const langParam = searchParams.get("lang");

  // Scroll to top when navigating to this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [surahId]);

  // Get language code from URL or localStorage
  const [languageCode, setLanguageCode] = useState<string>(() => {
    if (langParam && getLanguageByCode(langParam)) {
      return langParam;
    }
    return getSavedLanguageCode();
  });

  // Sync language to localStorage
  useEffect(() => {
    saveLanguageCode(languageCode);
  }, [languageCode]);

  // Get the current language option
  const currentLanguage = getLanguageByCode(languageCode) || DEFAULT_LANGUAGE;

  const {
    data: chapter,
    isLoading: chapterLoading,
    error: chapterError,
  } = useChapter(chapterId, languageCode);

  const {
    data: verses,
    isLoading: versesLoading,
    error: versesError,
  } = useVerses(chapterId, currentLanguage.translationId);

  const { data: chapterAudio, isLoading: audioLoading } =
    useChapterAudio(chapterId);

  const [audioState, audioActions] = useAudioPlayer(chapterAudio);
  const { isPlaying, currentPlayingVerse, currentWordPosition } = audioState;
  const { togglePlayPause, playFromVerse, stop } = audioActions;

  const handleBack = () => {
    navigate(`/?lang=${languageCode}`);
  };

  const handleLanguageChange = (newCode: string) => {
    setLanguageCode(newCode);
    setSearchParams({ lang: newCode });
  };

  const loading = chapterLoading || versesLoading;
  const error = chapterError || versesError;

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4">
        {/* Language selector skeleton */}
        <div className="mb-4 flex items-center gap-4 md:justify-end">
          <Skeleton className="h-9 w-full md:w-[220px]" />
        </div>
        {/* Surah title skeleton */}
        <div className="mb-4 space-y-2 text-center">
          <Skeleton className="mx-auto h-16 w-64" />
          <Skeleton className="mx-auto h-6 w-48" />
        </div>
        {/* Action buttons skeleton */}
        <div className="mb-6 flex items-center justify-between gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-28" />
        </div>
        {/* Verse cards skeleton */}
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[140px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-4">
            <p className="text-destructive">
              Failed to load surah. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="quran-fade-in mx-auto w-full max-w-4xl">
      <div className="mb-4 flex items-center gap-4 md:justify-end">
        <LanguageSelector
          value={languageCode}
          onChange={handleLanguageChange}
        />
      </div>

      <div className="mb-4 text-center">
        <h1
          className="text-5xl leading-relaxed font-bold"
          dir="rtl"
          style={{ fontFamily: "var(--font-arabic)" }}
        >
          سُورَةُ {chapter.name_arabic}
        </h1>
        <p className="text-muted-foreground mb-6 text-lg">
          {chapter.name_simple}
          {chapter.translated_name?.name &&
            chapter.translated_name.name !== chapter.name_simple &&
            ` - ${chapter.translated_name.name}`}
        </p>
        <div className="flex items-center justify-between gap-2">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayPause}
              className="gap-2 transition-all duration-200 hover:scale-105"
              disabled={audioLoading || !chapterAudio}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause Surah
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Play Surah
                </>
              )}
            </Button>
            {(isPlaying || currentPlayingVerse) && (
              <Button
                variant="outline"
                size="sm"
                onClick={stop}
                className="transition-all duration-200 hover:scale-105"
              >
                <Square className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {verses?.map((verse, index) => (
          <VerseCard
            key={verse.id}
            verse={verse}
            isCurrentVerse={currentPlayingVerse === verse.verse_key}
            isPlaying={isPlaying}
            currentWordPosition={currentWordPosition}
            onPlayVerse={playFromVerse}
            onTogglePause={togglePlayPause}
            hasAudio={!!chapterAudio}
            animationDelay={Math.min(index * 30, 300)}
          />
        ))}
      </div>
    </div>
  );
}
