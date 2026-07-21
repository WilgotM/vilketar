import React from "react";
import {
  getCachedMusicPreview,
  resolveMusicPreview,
} from "../lib/itunes-preview";
import { Card } from "../types/cards";
import { MUSIC_AUTOPLAY_START_EVENT, useMusicAutoplay } from "./music-autoplay";
import * as styles from "../styles/music-preview-player.css";

type Props = {
  artist: string;
  music: NonNullable<Card["music"]>;
  title: string;
};

let activeAudio: HTMLAudioElement | null = null;

function stopAudio(audio: HTMLAudioElement) {
  audio.pause();
  audio.currentTime = 0;
  audio.volume = 1;
}

export default function MusicPreviewPlayer(props: Props) {
  const { artist, music, title } = props;
  const autoPlay = useMusicAutoplay();
  const initialPreview = getCachedMusicPreview(music, title);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    initialPreview?.previewUrl ?? music.previewUrl,
  );
  const [artworkUrl, setArtworkUrl] = React.useState<string | null>(
    initialPreview?.artworkUrl ?? music.artworkUrl,
  );
  const [status, setStatus] = React.useState<
    "error" | "loading" | "paused" | "playing" | "ready"
  >(music.previewUrl ? "ready" : "loading");
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(30);

  React.useEffect(() => {
    let cancelled = false;
    const audio = audioRef.current;
    setCurrentTime(0);
    const cachedPreview = getCachedMusicPreview(music, title);
    setPreviewUrl(cachedPreview?.previewUrl ?? music.previewUrl);
    setArtworkUrl(cachedPreview?.artworkUrl ?? music.artworkUrl);
    setStatus(
      cachedPreview?.previewUrl || music.previewUrl ? "ready" : "loading",
    );

    void resolveMusicPreview(music, title).then((preview) => {
      if (cancelled) return;
      if (!preview) {
        setStatus("error");
        return;
      }
      setPreviewUrl(preview.previewUrl);
      setArtworkUrl(preview.artworkUrl ?? music.artworkUrl);
      setStatus(audioRef.current?.paused === false ? "playing" : "ready");
    });

    return () => {
      cancelled = true;
      if (audio) stopAudio(audio);
      if (activeAudio === audio) activeAudio = null;
    };
  }, [music, title]);

  const togglePlayback = React.useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !previewUrl) return;

    if (!audio.paused) {
      audio.pause();
      setStatus("paused");
      return;
    }

    if (activeAudio && activeAudio !== audio) stopAudio(activeAudio);
    activeAudio = audio;
    audio.volume = 1;
    try {
      await audio.play();
      setStatus("playing");
    } catch {
      setStatus("error");
    }
  }, [previewUrl]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!autoPlay || !audio || !previewUrl || !audio.paused) return;

    if (activeAudio && activeAudio !== audio) stopAudio(activeAudio);
    activeAudio = audio;
    audio.volume = 1;
    void audio
      .play()
      .then(() => setStatus("playing"))
      .catch(() => setStatus("paused"));
  }, [autoPlay, previewUrl, title]);

  React.useEffect(() => {
    const startFromToggle = () => {
      const audio = audioRef.current;
      if (!audio || !previewUrl || !audio.paused) return;

      if (activeAudio && activeAudio !== audio) stopAudio(activeAudio);
      activeAudio = audio;
      audio.volume = 1;
      void audio
        .play()
        .then(() => setStatus("playing"))
        .catch(() => setStatus("paused"));
    };

    window.addEventListener(MUSIC_AUTOPLAY_START_EVENT, startFromToggle);
    return () => {
      window.removeEventListener(MUSIC_AUTOPLAY_START_EVENT, startFromToggle);
    };
  }, [previewUrl]);

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const label =
    status === "loading"
      ? "Hämtar låten…"
      : status === "error"
        ? "Låten kunde inte spelas"
        : status === "playing"
          ? "Pausa låten"
          : currentTime > 0
            ? "Fortsätt lyssna"
            : "Spela låten";

  return (
    <div
      className={styles.player}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <audio
        ref={audioRef}
        onDurationChange={(event) => {
          const nextDuration = event.currentTarget.duration;
          if (Number.isFinite(nextDuration)) setDuration(nextDuration);
        }}
        onEnded={() => {
          setCurrentTime(0);
          setStatus("ready");
        }}
        onPause={() => {
          setStatus((current) => (current === "playing" ? "paused" : current));
        }}
        onPlay={() => setStatus("playing")}
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        preload="metadata"
        src={previewUrl ?? undefined}
      />
      <div className={styles.artworkFrame}>
        {artworkUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={`Omslag till ${title} av ${artist}`}
            className={styles.artwork}
            draggable={false}
            src={artworkUrl}
          />
        ) : (
          <div aria-hidden="true" className={styles.artworkFallback}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              className={styles.fallbackLogo}
              src="/logo-with-bg.svg"
            />
          </div>
        )}
        <div aria-hidden="true" className={styles.artworkShade} />
      </div>
      <div className={styles.trackRow}>
        <button
          aria-label={label}
          className={styles.listenButton}
          disabled={!previewUrl || status === "loading" || status === "error"}
          onClick={() => void togglePlayback()}
          style={{
            background: `conic-gradient(rgba(17, 17, 17, 0.2) ${progress * 360}deg, #111111 0)`,
          }}
          type="button"
        >
          <span className={styles.playButtonInner}>
            <span aria-hidden="true" className={styles.playIcon}>
              {status === "playing" ? "Ⅱ" : "▶"}
            </span>
          </span>
        </button>
        <div className={styles.trackCopy}>
          <strong className={styles.trackTitle}>{title}</strong>
          <span className={styles.artist}>{artist}</span>
        </div>
      </div>
    </div>
  );
}
