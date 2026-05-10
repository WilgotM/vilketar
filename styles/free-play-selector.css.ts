import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";
import { sectionLabel } from "./ui.css";

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
  maxWidth: vars.size.contentWidth,
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
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  width: "100%",
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
  gap: vars.space.lg,
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  minWidth: 0,
  width: "100%",
  "@media": {
    [media.compact]: {
      gridTemplateColumns: "minmax(0, 1fr)",
    },
  },
});

export const gridFiller = style({
  borderRadius: vars.radius.lg,
  minHeight: vars.size.controlHeight,
  pointerEvents: "none",
  visibility: "hidden",
});

export const sectionTitle = sectionLabel;
