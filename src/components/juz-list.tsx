import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Chapter, Juz } from "@/types";
import { useNavigate } from "react-router-dom";

type JuzListProps = {
  juzs: Juz[];
  chapters: Chapter[];
  languageCode: string;
  translationId: number;
};

function getChapterIdsForJuz(juz: Juz): number[] {
  const mapping = juz.verse_mapping || {};
  const ids = new Set<number>();
  Object.keys(mapping).forEach((k) => {
    const chap = parseInt(k.split(":")[0], 10);
    if (!Number.isNaN(chap)) ids.add(chap);
  });
  return Array.from(ids).sort((a, b) => a - b);
}

export function JuzList({ juzs, chapters, languageCode }: JuzListProps) {
  const navigate = useNavigate();

  const handleChapterClick = (chapterId: number) => {
    navigate(`/surah/${chapterId}?lang=${languageCode}`);
  };

  return (
    <div className="space-y-4">
      {juzs.map((juz, juzIndex) => {
        const chapIds = getChapterIdsForJuz(juz);
        return (
          <Card
            key={`juz-${juz.juz_number}-${juzIndex}`}
            className="quran-card-appear gap-0 p-4"
            style={{ animationDelay: `${Math.min(juzIndex * 30, 300)}ms` }}
          >
            <CardHeader className="p-0">
              <CardTitle className="text-base">Juz {juz.juz_number}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {chapIds.map((id) => {
                  const chapter = chapters.find((x) => x.id === id);
                  return (
                    <Button
                      key={`juz-${juz.juz_number}-chapter-${id}`}
                      variant="outline"
                      className="h-auto w-full justify-between gap-2 px-3 py-2 transition-all duration-200 hover:scale-[1.02]"
                      onClick={() => handleChapterClick(id)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">
                          {chapter?.name_simple}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {chapter?.translated_name?.name ||
                            chapter?.name_arabic}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className="text-base"
                          style={{ fontFamily: "var(--font-arabic)" }}
                        >
                          {chapter?.name_arabic}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {chapter?.verses_count} Ayahs
                        </span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
