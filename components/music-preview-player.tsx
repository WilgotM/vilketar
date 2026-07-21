import React from "react";
import {
  getCachedMusicPreview,
  resolveMusicPreview,
} from "../lib/itunes-preview";
import { Card } from "../types/cards";
import * as styles from "../styles/music-preview-player.css";

type Props = {
  artist: string;
  music: NonNullable<Card["music"]>;
  title: string;
};

let activeAudio: HTMLAudioElement | null = null;
const AUDIO_FADE_DURATION_MS = 260;

function fadeOutAndPause(audio: HTMLAudioElement) {
  if (audio.paused || audio.volume === 0) {
    audio.pause();
    return;
  }

  const initialVolume = audio.volume;
  const startedAt = performance.now();

  const fade = (timestamp: number) => {
    const progress = Math.min(
      (timestamp - startedAt) / AUDIO_FADE_DURATION_MS,
      1,
    );
    audio.volume = initialVolume * (1 - progress);

    if (progress < 1) {
      requestAnimationFrame(fade);
      return;
    }

    audio.pause();
    audio.volume = initialVolume;
  };

  requestAnimationFrame(fade);
}

export default function MusicPreviewPlayer(props: Props) {
  const { artist, music, title } = props;
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
      setStatus("ready");
    });

    return () => {
      cancelled = true;
      if (audio) fadeOutAndPause(audio);
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

    if (activeAudio && activeAudio !== audio) activeAudio.pause();
    activeAudio = audio;
    audio.volume = 1;
    try {
      await audio.play();
      setStatus("playing");
    } catch {
      setStatus("error");
    }
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
