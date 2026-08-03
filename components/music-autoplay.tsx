import classNames from "classnames";
import React from "react";
import * as styles from "../styles/music-autoplay.css";

export const MUSIC_AUTOPLAY_STOP_EVENT = "vilketar:music-autoplay-stop";

type MusicAutoplayContextValue = {
  audio: HTMLAudioElement | null;
  enabled: boolean;
  stop: () => void;
};

const MusicAutoplayContext = React.createContext<MusicAutoplayContextValue>({
  audio: null,
  enabled: false,
  stop: () => undefined,
});

export function MusicAutoplayProvider(props: {
  children: React.ReactNode;
  enabled: boolean;
}) {
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null);
  const stop = React.useCallback(() => {
    if (!audio) return;

    audio.pause();
    audio.volume = 1;
  }, [audio]);
  const contextValue = React.useMemo(
    () => ({ audio, enabled: props.enabled, stop }),
    [audio, props.enabled, stop],
  );

  React.useEffect(() => {
    return () => {
      audio?.pause();
    };
  }, [audio]);

  React.useEffect(() => {
    window.addEventListener(MUSIC_AUTOPLAY_STOP_EVENT, stop);
    return () => {
      window.removeEventListener(MUSIC_AUTOPLAY_STOP_EVENT, stop);
    };
  }, [stop]);

  return (
    <MusicAutoplayContext.Provider value={contextValue}>
      {props.children}
      <audio ref={setAudio} preload="auto" />
    </MusicAutoplayContext.Provider>
  );
}

export function useMusicAutoplay() {
  return React.useContext(MusicAutoplayContext);
}

export function requestMusicStop() {
  window.dispatchEvent(new Event(MUSIC_AUTOPLAY_STOP_EVENT));
}

export function MusicAutoplayToggle(props: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  placement?: "board" | "party";
}) {
  const { enabled, onChange, placement = "board" } = props;
  const { audio } = useMusicAutoplay();

  return (
    <button
      aria-label={
        enabled
          ? "Stäng av automatisk uppspelning"
          : "Slå på automatisk uppspelning"
      }
      aria-pressed={enabled}
      className={classNames(styles.toggle, {
        [styles.boardPlacement]: placement === "board",
        [styles.enabled]: enabled,
      })}
      onClick={() => {
        const nextEnabled = !enabled;
        if (nextEnabled && audio) {
          // Keep this play call inside the user's click. iOS grants future
          // autoplay permission to this specific, persistent media element.
          void audio.play().catch(() => undefined);
        }
        onChange(nextEnabled);
      }}
      type="button"
    >
      <span aria-hidden="true" className={styles.iconWrap}>
        <svg className={styles.icon} viewBox="0 0 24 24">
          <path d="M9 18V6l10-2v12" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="16" cy="16" r="3" />
        </svg>
        <span className={styles.playMark}>▶</span>
      </span>
      <span className={styles.copy}>
        <span className={styles.label}>Autoplay</span>
        <span className={styles.state}>{enabled ? "På" : "Av"}</span>
      </span>
      <span aria-hidden="true" className={styles.switchTrack}>
        <span className={styles.switchThumb} />
      </span>
    </button>
  );
}
