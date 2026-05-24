import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";
import { bodyTextMuted, sectionLabel } from "./ui.css";

export const screen = style({
  display: "flex",
  flexDirection: "column",
  margin: "0 auto",
  maxWidth: "46rem",
  overflowX: "hidden",
  width: "100%",
  paddingBottom: vars.space["4xl"],
});

export const hero = style({
  display: "grid",
  gap: vars.space.xs,
  padding: `${vars.space.xl} ${vars.space.xl} ${vars.space.md}`,
  textAlign: "center",
  "@media": {
    [media.narrow]: {
      padding: `${vars.space.lg} ${vars.space.md} ${vars.space.md}`,
    },
  },
});

export const eyebrow = style([
  sectionLabel,
  {
    fontSize: vars.fontSize.xs,
    letterSpacing: "0.1em",
    marginBottom: vars.space.xs,
  },
]);

export const title = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize["2xl"],
  fontWeight: vars.fontWeight.bold,
  letterSpacing: 0,
  lineHeight: vars.lineHeight.tight,
  margin: 0,
  overflowWrap: "anywhere",
  "@media": {
    [media.narrow]: {
      fontSize: vars.fontSize.xl,
    },
  },
});

export const intro = style([
  bodyTextMuted,
  {
    fontSize: vars.fontSize.md,
    lineHeight: vars.lineHeight.snug,
    margin: "0 auto",
    maxWidth: "16rem",
    overflowWrap: "anywhere",
    textAlign: "center",
    textWrap: "wrap",
  },
]);

export const panel = style({
  background: vars.color.surfaceStrong,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  alignSelf: "center",
  display: "grid",
  gap: vars.space.lg,
  margin: `0 0 ${vars.space.xl}`,
  padding: vars.space.xl,
  width: `calc(100% - (${vars.space.xl} * 2))`,
  "@media": {
    [media.narrow]: {
      margin: `0 0 ${vars.space.lg}`,
      padding: vars.space.lg,
      width: `calc(100% - (${vars.space.md} * 2))`,
    },
  },
});

export const nameForm = style({
  display: "grid",
  gap: vars.space.lg,
});

export const formGrid = style({
  display: "grid",
  gap: vars.space.md,
  gridTemplateColumns: "1fr auto",
  "@media": {
    [media.narrow]: {
      gridTemplateColumns: "1fr",
    },
  },
});

export const input = style({
  background: vars.color.backdrop,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  fontSize: vars.fontSize.base,
  minHeight: vars.size.controlHeight,
  outline: "none",
  padding: `${vars.space.md} ${vars.space.lg}`,
  width: "100%",
  selectors: {
    "&:focus": {
      borderColor: vars.color.accentLogo,
    },
    "&::placeholder": {
      color: vars.color.textSubtle,
    },
  },
});

export const formTitle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.snug,
  margin: 0,
});

export const helperText = style([
  bodyTextMuted,
  {
    fontSize: vars.fontSize.sm,
  },
]);

export const tabMenu = style({
  display: "flex",
  gap: vars.space.md,
  padding: `${vars.space.md} ${vars.space.xl} ${vars.space.xl}`,
  "@media": {
    [media.narrow]: {
      display: "grid",
      gridTemplateColumns: "1fr",
      paddingTop: vars.space.sm,
    },
  },
});

export const tabMenuSingle = style({
  alignSelf: "center",
  display: "grid",
  gap: vars.space.md,
  gridTemplateColumns: "1fr",
  margin: `0 0 ${vars.space.lg}`,
  width: `calc(100% - (${vars.space.xl} * 2))`,
  "@media": {
    [media.narrow]: {
      margin: `0 0 ${vars.space.lg}`,
      width: `calc(100% - (${vars.space.md} * 2))`,
    },
  },
});

export const accountNudge = style({
  alignItems: "center",
  alignSelf: "center",
  background: `linear-gradient(135deg, color-mix(in srgb, ${vars.color.text} 12%, transparent), color-mix(in srgb, ${vars.color.accentLogo} 16%, transparent)), ${vars.color.surfaceStrong}`,
  border: `1px solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.md,
  display: "grid",
  gap: vars.space.md,
  gridTemplateColumns: "minmax(0, 1fr) auto auto",
  margin: `0 0 ${vars.space.xl}`,
  padding: vars.space.lg,
  width: `calc(100% - (${vars.space.xl} * 2))`,
  "@media": {
    [media.narrow]: {
      alignItems: "stretch",
      gridTemplateColumns: "1fr",
      margin: `0 0 ${vars.space.lg}`,
      width: `calc(100% - (${vars.space.md} * 2))`,
    },
  },
});

export const accountNudgeLabel = style({
  color: vars.color.accentLogo,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.08em",
  lineHeight: vars.lineHeight.tight,
  marginBottom: vars.space.xxs,
  textTransform: "uppercase",
});

export const accountNudgeTitle = style({
  color: vars.color.text,
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.tight,
  margin: 0,
});

export const accountNudgeButton = style({
  appearance: "none",
  background: vars.color.text,
  border: 0,
  borderRadius: vars.radius.sm,
  color: vars.color.backdropStrong,
  cursor: "pointer",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.bold,
  minHeight: vars.size.controlHeight,
  padding: `${vars.space.md} ${vars.space.lg}`,
});

export const deviceLink = style({
  color: vars.color.text,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  textDecoration: "none",
  whiteSpace: "nowrap",
});

export const leagueList = style({
  display: "grid",
  gap: vars.space.xl,
  padding: `0 ${vars.space.xl}`,
  "@media": {
    [media.narrow]: {
      padding: `0 ${vars.space.md}`,
    },
  },
});

export const leagueCard = style({
  background: vars.color.surfaceStrong,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxShadow: "0 18px 48px rgb(15 23 42 / 0.08)",
});

export const leagueHeader = style({
  alignItems: "flex-start",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: vars.space.md,
  padding: `${vars.space.lg} ${vars.space.xl}`,
  "@media": {
    [media.narrow]: {
      flexDirection: "column",
      padding: `${vars.space.lg} ${vars.space.lg} ${vars.space.md}`,
    },
  },
});

export const leagueTitleStack = style({
  display: "grid",
  gap: vars.space.xxs,
  minWidth: 0,
});

export const leagueTitle = style({
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.tight,
  margin: 0,
  color: vars.color.text,
  overflowWrap: "anywhere",
});

export const memberCount = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
});

export const codeActions = style({
  alignItems: "center",
  display: "flex",
  gap: vars.space.sm,
  flexWrap: "wrap",
});

export const codeBox = style({
  alignItems: "center",
  background: vars.color.backdrop,
  borderRadius: vars.radius.md,
  color: vars.color.text,
  display: "inline-flex",
  fontSize: vars.fontSize.sm,
  fontFamily: "monospace",
  fontWeight: vars.fontWeight.bold,
  justifyContent: "center",
  padding: `${vars.space.xxs} ${vars.space.sm}`,
  border: `1px solid ${vars.color.border}`,
});

export const smallAction = style({
  appearance: "none",
  background: vars.color.backdrop,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  cursor: "pointer",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  minHeight: "2rem",
  padding: `${vars.space.xxs} ${vars.space.sm}`,
  selectors: {
    "&:disabled": {
      cursor: "wait",
      opacity: 0.62,
    },
  },
});

export const copyAction = style({
  color: vars.color.textMuted,
});

export const manageBar = style({
  alignItems: "center",
  borderTop: `1px solid ${vars.color.border}`,
  display: "flex",
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.xl}`,
  "@media": {
    [media.narrow]: {
      padding: `${vars.space.sm} ${vars.space.lg}`,
    },
  },
});

export const textAction = style({
  appearance: "none",
  background: "transparent",
  border: 0,
  color: vars.color.textMuted,
  cursor: "pointer",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  padding: `${vars.space.xs} ${vars.space.xs}`,
});

export const textActionDanger = style([
  textAction,
  {
    color: vars.color.danger,
  },
]);

export const renameRow = style({
  alignItems: "center",
  display: "grid",
  gap: vars.space.sm,
  gridTemplateColumns: "minmax(0, 1fr) auto",
});

export const compactInput = style([
  input,
  {
    fontSize: vars.fontSize.md,
    minHeight: "2.25rem",
    padding: `${vars.space.xs} ${vars.space.sm}`,
  },
]);

export const savedAccountBox = style({
  background: vars.color.backdrop,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.semibold,
  padding: `${vars.space.md} ${vars.space.lg}`,
  overflowWrap: "anywhere",
});

export const deviceList = style({
  display: "grid",
  gap: vars.space.sm,
});

export const deviceRow = style({
  alignItems: "center",
  background: vars.color.backdrop,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  display: "grid",
  gap: vars.space.md,
  gridTemplateColumns: "minmax(0, 1fr) auto",
  padding: vars.space.md,
});

export const deviceName = style({
  alignItems: "center",
  color: vars.color.text,
  display: "flex",
  flexWrap: "wrap",
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.bold,
  gap: vars.space.sm,
});

export const notice = style({
  background: vars.color.accentSoft,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
  lineHeight: vars.lineHeight.body,
  padding: vars.space.md,
  margin: `${vars.space.md} ${vars.space.xl} 0`,
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.accentTint}`,
});

export const winner = style({
  padding: vars.space.md,
  textAlign: "center",
  borderBottom: `1px solid ${vars.color.border}`,
  background: vars.color.accentTint,
});

export const winnerLabel = style({
  color: vars.color.accentLogo,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});

export const winnerName = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.tight,
});

export const memberList = style({
  display: "flex",
  flexDirection: "column",
});

export const memberListHeader = style({
  display: "grid",
  gridTemplateColumns: "2rem minmax(0, 1fr) minmax(4.5rem, auto)",
  gap: vars.space.sm,
  padding: `${vars.space.xs} ${vars.space.xl}`,
  fontSize: vars.fontSize.xs,
  color: vars.color.textSubtle,
  fontWeight: vars.fontWeight.bold,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: `1px solid ${vars.color.border}`,
});

export const memberRow = style({
  alignItems: "center",
  display: "grid",
  gridTemplateColumns: "2rem minmax(0, 1fr) minmax(4.5rem, auto)",
  gap: vars.space.sm,
  padding: `${vars.space.md} ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border}`,
  minHeight: "4rem",
  color: vars.color.text,
  fontSize: vars.fontSize.base,
  "@media": {
    [media.narrow]: {
      padding: `${vars.space.md} ${vars.space.lg}`,
    },
  },
  selectors: {
    "&:last-child": {
      borderBottom: "none",
    },
  },
});

export const memberRank = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.textMuted,
});

export const memberInfo = style({
  display: "flex",
  flexDirection: "column",
  gap: "1px",
});

export const memberName = style({
  fontWeight: vars.fontWeight.semibold,
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  minWidth: 0,
  overflowWrap: "anywhere",
});

export const youBadge = style({
  background: vars.color.accentSoft,
  borderRadius: vars.radius.sm,
  padding: "2px 6px",
  fontSize: "0.6rem",
  fontWeight: vars.fontWeight.bold,
  textTransform: "uppercase",
  color: vars.color.accentLogo,
});

export const today = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
});

export const score = style({
  fontWeight: vars.fontWeight.bold,
  textAlign: "right",
  fontSize: vars.fontSize.lg,
});

export const scoreCell = style({
  alignItems: "flex-end",
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xxs,
});

export const kickButton = style({
  appearance: "none",
  background: "transparent",
  border: 0,
  color: vars.color.danger,
  cursor: "pointer",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  padding: 0,
  selectors: {
    "&:disabled": {
      cursor: "wait",
      opacity: 0.62,
    },
  },
});

export const empty = style([
  bodyTextMuted,
  {
    fontSize: vars.fontSize.base,
    textAlign: "center",
    padding: vars.space["2xl"],
  },
]);

export const error = style({
  alignSelf: "center",
  background: vars.color.dangerSoft,
  border: `1px solid ${vars.color.danger}`,
  borderRadius: vars.radius.md,
  color: vars.color.text,
  fontSize: vars.fontSize.sm,
  padding: vars.space.md,
  margin: `0 0 ${vars.space.xl}`,
  width: `calc(100% - (${vars.space.xl} * 2))`,
  "@media": {
    [media.narrow]: {
      margin: `0 0 ${vars.space.lg}`,
      width: `calc(100% - (${vars.space.md} * 2))`,
    },
  },
});

export const status = style([
  error,
  {
    background: vars.color.accentSoft,
    borderColor: vars.color.accentTint,
    color: vars.color.text,
  },
]);
