import { JuzList } from "@/components/juz-list";
import { LanguageSelector } from "@/components/language-selector";
import { SurahList } from "@/components/surah-list";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChapters, useJuzs } from "@/hooks";
import { DEFAULT_LANGUAGE, getLanguageByCode } from "@/lib/constants";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const langCode = searchParams.get("lang") || DEFAULT_LANGUAGE.code;

  const [activeTab, setActiveTab] = useState("surah");

  const {
    data: chapters,
    isLoading: chaptersLoading,
    error: chaptersError,
  } = useChapters();

  const { data: juzs, isLoading: juzsLoading, error: juzsError } = useJuzs();

  const handleLanguageChange = (code: string) => {
    setSearchParams({ lang: code });
  };

  const loading = chaptersLoading || juzsLoading;
  const error = chaptersError || juzsError;

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-4">
            <p className="text-destructive">
              Failed to load Quran data. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentLanguage = getLanguageByCode(langCode) || DEFAULT_LANGUAGE;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4">
        <LanguageSelector
          value={currentLanguage.code}
          onChange={handleLanguageChange}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="surah">Surah</TabsTrigger>
          <TabsTrigger value="juz">Juz</TabsTrigger>
        </TabsList>

        <TabsContent value="surah" className="mt-4">
          {chapters && (
            <SurahList
              chapters={chapters}
              languageCode={currentLanguage.code}
            />
          )}
        </TabsContent>

        <TabsContent value="juz" className="mt-4">
          {juzs && chapters && (
            <JuzList
              juzs={juzs}
              chapters={chapters}
              languageCode={currentLanguage.code}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
