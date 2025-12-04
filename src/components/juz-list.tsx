import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Chapter, Juz } from "@/types";
import { useNavigate } from "react-router-dom";

type JuzListProps = {
  juzs: Juz[];
  chapters: Chapter[];
  languageCode: string;
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
          <Card key={`juz-${juz.juz_number}-${juzIndex}`} className="py-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Juz {juz.juz_number}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {chapIds.map((id) => {
                  const chapter = chapters.find((x) => x.id === id);
                  return (
                    <Button
                      key={`juz-${juz.juz_number}-chapter-${id}`}
                      variant="outline"
                      className="h-auto flex-col items-start py-2"
                      onClick={() => handleChapterClick(id)}
                    >
                      <span className="text-sm font-medium">
                        {chapter?.name_simple}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {chapter?.name_arabic}
                      </span>
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
