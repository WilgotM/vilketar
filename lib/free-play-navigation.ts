export type FreePlayRootView = "browse" | "featured" | "landing";

export interface FeaturedFreePlayDeck {
  key: string;
  routeSlug: string;
  slugPath: string[];
  text: string;
}

export const FEATURED_FREE_PLAY_DECKS: readonly FeaturedFreePlayDeck[] = [
  {
    key: "featured-sport-moments",
    routeSlug: "sportogonblick",
    slugPath: ["sport", "sportogonblick"],
    text: "Sport",
  },
  {
    key: "featured-swedish-classics",
    routeSlug: "svenska-klassiker",
    slugPath: ["svenska-klassiker", "allt"],
    text: "Svenska klassiker",
  },
  {
    key: "featured-music",
    routeSlug: "musik",
    slugPath: ["entertainment", "music"],
    text: "Musik",
  },
] as const;

export function getRootFreePlayPath(view: FreePlayRootView): string {
  switch (view) {
    case "browse":
      return "/play/browse";
    case "featured":
      return "/play/featured";
    case "landing":
    default:
      return "/play";
  }
}

export function prefixPlayPath(path: string, view: FreePlayRootView): string {
  if (
    view !== "browse" ||
    !path.startsWith("/play") ||
    path.startsWith("/play/browse")
  ) {
    return path;
  }

  const suffix = path.slice("/play".length);
  return `${getRootFreePlayPath("browse")}${suffix}`;
}
