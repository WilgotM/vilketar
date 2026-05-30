import { style } from "@vanilla-extract/css";
import { vars } from "./theme.css";
import { sectionLabel } from "./ui.css";

export const summary = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  width: `min(100%, ${vars.size.contentWidth})`,
});

export const dailyLabel = style([
  sectionLabel,
  {
    color: vars.color.text,
  },
]);

export const metaText = sectionLabel;

export const score = style({
  width: "100%",
});

export const shareButton = style({
  width: "100%",
});

export const leagueTip = style({
  alignItems: "center",
  background: vars.color.surfaceStrong,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  display: "grid",
  gap: vars.space.md,
  gridTemplateColumns: "1fr auto",
  padding: vars.space.lg,
  width: "100%",
  "@media": {
    "screen and (max-width: 520px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const leagueTipTitle = style({
  color: vars.color.text,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.snug,
});

export const leagueTipText = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.snug,
  margin: 0,
});

export const leagueLink = style({
  alignItems: "center",
  background: vars.color.backdrop,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  display: "inline-flex",
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  justifyContent: "center",
  minHeight: "2.5rem",
  padding: `${vars.space.xs} ${vars.space.md}`,
  textDecoration: "none",
});

export const leagueResults = style({
  background: `linear-gradient(145deg, ${vars.color.surfaceChrome}, ${vars.color.surfaceStrong})`,
  border: `1px solid rgba(255, 255, 255, 0.08)`,
  borderRadius: vars.radius.xl,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  display: "grid",
  gap: vars.space.md,
  padding: vars.space.xl,
  width: "100%",
});

export const leagueResultsHeader = style({
  alignItems: "center",
  display: "grid",
  gap: vars.space.md,
  gridTemplateColumns: "1fr auto",
});

export const leagueStack = style({
  display: "grid",
  gap: vars.space.sm,
});

export const dailyLeagueCard = style({
  background: vars.color.backdropStrong,
  border: `1px solid rgba(255, 255, 255, 0.06)`,
  borderRadius: vars.radius.lg,
  overflow: "hidden",
});

export const dailyLeagueName = style({
  color: vars.color.text,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  padding: `${vars.space.sm} ${vars.space.md}`,
});

export const dailyLeagueMembers = style({
  display: "grid",
});

export const dailyLeagueRow = style({
  alignItems: "center",
  borderTop: `1px solid rgba(255, 255, 255, 0.04)`,
  display: "grid",
  gap: vars.space.sm,
  gridTemplateColumns: "1.5rem minmax(0, 1fr) auto",
  minHeight: "3rem",
  padding: `${vars.space.sm} ${vars.space.md}`,
  transition: "background 0.2s ease",
  selectors: {
    "&:hover": {
      background: "rgba(255, 255, 255, 0.02)",
    },
  },
});

export const dailyLeagueRank = style({
  color: vars.color.textSubtle,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
});

export const dailyLeaguePerson = style({
  alignItems: "center",
  color: vars.color.text,
  display: "flex",
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  gap: vars.space.xs,
  minWidth: 0,
  overflowWrap: "anywhere",
});

export const dailyYouBadge = style({
  background: vars.color.accentSoft,
  borderRadius: vars.radius.sm,
  color: vars.color.accentLogo,
  fontSize: "0.65rem",
  fontWeight: vars.fontWeight.bold,
  padding: "1px 5px",
});

export const dailyLeagueScore = style({
  color: vars.color.text,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  textAlign: "right",
});
