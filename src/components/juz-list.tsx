import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Chapter, Juz } from "@/types";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

type JuzListProps = {
  juzs: Juz[];
  chapters: Chapter[];
  languageCode: string;
  translationId: number;
  searchQuery?: string;
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

function matchesSearch(chapter: Chapter, query: string): boolean {
  if (!query.trim()) return true;

  const q = query.toLowerCase().trim();
  const nameSimple = chapter.name_simple?.toLowerCase() || "";
  const nameArabic = chapter.name_arabic || "";
  const translatedName = chapter.translated_name?.name?.toLowerCase() || "";

  return (
    nameSimple.includes(q) ||
    nameArabic.includes(q) ||
    translatedName.includes(q)
  );
}

export function JuzList({
  juzs,
  chapters,
  languageCode,
  searchQuery = "",
}: JuzListProps) {
  const navigate = useNavigate();

  const handleChapterClick = (chapterId: number) => {
    navigate(`/surah/${chapterId}?lang=${languageCode}`);
  };

  // Filter juzs to only show those with matching chapters
  const filteredJuzs = useMemo(() => {
    if (!searchQuery.trim()) {
      return juzs.map((juz) => ({
        juz,
        filteredChapIds: getChapterIdsForJuz(juz),
      }));
    }

    return juzs
      .map((juz) => {
        const chapIds = getChapterIdsForJuz(juz);
        const filteredChapIds = chapIds.filter((id) => {
          const chapter = chapters.find((x) => x.id === id);
          return chapter && matchesSearch(chapter, searchQuery);
        });
        return { juz, filteredChapIds };
      })
      .filter(({ filteredChapIds }) => filteredChapIds.length > 0);
  }, [juzs, chapters, searchQuery]);

  if (filteredJuzs.length === 0 && searchQuery) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            No surahs found for "{searchQuery}"
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate total matching surahs across all filtered Juzs
  const uniqueMatchingSurahs = new Set<number>();
  filteredJuzs.forEach(({ filteredChapIds }) => {
    filteredChapIds.forEach((id) => uniqueMatchingSurahs.add(id));
  });
  const totalMatching = uniqueMatchingSurahs.size;

  return (
    <div className="space-y-4">
      {searchQuery && (
        <p className="text-muted-foreground text-sm">
          Found {totalMatching} surah{totalMatching !== 1 ? "s" : ""} matching "
          {searchQuery}"
        </p>
      )}
      {filteredJuzs.map(({ juz, filteredChapIds }, juzIndex) => {
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {filteredChapIds.map((id) => {
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
