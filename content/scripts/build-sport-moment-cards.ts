import { Card } from "../../types/cards";

type DifficultyBand = "major" | "standard" | "niche";

type SportCandidate = {
  competition: string;
  fallbackImage: string;
  host?: string;
  pageTitle: string;
  subtitle: string;
  type: "host" | "winner";
  year: number;
  weight: DifficultyBand;
};

type PageMetadata = {
  image: string;
  pageTitle: string;
  qid: string;
  requestedTitle: string;
};

type EntityMetadata = {
  image: string;
  label: string;
  locations: string[];
  winners: string[];
};

const USER_AGENT =
  "VilketAr/0.1 (https://vilketar.pages.dev; Wikimedia metadata for Swedish timeline game)";

const WIKIPEDIA_API_ENDPOINT = "https://sv.wikipedia.org/w/api.php";
const WIKIDATA_API_ENDPOINT = "https://www.wikidata.org/w/api.php";

const SPORT_MOMENT_FALLBACK_IMAGES = {
  basketball: "Basketball.png",
  cycling: "Tour_de_France_2022_-_Stage_13_-_finish_line.jpg",
  f1: "F1.svg",
  football: "Football_(soccer_ball).svg",
  iceHockey: "Ice_hockey_pictogram.svg",
  olympics: "Olympic_flag.svg",
  tennis: "Tennis_ball.svg",
} as const;

const PAGE_VIEW_WEIGHTS = {
  major: 360_000,
  niche: 140_000,
  standard: 240_000,
} satisfies Record<DifficultyBand, number>;

const SUMMER_OLYMPICS_YEARS = [
  1896, 1900, 1904, 1908, 1912, 1920, 1924, 1928, 1932, 1936, 1948, 1952, 1956,
  1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008,
  2012, 2016, 2020, 2024,
];

const WINTER_OLYMPICS_YEARS = [
  1924, 1928, 1932, 1936, 1948, 1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980,
  1984, 1988, 1992, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026,
];

const SUMMER_OLYMPICS_HOSTS = new Map([
  [1896, "Aten"],
  [1900, "Paris"],
  [1904, "Saint Louis"],
  [1908, "London"],
  [1912, "Stockholm"],
  [1920, "Antwerpen"],
  [1924, "Paris"],
  [1928, "Amsterdam"],
  [1932, "Los Angeles"],
  [1936, "Berlin"],
  [1948, "London"],
  [1952, "Helsingfors"],
  [1956, "Melbourne"],
  [1960, "Rom"],
  [1964, "Tokyo"],
  [1968, "Mexico City"],
  [1972, "München"],
  [1976, "Montréal"],
  [1980, "Moskva"],
  [1984, "Los Angeles"],
  [1988, "Seoul"],
  [1992, "Barcelona"],
  [1996, "Atlanta"],
  [2000, "Sydney"],
  [2004, "Aten"],
  [2008, "Peking"],
  [2012, "London"],
  [2016, "Rio de Janeiro"],
  [2020, "Tokyo"],
  [2024, "Paris"],
]);

const WINTER_OLYMPICS_HOSTS = new Map([
  [1924, "Chamonix"],
  [1928, "St. Moritz"],
  [1932, "Lake Placid"],
  [1936, "Garmisch-Partenkirchen"],
  [1948, "St. Moritz"],
  [1952, "Oslo"],
  [1956, "Cortina d'Ampezzo"],
  [1960, "Squaw Valley"],
  [1964, "Innsbruck"],
  [1968, "Grenoble"],
  [1972, "Sapporo"],
  [1976, "Innsbruck"],
  [1980, "Lake Placid"],
  [1984, "Sarajevo"],
  [1988, "Calgary"],
  [1992, "Albertville"],
  [1994, "Lillehammer"],
  [1998, "Nagano"],
  [2002, "Salt Lake City"],
  [2006, "Turin"],
  [2010, "Vancouver"],
  [2014, "Sotji"],
  [2018, "Pyeongchang"],
  [2022, "Peking"],
  [2026, "Milano-Cortina"],
]);

const FOOTBALL_WORLD_CUP_YEARS = [
  1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986,
  1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022,
];

const WOMENS_FOOTBALL_WORLD_CUP_YEARS = [
  1991, 1995, 1999, 2003, 2007, 2011, 2015, 2019, 2023,
];

const FOOTBALL_EURO_YEARS = [
  1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008,
  2012, 2016, 2020, 2024,
];

const WOMENS_FOOTBALL_EURO_YEARS = [
  1984, 1987, 1989, 1991, 1993, 1995, 1997, 2001, 2005, 2009, 2013, 2017, 2022,
  2025,
];

const TENNIS_TOURNAMENTS = [
  {
    competition: "Australian Open",
    pagePrefix: "Australiska öppna",
    subtitle: "Grand Slam-tennis",
  },
  {
    competition: "Franska öppna",
    pagePrefix: "Franska öppna",
    subtitle: "Grand Slam-tennis",
  },
  {
    competition: "US Open",
    pagePrefix: "US Open i tennis",
    subtitle: "Grand Slam-tennis",
  },
  {
    competition: "Wimbledon",
    pagePrefix: "Wimbledonmästerskapen",
    subtitle: "Grand Slam-tennis",
  },
] as const;

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function toRoman(value: number): string {
  const numerals: Array<[number, string]> = [
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let remaining = value;
  let result = "";

  for (const [amount, numeral] of numerals) {
    while (remaining >= amount) {
      result += numeral;
      remaining -= amount;
    }
  }

  return result;
}

function superBowlTitle(index: number): string {
  return index === 50 ? "Super Bowl 50" : `Super Bowl ${toRoman(index)}`;
}

function createCandidates(): SportCandidate[] {
  return [
    ...SUMMER_OLYMPICS_YEARS.map((year) => ({
      competition: "Sommar-OS",
      fallbackImage: SPORT_MOMENT_FALLBACK_IMAGES.olympics,
      host: SUMMER_OLYMPICS_HOSTS.get(year),
      pageTitle: `Olympiska sommarspelen ${year}`,
      subtitle: "Olympiskt sommarspel",
      type: "host" as const,
      weight: "major" as const,
      year,
    })),
    ...WINTER_OLYMPICS_YEARS.map((year) => ({
      competition: "Vinter-OS",
      fallbackImage: SPORT_MOMENT_FALLBACK_IMAGES.olympics,
      host: WINTER_OLYMPICS_HOSTS.get(year),
      pageTitle: `Olympiska vinterspelen ${year}`,
      subtitle: "Olympiskt vinterspel",
      type: "host" as const,
      weight: "major" as const,
      year,
    })),
    ...FOOTBALL_WORLD_CUP_YEARS.map((year) => ({
      competition: "fotbolls-VM",
      fallbackImage: SPORT_MOMENT_FALLBACK_IMAGES.football,
      pageTitle: `Världsmästerskapet i fotboll ${year}`,
      subtitle: "Herrarnas fotbolls-VM",
      type: "winner" as const,
      weight: "major" as const,
      year,
    })),
    ...WOMENS_FOOTBALL_WORLD_CUP_YEARS.map((year) => ({
      competition: "damernas fotbolls-VM",
      fallbackImage: SPORT_MOMENT_FALLBACK_IMAGES.football,
      pageTitle: `Världsmästerskapet i fotboll för damer ${year}`,
      subtitle: "Damernas fotbolls-VM",
      type: "winner" as const,
      weight: "standard" as const,
      year,
    })),
    ...FOOTBALL_EURO_YEARS.map((year) => ({
      competition: "fotbolls-EM",
      fallbackImage: SPORT_MOMENT_FALLBACK_IMAGES.football,
      pageTitle: `Europamästerskapet i fotboll ${year}`,
      subtitle: "Herrarnas fotbolls-EM",
      type: "winner" as const,
      weight: "major" as const,
      year,
    })),
    ...WOMENS_FOOTBALL_EURO_YEARS.map((year) => ({
      competition: "damernas fotbolls-EM",
      fallbackImage: SPORT_MOMENT_FALLBACK_IMAGES.football,
      pageTitle: `Europamästerskapet i fotboll för damer ${year}`,
      subtitle: "Damernas fotbolls-EM",
      type: "winner" as const,
      weight: "standard" as const,
      year,
    })),
    ...range(1950, 2025).map((year) => ({
      competition: "Formel 1-VM",
      fallbackImage: SPORT_MOMENT_FALLBACK_IMAGES.f1,
      pageTitle: `Formel 1-VM ${year}`,
      subtitle: "Formel 1-säsong",
      type: "winner" as const,
      weight: year >= 1980 ? ("standard" as const) : ("niche" as const),
      year,
    })),
    ...range(1903, 2025).map((year) => ({
      competition: "Tour de France",
      fallbackImage: SPORT_MOMENT_FALLBACK_IMAGES.cycling,
      pageTitle: `Tour de France ${year}`,
      subtitle: "Cykelklassiker",
      type: "winner" as const,
      weight: year >= 1980 ? ("standard" as const) : ("niche" as const),
      year,
    })),
    ...range(1, 59).map((index) => ({
      competition: "Super Bowl",
      fallbackImage: SPORT_MOMENT_FALLBACK_IMAGES.football,
      pageTitle: superBowlTitle(index),
      subtitle: "NFL-final",
      type: "winner" as const,
      weight: index >= 20 ? ("standard" as const) : ("niche" as const),
      year: 1966 + index,
    })),
    ...range(1992, 2024).map((year) => ({
      competition: "Champions League",
      fallbackImage: SPORT_MOMENT_FALLBACK_IMAGES.football,
      pageTitle: `Uefa Champions League ${year}/${year + 1}`,
      subtitle: "Champions League-säsong",
      type: "winner" as const,
      weight: "major" as const,
      year: year + 1,
    })),
    ...range(1992, 2024).map((year) => ({
      competition: "Champions League-finalen",
      fallbackImage: SPORT_MOMENT_FALLBACK_IMAGES.football,
      pageTitle: `Finalen av Uefa Champions League ${year}/${year + 1}`,
      subtitle: "Champions League-final",
      type: "winner" as const,
      weight: "major" as const,
      year: year + 1,
    })),
    ...range(2009, 2024).map((year) => ({
      competition: "Europa League",
      fallbackImage: SPORT_MOMENT_FALLBACK_IMAGES.football,
      pageTitle: `Uefa Europa League ${year}/${year + 1}`,
      subtitle: "Europa League-säsong",
      type: "winner" as const,
      weight: "standard" as const,
      year: year + 1,
    })),
    ...TENNIS_TOURNAMENTS.flatMap((tournament) =>
      range(1968, 2025).map((year) => ({
        competition: tournament.competition,
        fallbackImage: SPORT_MOMENT_FALLBACK_IMAGES.tennis,
        pageTitle: `${tournament.pagePrefix} ${year}`,
        subtitle: tournament.subtitle,
        type: "winner" as const,
        weight: year >= 1990 ? ("standard" as const) : ("niche" as const),
        year,
      })),
    ),
  ];
}

async function sleep(ms: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchJsonWithRetry<T>(url: string): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
      await sleep(400 * (attempt + 1));
    }
  }

  throw lastError;
}

function chunk<T>(values: readonly T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }

  return chunks;
}

function slugFromTitle(title: string): string {
  return encodeURIComponent(title.replaceAll(" ", "_"));
}

async function fetchPageMetadata(
  pageTitles: readonly string[],
): Promise<Map<string, PageMetadata>> {
  const metadata = new Map<string, PageMetadata>();

  for (const titles of chunk(Array.from(new Set(pageTitles)), 45)) {
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      origin: "*",
      piprop: "name",
      prop: "pageimages|pageprops",
      redirects: "1",
      titles: titles.join("|"),
    });
    const data = await fetchJsonWithRetry<{
      query?: {
        normalized?: Array<{ from: string; to: string }>;
        pages?: Record<
          string,
          {
            missing?: boolean;
            ns?: number;
            pageimage?: string;
            pageprops?: { wikibase_item?: string };
            title?: string;
          }
        >;
        redirects?: Array<{ from: string; to: string }>;
      };
    }>(`${WIKIPEDIA_API_ENDPOINT}?${params}`);
    const titleAliases = new Map<string, string>();

    for (const normalized of data.query?.normalized ?? []) {
      titleAliases.set(normalized.to, normalized.from);
    }

    for (const redirect of data.query?.redirects ?? []) {
      titleAliases.set(redirect.to, redirect.from);
    }

    for (const page of Object.values(data.query?.pages ?? {})) {
      if (
        page.missing ||
        page.ns !== 0 ||
        !page.title ||
        !page.pageprops?.wikibase_item
      ) {
        continue;
      }

      const requestedTitle = titleAliases.get(page.title) ?? page.title;
      metadata.set(requestedTitle, {
        image: page.pageimage ?? "",
        pageTitle: page.title,
        qid: page.pageprops.wikibase_item,
        requestedTitle,
      });
    }

    await sleep(100);
  }

  return metadata;
}

function claimEntityIds(
  claims: Record<string, unknown[]> | undefined,
  property: string,
): string[] {
  return (claims?.[property] ?? [])
    .map((claim) => {
      if (!claim || typeof claim !== "object") {
        return null;
      }

      const mainsnak = "mainsnak" in claim ? claim.mainsnak : null;
      if (
        !mainsnak ||
        typeof mainsnak !== "object" ||
        !("datavalue" in mainsnak)
      ) {
        return null;
      }

      const datavalue = mainsnak.datavalue;
      if (
        !datavalue ||
        typeof datavalue !== "object" ||
        !("value" in datavalue)
      ) {
        return null;
      }

      const value = datavalue.value;
      if (!value || typeof value !== "object" || !("id" in value)) {
        return null;
      }

      return typeof value.id === "string" ? value.id : null;
    })
    .filter((id): id is string => id !== null);
}

function claimString(
  claims: Record<string, unknown[]> | undefined,
  property: string,
): string {
  const claim = claims?.[property]?.[0];
  if (!claim || typeof claim !== "object" || !("mainsnak" in claim)) {
    return "";
  }

  const mainsnak = claim.mainsnak;
  if (!mainsnak || typeof mainsnak !== "object" || !("datavalue" in mainsnak)) {
    return "";
  }

  const datavalue = mainsnak.datavalue;
  if (!datavalue || typeof datavalue !== "object" || !("value" in datavalue)) {
    return "";
  }

  return typeof datavalue.value === "string" ? datavalue.value : "";
}

async function fetchEntityMetadata(
  qids: readonly string[],
): Promise<Map<string, EntityMetadata>> {
  const entityMetadata = new Map<string, EntityMetadata>();
  const pending = new Set(qids);

  for (let depth = 0; depth < 3 && pending.size > 0; depth += 1) {
    const batchIds = Array.from(pending);
    pending.clear();

    for (const ids of chunk(batchIds, 45)) {
      const params = new URLSearchParams({
        action: "wbgetentities",
        format: "json",
        ids: ids.join("|"),
        languages: "sv|en",
        origin: "*",
        props: "labels|claims",
      });
      const data = await fetchJsonWithRetry<{
        entities?: Record<
          string,
          {
            claims?: Record<string, unknown[]>;
            labels?: {
              en?: { value?: string };
              sv?: { value?: string };
            };
          }
        >;
      }>(`${WIKIDATA_API_ENDPOINT}?${params}`);

      for (const [qid, entity] of Object.entries(data.entities ?? {})) {
        const winners = claimEntityIds(entity.claims, "P1346");
        const locations = [
          ...claimEntityIds(entity.claims, "P276"),
          ...claimEntityIds(entity.claims, "P17"),
        ];

        entityMetadata.set(qid, {
          image: claimString(entity.claims, "P18"),
          label: entity.labels?.sv?.value ?? entity.labels?.en?.value ?? qid,
          locations,
          winners,
        });

        for (const linkedQid of [...winners, ...locations]) {
          if (!entityMetadata.has(linkedQid)) {
            pending.add(linkedQid);
          }
        }
      }

      await sleep(100);
    }
  }

  return entityMetadata;
}

function firstLabel(
  ids: readonly string[],
  entities: ReadonlyMap<string, EntityMetadata>,
): string {
  return (
    ids
      .map((id) => entities.get(id)?.label ?? "")
      .find((label) => label.length > 0) ?? ""
  );
}

function firstImage(
  ids: readonly string[],
  entities: ReadonlyMap<string, EntityMetadata>,
): string {
  return (
    ids
      .map((id) => entities.get(id)?.image ?? "")
      .find((image) => image.length > 0) ?? ""
  );
}

function normalizeWinnerLabel(label: string): string {
  const footballTeamMatch = label.match(
    /^(.+?)(?:s|:s)? (?:herr|dam|kvinno)landslag i fotboll$/i,
  );
  if (footballTeamMatch) {
    return footballTeamMatch[1]
      .replace(/Nederländern?a$/i, "Nederländerna")
      .replace(/Förenta staterna/i, "USA");
  }

  return label;
}

function createCard(
  candidate: SportCandidate,
  page: PageMetadata,
  entities: ReadonlyMap<string, EntityMetadata>,
): Card {
  const entity = entities.get(page.qid);
  const winner = normalizeWinnerLabel(
    firstLabel(entity?.winners ?? [], entities),
  );
  const location =
    candidate.host ?? firstLabel(entity?.locations ?? [], entities);
  const title =
    candidate.type === "host"
      ? location
        ? `${candidate.competition} hålls i ${location}`
        : `${candidate.competition} hålls`
      : winner
        ? `${winner} vinner ${candidate.competition}`
        : `${candidate.competition} avgörs`;
  const fact =
    candidate.type === "host"
      ? location
        ? `${candidate.competition} hålls i ${location}.`
        : `${candidate.competition} hålls.`
      : winner
        ? `${winner} vinner ${candidate.competition}.`
        : `${candidate.competition} avgörs.`;
  const image =
    page.image ||
    entity?.image ||
    firstImage(entity?.winners ?? [], entities) ||
    candidate.fallbackImage;

  return {
    fact,
    image,
    pageViews: PAGE_VIEW_WEIGHTS[candidate.weight],
    qid: page.qid,
    subtitle: candidate.subtitle,
    title,
    wikipediaSlug: slugFromTitle(page.pageTitle),
    year: candidate.year,
  };
}

export async function buildGeneratedSportMomentCards(): Promise<Card[]> {
  const candidates = createCandidates();
  const pages = await fetchPageMetadata(
    candidates.map((candidate) => candidate.pageTitle),
  );
  const availableCandidates = candidates.filter((candidate) => {
    return pages.has(candidate.pageTitle);
  });
  const entities = await fetchEntityMetadata(
    Array.from(
      new Set(
        availableCandidates
          .map((candidate) => pages.get(candidate.pageTitle)?.qid)
          .filter((qid): qid is string => !!qid),
      ),
    ),
  );
  const cards = availableCandidates.map((candidate) => {
    return createCard(candidate, pages.get(candidate.pageTitle)!, entities);
  });
  const dedupedCards = Array.from(
    new Map(cards.map((card) => [card.qid, card])).values(),
  );

  return dedupedCards.sort(
    (left, right) =>
      (right.pageViews ?? 0) - (left.pageViews ?? 0) || left.year - right.year,
  );
}
