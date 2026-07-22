import classNames from "classnames";
import React from "react";
import * as styles from "../styles/music-autoplay.css";

type MusicAutoplayState = {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  enabled: boolean;
};

const MusicAutoplayContext = React.createContext<MusicAutoplayState | null>(
  null,
);
export const MUSIC_AUTOPLAY_START_EVENT = "vilketar:music-autoplay-start";

export function MusicAutoplayProvider(props: {
  children: React.ReactNode;
  enabled: boolean;
}) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const value = React.useMemo(
    () => ({ audioRef, enabled: props.enabled }),
    [props.enabled],
  );

  return (
    <MusicAutoplayContext.Provider value={value}>
      <audio ref={audioRef} preload="metadata" />
      {props.children}
    </MusicAutoplayContext.Provider>
  );
}

export function useMusicAutoplay() {
  const state = React.useContext(MusicAutoplayContext);
  if (!state) {
    throw new Error("MusicPreviewPlayer must be inside MusicAutoplayProvider");
  }
  return state;
}

export function MusicAutoplayToggle(props: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  placement?: "board" | "party";
}) {
  const { enabled, onChange, placement = "board" } = props;

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
        if (nextEnabled) {
          window.dispatchEvent(new Event(MUSIC_AUTOPLAY_START_EVENT));
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
