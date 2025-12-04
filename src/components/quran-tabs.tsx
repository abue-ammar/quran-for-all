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

type Word = {
  id: number;
  position: number;
  text_uthmani: string;
  char_type_name?: string;
  audio_url?: string;
  location?: string;
};

type WordSegment = [number, number, number]; // [wordPosition, startMs, endMs]

type VerseTiming = {
  verse_key: string;
  timestamp_from: number;
  timestamp_to: number;
  duration: number;
  segments: WordSegment[];
};

type ChapterAudio = {
  audio_url: string;
  duration: number;
  verse_timings: VerseTiming[];
};

type Verse = {
  id: number;
  verse_key: string;
  verse_number: number;
  text_uthmani: string;
  words?: Word[];
  translations?: { text: string }[];
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

const AUDIO_CDN_BASE = "https://api.qurancdn.com/api/qdc/audio/reciters";

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
          fetch("https://api.quran.com/api/v4/chapters"),
          fetch("https://api.quran.com/api/v4/juzs"),
        ]);
        const chaptersData = await chaptersRes.json();
        const juzsData = await juzsRes.json();
        setChapters(chaptersData.chapters);
        setJuzs(juzsData.juzs);
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
      <div className="mx-auto max-w-4xl">
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
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex items-center gap-3">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
  const [chapterAudio, setChapterAudio] = useState<ChapterAudio | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingVerse, setCurrentPlayingVerse] = useState<string | null>(
    null
  );
  const [currentWordPosition, setCurrentWordPosition] = useState<number>(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const verseRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const lastScrolledVerseRef = useRef<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const versesUrl = new URL(
          `https://api.quran.com/api/v4/verses/by_chapter/${chapterId}`
        );
        versesUrl.searchParams.set("translations", language.id.toString());
        versesUrl.searchParams.set("per_page", "300");
        versesUrl.searchParams.set("fields", "text_uthmani,verse_key");
        versesUrl.searchParams.set("words", "true");
        versesUrl.searchParams.set(
          "word_fields",
          "text_uthmani,char_type_name"
        );

        const [versesRes, chapterRes, audioRes] = await Promise.all([
          fetch(versesUrl.toString()),
          fetch(`https://api.quran.com/api/v4/chapters/${chapterId}`),
          fetch(
            `${AUDIO_CDN_BASE}/7/audio_files?chapter=${chapterId}&segments=true`
          ),
        ]);

        const versesData = await versesRes.json();
        const chapterData = await chapterRes.json();
        const audioData = await audioRes.json();

        setVerses(versesData.verses);
        setChapterInfo(chapterData.chapter);

        if (audioData.audio_files?.[0]) {
          setChapterAudio({
            audio_url: audioData.audio_files[0].audio_url,
            duration: audioData.audio_files[0].duration,
            verse_timings: audioData.audio_files[0].verse_timings || [],
          });
        }
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Auto-scroll to current verse
  useEffect(() => {
    if (
      currentPlayingVerse &&
      currentPlayingVerse !== lastScrolledVerseRef.current
    ) {
      const verseElement = verseRefs.current.get(currentPlayingVerse);
      if (verseElement) {
        verseElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        lastScrolledVerseRef.current = currentPlayingVerse;
      }
    }
    if (!currentPlayingVerse) {
      lastScrolledVerseRef.current = null;
    }
  }, [currentPlayingVerse]);

  const updateHighlight = useCallback(() => {
    if (!audioRef.current || !chapterAudio) return;

    const currentTimeMs = audioRef.current.currentTime * 1000;

    // Find current verse based on timestamp
    const currentTiming = chapterAudio.verse_timings.find(
      (timing) =>
        currentTimeMs >= timing.timestamp_from &&
        currentTimeMs < timing.timestamp_to
    );

    if (currentTiming) {
      setCurrentPlayingVerse(currentTiming.verse_key);

      // Find current word within the verse
      // Filter out incomplete segments (those with only 1 element)
      const validSegments = currentTiming.segments.filter(
        (seg) => seg.length === 3
      );

      const currentSegment = validSegments.find(
        (seg) => currentTimeMs >= seg[1] && currentTimeMs < seg[2]
      );

      if (currentSegment) {
        setCurrentWordPosition(currentSegment[0]);
      } else {
        setCurrentWordPosition(-1);
      }
    } else {
      setCurrentPlayingVerse(null);
      setCurrentWordPosition(-1);
    }

    if (audioRef.current && !audioRef.current.paused) {
      animationFrameRef.current = requestAnimationFrame(updateHighlight);
    }
  }, [chapterAudio]);

  const playFromVerse = useCallback(
    (verseKey: string | null) => {
      if (!chapterAudio) return;

      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const audio = new Audio(chapterAudio.audio_url);
      audioRef.current = audio;

      // If a specific verse is requested, seek to its start time
      if (verseKey) {
        const timing = chapterAudio.verse_timings.find(
          (t) => t.verse_key === verseKey
        );
        if (timing) {
          audio.currentTime = timing.timestamp_from / 1000;
        }
      }

      audio.onplay = () => {
        setIsPlaying(true);
        animationFrameRef.current = requestAnimationFrame(updateHighlight);
      };

      audio.onpause = () => {
        setIsPlaying(false);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentPlayingVerse(null);
        setCurrentWordPosition(-1);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      audio.onerror = () => {
        console.error("Audio error");
        setIsPlaying(false);
        setCurrentPlayingVerse(null);
        setCurrentWordPosition(-1);
      };

      audio.play();
    },
    [chapterAudio, updateHighlight]
  );

  const togglePlayPause = () => {
    if (!chapterAudio) return;

    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
    } else if (audioRef.current && !isPlaying) {
      audioRef.current.play();
      animationFrameRef.current = requestAnimationFrame(updateHighlight);
    } else {
      // Start from beginning
      playFromVerse(null);
    }
  };

  const playSingleVerse = (verseKey: string) => {
    if (!chapterAudio) return;

    const timing = chapterAudio.verse_timings.find(
      (t) => t.verse_key === verseKey
    );
    if (!timing) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const audio = new Audio(chapterAudio.audio_url);
    audioRef.current = audio;
    audio.currentTime = timing.timestamp_from / 1000;

    const checkEnd = () => {
      if (audio.currentTime * 1000 >= timing.timestamp_to) {
        audio.pause();
        setIsPlaying(false);
        setCurrentPlayingVerse(null);
        setCurrentWordPosition(-1);
      }
    };

    audio.ontimeupdate = checkEnd;

    audio.onplay = () => {
      setIsPlaying(true);
      animationFrameRef.current = requestAnimationFrame(updateHighlight);
    };

    audio.onpause = () => {
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentPlayingVerse(null);
      setCurrentWordPosition(-1);
    };

    audio.play();
  };

  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsPlaying(false);
    setCurrentPlayingVerse(null);
    setCurrentWordPosition(-1);
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
          <h1 className="mb-4 text-4xl leading-relaxed font-bold" dir="rtl">
            سُورَةُ {chapterInfo.name_arabic}
          </h1>
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayPause}
              className="gap-2"
              disabled={!chapterAudio}
            >
              {isPlaying ? (
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
            {(isPlaying || currentPlayingVerse) && (
              <Button variant="outline" size="sm" onClick={stopPlaying}>
                <Square className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {verses.map((v) => {
        const isCurrentVerse = currentPlayingVerse === v.verse_key;
        // Filter words to only include actual words (not end markers)
        const displayWords =
          v.words?.filter((w) => w.char_type_name !== "end") || [];

        return (
          <Card
            key={v.id}
            ref={(el) => {
              if (el) {
                verseRefs.current.set(v.verse_key, el);
              } else {
                verseRefs.current.delete(v.verse_key);
              }
            }}
            className={`py-4 transition-colors ${
              isCurrentVerse ? "border-primary bg-primary/5" : ""
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
                    onClick={() => playSingleVerse(v.verse_key)}
                    disabled={!chapterAudio}
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
                            isCurrentVerse &&
                            currentWordPosition === word.position
                              ? "bg-primary text-primary-foreground rounded px-1"
                              : ""
                          }`}
                        >
                          {word.text_uthmani}{" "}
                        </span>
                      ))}
                    </>
                  ) : (
                    v.text_uthmani
                  )}{" "}
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
        );
      })}
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
