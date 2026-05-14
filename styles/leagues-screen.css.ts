import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";
import { bodyTextMuted, sectionLabel } from "./ui.css";

export const screen = style({
  display: "flex",
  flexDirection: "column",
  margin: "0 auto",
  maxWidth: vars.size.pageWidth,
  width: "100%",
  paddingBottom: vars.space["4xl"],
});

export const hero = style({
  display: "grid",
  gap: vars.space.xs,
  padding: `${vars.space.xl} ${vars.space.xl} ${vars.space.md}`,
  textAlign: "center",
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
  letterSpacing: "-0.02em",
  lineHeight: vars.lineHeight.tight,
  margin: 0,
});

export const intro = style([
  bodyTextMuted,
  {
    fontSize: vars.fontSize.md,
    lineHeight: vars.lineHeight.snug,
    margin: "0 auto",
    maxWidth: "28rem",
    textAlign: "center",
  },
]);

export const panel = style({
  background: vars.color.surfaceStrong,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xl,
  display: "grid",
  gap: vars.space.lg,
  margin: `0 ${vars.space.xl} ${vars.space.xl}`,
  padding: vars.space.xl,
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
  borderRadius: vars.radius.md,
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
});

export const tabMenuSingle = style({
  display: "grid",
  gap: vars.space.md,
  gridTemplateColumns: "1fr",
  margin: `0 ${vars.space.xl} ${vars.space.lg}`,
});

export const leagueList = style({
  display: "grid",
  gap: vars.space["2xl"],
  padding: `0 ${vars.space.xl}`,
});

export const leagueCard = style({
  background: vars.color.surfaceStrong,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xl,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

export const leagueHeader = style({
  alignItems: "center",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: vars.space.md,
  padding: `${vars.space.lg} ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const leagueTitle = style({
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.tight,
  margin: 0,
  color: vars.color.text,
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

export const notice = style({
  background: vars.color.accentSoft,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
  lineHeight: vars.lineHeight.body,
  padding: vars.space.md,
  margin: `${vars.space.md} ${vars.space.xl} 0`,
  borderRadius: vars.radius.md,
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
  gridTemplateColumns: "2rem 1fr 3.5rem",
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
  gridTemplateColumns: "2rem 1fr 3.5rem",
  gap: vars.space.sm,
  padding: `${vars.space.md} ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border}`,
  minHeight: "4rem",
  color: vars.color.text,
  fontSize: vars.fontSize.base,
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

export const empty = style([
  bodyTextMuted,
  {
    fontSize: vars.fontSize.base,
    textAlign: "center",
    padding: vars.space["2xl"],
  },
]);

export const error = style({
  background: vars.color.dangerSoft,
  border: `1px solid ${vars.color.danger}`,
  borderRadius: vars.radius.md,
  color: vars.color.text,
  fontSize: vars.fontSize.sm,
  padding: vars.space.md,
  margin: `0 ${vars.space.xl} ${vars.space.xl}`,
});
