import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";

export const page = style({
  minHeight: "100dvh",
  padding: "1.5rem",
});

export const shell = style({
  display: "grid",
  gap: "1rem",
  margin: "0 auto",
  maxWidth: "78rem",
});

export const header = style({
  alignItems: "end",
  display: "flex",
  gap: "1rem",
  justifyContent: "space-between",
  "@media": {
    [media.compact]: {
      alignItems: "stretch",
      flexDirection: "column",
    },
  },
});

export const eyebrow = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0",
  margin: 0,
  textTransform: "uppercase",
});

export const title = style({
  fontSize: "2rem",
  lineHeight: vars.lineHeight.tight,
  margin: "0.25rem 0 0",
});

export const subtitle = style({
  color: vars.color.textMuted,
  margin: "0.5rem 0 0",
  maxWidth: "42rem",
});

export const toolbar = style({
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
});

export const button = style({
  alignItems: "center",
  background: vars.color.accent,
  border: `1px solid ${vars.color.accent}`,
  borderRadius: vars.radius.sm,
  color: vars.color.accentText,
  cursor: "pointer",
  display: "inline-flex",
  font: "inherit",
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.bold,
  gap: "0.4rem",
  minHeight: "2.5rem",
  padding: "0.55rem 0.8rem",
  selectors: {
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.45,
    },
  },
});

export const secondaryButton = style([
  button,
  {
    background: vars.color.surfaceChrome,
    borderColor: vars.color.borderStrong,
    color: vars.color.text,
  },
]);

export const dangerButton = style([
  button,
  {
    background: vars.color.dangerSoft,
    borderColor: vars.color.danger,
    color: vars.color.danger,
  },
]);

export const panel = style({
  background: vars.color.surfaceChrome,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.card,
  padding: "1rem",
});

export const loginPanel = style([
  panel,
  {
    display: "grid",
    gap: "0.75rem",
    maxWidth: "28rem",
  },
]);

export const input = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  font: "inherit",
  minHeight: "2.5rem",
  padding: "0.55rem 0.7rem",
  width: "100%",
});

export const status = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.control,
  margin: 0,
});

export const layout = style({
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "minmax(0, 1fr) minmax(18rem, 24rem)",
  "@media": {
    [media.compact]: {
      gridTemplateColumns: "1fr",
    },
  },
});

export const dayGrid = style({
  display: "grid",
  gap: "0.75rem",
});

export const dayCard = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  display: "grid",
  gap: "0.75rem",
  padding: "0.9rem",
});

export const dayHeader = style({
  alignItems: "center",
  display: "flex",
  gap: "0.75rem",
  justifyContent: "space-between",
});

export const dayTitle = style({
  fontSize: vars.fontSize.lg,
  lineHeight: vars.lineHeight.snug,
  margin: 0,
});

export const badge = style({
  background: vars.color.statusNeutral,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.pill,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  padding: "0.2rem 0.55rem",
});

export const overrideBadge = style([
  badge,
  {
    background: vars.color.successSoft,
    borderColor: vars.color.success,
    color: vars.color.success,
  },
]);

export const cardList = style({
  display: "grid",
  gap: "0.45rem",
});

export const dailyCardRow = style({
  alignItems: "center",
  background: vars.color.backdrop,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  display: "grid",
  gap: "0.75rem",
  gridTemplateColumns: "2.2rem minmax(0, 1fr) auto",
  padding: "0.55rem",
});

export const cardIndex = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.bold,
  textAlign: "center",
});

export const cardTitle = style({
  fontWeight: vars.fontWeight.bold,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const cardMeta = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.control,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const searchPanel = style([
  panel,
  {
    alignSelf: "start",
    display: "grid",
    gap: "0.75rem",
    position: "sticky",
    top: "1rem",
  },
]);

export const searchResults = style({
  display: "grid",
  gap: "0.45rem",
  maxHeight: "58dvh",
  overflow: "auto",
});

export const searchResult = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  cursor: "pointer",
  display: "grid",
  gap: "0.2rem",
  padding: "0.65rem",
  textAlign: "left",
});

export const selectedResult = style({
  borderColor: vars.color.accent,
  boxShadow: vars.shadow.focus,
});
