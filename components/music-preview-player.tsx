import React from "react";
import {
  getCachedMusicPreview,
  resolveMusicPreview,
} from "../lib/itunes-preview";
import { Card } from "../types/cards";
import { useMusicAutoplay } from "./music-autoplay";
import * as styles from "../styles/music-preview-player.css";

type Props = {
  artist: string;
  music: NonNullable<Card["music"]>;
  title: string;
};

let activeAudio: HTMLAudioElement | null = null;
const audioSources = new WeakMap<HTMLAudioElement, string>();

function stopAudio(audio: HTMLAudioElement) {
  audio.pause();
  audio.volume = 1;
}

function selectAudioSource(audio: HTMLAudioElement, previewUrl: string) {
  if (audioSources.get(audio) === previewUrl) return false;

  audioSources.set(audio, previewUrl);
  audio.src = previewUrl;
  return true;
}

export default function MusicPreviewPlayer(props: Props) {
  const { artist, music, title } = props;
  const { audio, enabled: autoPlay } = useMusicAutoplay();
  const initialPreview = getCachedMusicPreview(music, title);
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
      setStatus((current) => (current === "playing" ? current : "ready"));
    });

    return () => {
      cancelled = true;
    };
  }, [music, title]);

  const togglePlayback = React.useCallback(async () => {
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
  }, [audio, previewUrl]);

  React.useEffect(() => {
    if (!audio || !previewUrl) return;

    const sourceChanged = selectAudioSource(audio, previewUrl);
    if (sourceChanged) {
      setCurrentTime(0);
      setStatus("ready");
    }

    if (!autoPlay || (!sourceChanged && !audio.paused)) return;

    if (activeAudio && activeAudio !== audio) stopAudio(activeAudio);
    activeAudio = audio;
    audio.volume = 1;
    void audio
      .play()
      .then(() => setStatus("playing"))
      .catch(() => setStatus("paused"));
  }, [audio, autoPlay, previewUrl]);

  React.useEffect(() => {
    if (!audio) return;

    const handleDurationChange = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    const handleEnded = () => {
      setCurrentTime(0);
      setStatus("ready");
    };
    const handlePause = () => {
      if (audio.paused) {
        setStatus((current) => (current === "playing" ? "paused" : current));
      }
    };
    const handlePlay = () => setStatus("playing");
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audio]);

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
