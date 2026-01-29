import { useCallback, useRef } from "react";

export type SoundType = "correct" | "incorrect" | "achievement";

interface SoundConfig {
  [key: string]: {
    src: string;
    volume?: number;
  };
}

const soundConfig: SoundConfig = {
  correct: {
    src: "/math-learning-advent/sounds/correct.mp3",
    volume: 0.7,
  },
  incorrect: {
    src: "/math-learning-advent/sounds/incorrect.mp3",
    volume: 0.6,
  },
  achievement: {
    src: "/math-learning-advent/sounds/achievement.mp3",
    volume: 0.8,
  },
};

export function useSound() {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const preloadSounds = useCallback(() => {
    Object.entries(soundConfig).forEach(([key, config]) => {
      if (!audioRefs.current[key]) {
        const audio = new Audio(config.src);
        audio.preload = "auto";
        audio.volume = config.volume || 0.5;
        audioRefs.current[key] = audio;
      }
    });
  }, []);

  const playSound = useCallback((soundType: SoundType) => {
    try {
      const audio = audioRefs.current[soundType];
      if (audio) {
        // Reset to beginning if already playing
        audio.currentTime = 0;
        audio.play().catch((error) => {
          // Silently handle play errors (e.g., user hasn't interacted with page yet)
          console.warn("Could not play sound:", error);
        });
      } else {
        // Fallback: create new audio instance
        const config = soundConfig[soundType];
        if (config) {
          const audio = new Audio(config.src);
          audio.volume = config.volume || 0.5;
          audio.play().catch((error) => {
            console.warn("Could not play sound:", error);
          });
        }
      }
    } catch (error) {
      console.warn("Error playing sound:", error);
    }
  }, []);

  return {
    playSound,
    preloadSounds,
  };
}

// Alternative simple function for direct usage
export function playSound(soundType: SoundType) {
  try {
    const config = soundConfig[soundType];
    if (config) {
      const audio = new Audio(config.src);
      audio.volume = config.volume || 0.5;
      audio.play().catch((error) => {
        console.warn("Could not play sound:", error);
      });
    }
  } catch (error) {
    console.warn("Error playing sound:", error);
  }
}
