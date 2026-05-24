import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";
import { bodyTextMuted, sectionLabel, surface } from "./ui.css";

export const page = style({
  minHeight: "100dvh",
});

export const screen = style({
  display: "flex",
  justifyContent: "center",
  padding: `${vars.space["2xl"]} ${vars.space.xl} ${vars.space["4xl"]}`,
  width: "100%",
  "@media": {
    [media.compact]: {
      padding: `${vars.space.lg} ${vars.space.lg} ${vars.space["3xl"]}`,
    },
  },
});

export const setupStage = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  maxWidth: vars.size.contentWidth,
  width: "100%",
});

export const sectionTitle = sectionLabel;

export const setupPanel = style([
  surface({ density: "spacious", tone: "chrome" }),
  {
    flexDirection: "column",
    gap: vars.space.lg,
  },
]);

export const setupText = style([
  bodyTextMuted,
  {
    margin: 0,
    textAlign: "center",
  },
]);

export const guide = style({
  background: `color-mix(in srgb, ${vars.color.text} 4%, transparent)`,
  border: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
  padding: vars.space.lg,
});

export const guideIntro = style([
  bodyTextMuted,
  {
    margin: 0,
    textAlign: "center",
  },
]);

export const guideGrid = style({
  display: "grid",
  gap: vars.space.sm,
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  "@media": {
    [media.narrow]: {
      gridTemplateColumns: "minmax(0, 1fr)",
    },
  },
});

export const guideItem = style({
  background: vars.color.surfaceStrong,
  border: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.space.md,
});

export const guideTitle = style({
  color: vars.color.text,
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.black,
  lineHeight: vars.lineHeight.tight,
});

export const guideCopy = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.snug,
  margin: `${vars.space.xs} 0 0`,
});

export const segmented = style({
  display: "grid",
  gap: vars.space.sm,
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  width: "100%",
});

export const segmentButton = style({
  appearance: "none",
  background: vars.color.surfaceStrong,
  border: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderRadius: vars.radius.pill,
  color: vars.color.text,
  cursor: "pointer",
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.bold,
  minHeight: vars.size.controlHeight,
  padding: `${vars.space.md} ${vars.space.lg}`,
});

export const segmentButtonActive = style({
  background: vars.color.accent,
  borderColor: vars.color.accent,
  color: vars.color.accentText,
});

export const teamCountGrid = style({
  display: "grid",
  gap: vars.space.sm,
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  "@media": {
    [media.narrow]: {
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    },
  },
});

export const numberButton = style({
  appearance: "none",
  background: vars.color.surfaceStrong,
  border: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  color: vars.color.text,
  cursor: "pointer",
  fontWeight: vars.fontWeight.black,
  minHeight: "2.75rem",
});

export const numberButtonActive = style({
  background: vars.color.accent,
  borderColor: vars.color.accent,
  color: vars.color.accentText,
});

export const teamInputs = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
});

export const teamInput = style({
  background: vars.color.surfaceStrong,
  border: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  color: vars.color.text,
  minHeight: vars.size.controlHeight,
  outline: "none",
  padding: `${vars.space.sm} ${vars.space.lg}`,
  selectors: {
    "&:focus": {
      borderColor: vars.color.accent,
      boxShadow: vars.shadow.focus,
    },
  },
});

export const setupActions = style({
  display: "grid",
  gap: vars.space.md,
  gridTemplateColumns: "minmax(0, 1fr)",
});

export const gameShell = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  height: "calc(100dvh - 4.5rem)",
  minHeight: 0,
  padding: `${vars.space.lg} ${vars.space.xl} ${vars.space.xl}`,
  width: "100%",
  "@media": {
    [media.compact]: {
      height: "auto",
      minHeight: "calc(100dvh - 4.5rem)",
      padding: `${vars.space.md} ${vars.space.lg} ${vars.space["2xl"]}`,
    },
  },
});

export const gameShellTv = style({
  alignItems: "center",
  justifyContent: "center",
  padding: vars.space.lg,
  "@media": {
    [media.compact]: {
      minHeight: "calc(100dvh - 4.5rem)",
    },
  },
});

export const gameTopBar = style({
  alignItems: "center",
  display: "flex",
  gap: vars.space.md,
  justifyContent: "space-between",
  width: "100%",
});

export const gameActions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.sm,
  justifyContent: "flex-end",
});

export const gameTitle = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.12em",
  lineHeight: vars.lineHeight.tight,
  textTransform: "uppercase",
});

export const board = style({
  display: "grid",
  flex: 1,
  gap: vars.space.xl,
  gridTemplateColumns: "minmax(0, 1fr) minmax(18rem, 24rem)",
  minHeight: 0,
  "@media": {
    [media.compact]: {
      display: "flex",
      flexDirection: "column-reverse",
      minHeight: 0,
    },
  },
});

export const tvBoard = style({
  aspectRatio: "16 / 9",
  background: `linear-gradient(180deg, ${vars.color.backdrop} 0%, ${vars.color.backdropStrong} 100%)`,
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.panel,
  flex: "0 1 auto",
  height: "auto",
  maxHeight: "calc(100dvh - 7.5rem)",
  maxWidth: "min(100%, calc((100dvh - 7.5rem) * 16 / 9))",
  padding: vars.space.lg,
  width: "100%",
  selectors: {
    "&:fullscreen": {
      borderRadius: 0,
      maxHeight: "100dvh",
      maxWidth: "100vw",
      padding: vars.space.xl,
    },
  },
  "@media": {
    [media.compact]: {
      aspectRatio: "16 / 9",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(15rem, 20rem)",
      maxHeight: "calc(100dvh - 8rem)",
      minHeight: 0,
    },
  },
});

export const receiverBoard = style({
  gridTemplateColumns: "minmax(0, 1fr) minmax(20rem, 28rem)",
});

export const timelinePanel = style([
  surface({ density: "spacious", tone: "default" }),
  {
    alignContent: "center",
    display: "flex",
    minHeight: 0,
    overflow: "auto",
  },
]);

export const timelinePanelDense = style({
  alignContent: "flex-start",
});

export const timeline = style({
  alignContent: "center",
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: `${vars.space["2xl"]} ${vars.space.lg}`,
  justifyContent: "center",
  margin: "auto",
  padding: vars.space.lg,
  width: "100%",
});

export const timelineDense = style({
  alignContent: "flex-start",
  justifyContent: "flex-start",
  margin: 0,
});

export const placement = style({
  alignItems: "center",
  alignSelf: "stretch",
  background: "transparent",
  border: 0,
  color: vars.color.accent,
  display: "flex",
  justifyContent: "center",
  minHeight: vars.size.cardHeight,
  minWidth: "3.5rem",
  padding: 0,
});

export const placementButton = style({
  cursor: "pointer",
  selectors: {
    "&:disabled": {
      cursor: "default",
      opacity: 0.9,
    },
  },
});

export const placementLine = style({
  alignItems: "center",
  background: vars.color.accent,
  border: `${vars.size.borderWidth} solid rgba(255, 255, 255, 0.44)`,
  borderRadius: vars.radius.pill,
  boxShadow: "0 0.75rem 1.5rem rgba(0, 0, 0, 0.24)",
  color: vars.color.accentText,
  display: "flex",
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.black,
  height: "2.5rem",
  justifyContent: "center",
  minWidth: "2.5rem",
  transition: `transform ${vars.duration.fast} ${vars.easing.standard}`,
  selectors: {
    [`${placementButton}:hover &`]: {
      transform: "scale(1.08)",
    },
  },
});

export const cardSlot = style({
  flex: "0 0 auto",
  position: "relative",
});

export const compactCard = style({
  height: "10.9rem",
  width: "8.2rem",
});

export const sidePanel = style([
  surface({ density: "spacious", tone: "chrome" }),
  {
    alignItems: "center",
    flexDirection: "column",
    gap: vars.space.lg,
    justifyContent: "space-between",
    minHeight: 0,
    overflow: "auto",
  },
]);

export const currentCardWrap = style({
  display: "flex",
  justifyContent: "center",
  minHeight: vars.size.cardHeight,
  width: "100%",
});

export const currentMeta = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  textAlign: "center",
  width: "100%",
});

export const activeTeam = style({
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize["2xl"],
  fontWeight: vars.fontWeight.black,
  lineHeight: vars.lineHeight.tight,
  margin: 0,
});

export const muted = bodyTextMuted;

export const teams = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  width: "100%",
});

export const teamRow = style({
  alignItems: "center",
  background: `color-mix(in srgb, ${vars.color.text} 5%, transparent)`,
  border: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  display: "flex",
  gap: vars.space.md,
  justifyContent: "space-between",
  minHeight: "2.75rem",
  padding: `${vars.space.sm} ${vars.space.md}`,
});

export const teamRowActive = style({
  borderColor: vars.color.accent,
});

export const teamRowEliminated = style({
  opacity: 0.46,
  textDecoration: "line-through",
});

export const mistakeDots = style({
  display: "flex",
  gap: vars.space.xxs,
});

export const mistakeDot = style({
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: "50%",
  height: "0.7rem",
  width: "0.7rem",
});

export const mistakeDotFilled = style({
  background: vars.color.danger,
  borderColor: vars.color.danger,
});

export const result = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.semibold,
  margin: 0,
  minHeight: "1.3rem",
  textAlign: "center",
});

export const winnerPanel = style([
  surface({ density: "spacious", tone: "chrome" }),
  {
    alignItems: "center",
    flexDirection: "column",
    gap: vars.space.lg,
    margin: "auto",
    maxWidth: vars.size.contentWidth,
    textAlign: "center",
  },
]);
