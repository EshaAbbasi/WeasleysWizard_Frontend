import musicFile from "../assets/music.mp3"; // <-- CHANGE to your real music path/name

let audio = null;

export const startMusic = () => {
  try {
    if (!audio) {
      audio = new Audio(musicFile);
      audio.loop = true;
    }
    audio.volume = 0.6;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {
    /* ignore audio errors */
  }
};

// fades out smoothly, then stops
export const stopMusic = () => {
  if (!audio) return;
  const a = audio;
  const fade = setInterval(() => {
    if (a.volume > 0.08) {
      a.volume = Math.max(0, a.volume - 0.08);
    } else {
      clearInterval(fade);
      a.pause();
      a.currentTime = 0;
      a.volume = 0.6;
    }
  }, 40);
};
