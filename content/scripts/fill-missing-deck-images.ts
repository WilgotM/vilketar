import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { Card } from "../../types/cards";
import { getWikimediaUserAgent } from "../api-env";
import { fetchJson } from "../fetch";

const PUBLIC_DECKS_DIR = path.join("public", "decks");
const WIKIDATA_API_ENDPOINT = "https://www.wikidata.org/w/api.php";
const WIKIPEDIA_API_ENDPOINTS = [
  "https://sv.wikipedia.org/w/api.php",
  "https://en.wikipedia.org/w/api.php",
];
const BATCH_SIZE = 45;
const DEFAULT_FALLBACK_IMAGE = "Flag_of_Sweden.svg";
const MAX_ATTEMPTS = 4;
const REPAIR_FALLBACK_IMAGES = new Set([
  "Disambig_grey.svg",
  "Minecraft_cube.svg",
  "OOjs_UI_icon_logo.svg",
  "One_Battle_After_Another.jpg",
]);
const FALLBACK_IMAGES_BY_DECK_PREFIX: Array<[RegExp, string]> = [
  [/^all-swedish-classics-|^all-sweden/u, "Flag_of_Sweden.svg"],
  [/^all-sport-/u, "Olympic_flag.svg"],
  [
    /^all-entertainment-music|^all-entertainment-songs/u,
    "ABBA_-_TopPop_1974_5.png",
  ],
  [/^all-entertainment-/u, "Video-x-generic.svg"],
  [/^all-business-/u, "Wikidata-logo.svg"],
  [/^all-history-/u, "P_history.svg"],
  [/^all-leaders-/u, "Wikidata-logo.svg"],
  [/^all-people-/u, "Wikidata-logo.svg"],
  [/^all-architecture-/u, "P_architecture.svg"],
  [/^all-art-/u, "Nuvola_apps_kpaint.svg"],
  [/^all-engineering-/u, "Crystal_Clear_app_kservices.png"],
  [/^all-technology-/u, "Computer-aj_aj_ashton_01.svg"],
];

type DeckCards = {
  cards: Card[];
  deckId: string;
  filePath: string;
};

type WikidataEntityResponse = {
  entities?: Record<
    string,
    {
      claims?: Record<string, unknown[]>;
    }
  >;
};

type WikipediaPageImagesResponse = {
  query?: {
    normalized?: Array<{ from: string; to: string }>;
    pages?: Record<
      string,
      {
        missing?: boolean;
        ns?: number;
        pageimage?: string;
        title?: string;
      }
    >;
    redirects?: Array<{ from: string; to: string }>;
  };
};

function chunk<T>(items: readonly T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

async function sleep(ms: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchJsonWithRetry<T>(
  url: string,
  options: Parameters<typeof fetchJson<T>>[1],
): Promise<Awaited<ReturnType<typeof fetchJson<T>>>> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      return await fetchJson<T>(url, options);
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        await sleep(750 * attempt);
      }
    }
  }

  throw lastError;
}

function isSupportedImage(image: string | null | undefined): image is string {
  return !!image && !/\.tiff?$/iu.test(image);
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

function pageTitleFromSlug(slug: string | null): string | null {
  if (!slug) {
    return null;
  }

  try {
    return decodeURIComponent(slug).replaceAll("_", " ");
  } catch {
    return slug.replaceAll("_", " ");
  }
}

function getCategoryFallbackImage(deckId: string): string {
  return (
    FALLBACK_IMAGES_BY_DECK_PREFIX.find(([pattern]) =>
      pattern.test(deckId),
    )?.[1] ?? DEFAULT_FALLBACK_IMAGE
  );
}

function getFallbackImage(deck: DeckCards): string {
  return getCategoryFallbackImage(deck.deckId);
}

async function readDecks(): Promise<DeckCards[]> {
  const fileNames = (await readdir(PUBLIC_DECKS_DIR)).filter((fileName) => {
    return fileName.endsWith(".json") && fileName !== "index.json";
  });
  const decks: DeckCards[] = [];

  for (const fileName of fileNames) {
    const filePath = path.join(PUBLIC_DECKS_DIR, fileName);
    const cards = JSON.parse(await readFile(filePath, "utf8")) as Card[];
    decks.push({
      cards,
      deckId: fileName.replace(/\.json$/u, ""),
      filePath,
    });
  }

  return decks;
}

async function fetchWikidataImages(qids: readonly string[]) {
  const imagesByQid = new Map<string, string>();
  const userAgent = getWikimediaUserAgent();
  const uniqueQids = Array.from(
    new Set(qids.filter((qid) => /^Q\d+$/u.test(qid))),
  );

  for (const batch of chunk(uniqueQids, BATCH_SIZE)) {
    const response = await fetchJsonWithRetry<WikidataEntityResponse>(
      WIKIDATA_API_ENDPOINT,
      {
        headers: {
          "Api-User-Agent": userAgent,
          "User-Agent": userAgent,
        },
        searchParams: {
          action: "wbgetentities",
          format: "json",
          ids: batch.join("|"),
          props: "claims",
        },
        timeoutMs: 30_000,
      },
    );

    for (const [qid, entity] of Object.entries(response.data.entities ?? {})) {
      const image = claimString(entity.claims, "P18");
      if (isSupportedImage(image)) {
        imagesByQid.set(qid, image);
      }
    }
  }

  return imagesByQid;
}

async function fetchWikipediaImages(titles: readonly string[]) {
  const imagesByTitle = new Map<string, string>();
  const userAgent = getWikimediaUserAgent();
  const uniqueTitles = Array.from(new Set(titles.filter(Boolean)));

  for (const endpoint of WIKIPEDIA_API_ENDPOINTS) {
    const unresolvedTitles = uniqueTitles.filter(
      (title) => !imagesByTitle.has(title),
    );

    for (const batch of chunk(unresolvedTitles, BATCH_SIZE)) {
      const response = await fetchJsonWithRetry<WikipediaPageImagesResponse>(
        endpoint,
        {
          headers: {
            "Api-User-Agent": userAgent,
            "User-Agent": userAgent,
          },
          searchParams: {
            action: "query",
            format: "json",
            origin: "*",
            piprop: "name",
            prop: "pageimages",
            redirects: "1",
            titles: batch.join("|"),
          },
          timeoutMs: 30_000,
        },
      );
      const titleAliases = new Map<string, string>();

      for (const normalized of response.data.query?.normalized ?? []) {
        titleAliases.set(normalized.to, normalized.from);
      }

      for (const redirect of response.data.query?.redirects ?? []) {
        titleAliases.set(
          redirect.to,
          titleAliases.get(redirect.from) ?? redirect.from,
        );
      }

      for (const page of Object.values(response.data.query?.pages ?? {})) {
        if (
          page.missing ||
          page.ns !== 0 ||
          !page.title ||
          !isSupportedImage(page.pageimage)
        ) {
          continue;
        }

        const requestedTitle = titleAliases.get(page.title) ?? page.title;
        imagesByTitle.set(requestedTitle, page.pageimage);
      }
    }
  }

  return imagesByTitle;
}

async function main() {
  const decks = await readDecks();
  const missingCards = decks.flatMap((deck) => {
    return deck.cards
      .filter((card) => {
        return (
          !isSupportedImage(card.image) ||
          (REPAIR_FALLBACK_IMAGES.has(card.image) &&
            !card.title.toLowerCase().includes("minecraft") &&
            !card.title.toLowerCase().includes("one battle after another"))
        );
      })
      .map((card) => ({ card, deck }));
  });

  const wikidataImages = await fetchWikidataImages(
    missingCards.map(({ card }) => card.qid),
  );
  const wikipediaTitlesByCard = new Map<Card, string>();
  for (const { card } of missingCards) {
    const title = pageTitleFromSlug(card.wikipediaSlug);
    if (title) {
      wikipediaTitlesByCard.set(card, title);
    }
  }
  const wikipediaImages = await fetchWikipediaImages(
    Array.from(wikipediaTitlesByCard.values()),
  );

  const stats = {
    deckFallback: 0,
    missingBefore: missingCards.length,
    wikidata: 0,
    wikipedia: 0,
  };

  for (const { card, deck } of missingCards) {
    const wikipediaTitle = wikipediaTitlesByCard.get(card);
    const resolvedImage =
      wikidataImages.get(card.qid) ??
      (wikipediaTitle ? wikipediaImages.get(wikipediaTitle) : undefined);

    if (resolvedImage) {
      card.image = resolvedImage;
      if (wikidataImages.get(card.qid) === resolvedImage) {
        stats.wikidata += 1;
      } else {
        stats.wikipedia += 1;
      }
      continue;
    }

    card.image = getFallbackImage(deck);
    stats.deckFallback += 1;
  }

  for (const deck of decks) {
    await writeFile(deck.filePath, `${JSON.stringify(deck.cards, null, 2)}\n`);
  }

  const missingAfter = decks.reduce((sum, deck) => {
    return (
      sum + deck.cards.filter((card) => !isSupportedImage(card.image)).length
    );
  }, 0);

  console.log(
    `filled ${stats.missingBefore - missingAfter}/${stats.missingBefore} missing image(s): wikidata=${stats.wikidata}, wikipedia=${stats.wikipedia}, fallback=${stats.deckFallback}, remaining=${missingAfter}`,
  );
}

await main();
