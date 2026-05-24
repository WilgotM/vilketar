import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";

export const toggleWrapper = style({
  height: "44px", // Touch target size
  position: "absolute",
  right: vars.space.md,
  top: vars.space.md,
  width: "44px",
  zIndex: 100, // Ensure it's above hero decorations
  "@media": {
    [media.compact]: {
      right: vars.space.sm,
      top: vars.space.sm,
    },
  },
});

export const toggleButton = style([
  toggleWrapper,
  {
    alignItems: "center",
    background: "transparent",
    border: "none",
    borderRadius: "50%",
    color: vars.color.textMuted,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    padding: 0,
    transition: `background-color ${vars.duration.fast} ${vars.easing.standard}, color ${vars.duration.fast} ${vars.easing.standard}`,
    ":hover": {
      backgroundColor: vars.color.surfaceChrome,
      color: vars.color.text,
    },
    ":active": {
      backgroundColor: vars.color.surfaceStrong,
    },
  },
]);
