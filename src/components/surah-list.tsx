import { Card, CardContent } from "@/components/ui/card";
import type { Chapter } from "@/types";
import { useNavigate } from "react-router-dom";

type SurahListProps = {
  chapters: Chapter[];
  languageCode: string;
  translationId: number;
};

export function SurahList({ chapters, languageCode }: SurahListProps) {
  const navigate = useNavigate();

  const handleSurahClick = (chapterId: number) => {
    navigate(`/surah/${chapterId}?lang=${languageCode}`);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {chapters.map((chapter, index) => (
        <Card
          key={chapter.id}
          className="quran-card-appear hover:bg-accent cursor-pointer p-0 transition-all duration-200 hover:scale-[1.02]"
          style={{ animationDelay: `${Math.min(index * 20, 200)}ms` }}
          onClick={() => handleSurahClick(chapter.id)}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold">{chapter.name_simple}</p>
              <p className="text-muted-foreground text-xs">
                {chapter.translated_name?.name || chapter.name_simple}
              </p>
              <p className="text-muted-foreground text-xs">
                {chapter.verses_count} Ayahs
              </p>
            </div>
            <p className="text-2xl">{chapter.name_arabic}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
