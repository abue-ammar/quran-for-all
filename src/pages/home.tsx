import { JuzList } from "@/components/juz-list";
import { LanguageSelector } from "@/components/language-selector";
import { SurahList } from "@/components/surah-list";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChapters, useJuzs } from "@/hooks";
import {
  DEFAULT_LANGUAGE,
  getLanguageByCode,
  getSavedLanguageCode,
  saveLanguageCode,
} from "@/lib/constants";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const langParam = searchParams.get("lang");

  const [activeTab, setActiveTab] = useState("surah");

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

  const {
    data: chapters,
    isLoading: chaptersLoading,
    error: chaptersError,
  } = useChapters(languageCode);

  const { data: juzs, isLoading: juzsLoading, error: juzsError } = useJuzs();

  const handleLanguageChange = (newCode: string) => {
    setLanguageCode(newCode);
    setSearchParams({ lang: newCode });
  };

  const loading = chaptersLoading || juzsLoading;
  const error = chaptersError || juzsError;

  // Get the current language option
  const currentLanguage = getLanguageByCode(languageCode) || DEFAULT_LANGUAGE;

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4">
        {/* Language selector skeleton */}
        <div className="mb-4 flex items-center gap-4 md:justify-end">
          <Skeleton className="h-9 w-full md:w-[220px]" />
        </div>
        {/* Tabs skeleton */}
        <Skeleton className="h-9 w-[120px] rounded-lg" />
        {/* Cards skeleton */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[76px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-4">
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

  return (
    <div className="quran-fade-in mx-auto w-full max-w-4xl">
      <div className="mb-4">
        <LanguageSelector
          value={languageCode}
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
              languageCode={languageCode}
              translationId={currentLanguage.translationId}
            />
          )}
        </TabsContent>

        <TabsContent value="juz" className="mt-4">
          {juzs && chapters && (
            <JuzList
              juzs={juzs}
              chapters={chapters}
              languageCode={languageCode}
              translationId={currentLanguage.translationId}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
