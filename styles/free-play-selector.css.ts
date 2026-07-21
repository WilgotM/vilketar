import { keyframes, style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";
import { sectionLabel, surface } from "./ui.css";

const selectorItemIn = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(0.9rem) scale(0.97)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0) scale(1)",
  },
});

const selectorPanelIn = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(0.75rem) scale(0.985)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0) scale(1)",
  },
});

export const content = style({
  alignItems: "flex-start",
  display: "flex",
  justifyContent: "center",
  width: "100%",
});

export const embeddedContent = style({
  padding: 0,
});

export const stage = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: vars.size.contentWidthWide,
  width: "100%",
});

export const optionLabel = style({
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  minHeight: vars.fontSize.lg,
  minWidth: 0,
  width: "100%",
});

export const insideCardPanel = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  width: "100%",
});

export const transitionSection = style({
  animation: `${selectorPanelIn} ${vars.duration.slower} ${vars.easing.ios} both`,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  transformOrigin: "50% 0",
  width: "100%",
  "@media": {
    [media.reduceMotion]: {
      animation: "none",
    },
  },
});

export const selectorSection = transitionSection;

export const actions = style({
  width: "100%",
});

export const rootSelectorNav = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  width: "100%",
});

export const landingSelector = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  width: "100%",
});

export const categoryDropdown = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
  width: "100%",
});

export const categoryDropdownButton = style({
  listStyle: "none",
  selectors: {
    "&::-webkit-details-marker": {
      display: "none",
    },
  },
});

export const dropdownChevron = style({
  borderBottom: "0.125rem solid currentColor",
  borderRight: "0.125rem solid currentColor",
  display: "inline-block",
  height: "0.55rem",
  transform: "rotate(45deg) translateY(-0.125rem)",
  transition: `transform ${vars.duration.fast} ${vars.easing.standard}`,
  width: "0.55rem",
  selectors: {
    [`${categoryDropdown}[open] &`]: {
      transform: "rotate(225deg) translateY(-0.125rem)",
    },
  },
});

export const categoryDropdownPanel = style({
  paddingTop: vars.space.md,
  width: "100%",
});

export const selectorBody = style({
  width: "100%",
});

export const introControls = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  width: "100%",
});

export const introControl = style({
  width: "100%",
});

export const grid = style({
  display: "grid",
  gap: vars.space.md,
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  minWidth: 0,
  width: "100%",
  "@media": {
    [media.compact]: {
      gridTemplateColumns: "minmax(0, 1fr)",
    },
  },
});

export const gridItem = style({
  animation: `${selectorItemIn} ${vars.duration.slower} ${vars.easing.ios} both`,
  minWidth: 0,
  selectors: {
    "&:nth-child(1)": {
      animationDelay: "30ms",
    },
    "&:nth-child(2)": {
      animationDelay: "65ms",
    },
    "&:nth-child(3)": {
      animationDelay: "100ms",
    },
    "&:nth-child(4)": {
      animationDelay: "135ms",
    },
    "&:nth-child(5)": {
      animationDelay: "170ms",
    },
    "&:nth-child(6)": {
      animationDelay: "205ms",
    },
    "&:nth-child(n + 7)": {
      animationDelay: "240ms",
    },
  },
  "@media": {
    [media.reduceMotion]: {
      animation: "none",
    },
  },
});

export const optionCard = style([
  surface({ density: "compact", tone: "chrome" }),
  {
    minHeight: "4.5rem",
    justifyContent: "center",
    padding: 0,
    overflow: "hidden",
    transition: `border-color ${vars.duration.fast} ${vars.easing.standard}, transform ${vars.duration.fast} ${vars.easing.standard}, box-shadow ${vars.duration.fast} ${vars.easing.standard}`,
    selectors: {
      "&:hover": {
        borderColor: vars.color.borderStrong,
        boxShadow: `0 0 0 1px ${vars.color.accentSoft}, ${vars.shadow.panel}`,
        transform: "translateY(-0.125rem)",
      },
    },
    "@media": {
      [media.reduceMotion]: {
        transition: "none",
        selectors: { "&:hover": { transform: "none" } },
      },
    },
  },
]);

export const gridFiller = style({
  borderRadius: vars.radius.lg,
  minHeight: vars.size.controlHeight,
  pointerEvents: "none",
  visibility: "hidden",
});

export const disabledOption = style({
  alignItems: "center",
  color: vars.color.textMuted,
  cursor: "not-allowed",
  display: "flex",
  fontWeight: vars.fontWeight.semibold,
  justifyContent: "center",
  minHeight: "4.5rem",
  padding: vars.space.md,
  textAlign: "center",
  width: "100%",
});

export const sectionTitle = sectionLabel;
