import type { ChapterAudio, VerseTiming } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

type AudioPlayerState = {
  isPlaying: boolean;
  currentPlayingVerse: string | null;
  currentWordPosition: number;
};

type AudioPlayerActions = {
  playFromVerse: (verseKey: string | null) => void;
  playSingleVerse: (verseKey: string) => void;
  togglePlayPause: () => void;
  stop: () => void;
};

export function useAudioPlayer(
  chapterAudio: ChapterAudio | null | undefined
): [AudioPlayerState, AudioPlayerActions] {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingVerse, setCurrentPlayingVerse] = useState<string | null>(
    null
  );
  const [currentWordPosition, setCurrentWordPosition] = useState<number>(-1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Cleanup on unmount
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

  const updateHighlight = useCallback(() => {
    if (!audioRef.current || !chapterAudio) return;

    const currentTimeMs = audioRef.current.currentTime * 1000;

    // Find current verse based on timestamp
    const currentTiming = chapterAudio.verse_timings.find(
      (timing: VerseTiming) =>
        currentTimeMs >= timing.timestamp_from &&
        currentTimeMs < timing.timestamp_to
    );

    if (currentTiming) {
      setCurrentPlayingVerse(currentTiming.verse_key);

      // Find current word within the verse
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

  const setupAudioEvents = useCallback(
    (audio: HTMLAudioElement) => {
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
    },
    [updateHighlight]
  );

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
          (t: VerseTiming) => t.verse_key === verseKey
        );
        if (timing) {
          audio.currentTime = timing.timestamp_from / 1000;
        }
      }

      setupAudioEvents(audio);
      audio.play();
    },
    [chapterAudio, setupAudioEvents]
  );

  const playSingleVerse = useCallback(
    (verseKey: string) => {
      if (!chapterAudio) return;

      const timing = chapterAudio.verse_timings.find(
        (t: VerseTiming) => t.verse_key === verseKey
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
      setupAudioEvents(audio);
      audio.play();
    },
    [chapterAudio, setupAudioEvents]
  );

  const togglePlayPause = useCallback(() => {
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
  }, [chapterAudio, isPlaying, playFromVerse, updateHighlight]);

  const stop = useCallback(() => {
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
  }, []);

  return [
    { isPlaying, currentPlayingVerse, currentWordPosition },
    { playFromVerse, playSingleVerse, togglePlayPause, stop },
  ];
}
