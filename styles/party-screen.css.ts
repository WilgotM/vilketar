import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";
import { bodyTextMuted, sectionLabel, surface } from "./ui.css";

const shake = keyframes({
  "0%, 100%": { transform: "translate(-50%, 0) rotate(0deg)" },
  "10%, 30%, 50%, 70%, 90%": {
    transform: "translate(-52%, -2px) rotate(-1.5deg)",
  },
  "20%, 40%, 60%, 80%": { transform: "translate(-48%, 2px) rotate(1.5deg)" },
});

export const page = style({
  minHeight: "100dvh",
});

export const pageGame = style({});

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

export const gameScreen = style({
  display: "block",
  height: "100dvh",
  padding: 0,
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
  gap: 0,
  height: "100dvh",
  minHeight: "100dvh",
  padding: 0,
  "@media": {
    [media.compact]: {
      minHeight: "100dvh",
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
  vars: {
    "--sidebar-card-width": "13.5rem",
    "--sidebar-card-height": "18rem",
  },
  display: "grid",
  flex: 1,
  gap: vars.space.xl,
  gridTemplateColumns: "minmax(0, 1fr) minmax(18rem, 24rem)",
  minHeight: 0,
  position: "relative",
  "@media": {
    [media.compact]: {
      vars: {
        "--sidebar-card-width": "9.375rem",
        "--sidebar-card-height": "12.5rem",
      },
      display: "flex",
      flexDirection: "column-reverse",
      minHeight: 0,
    },
  },
});

export const tvBoard = style({
  aspectRatio: "auto",
  background: `radial-gradient(circle at center, color-mix(in srgb, ${vars.color.text} 4%, ${vars.color.backdropStrong}) 0%, ${vars.color.backdrop} 100%)`,
  border: 0,
  borderRadius: 0,
  boxShadow: "none",
  flex: "1 1 auto",
  height: "100dvh",
  maxHeight: "100dvh",
  maxWidth: "100vw",
  padding: vars.space.lg,
  width: "100vw",
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
      aspectRatio: "auto",
      display: "flex",
      flexDirection: "column-reverse",
      maxHeight: "100dvh",
      minHeight: 0,
      overflow: "auto",
    },
  },
});

globalStyle(`${pageGame} header`, {
  left: 0,
  padding: vars.space.lg,
  position: "fixed",
  top: 0,
  width: "auto",
  zIndex: 10,
});

globalStyle(`${pageGame} header > div`, {
  margin: 0,
  maxWidth: "none",
  minHeight: vars.size.controlHeight,
  width: "auto",
});

globalStyle(`${pageGame} header a[href="/"]`, {
  display: "none",
});

globalStyle(`${pageGame} header button`, {
  position: "static",
  transform: "none",
});

globalStyle(`${pageGame} header button:hover`, {
  transform: "scale(1.03)",
});

globalStyle(`${pageGame} ${gameTopBar}`, {
  display: "none",
});

globalStyle(`${page}:fullscreen`, {
  background: vars.color.backdrop,
  overflow: "hidden",
});

globalStyle(`${page}:fullscreen header`, {
  display: "none",
});

globalStyle(`${page}:fullscreen ${screen}`, {
  display: "block",
  height: "100dvh",
  padding: 0,
});

globalStyle(`${page}:fullscreen ${gameShellTv}`, {
  gap: 0,
  height: "100dvh",
  minHeight: "100dvh",
  padding: 0,
});

globalStyle(`${page}:fullscreen ${gameTopBar}`, {
  display: "none",
});

globalStyle(`${page}:fullscreen ${tvBoard}`, {
  aspectRatio: "auto",
  borderRadius: 0,
  height: "100dvh",
  maxHeight: "100dvh",
  maxWidth: "100vw",
  padding: vars.space.xl,
  width: "100vw",
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
  gap: `${vars.space.xl} ${vars.space.lg}`,
  justifyContent: "center",
  margin: "auto",
  padding: vars.space.lg,
  width: "100%",
  position: "relative",
  isolation: "isolate",
});

export const timelineDense = style({
  alignContent: "flex-start",
  justifyContent: "flex-start",
  margin: 0,
});

export const placement = style({
  alignItems: "center",
  alignSelf: "stretch",
  background: `color-mix(in srgb, ${vars.color.text} 2%, transparent)`,
  border: `2px dashed color-mix(in srgb, ${vars.color.text} 12%, transparent)`,
  borderRadius: vars.radius.md,
  color: vars.color.accent,
  display: "flex",
  justifyContent: "center",
  minHeight: vars.size.cardHeight,
  minWidth: "4.5rem",
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
  paddingBottom: "3rem",
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
  minHeight: "var(--sidebar-card-height)",
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
  background: vars.color.accentSoft,
  borderColor: vars.color.accent,
  borderWidth: "2px",
  boxShadow: vars.shadow.focus,
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

export const guideDetails = style({
  width: "100%",
  marginTop: vars.space.sm,
  marginBottom: vars.space.sm,
});

export const guideSummary = style({
  cursor: "pointer",
  color: vars.color.accent,
  fontWeight: vars.fontWeight.bold,
  fontSize: vars.fontSize.control,
  textAlign: "center",
  listStyle: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.sm,
  padding: `${vars.space.md} ${vars.space.lg}`,
  background: `color-mix(in srgb, ${vars.color.text} 4%, transparent)`,
  border: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderRadius: vars.radius.pill,
  transition: `all ${vars.duration.fast} ${vars.easing.standard}`,
  userSelect: "none",
  selectors: {
    "&:hover": {
      background: `color-mix(in srgb, ${vars.color.text} 8%, transparent)`,
      borderColor: vars.color.accent,
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
    "&::-webkit-details-marker": {
      display: "none",
    },
  },
});

export const guideSummaryIcon = style({
  transition: `transform ${vars.duration.fast} ${vars.easing.standard}`,
  selectors: {
    [`${guideDetails}[open] &`]: {
      transform: "rotate(180deg)",
    },
  },
});

export const errorOverlay = style({
  position: "absolute",
  inset: 0,
  background: "rgba(180, 0, 0, 0.44)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
});

export const correctOverlay = style({
  position: "absolute",
  inset: 0,
  background: "rgba(0, 140, 40, 0.44)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
});

export const errorBadge = style({
  background: "rgba(30, 0, 0, 0.94)",
  border: `4px solid ${vars.color.statusIncorrectBorder}`,
  borderRadius: vars.radius.lg,
  boxShadow: "0 2rem 4rem rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.38)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: `${vars.space["2xl"]} ${vars.space["4xl"]}`,
  textAlign: "center",
  gap: vars.space.sm,
  position: "absolute",
  left: "50%",
  top: "30%",
  width: "min(90vw, 420px)",
  animation: `${shake} 0.5s ease-in-out`,
});

export const correctBadge = style({
  background: "rgba(0, 20, 0, 0.94)",
  border: `4px solid ${vars.color.statusCorrectBorder}`,
  borderRadius: vars.radius.lg,
  boxShadow: "0 2rem 4rem rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.38)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: `${vars.space["2xl"]} ${vars.space["4xl"]}`,
  textAlign: "center",
  gap: vars.space.sm,
  position: "absolute",
  left: "50%",
  top: "30%",
  width: "min(90vw, 420px)",
  transform: "translateX(-50%)",
});

export const errorIcon = style({
  fontSize: "4.5rem",
  color: vars.color.statusIncorrectBorder,
  lineHeight: 1,
});

export const correctIcon = style({
  fontSize: "4.5rem",
  color: vars.color.statusCorrectBorder,
  lineHeight: 1,
});

export const errorText = style({
  fontSize: vars.fontSize.display,
  fontWeight: vars.fontWeight.black,
  color: "#fff",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  margin: 0,
});

export const correctText = style({
  fontSize: vars.fontSize.display,
  fontWeight: vars.fontWeight.black,
  color: "#fff",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  margin: 0,
});

export const errorTeam = style({
  fontSize: vars.fontSize.control,
  color: vars.color.statusIncorrectBorder,
  fontWeight: vars.fontWeight.bold,
  margin: 0,
});

export const correctTeam = style({
  fontSize: vars.fontSize.control,
  color: vars.color.statusCorrectBorder,
  fontWeight: vars.fontWeight.bold,
  margin: 0,
});
