import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";
import { bodyTextMuted, sectionLabel } from "./ui.css";

const glassSurface = {
  background: `linear-gradient(145deg, color-mix(in srgb, ${vars.color.backdropStrong} 60%, transparent), color-mix(in srgb, ${vars.color.backdrop} 40%, transparent))`,
  backdropFilter: "blur(2rem) saturate(1.2)",
  WebkitBackdropFilter: "blur(2rem) saturate(1.2)",
  border: `1px solid color-mix(in srgb, ${vars.color.text} 10%, transparent)`,
  boxShadow:
    "0 1.25rem 3.5rem rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
};

const glassControl = {
  background: `color-mix(in srgb, ${vars.color.text} 6%, transparent)`,
  backdropFilter: "blur(1.25rem) saturate(1.16)",
  WebkitBackdropFilter: "blur(1.25rem) saturate(1.16)",
  border: `1px solid color-mix(in srgb, ${vars.color.text} 10%, transparent)`,
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
};

export const screen = style({
  display: "flex",
  flexDirection: "column",
  margin: "0 auto",
  maxWidth: "52rem",
  overflowX: "hidden",
  width: "100%",
  paddingBottom: vars.space["4xl"],
});

export const hero = style({
  display: "grid",
  gap: vars.space.sm,
  padding: `${vars.space["2xl"]} ${vars.space.xl} ${vars.space.xl}`,
  textAlign: "center",
  "@media": {
    [media.narrow]: {
      padding: `${vars.space.xl} ${vars.space.md} ${vars.space.lg}`,
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
  ...glassSurface,
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
  ...glassControl,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  fontSize: vars.fontSize.base,
  minHeight: vars.size.controlHeight,
  outline: "none",
  padding: `${vars.space.md} ${vars.space.lg}`,
  width: "100%",
  selectors: {
    "&:focus": {
      borderColor: `color-mix(in srgb, ${vars.color.accentLogo} 70%, ${vars.color.text})`,
      boxShadow: `${vars.shadow.focus}, inset 0 1px 0 rgba(255, 255, 255, 0.14)`,
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

export const profileCard = style({
  alignSelf: "center",
  ...glassSurface,
  background: `linear-gradient(135deg, color-mix(in srgb, ${vars.color.text} 10%, transparent), color-mix(in srgb, ${vars.color.text} 4%, transparent))`,
  borderColor: `color-mix(in srgb, ${vars.color.text} 20%, transparent)`,
  boxShadow: `0 1.5rem 4rem rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
  borderRadius: vars.radius.md,
  display: "grid",
  gap: vars.space.lg,
  margin: `0 0 ${vars.space.lg}`,
  padding: vars.space.xl,
  width: `calc(100% - (${vars.space.xl} * 2))`,
  "@media": {
    [media.narrow]: {
      padding: vars.space.lg,
      width: `calc(100% - (${vars.space.md} * 2))`,
    },
  },
});

export const profileSummary = style({
  alignItems: "center",
  display: "grid",
  gap: vars.space.md,
  gridTemplateColumns: "4.25rem minmax(0, 1fr)",
});

export const profileText = style({
  minWidth: 0,
});

export const profileName = style({
  color: vars.color.text,
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.tight,
  margin: 0,
  overflowWrap: "anywhere",
});

export const profileActions = style({
  alignItems: "center",
  display: "grid",
  gap: vars.space.sm,
  gridTemplateColumns: "minmax(0, 1fr) auto auto auto",
  "@media": {
    [media.narrow]: {
      alignItems: "stretch",
      gridTemplateColumns: "1fr",
    },
  },
});

export const profileEditor = style({
  alignItems: "center",
  display: "flex",
  gap: vars.space.md,
});

export const avatarPreview = style({
  alignItems: "center",
  aspectRatio: "1",
  ...glassControl,
  border: `1px solid color-mix(in srgb, ${vars.color.text} 18%, transparent)`,
  borderRadius: "50%",
  color: vars.color.textMuted,
  display: "flex",
  flex: "0 0 4.5rem",
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.bold,
  justifyContent: "center",
  overflow: "hidden",
  width: "4.5rem",
});

export const avatarPreviewSmall = style([
  avatarPreview,
  {
    flexBasis: "4.25rem",
    width: "4.25rem",
  },
]);

export const avatarImage = style({
  display: "block",
  height: "100%",
  objectFit: "cover",
  width: "100%",
});

export const avatarPicker = style({
  alignItems: "center",
  appearance: "none",
  ...glassControl,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  cursor: "pointer",
  display: "inline-flex",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  justifyContent: "center",
  minHeight: "2.5rem",
  padding: `${vars.space.xs} ${vars.space.md}`,
});

export const hiddenFileInput = style({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
});

export const inlineStatus = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
});

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
  ...glassSurface,
  background: `linear-gradient(135deg, color-mix(in srgb, ${vars.color.text} 12%, transparent), color-mix(in srgb, ${vars.color.text} 4%, transparent))`,
  borderColor: `color-mix(in srgb, ${vars.color.text} 22%, transparent)`,
  boxShadow: `0 1.5rem 4rem rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
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
  color: vars.color.text,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.15em",
  lineHeight: vars.lineHeight.tight,
  marginBottom: vars.space.xxs,
  textTransform: "uppercase",
  opacity: 0.8,
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
  background: `linear-gradient(135deg, ${vars.color.text} 0%, color-mix(in srgb, ${vars.color.text} 80%, transparent) 100%)`,
  border: 0,
  borderRadius: vars.radius.sm,
  color: vars.color.backdropStrong,
  cursor: "pointer",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.bold,
  minHeight: vars.size.controlHeight,
  padding: `${vars.space.md} ${vars.space.lg}`,
  boxShadow:
    "0 4px 12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
  transition: `transform ${vars.duration.fast} ${vars.easing.standard}, filter ${vars.duration.fast} ${vars.easing.standard}`,
  selectors: {
    "&:hover": {
      transform: "translateY(-1px)",
      filter: "brightness(1.1)",
    },
    "&:active": {
      transform: "translateY(1px)",
    },
  },
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
  gap: vars.space.lg,
  padding: `0 ${vars.space.xl}`,
  "@media": {
    [media.narrow]: {
      padding: `0 ${vars.space.md}`,
    },
  },
});

export const leagueCard = style({
  ...glassSurface,
  borderRadius: vars.radius.md,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  transition: `border-color ${vars.duration.fast} ${vars.easing.standard}, transform ${vars.duration.fast} ${vars.easing.standard}, box-shadow ${vars.duration.fast} ${vars.easing.standard}`,
  selectors: {
    "&:hover": {
      borderColor: `color-mix(in srgb, ${vars.color.text} 20%, transparent)`,
      boxShadow:
        "0 1.55rem 4rem rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.18)",
      transform: "translateY(-0.0625rem)",
    },
  },
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
  ...glassControl,
  borderRadius: vars.radius.md,
  color: vars.color.text,
  display: "inline-flex",
  fontSize: vars.fontSize.sm,
  fontFamily: "monospace",
  fontWeight: vars.fontWeight.bold,
  justifyContent: "center",
  padding: `${vars.space.xxs} ${vars.space.sm}`,
  letterSpacing: "0.08em",
});

export const smallAction = style({
  appearance: "none",
  ...glassControl,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  cursor: "pointer",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  minHeight: "2rem",
  padding: `${vars.space.xxs} ${vars.space.sm}`,
  selectors: {
    "&:hover": {
      background: `color-mix(in srgb, ${vars.color.text} 11%, transparent)`,
      borderColor: `color-mix(in srgb, ${vars.color.text} 18%, transparent)`,
    },
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
  background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${vars.color.text} 4%, transparent), transparent)`,
  borderTop: `1px solid color-mix(in srgb, ${vars.color.text} 9%, transparent)`,
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
  ...glassControl,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.semibold,
  padding: `${vars.space.md} ${vars.space.lg}`,
  overflowWrap: "anywhere",
});

export const dangerZone = style({
  borderTop: `1px solid color-mix(in srgb, ${vars.color.text} 10%, transparent)`,
  display: "grid",
  gap: vars.space.md,
  marginTop: vars.space.sm,
  paddingTop: vars.space.lg,
});

export const dangerTitle = style({
  color: vars.color.text,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.snug,
  margin: 0,
});

export const dangerButton = style({
  appearance: "none",
  background: `linear-gradient(145deg, ${vars.color.dangerSoft}, color-mix(in srgb, ${vars.color.dangerSoft} 70%, transparent))`,
  border: `1px solid ${vars.color.danger}`,
  borderRadius: vars.radius.sm,
  color: vars.color.danger,
  cursor: "pointer",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.bold,
  minHeight: vars.size.controlHeight,
  padding: `${vars.space.md} ${vars.space.lg}`,
  width: "100%",
  selectors: {
    "&:disabled": {
      cursor: "wait",
      opacity: 0.62,
    },
  },
});

export const deviceList = style({
  display: "grid",
  gap: vars.space.sm,
});

export const deviceRow = style({
  alignItems: "center",
  ...glassControl,
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
  background: `linear-gradient(145deg, color-mix(in srgb, ${vars.color.text} 5%, transparent), color-mix(in srgb, ${vars.color.text} 1%, transparent))`,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
  lineHeight: vars.lineHeight.body,
  padding: vars.space.md,
  margin: `${vars.space.md} ${vars.space.xl} 0`,
  borderRadius: vars.radius.sm,
  border: `1px solid color-mix(in srgb, ${vars.color.text} 8%, transparent)`,
});

export const winner = style({
  padding: vars.space.md,
  textAlign: "center",
  borderBottom: `1px solid color-mix(in srgb, ${vars.color.text} 10%, transparent)`,
  background: `linear-gradient(135deg, color-mix(in srgb, ${vars.color.text} 8%, transparent) 0%, color-mix(in srgb, ${vars.color.text} 2%, transparent) 100%)`,
});

export const winnerLabel = style({
  color: vars.color.text,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  opacity: 0.8,
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
  background: `color-mix(in srgb, ${vars.color.text} 4%, transparent)`,
  borderBottom: `1px solid color-mix(in srgb, ${vars.color.text} 9%, transparent)`,
});

export const memberRow = style({
  alignItems: "center",
  display: "grid",
  gridTemplateColumns: "2rem minmax(0, 1fr) minmax(4.5rem, auto)",
  gap: vars.space.sm,
  padding: `${vars.space.md} ${vars.space.xl}`,
  borderBottom: `1px solid color-mix(in srgb, ${vars.color.text} 8%, transparent)`,
  minHeight: "4rem",
  color: vars.color.text,
  fontSize: vars.fontSize.base,
  "@media": {
    [media.narrow]: {
      padding: `${vars.space.md} ${vars.space.lg}`,
    },
  },
  selectors: {
    "&:hover": {
      background: `color-mix(in srgb, ${vars.color.text} 4%, transparent)`,
    },
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

export const memberAvatar = style({
  alignItems: "center",
  aspectRatio: "1",
  ...glassControl,
  borderRadius: "50%",
  color: vars.color.textMuted,
  display: "inline-flex",
  flex: "0 0 2rem",
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  justifyContent: "center",
  overflow: "hidden",
  width: "2rem",
});

export const youBadge = style({
  background: `linear-gradient(135deg, ${vars.color.text} 0%, color-mix(in srgb, ${vars.color.text} 80%, transparent) 100%)`,
  borderRadius: vars.radius.sm,
  padding: "2px 6px",
  fontSize: "0.6rem",
  fontWeight: vars.fontWeight.bold,
  textTransform: "uppercase",
  color: vars.color.backdropStrong,
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
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
    ...glassSurface,
    borderRadius: vars.radius.md,
    fontSize: vars.fontSize.base,
    textAlign: "center",
    padding: vars.space["2xl"],
  },
]);

export const error = style({
  alignSelf: "center",
  background: `linear-gradient(145deg, ${vars.color.dangerSoft}, color-mix(in srgb, ${vars.color.dangerSoft} 65%, transparent))`,
  backdropFilter: "blur(1.25rem)",
  WebkitBackdropFilter: "blur(1.25rem)",
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
    background: `linear-gradient(145deg, color-mix(in srgb, ${vars.color.text} 8%, transparent), color-mix(in srgb, ${vars.color.text} 3%, transparent))`,
    borderColor: `color-mix(in srgb, ${vars.color.text} 15%, transparent)`,
    color: vars.color.text,
  },
]);

export const quickActions = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: vars.space.md,
  padding: `0 ${vars.space.xl} ${vars.space.xl}`,
  alignSelf: "center",
  width: `calc(100% - (${vars.space.xl} * 2))`,
  "@media": {
    [media.narrow]: {
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: vars.space.sm,
      padding: `0 ${vars.space.md} ${vars.space.lg}`,
      width: `calc(100% - (${vars.space.md} * 2))`,
    },
  },
});

export const actionCard = style({
  appearance: "none",
  ...glassSurface,
  borderRadius: vars.radius.md,
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.sm,
  padding: vars.space.md,
  color: vars.color.text,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  boxShadow:
    "0 0.75rem 2rem rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.14)",
  minHeight: "6rem",
  transition: `border-color ${vars.duration.fast} ${vars.easing.standard}, background ${vars.duration.fast} ${vars.easing.standard}, transform ${vars.duration.fast} ${vars.easing.standard}, box-shadow ${vars.duration.fast} ${vars.easing.standard}`,
  selectors: {
    "&:hover": {
      background: `linear-gradient(145deg, color-mix(in srgb, ${vars.color.text} 14%, transparent), color-mix(in srgb, ${vars.color.text} 6%, transparent))`,
      borderColor: `color-mix(in srgb, ${vars.color.text} 25%, transparent)`,
      boxShadow:
        "0 1rem 2.4rem rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.20)",
      transform: "translateY(-0.125rem)",
    },
  },
});

export const actionIcon = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: vars.color.text,
  width: "2.5rem",
  height: "2.5rem",
  borderRadius: "50%",
  background: `linear-gradient(135deg, color-mix(in srgb, ${vars.color.text} 16%, transparent), color-mix(in srgb, ${vars.color.text} 4%, transparent))`,
  border: `1px solid color-mix(in srgb, ${vars.color.text} 16%, transparent)`,
  overflow: "hidden",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
});

export const actionAvatar = style({
  display: "block",
  height: "100%",
  objectFit: "cover",
  width: "100%",
});

export const verifyPanel = style({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xl,
  justifyContent: "center",
  minHeight: "60vh",
  padding: `${vars.space["4xl"]} ${vars.space.md}`,
  textAlign: "center",
});

export const verifyIconBubble = style({
  ...glassSurface,
  alignItems: "center",
  borderRadius: "50%",
  color: vars.color.text,
  display: "flex",
  justifyContent: "center",
  padding: vars.space.xl,
});

export const verifyTextStack = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
});

export const verifyTitle = style({
  color: vars.color.text,
  fontSize: vars.fontSize["2xl"],
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.tight,
  margin: 0,
});

export const verifyDescription = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.body,
  margin: "0 auto",
  maxWidth: "25rem",
});

export const verifyMutedText = style([
  verifyDescription,
  {
    color: vars.color.textSubtle,
    fontSize: vars.fontSize.sm,
  },
]);

export const verifyButtonWrap = style({
  marginTop: vars.space.md,
  maxWidth: "20rem",
  width: "100%",
});
