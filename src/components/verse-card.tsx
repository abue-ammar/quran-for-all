import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Verse } from "@/types";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef } from "react";

type VerseCardProps = {
  verse: Verse;
  isCurrentVerse: boolean;
  isPlaying: boolean;
  currentWordPosition: number;
  onPlayVerse: (verseKey: string) => void;
  onTogglePause: () => void;
  hasAudio: boolean;
  animationDelay?: number;
};

export function VerseCard({
  verse,
  isCurrentVerse,
  isPlaying,
  currentWordPosition,
  onPlayVerse,
  onTogglePause,
  hasAudio,
  animationDelay = 0,
}: VerseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const lastScrolledRef = useRef<boolean>(false);

  // Auto-scroll to current verse
  useEffect(() => {
    if (isCurrentVerse && !lastScrolledRef.current && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      lastScrolledRef.current = true;
    }
    if (!isCurrentVerse) {
      lastScrolledRef.current = false;
    }
  }, [isCurrentVerse]);

  // Filter words to only include actual words (not end markers)
  const displayWords =
    verse.words?.filter((w) => w.char_type_name !== "end") || [];

  // Get the end marker (verse number in Arabic) from words array
  const endMarker = verse.words?.find((w) => w.char_type_name === "end");

  return (
    <Card
      ref={cardRef}
      className={`quran-card-appear py-0 transition-all duration-300 ${
        isCurrentVerse
          ? "border-primary bg-primary/5 dark:border-primary/50 scale-[1.01]"
          : ""
      }`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-medium">
              {verse.verse_key}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-all duration-200 hover:scale-110"
              onClick={() => {
                if (isCurrentVerse && isPlaying) {
                  onTogglePause();
                } else {
                  onPlayVerse(verse.verse_key);
                }
              }}
              disabled={!hasAudio}
            >
              {isCurrentVerse && isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p
            className="flex-1 text-right text-3xl leading-relaxed md:text-4xl"
            dir="rtl"
            style={{ fontFamily: "var(--font-arabic)" }}
          >
            {displayWords.length > 0 ? (
              <>
                {displayWords.map((word) => (
                  <span
                    key={word.id}
                    className={`transition-all duration-150 ${
                      isCurrentVerse && currentWordPosition === word.position
                        ? "text-violet-600 dark:text-violet-400"
                        : ""
                    }`}
                  >
                    {word.text_indopak}{" "}
                  </span>
                ))}
              </>
            ) : (
              verse.text_indopak
            )}{" "}
            {endMarker && (
              <span className="text-muted-foreground inline-block text-3xl md:text-4xl">
                ۟{endMarker.text_indopak}
              </span>
            )}
          </p>
        </div>
        {verse.translations?.[0]?.text && (
          <p
            className="text-muted-foreground border-t pt-3 text-sm"
            dangerouslySetInnerHTML={{ __html: verse.translations[0].text }}
          />
        )}
      </CardContent>
    </Card>
  );
}
