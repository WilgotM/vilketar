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
    text: "Sportögonblick",
  },
  {
    key: "featured-swedish-classics",
    routeSlug: "svenska-klassiker",
    slugPath: ["svenska-klassiker", "allt"],
    text: "Svenska klassiker",
  },
  {
    key: "featured-sweden",
    routeSlug: "sverige",
    slugPath: ["sverige", "allt"],
    text: "Sverige",
  },
  {
    key: "featured-us-presidents",
    routeSlug: "usas-presidenter",
    slugPath: ["leaders", "politicians", "americas", "us"],
    text: "USA:s presidenter",
  },
  {
    key: "featured-english-monarchs",
    routeSlug: "engelska-regenter",
    slugPath: ["leaders", "rulers", "europe", "england"],
    text: "Engelska regenter",
  },
  {
    key: "featured-roman-empire",
    routeSlug: "romerska-kejsare",
    slugPath: ["leaders", "rulers", "europe", "rome"],
    text: "Romerska kejsare",
  },
  {
    key: "featured-wars",
    routeSlug: "krig",
    slugPath: ["history", "wars"],
    text: "Krig",
  },
  {
    key: "featured-films",
    routeSlug: "film",
    slugPath: ["entertainment", "films"],
    text: "Film",
  },
  {
    key: "featured-music",
    routeSlug: "musik",
    slugPath: ["entertainment", "music"],
    text: "Musik",
  },
  {
    key: "featured-books",
    routeSlug: "bocker",
    slugPath: ["entertainment", "books"],
    text: "Böcker",
  },
  {
    key: "featured-video-games",
    routeSlug: "tv-spel",
    slugPath: ["technology", "video-games"],
    text: "TV-spel",
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
