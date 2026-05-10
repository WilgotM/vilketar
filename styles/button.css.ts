import { style } from "@vanilla-extract/css";
import { vars } from "./theme.css";
import { action, actionContent, actionIcon, actionLabel } from "./ui.css";

export const button = action({ tone: "primary" });

export const fullWidth = style({
  width: "100%",
});

export const minimal = style({
  background: `linear-gradient(${vars.color.backdropStrong}, ${vars.color.backdropStrong}) padding-box, linear-gradient(90deg, rgba(140, 80, 180, 0.8) 0%, rgba(245, 183, 49, 0.8) 100%) border-box`,
  borderColor: "transparent",
  borderWidth: "1px",
  boxShadow: "none",
  color: "#ffffff",
  selectors: {
    "&:hover": {
      background: `linear-gradient(${vars.color.surfaceStrong}, ${vars.color.surfaceStrong}) padding-box, linear-gradient(90deg, rgba(140, 80, 180, 1) 0%, rgba(245, 183, 49, 1) 100%) border-box`,
      borderColor: "transparent",
      color: "#ffffff",
    },
  },
});

export const withTrailingIcon = style({
  justifyContent: "space-between",
});

export const content = actionContent;

export const label = actionLabel;

export const icon = actionIcon;
