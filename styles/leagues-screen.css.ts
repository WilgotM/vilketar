import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";
import { bodyTextMuted, screenTitle, sectionLabel } from "./ui.css";

const glassSurface = {
  background: vars.color.surfaceChrome,
  backdropFilter: "blur(1.5rem)",
  WebkitBackdropFilter: "blur(1.5rem)",
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.panel,
};

const glassControl = {
  background: vars.color.surfaceStrong,
  backdropFilter: "none",
  WebkitBackdropFilter: "none",
  border: `1px solid ${vars.color.border}`,
  boxShadow: "none",
};

export const screen = style({
  display: "flex",
  flexDirection: "column",
  margin: "0 auto",
  maxWidth: "76rem",
  overflowX: "hidden",
  width: "100%",
  paddingBottom: vars.space["4xl"],
});

export const hero = style({
  alignItems: "flex-end",
  display: "flex",
  justifyContent: "space-between",
  gap: vars.space.xl,
  padding: `${vars.space["3xl"]} ${vars.space["2xl"]} ${vars.space["2xl"]}`,
  position: "relative",
  "@media": {
    [media.narrow]: {
      alignItems: "center",
      padding: `${vars.space.xl} ${vars.space.lg} ${vars.space.lg}`,
    },
    [media.shortLandscape]: {
      alignItems: "center",
      padding: `${vars.space.sm} ${vars.space["2xl"]} ${vars.space.md}`,
    },
  },
});

export const heroCopy = style({
  display: "grid",
  gap: vars.space.xs,
  minWidth: 0,
});

export const eyebrow = style([
  sectionLabel,
  {
    fontSize: vars.fontSize.xs,
    letterSpacing: "0.1em",
    marginBottom: vars.space.xs,
  },
]);

export const title = style([
  screenTitle,
  {
    fontFamily: vars.font.display,
    fontSize: "clamp(2.5rem, 5vw, 4.25rem)",
    fontWeight: vars.fontWeight.black,
    letterSpacing: "-0.05em",
    lineHeight: "0.96",
    overflowWrap: "anywhere",
    "@media": {
      [media.narrow]: {
        fontSize: vars.fontSize["2xl"],
      },
      [media.shortLandscape]: {
        fontSize: vars.fontSize["2xl"],
      },
    },
  },
]);

export const intro = style([
  bodyTextMuted,
  {
    fontSize: vars.fontSize.lg,
    lineHeight: vars.lineHeight.snug,
    margin: 0,
    maxWidth: "24rem",
    overflowWrap: "anywhere",
    textWrap: "wrap",
    "@media": {
      [media.narrow]: {
        fontSize: vars.fontSize.base,
      },
    },
  },
]);

export const profileMenu = style({
  position: "relative",
  zIndex: 12,
});

export const profileTrigger = style({
  alignItems: "center",
  appearance: "none",
  color: vars.color.textMuted,
  cursor: "pointer",
  display: "flex",
  gap: vars.space.sm,
  listStyle: "none",
  selectors: {
    "&::-webkit-details-marker": { display: "none" },
    "&:focus-visible": {
      borderRadius: vars.radius.pill,
      boxShadow: vars.shadow.focus,
      outline: "none",
    },
  },
});

export const profileTriggerAvatar = style({
  alignItems: "center",
  aspectRatio: "1",
  background: vars.color.surfaceStrong,
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.pill,
  color: vars.color.text,
  display: "flex",
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.bold,
  justifyContent: "center",
  overflow: "hidden",
  width: vars.size.controlHeight,
});

export const profileDropdown = style({
  background: vars.color.surfaceRaised,
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.panel,
  display: "grid",
  gap: vars.space.xxs,
  minWidth: "11rem",
  padding: vars.space.sm,
  position: "absolute",
  right: 0,
  top: `calc(100% + ${vars.space.sm})`,
});

export const profileDropdownName = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  overflowWrap: "anywhere",
  padding: `${vars.space.sm} ${vars.space.md}`,
});

export const profileDropdownAction = style({
  appearance: "none",
  background: "transparent",
  border: 0,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  cursor: "pointer",
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.semibold,
  minHeight: "2.75rem",
  padding: `${vars.space.sm} ${vars.space.md}`,
  textAlign: "left",
  selectors: {
    "&:hover": { background: vars.color.accentTint },
    "&:focus-visible": {
      boxShadow: vars.shadow.focus,
      outline: "none",
    },
  },
});

export const panel = style({
  ...glassSurface,
  borderRadius: vars.radius.xl,
  alignSelf: "center",
  display: "grid",
  gap: vars.space.lg,
  margin: `0 0 ${vars.space.xl}`,
  padding: vars.space.xl,
  maxWidth: vars.size.contentWidthWide,
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
  background: vars.color.surfaceChrome,
  borderColor: vars.color.borderStrong,
  boxShadow: vars.shadow.panel,
  borderRadius: vars.radius.xl,
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

export const workspace = style({
  alignItems: "start",
  display: "grid",
  gap: vars.space.md,
  gridTemplateColumns: "15rem minmax(0, 1fr)",
  padding: `0 ${vars.space["2xl"]}`,
  width: "100%",
  "@media": {
    [media.compact]: {
      gap: vars.space.lg,
      gridTemplateAreas: '"actions" "switcher" "detail"',
      gridTemplateColumns: "minmax(0, 1fr)",
    },
    [media.narrow]: {
      padding: `0 ${vars.space.md}`,
    },
  },
});

export const leagueSidebar = style({
  background: `color-mix(in srgb, ${vars.color.surfaceStrong} 70%, transparent)`,
  border: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  display: "flex",
  flexDirection: "column",
  minHeight: "30rem",
  overflow: "hidden",
  "@media": {
    [media.compact]: {
      display: "contents",
    },
    [media.shortLandscape]: {
      minHeight: 0,
    },
  },
});

export const sidebarTitle = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.bold,
  margin: 0,
  padding: `${vars.space.lg} ${vars.space.lg} ${vars.space.md}`,
  "@media": {
    [media.compact]: {
      clip: "rect(0 0 0 0)",
      clipPath: "inset(50%)",
      height: "1px",
      overflow: "hidden",
      position: "absolute",
      whiteSpace: "nowrap",
      width: "1px",
    },
  },
});

export const leagueSwitcher = style({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  "@media": {
    [media.compact]: {
      gap: vars.space.sm,
      gridArea: "switcher",
      overflowX: "auto",
      overscrollBehaviorX: "contain",
      paddingBottom: vars.space.xxs,
      scrollbarWidth: "none",
      WebkitOverflowScrolling: "touch",
      flexDirection: "row",
    },
  },
});

export const leagueSwitchButton = style({
  alignItems: "center",
  appearance: "none",
  background: "transparent",
  border: 0,
  borderLeft: `${vars.space.xxs} solid transparent`,
  color: vars.color.textMuted,
  cursor: "pointer",
  display: "grid",
  fontFamily: vars.font.body,
  gap: vars.space.md,
  gridTemplateColumns: "2.5rem minmax(0, 1fr)",
  minHeight: vars.size.controlHeight,
  padding: vars.space.md,
  textAlign: "left",
  transition: `background ${vars.duration.fast} ${vars.easing.standard}, border-color ${vars.duration.fast} ${vars.easing.standard}, color ${vars.duration.fast} ${vars.easing.standard}`,
  selectors: {
    "&[aria-pressed='true']": {
      background: `linear-gradient(90deg, ${vars.color.accentTint}, transparent)`,
      borderLeftColor: vars.color.accentLogo,
      color: vars.color.text,
    },
    "&:hover": {
      background: `color-mix(in srgb, ${vars.color.text} 4%, transparent)`,
      color: vars.color.text,
    },
    "&:focus-visible": {
      boxShadow: `inset ${vars.shadow.focus}`,
      outline: "none",
    },
  },
  "@media": {
    [media.compact]: {
      border: `${vars.size.borderWidth} solid ${vars.color.border}`,
      borderRadius: vars.radius.pill,
      flex: "0 0 auto",
      gridTemplateColumns: "1fr",
      minHeight: "2.75rem",
      padding: `${vars.space.sm} ${vars.space.lg}`,
      selectors: {
        "&[aria-pressed='true']": {
          background: vars.color.accentTint,
          borderColor: vars.color.accentLogo,
        },
      },
    },
  },
});

export const leagueSwitchIcon = style({
  alignItems: "center",
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.pill,
  color: "currentColor",
  display: "flex",
  height: "2.5rem",
  justifyContent: "center",
  width: "2.5rem",
  "@media": {
    [media.compact]: { display: "none" },
  },
});

export const leagueSwitchCopy = style({
  display: "grid",
  gap: vars.space.xxs,
  minWidth: 0,
});

export const leagueSwitchName = style({
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.bold,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const leagueSwitchMeta = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  "@media": {
    [media.compact]: { display: "none" },
  },
});

export const leagueActions = style({
  display: "grid",
  gap: vars.space.sm,
  marginTop: "auto",
  padding: vars.space.lg,
  "@media": {
    [media.compact]: {
      gridArea: "actions",
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
      padding: 0,
    },
    [media.shortLandscape]: {
      marginTop: 0,
      padding: vars.space.md,
    },
  },
});

const leagueAction = {
  alignItems: "center",
  appearance: "none" as const,
  borderRadius: vars.radius.md,
  cursor: "pointer",
  display: "flex",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.bold,
  gap: vars.space.sm,
  justifyContent: "center",
  minHeight: vars.size.controlHeight,
  padding: `${vars.space.md} ${vars.space.lg}`,
  transition: `transform ${vars.duration.fast} ${vars.easing.standard}, filter ${vars.duration.fast} ${vars.easing.standard}, border-color ${vars.duration.fast} ${vars.easing.standard}`,
};

export const primaryLeagueAction = style({
  ...leagueAction,
  background: `linear-gradient(135deg, ${vars.color.accentLogo}, color-mix(in srgb, ${vars.color.accentLogo} 82%, white))`,
  border: `${vars.size.borderWidth} solid color-mix(in srgb, ${vars.color.accentLogo} 70%, white)`,
  boxShadow: `0 ${vars.space.sm} ${vars.space.xl} ${vars.color.accentGlow}`,
  color: vars.color.accentText,
  selectors: {
    "&:hover": { filter: "brightness(1.06)", transform: "translateY(-1px)" },
    "&:focus-visible": { boxShadow: vars.shadow.focus, outline: "none" },
    "&:active": { transform: "translateY(0) scale(0.98)" },
  },
});

export const secondaryLeagueAction = style({
  ...leagueAction,
  background: vars.color.surfaceStrong,
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  color: vars.color.text,
  selectors: {
    "&:hover": {
      borderColor: vars.color.accentLogo,
      transform: "translateY(-1px)",
    },
    "&:focus-visible": { boxShadow: vars.shadow.focus, outline: "none" },
    "&:active": { transform: "translateY(0) scale(0.98)" },
  },
});

export const leagueDetail = style({
  minWidth: 0,
  "@media": {
    [media.compact]: { gridArea: "detail" },
  },
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
  background: `linear-gradient(145deg, color-mix(in srgb, ${vars.color.surfaceStrong} 96%, ${vars.color.accentLogo}) 0%, ${vars.color.surfaceStrong} 48%, color-mix(in srgb, ${vars.color.backdropStrong} 70%, ${vars.color.surfaceStrong}) 100%)`,
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.lg,
  boxShadow: `${vars.shadow.panel}, inset 0 1px 0 color-mix(in srgb, ${vars.color.text} 6%, transparent)`,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

export const leagueHeader = style({
  alignItems: "center",
  display: "grid",
  gap: vars.space.lg,
  gridTemplateColumns: "4rem minmax(0, 1fr) auto",
  padding: `${vars.space["2xl"]} ${vars.space["2xl"]} ${vars.space.lg}`,
  "@media": {
    [media.narrow]: {
      gap: vars.space.md,
      gridTemplateColumns: "3.25rem minmax(0, 1fr) auto",
      padding: `${vars.space.lg} ${vars.space.lg} ${vars.space.md}`,
    },
  },
});

export const leagueIdentityIcon = style({
  alignItems: "center",
  aspectRatio: "1",
  background: vars.color.accentTint,
  border: `${vars.size.borderWidth} solid color-mix(in srgb, ${vars.color.accentLogo} 42%, transparent)`,
  borderRadius: vars.radius.pill,
  color: vars.color.accentLogo,
  display: "flex",
  justifyContent: "center",
  width: "4rem",
  "@media": {
    [media.narrow]: { width: "3.25rem" },
  },
});

export const leagueTitleStack = style({
  display: "grid",
  gap: vars.space.xxs,
  minWidth: 0,
});

export const leagueTitle = style({
  fontSize: vars.fontSize["2xl"],
  fontWeight: vars.fontWeight.black,
  letterSpacing: "-0.04em",
  lineHeight: vars.lineHeight.tight,
  margin: 0,
  color: vars.color.text,
  overflowWrap: "anywhere",
  "@media": {
    [media.narrow]: { fontSize: vars.fontSize.xl },
  },
});

export const memberCount = style({
  alignItems: "center",
  color: vars.color.textMuted,
  display: "flex",
  flexWrap: "wrap",
  fontSize: vars.fontSize.base,
  gap: vars.space.sm,
  "@media": {
    [media.narrow]: { fontSize: vars.fontSize.sm, gap: vars.space.xs },
  },
});

export const metaDot = style({
  color: vars.color.accentLogo,
  fontWeight: vars.fontWeight.bold,
});

export const manageMenu = style({
  position: "relative",
  zIndex: 8,
});

export const manageTrigger = style({
  alignItems: "center",
  appearance: "none",
  background: "transparent",
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.pill,
  color: vars.color.text,
  cursor: "pointer",
  display: "flex",
  height: vars.size.controlHeight,
  justifyContent: "center",
  listStyle: "none",
  width: vars.size.controlHeight,
  selectors: {
    "&::-webkit-details-marker": { display: "none" },
    "&:hover": { borderColor: vars.color.accentLogo },
    "&:focus-visible": { boxShadow: vars.shadow.focus, outline: "none" },
  },
  "@media": {
    [media.narrow]: { height: "2.75rem", width: "2.75rem" },
  },
});

export const manageDropdown = style({
  background: vars.color.surfaceRaised,
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.panel,
  display: "grid",
  gap: vars.space.xxs,
  minWidth: "10rem",
  padding: vars.space.sm,
  position: "absolute",
  right: 0,
  top: `calc(100% + ${vars.space.sm})`,
});

export const manageAction = style({
  appearance: "none",
  background: "transparent",
  border: 0,
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  cursor: "pointer",
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.semibold,
  minHeight: "2.75rem",
  padding: `${vars.space.sm} ${vars.space.md}`,
  textAlign: "left",
  selectors: {
    "&:hover": { background: vars.color.accentTint },
    "&:focus-visible": { boxShadow: vars.shadow.focus, outline: "none" },
    "&:disabled": { cursor: "wait", opacity: 0.62 },
  },
});

export const manageActionDanger = style([
  manageAction,
  {
    color: vars.color.danger,
    selectors: {
      "&:hover": { background: vars.color.dangerSoft },
    },
  },
]);

export const inviteAction = style({
  alignItems: "center",
  appearance: "none",
  background: `color-mix(in srgb, ${vars.color.backdropStrong} 36%, transparent)`,
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.md,
  color: vars.color.textMuted,
  cursor: "pointer",
  display: "flex",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.base,
  justifyContent: "space-between",
  margin: `0 ${vars.space["2xl"]}`,
  minHeight: vars.size.controlHeight,
  padding: `${vars.space.md} ${vars.space.lg}`,
  transition: `background ${vars.duration.fast} ${vars.easing.standard}, border-color ${vars.duration.fast} ${vars.easing.standard}`,
  selectors: {
    "&:hover": {
      background: vars.color.accentTint,
      borderColor: `color-mix(in srgb, ${vars.color.accentLogo} 52%, transparent)`,
    },
    "&:focus-visible": { boxShadow: vars.shadow.focus, outline: "none" },
  },
  "@media": {
    [media.narrow]: {
      margin: `0 ${vars.space.lg}`,
      padding: `${vars.space.md} ${vars.space.md}`,
    },
  },
});

export const inviteLabel = style({
  alignItems: "center",
  display: "flex",
  gap: vars.space.sm,
  minWidth: 0,
});

export const inviteCode = style({
  color: vars.color.text,
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontWeight: vars.fontWeight.semibold,
  letterSpacing: "0.06em",
});

export const copyFeedback = style({
  alignItems: "center",
  color: vars.color.text,
  display: "flex",
  fontSize: vars.fontSize.sm,
  gap: vars.space.sm,
});

export const copyFeedbackText = style({ display: "none" });

export const copyFeedbackTextVisible = style({
  color: vars.color.accentLogo,
  display: "inline",
  fontWeight: vars.fontWeight.semibold,
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
  alignItems: "center",
  color: vars.color.textMuted,
  display: "flex",
  fontSize: vars.fontSize.base,
  gap: vars.space.md,
  lineHeight: vars.lineHeight.body,
  margin: `${vars.space.lg} ${vars.space["2xl"]} 0`,
  padding: `${vars.space.sm} 0`,
  "@media": {
    [media.narrow]: {
      alignItems: "flex-start",
      margin: `${vars.space.md} ${vars.space.lg} 0`,
    },
  },
});

export const noticeIcon = style({
  alignItems: "center",
  border: `${vars.size.borderWidth} solid ${vars.color.accentLogo}`,
  borderRadius: vars.radius.pill,
  color: vars.color.accentLogo,
  display: "flex",
  flex: `0 0 ${vars.space["2xl"]}`,
  fontFamily: "Georgia, serif",
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.bold,
  height: vars.space["2xl"],
  justifyContent: "center",
});

export const winner = style({
  alignItems: "center",
  background: vars.color.accentTint,
  borderBottom: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderTop: `${vars.size.borderWidth} solid ${vars.color.border}`,
  display: "flex",
  justifyContent: "space-between",
  marginTop: vars.space.lg,
  padding: `${vars.space.md} ${vars.space["2xl"]}`,
  "@media": {
    [media.narrow]: { padding: `${vars.space.md} ${vars.space.lg}` },
  },
});

export const winnerLabel = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  textTransform: "uppercase",
  letterSpacing: "0.15em",
});

export const winnerName = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.tight,
});

export const winnerScore = style({
  color: vars.color.accentLogo,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.bold,
});

export const memberList = style({
  display: "flex",
  flexDirection: "column",
  marginTop: vars.space.lg,
});

export const memberListHeader = style({
  display: "grid",
  gridTemplateColumns: "3rem minmax(0, 1fr) minmax(7rem, auto)",
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space["2xl"]}`,
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  fontWeight: vars.fontWeight.bold,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderTop: `${vars.size.borderWidth} solid ${vars.color.border}`,
  "@media": {
    [media.narrow]: {
      gridTemplateColumns: "2.5rem minmax(0, 1fr) minmax(6.5rem, auto)",
      padding: `${vars.space.sm} ${vars.space.lg}`,
    },
  },
});

export const scoreHeading = style({ textAlign: "right" });

export const memberRow = style({
  alignItems: "center",
  display: "grid",
  gridTemplateColumns: "3rem minmax(0, 1fr) minmax(7rem, auto)",
  gap: vars.space.sm,
  padding: `${vars.space.md} ${vars.space["2xl"]}`,
  borderBottom: `${vars.size.borderWidth} solid ${vars.color.border}`,
  minHeight: "5.25rem",
  color: vars.color.text,
  fontSize: vars.fontSize.base,
  "@media": {
    [media.narrow]: {
      gridTemplateColumns: "2.5rem minmax(0, 1fr) minmax(6.5rem, auto)",
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

export const memberRowCurrent = style({
  background: `linear-gradient(90deg, ${vars.color.accentTint}, color-mix(in srgb, ${vars.color.accentLogo} 13%, transparent), ${vars.color.accentTint})`,
});

export const memberRank = style({
  alignItems: "center",
  border: `${vars.size.borderWidth} solid transparent`,
  borderRadius: vars.radius.pill,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.textMuted,
  display: "flex",
  fontSize: vars.fontSize.base,
  height: "2.5rem",
  justifyContent: "center",
  width: "2.5rem",
});

export const memberRankFirst = style({
  background: vars.color.accentTint,
  borderColor: `color-mix(in srgb, ${vars.color.accentLogo} 54%, transparent)`,
  color: vars.color.accentLogo,
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

export const memberDisplayName = style({
  fontSize: vars.fontSize.lg,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  "@media": {
    [media.narrow]: { fontSize: vars.fontSize.base },
  },
});

export const memberAvatar = style({
  alignItems: "center",
  aspectRatio: "1",
  ...glassControl,
  borderRadius: "50%",
  color: vars.color.textMuted,
  display: "inline-flex",
  flex: `0 0 ${vars.space["4xl"]}`,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  justifyContent: "center",
  overflow: "hidden",
  width: vars.space["4xl"],
});

export const youLabel = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
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
  color: vars.color.accentLogo,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
});

export const score = style({
  fontWeight: vars.fontWeight.bold,
  textAlign: "right",
  fontSize: vars.fontSize.lg,
});

export const scoreUnit = style({
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.semibold,
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
  color: vars.color.textSubtle,
  cursor: "pointer",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  padding: 0,
  selectors: {
    "&:hover": { color: vars.color.danger },
    "&:focus-visible": {
      color: vars.color.danger,
      outline: `solid ${vars.size.borderWidth} currentColor`,
      outlineOffset: vars.space.xxs,
    },
    "&:disabled": {
      cursor: "wait",
      opacity: 0.62,
    },
  },
});

export const empty = style([
  bodyTextMuted,
  {
    alignItems: "center",
    background: vars.color.surfaceChrome,
    border: `${vars.size.borderWidth} solid ${vars.color.border}`,
    borderRadius: vars.radius.lg,
    display: "flex",
    flexDirection: "column",
    fontSize: vars.fontSize.base,
    justifyContent: "center",
    minHeight: "24rem",
    textAlign: "center",
    padding: vars.space["2xl"],
  },
]);

export const emptyIcon = style({
  alignItems: "center",
  background: vars.color.accentTint,
  border: `${vars.size.borderWidth} solid color-mix(in srgb, ${vars.color.accentLogo} 40%, transparent)`,
  borderRadius: vars.radius.pill,
  color: vars.color.accentLogo,
  display: "flex",
  height: vars.space["5xl"],
  justifyContent: "center",
  marginBottom: vars.space.lg,
  width: vars.space["5xl"],
});

export const emptyTitle = style({
  color: vars.color.text,
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.bold,
  margin: 0,
});

export const emptyCopy = style({
  margin: `${vars.space.sm} 0 0`,
  maxWidth: "22rem",
});

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
  maxWidth: vars.size.contentWidthWide,
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
