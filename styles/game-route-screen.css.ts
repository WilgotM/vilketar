import { style } from "@vanilla-extract/css";
import { zIndex } from "./foundation";
import { vars } from "./theme.css";

export const page = style({
  display: "flex",
  flexDirection: "column",
  height: "100dvh",
  minHeight: "100dvh",
  overflow: "hidden",
});

export const pageWithoutHeader = style({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  height: "100%",
  minHeight: 0,
});

export const boardFrame = style({
  flex: 1,
  height: "100%",
  minHeight: 0,
  position: "relative",
  width: "100%",
});

export const gameControls = style({
  left: vars.space.lg,
  position: "absolute",
  top: vars.space.lg,
  zIndex: zIndex.overlay,
});

export const leaveButton = style({
  minHeight: "40px",
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
});
