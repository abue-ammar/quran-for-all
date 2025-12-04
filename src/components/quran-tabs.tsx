import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { ArrowLeft, Pause, Play, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Chapter = {
  id: number;
  name_simple: string;
  name_arabic: string;
  english_name?: string;
  verses_count: number;
};

type Juz = {
  juz_number: number;
  verse_mapping?: Record<string, string>;
};

type Language = {
  id: number;
  name: string;
  code: string;
};

type Verse = {
  id: number;
  verse_key: string;
  verse_number: number;
  text_uthmani: string;
  translations?: { text: string }[];
  audio?: { url: string };
};

const LANGUAGES: Language[] = [
  { id: 22, name: "English – Saheeh Intl", code: "en" },
  { id: 131, name: "Urdu – Jalandhry", code: "ur" },
  { id: 20, name: "Indonesian", code: "id" },
  { id: 59, name: "French", code: "fr" },
  { id: 17, name: "Turkish", code: "tr" },
  { id: 161, name: "Bengali – Muhiuddin Khan", code: "bn" },
  { id: 31, name: "German", code: "de" },
  { id: 83, name: "Spanish", code: "es" },
  { id: 79, name: "Hindi", code: "hi" },
];

const AUDIO_BASE_URL = "https://verses.quran.com/";

export default function QuranTabs() {
  const [language, setLanguage] = useState<Language>(LANGUAGES[0]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [juzs, setJuzs] = useState<Juz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [chaptersRes, juzsRes] = await Promise.all([
          axios.get("https://api.quran.com/api/v4/chapters"),
          axios.get("https://api.quran.com/api/v4/juzs"),
        ]);
        setChapters(chaptersRes.data.chapters);
        setJuzs(juzsRes.data.juzs);
        setError(null);
      } catch {
        setError("Failed to load Quran data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function getChapterIdsForJuz(j: Juz) {
    const mapping = j.verse_mapping || {};
    const ids = new Set<number>();
    Object.keys(mapping).forEach((k) => {
      const chap = parseInt(k.split(":")[0], 10);
      if (!Number.isNaN(chap)) ids.add(chap);
    });
    return Array.from(ids).sort((a, b) => a - b);
  }

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
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedSurah) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Button
          variant="outline"
          onClick={() => setSelectedSurah(null)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <SurahViewer chapterId={selectedSurah} language={language} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-muted-foreground text-sm font-medium">
          Language:
        </span>
        <Select
          value={language.code}
          onValueChange={(code) => {
            const lang = LANGUAGES.find((l) => l.code === code);
            if (lang) setLanguage(lang);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="surah" className="w-full">
        <TabsList>
          <TabsTrigger value="surah">Surah</TabsTrigger>
          <TabsTrigger value="juz">Juz</TabsTrigger>
        </TabsList>

        <TabsContent value="surah" className="mt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {chapters.map((c) => (
              <Card
                key={c.id}
                className="hover:bg-accent cursor-pointer py-4 transition-colors"
                onClick={() => setSelectedSurah(c.id)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold">{c.name_simple}</p>
                    <p className="text-muted-foreground text-sm">
                      {c.verses_count} verses
                    </p>
                  </div>
                  <p className="text-2xl">{c.name_arabic}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="juz" className="mt-4">
          <div className="space-y-4">
            {juzs.map((j) => {
              const chapIds = getChapterIdsForJuz(j);
              return (
                <Card key={j.juz_number} className="py-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Juz {j.juz_number}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {chapIds.map((id) => {
                        const c = chapters.find((x) => x.id === id);
                        return (
                          <Button
                            key={id}
                            variant="outline"
                            className="h-auto flex-col items-start py-2"
                            onClick={() => setSelectedSurah(id)}
                          >
                            <span className="text-sm font-medium">
                              {c?.name_simple}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {c?.name_arabic}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SurahViewer({
  chapterId,
  language,
}: {
  chapterId: number;
  language: Language;
}) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [chapterInfo, setChapterInfo] = useState<Chapter | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentPlayingVerse, setCurrentPlayingVerse] = useState<number | null>(
    null
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingAllRef = useRef(false);
  const versesRef = useRef<Verse[]>([]);

  // Keep refs in sync with state
  useEffect(() => {
    isPlayingAllRef.current = isPlayingAll;
  }, [isPlayingAll]);

  useEffect(() => {
    versesRef.current = verses;
  }, [verses]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [versesRes, chapterRes] = await Promise.all([
          axios.get(
            `https://api.quran.com/api/v4/verses/by_chapter/${chapterId}`,
            {
              params: {
                translations: language.id,
                per_page: 300,
                fields: "text_uthmani,verse_key",
              },
            }
          ),
          axios.get(`https://api.quran.com/api/v4/chapters/${chapterId}`),
        ]);

        // Fetch audio data separately
        const audioRes = await axios.get(
          `https://api.quran.com/api/v4/recitations/7/by_chapter/${chapterId}`
        );

        const versesData = versesRes.data.verses;
        const audioFiles = audioRes.data.audio_files;

        // Merge audio URLs into verses
        const versesWithAudio = versesData.map((v: any, index: number) => ({
          ...v,
          audio: {
            url: audioFiles[index]?.url
              ? AUDIO_BASE_URL + audioFiles[index].url
              : null,
          },
        }));

        setVerses(versesWithAudio);
        setChapterInfo(chapterRes.data.chapter);
      } catch (err) {
        console.error("Failed to load surah", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [chapterId, language.id]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playVerseAtIndex = useCallback((verseIndex: number) => {
    const currentVerses = versesRef.current;
    const verse = currentVerses[verseIndex];
    if (!verse?.audio?.url) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(verse.audio.url);
    audioRef.current = audio;
    setCurrentPlayingVerse(verse.verse_number);

    audio.play();

    audio.onended = () => {
      // Use ref to check current state
      if (isPlayingAllRef.current && verseIndex < currentVerses.length - 1) {
        // Continue to next verse
        playVerseAtIndex(verseIndex + 1);
      } else {
        setCurrentPlayingVerse(null);
        setIsPlayingAll(false);
      }
    };

    audio.onerror = () => {
      console.error("Audio error for verse", verseIndex);
      // Try to continue to next verse if playing all
      if (isPlayingAllRef.current && verseIndex < currentVerses.length - 1) {
        playVerseAtIndex(verseIndex + 1);
      } else {
        setCurrentPlayingVerse(null);
        setIsPlayingAll(false);
      }
    };
  }, []);

  const playSingleVerse = (verseNumber: number) => {
    // Stop continuous playback mode
    isPlayingAllRef.current = false;
    setIsPlayingAll(false);

    const verseIndex = verses.findIndex((v) => v.verse_number === verseNumber);
    if (verseIndex !== -1) {
      playVerseAtIndex(verseIndex);
    }
  };

  const playAllVerses = () => {
    if (isPlayingAll) {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      isPlayingAllRef.current = false;
      setIsPlayingAll(false);
      setCurrentPlayingVerse(null);
    } else {
      // Start playing from beginning
      isPlayingAllRef.current = true;
      setIsPlayingAll(true);
      playVerseAtIndex(0);
    }
  };

  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    isPlayingAllRef.current = false;
    setIsPlayingAll(false);
    setCurrentPlayingVerse(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chapterInfo && (
        <div className="mb-6 text-center">
          <h1
            className="font-arabic mb-4 text-4xl leading-relaxed font-bold"
            dir="rtl"
          >
            سُورَةُ {chapterInfo.name_arabic}
          </h1>
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={playAllVerses}
              className="gap-2"
            >
              {isPlayingAll ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause Surah
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Play Surah
                </>
              )}
            </Button>
            {(isPlayingAll || currentPlayingVerse) && (
              <Button variant="outline" size="sm" onClick={stopPlaying}>
                <Square className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {verses.map((v) => (
        <Card
          key={v.id}
          className={`py-4 transition-colors ${
            currentPlayingVerse === v.verse_number
              ? "border-primary bg-primary/5"
              : ""
          }`}
        >
          <CardContent className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm font-medium">
                  {v.verse_key}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => playSingleVerse(v.verse_number)}
                  disabled={!v.audio?.url}
                >
                  {currentPlayingVerse === v.verse_number ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p
                className="font-arabic flex-1 text-right text-2xl leading-[2.5]"
                dir="rtl"
              >
                {v.text_uthmani}{" "}
                <span className="text-muted-foreground inline-block text-xl">
                  ﴿{toArabicNumber(v.verse_number)}﴾
                </span>
              </p>
            </div>
            {v.translations?.[0]?.text && (
              <p
                className="text-muted-foreground border-t pt-3 text-sm"
                dangerouslySetInnerHTML={{ __html: v.translations[0].text }}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Convert number to Arabic numerals
function toArabicNumber(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((d) => arabicNumerals[parseInt(d)])
    .join("");
}
