// Global audio player utility for background music in posts, stories, and reels

let currentAudio: HTMLAudioElement | null = null;
let currentTrackUrl: string | null = null;

export const playAudioTrack = (
  url: string,
  onPlay?: () => void,
  onEnded?: () => void,
  onError?: () => void
): HTMLAudioElement | null => {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.75;

    audio.onplay = () => onPlay?.();
    audio.onended = () => onEnded?.();
    audio.onerror = () => {
      console.warn('Audio stream error, using fallback audio generation', url);
      onError?.();
    };

    const promise = audio.play();
    if (promise !== undefined) {
      promise.catch((err) => {
        console.warn('Audio autoplay prevented or error:', err);
        onError?.();
      });
    }

    currentAudio = audio;
    currentTrackUrl = url;
    return audio;
  } catch (e) {
    console.warn('Audio playback error:', e);
    onError?.();
    return null;
  }
};

export const stopAudioTrack = () => {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudio = null;
    currentTrackUrl = null;
  }
};

export const isAudioPlaying = (url?: string): boolean => {
  if (!currentAudio) return false;
  if (url && currentTrackUrl !== url) return false;
  return !currentAudio.paused;
};

// Web Audio API Synth Tone generator as a fallback for music
export const playSynthBeep = (freq = 440, duration = 0.5) => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // ignore
  }
};
