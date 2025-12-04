import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toArabicNumber } from "@/lib/helpers";
import type { Verse } from "@/types";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef } from "react";

type VerseCardProps = {
  verse: Verse;
  isCurrentVerse: boolean;
  isPlaying: boolean;
  currentWordPosition: number;
  onPlayVerse: (verseKey: string) => void;
  hasAudio: boolean;
};

export function VerseCard({
  verse,
  isCurrentVerse,
  isPlaying,
  currentWordPosition,
  onPlayVerse,
  hasAudio,
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

  return (
    <Card
      ref={cardRef}
      className={`py-4 transition-colors ${
        isCurrentVerse ? "border-primary bg-primary/5" : ""
      }`}
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
              className="h-8 w-8"
              onClick={() => onPlayVerse(verse.verse_key)}
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
            className="flex-1 text-right text-2xl leading-[2.5]"
            dir="rtl"
            style={{ fontFamily: "Traditional Arabic, serif" }}
          >
            {displayWords.length > 0 ? (
              <>
                {displayWords.map((word) => (
                  <span
                    key={word.id}
                    className={`transition-all duration-150 ${
                      isCurrentVerse && currentWordPosition === word.position
                        ? "bg-primary text-primary-foreground rounded px-1"
                        : ""
                    }`}
                  >
                    {word.text_uthmani}{" "}
                  </span>
                ))}
              </>
            ) : (
              verse.text_uthmani
            )}{" "}
            <span className="text-muted-foreground inline-block text-xl">
              ﴿{toArabicNumber(verse.verse_number)}﴾
            </span>
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
