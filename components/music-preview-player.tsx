import React from "react";
import { resolveMusicPreview } from "../lib/itunes-preview";
import { Card } from "../types/cards";
import * as styles from "../styles/music-preview-player.css";

type Props = {
  music: NonNullable<Card["music"]>;
  title: string;
};

let activeAudio: HTMLAudioElement | null = null;

function formatSeconds(value: number): string {
  return `0:${Math.max(0, Math.floor(value)).toString().padStart(2, "0")}`;
}

export default function MusicPreviewPlayer(props: Props) {
  const { music, title } = props;
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    music.previewUrl,
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
    setPreviewUrl(music.previewUrl);
    setStatus(music.previewUrl ? "ready" : "loading");

    void resolveMusicPreview(music, title).then((preview) => {
      if (cancelled) return;
      if (!preview) {
        setStatus("error");
        return;
      }
      setPreviewUrl(preview.previewUrl);
      setStatus("ready");
    });

    return () => {
      cancelled = true;
      audio?.pause();
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
      <button
        aria-label={label}
        className={styles.playButton}
        disabled={!previewUrl || status === "loading" || status === "error"}
        onClick={() => void togglePlayback()}
        type="button"
      >
        <span aria-hidden="true" className={styles.playIcon}>
          {status === "playing" ? "Ⅱ" : "▶"}
        </span>
      </button>
      <div className={styles.copy}>
        <strong className={styles.label}>{label}</strong>
        <div aria-hidden="true" className={styles.progressTrack}>
          <span
            className={styles.progressFill}
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <span className={styles.time}>
          {formatSeconds(currentTime)} / {formatSeconds(duration)}
        </span>
      </div>
      <span className={styles.attribution}>30 sek · Apple Music</span>
    </div>
  );
}
