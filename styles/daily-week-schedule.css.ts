import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const schedule = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
});

export const compact = style({
  // No special container styling needed for compact if we are just showing the list
});

export const header = style({
  alignItems: "baseline",
  display: "flex",
  gap: vars.space.sm,
  justifyContent: "space-between",
  padding: `0 ${vars.space.xs}`,
});

export const eyebrow = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});

export const title = style({
  color: vars.color.text,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.bold,
  display: "none", // Hide the main title on mobile to save space, eyebrow is enough
});

export const week = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  background: `linear-gradient(145deg, ${vars.color.surfaceChrome}, ${vars.color.surfaceStrong})`,
  borderRadius: vars.radius.xl,
  overflow: "hidden", // So children respect border radius
  border: `1px solid rgba(255, 255, 255, 0.08)`,
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
});

export const day = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `4px ${vars.space.md}`,
  minHeight: "2.3rem", // Very compact vertical height
  position: "relative",
  borderBottom: `1px solid rgba(255, 255, 255, 0.06)`,
  transition: "all 0.15s ease",
});

export const lastDay = style({
  borderBottom: "none",
});

export const featured = style({
  // Subtle tint for featured
});

export const today = style({
  background: "rgba(255, 255, 255, 0.06)",
});

export const dayName = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.text,
});

globalStyle(`${today} ${dayName}`, {
  fontWeight: vars.fontWeight.black,
  color: vars.color.accentLogo,
});

export const dayRight = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: vars.space.sm,
});

export const iconContainer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: vars.color.textMuted,
});

globalStyle(`${today} ${iconContainer}`, {
  color: vars.color.accentLogo,
});

globalStyle(`${iconContainer} svg`, {
  width: "1.1rem",
  height: "1.1rem",
});

export const theme = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  color: vars.color.textMuted,
});

globalStyle(`${today} ${theme}`, {
  color: vars.color.text,
  fontWeight: vars.fontWeight.bold,
});

export const todayLabel = style({
  background: vars.color.accentLogo,
  borderRadius: vars.radius.pill,
  color: "#fffdfa",
  fontSize: "0.65rem",
  fontWeight: vars.fontWeight.bold,
  padding: "2px 8px",
  marginLeft: vars.space.xs,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});

// Category-themed row colors for dynamic calendar strip:
export const sportDay = style({
  background: "rgba(34, 197, 94, 0.04)",
  selectors: {
    "&:hover": {
      background: "rgba(34, 197, 94, 0.08)",
    },
  },
});

globalStyle(`${sportDay} .${dayName}`, {
  color: "#4ade80",
});

globalStyle(`${sportDay} .${theme}`, {
  color: "#4ade80",
  fontWeight: vars.fontWeight.semibold,
});

globalStyle(`${sportDay} .${iconContainer}`, {
  color: "#22c55e",
});

globalStyle(`${sportDay}.${today}`, {
  background: "rgba(34, 197, 94, 0.12)",
  borderLeft: "3px solid #22c55e",
});

export const musicDay = style({
  background: "rgba(250, 35, 59, 0.04)",
  selectors: {
    "&:hover": {
      background: "rgba(250, 35, 59, 0.08)",
    },
  },
});

globalStyle(`${musicDay} .${dayName}`, {
  color: "#ff4f66",
});

globalStyle(`${musicDay} .${theme}`, {
  color: "#ff4f66",
  fontWeight: vars.fontWeight.semibold,
});

globalStyle(`${musicDay} .${iconContainer}`, {
  color: "#fa233b",
});

globalStyle(`${musicDay}.${today}`, {
  background: "rgba(250, 35, 59, 0.12)",
  borderLeft: "3px solid #fa233b",
});

export const classicDay = style({
  background: "rgba(0, 110, 175, 0.04)",
  selectors: {
    "&:hover": {
      background: "rgba(0, 110, 175, 0.08)",
    },
  },
});

globalStyle(`${classicDay} .${dayName}`, {
  color: "#60a5fa",
});

globalStyle(`${classicDay} .${theme}`, {
  color: "#eab308",
  fontWeight: vars.fontWeight.semibold,
});

globalStyle(`${classicDay} .${iconContainer}`, {
  color: "#fecc00",
});

globalStyle(`${classicDay}.${today}`, {
  background: "rgba(0, 110, 175, 0.12)",
  borderLeft: "3px solid #fecc00",
});
