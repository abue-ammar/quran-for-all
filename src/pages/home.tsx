import { JuzList } from "@/components/juz-list";
import { LanguageSelector } from "@/components/language-selector";
import { SurahList } from "@/components/surah-list";
import { SurahSearch } from "@/components/surah-search";
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
import type { Chapter } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const langParam = searchParams.get("lang");

  const [activeTab, setActiveTab] = useState("surah");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter chapters based on search query
  const filteredChapters = useMemo(() => {
    if (!chapters || !searchQuery.trim()) {
      return chapters;
    }

    const query = searchQuery.toLowerCase().trim();

    return chapters.filter((chapter: Chapter) => {
      const nameSimple = chapter.name_simple?.toLowerCase() || "";
      const nameArabic = chapter.name_arabic || "";
      const translatedName = chapter.translated_name?.name?.toLowerCase() || "";

      return (
        nameSimple.includes(query) ||
        nameArabic.includes(query) ||
        translatedName.includes(query)
      );
    });
  }, [chapters, searchQuery]);

  const loading = chaptersLoading || juzsLoading;
  const error = chaptersError || juzsError;

  // Get the current language option
  const currentLanguage = getLanguageByCode(languageCode) || DEFAULT_LANGUAGE;

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4">
        {/* Search and language selector skeleton */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Skeleton className="h-9 w-full sm:flex-[3]" />
          <Skeleton className="h-9 w-full sm:flex-1" />
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
      {/* Search bar (3/4) and Language selector (1/4) */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="sm:flex-[3]">
          <SurahSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search surah by name..."
          />
        </div>
        <div className="sm:flex-1">
          <LanguageSelector
            value={languageCode}
            onChange={handleLanguageChange}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="surah">Surah</TabsTrigger>
          <TabsTrigger value="juz">Juz</TabsTrigger>
        </TabsList>

        <TabsContent value="surah" className="mt-4">
          {filteredChapters && filteredChapters.length > 0 ? (
            <SurahList
              chapters={filteredChapters}
              languageCode={languageCode}
              translationId={currentLanguage.translationId}
            />
          ) : searchQuery ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No surahs found for "{searchQuery}"
                </p>
              </CardContent>
            </Card>
          ) : null}
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
