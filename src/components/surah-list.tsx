import { Card, CardContent } from "@/components/ui/card";
import type { Chapter } from "@/types";
import { useNavigate } from "react-router-dom";

type SurahListProps = {
  chapters: Chapter[];
  languageCode: string;
};

export function SurahList({ chapters, languageCode }: SurahListProps) {
  const navigate = useNavigate();

  const handleSurahClick = (chapterId: number) => {
    navigate(`/surah/${chapterId}?lang=${languageCode}`);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {chapters.map((chapter) => (
        <Card
          key={chapter.id}
          className="hover:bg-accent cursor-pointer py-4 transition-colors"
          onClick={() => handleSurahClick(chapter.id)}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold">{chapter.name_simple}</p>
              <p className="text-muted-foreground text-sm">
                {chapter.verses_count} verses
              </p>
            </div>
            <p className="text-2xl">{chapter.name_arabic}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
