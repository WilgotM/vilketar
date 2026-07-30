import { spawnSync } from "child_process";
import { readFile } from "fs/promises";

type Card = {
  fact?: string;
  image?: string;
  pageViews?: number;
  qid?: string;
  subtitle?: string;
  title: string;
  wikipediaSlug?: string | null;
  year: number;
};

type Args = {
  deck: string;
  expected: number | null;
  offline: boolean;
  since: string;
  excludeMusic: boolean;
};

const PUBLIC_DECKS_DIR = "public/decks";
const MUSIC_DECK = "all-entertainment-music";
const MUSIC_PATTERNS = [
  /\bmusik\b/iu,
  /\blåt\b/iu,
  /\bsång(?:en|are|erska)?\b/iu,
  /\bartist\b/iu,
  /\bpopgrupp\b/iu,
  /\bpopartist\b/iu,
  /\brockband\b/iu,
  /\bmusikgrupp\b/iu,
  /\bmelodifestivalen\b/iu,
  /\beurovision\b/iu,
];
const YEAR_PATTERN = /\b-?\d{3,4}\b/u;

function parseArgs(argv: string[]): Args {
  const args: Args = {
    deck: "all-swedish-classics-all",
    expected: null,
    offline: false,
    since: "HEAD",
    excludeMusic: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--expected") {
      const value = Number(argv[index + 1]);
      if (!Number.isInteger(value) || value < 0) {
        throw new Error("--expected must be a non-negative integer");
      }
      args.expected = value;
      index += 1;
    } else if (arg === "--since") {
      args.since = argv[index + 1] ?? "";
      if (!args.since) throw new Error("--since requires a git ref");
      index += 1;
    } else if (arg === "--deck") {
      args.deck = argv[index + 1] ?? "";
      if (!args.deck) throw new Error("--deck requires a deck id");
      index += 1;
    } else if (arg === "--offline") {
      args.offline = true;
    } else if (arg === "--allow-music") {
      args.excludeMusic = false;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function cardKey(card: Card): string {
  return `${card.title.trim().replace(/\s+/gu, " ").toLocaleLowerCase("sv-SE")}|${card.year}`;
}

function qidYearKey(card: Card): string {
  return `${card.qid ?? ""}|${card.year}`;
}

async function readJson(path: string): Promise<Card[]> {
  return JSON.parse(await readFile(path, "utf8")) as Card[];
}

function readGitJson(ref: string, path: string): Card[] {
  const result = spawnSync("git", ["show", `${ref}:${path}`], {
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`Could not read ${path} at git ref ${ref}`);
  }
  return JSON.parse(result.stdout) as Card[];
}

function wikipediaTitle(card: Card): string | null {
  if (!card.wikipediaSlug) return null;
  try {
    return decodeURIComponent(card.wikipediaSlug).replaceAll("_", " ");
  } catch {
    return card.wikipediaSlug.replaceAll("_", " ");
  }
}

function addMissingPageErrors(
  pages: Record<string, { missing?: string; title?: string }>,
  requestedTitles: string[],
  errors: string[],
  source: string,
) {
  const missing = Object.values(pages)
    .filter((page) => page.missing !== undefined)
    .map((page) => page.title ?? "unknown page");
  for (const title of missing) {
    errors.push(`${source} page missing: ${title}`);
  }

  if (Object.keys(pages).length === 0 && requestedTitles.length > 0) {
    errors.push(
      `${source} API returned no pages for ${requestedTitles.length} titles`,
    );
  }
}

async function validateWikipedia(cards: Card[], errors: string[]) {
  const titles = [
    ...new Set(cards.map(wikipediaTitle).filter(Boolean)),
  ] as string[];
  for (let index = 0; index < titles.length; index += 50) {
    const chunk = titles.slice(index, index + 50);
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      origin: "*",
      prop: "pageprops",
      redirects: "1",
      titles: chunk.join("|"),
    });
    const response = await fetchWithRetry(
      `https://sv.wikipedia.org/w/api.php?${params}`,
      errors,
      "Wikipedia",
    );
    if (!response) {
      continue;
    }
    const data = (await response.json()) as {
      query?: { pages?: Record<string, { missing?: string; title?: string }> };
    };
    addMissingPageErrors(data.query?.pages ?? {}, chunk, errors, "Wikipedia");
  }
}

async function validateCommons(cards: Card[], errors: string[]) {
  const images = [
    ...new Set(cards.map((card) => card.image).filter(Boolean)),
  ] as string[];
  for (let index = 0; index < images.length; index += 40) {
    const chunk = images.slice(index, index + 40);
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      origin: "*",
      iiprop: "url",
      prop: "imageinfo",
      titles: chunk.map((image) => `File:${image}`).join("|"),
    });
    const response = await fetchWithRetry(
      `https://commons.wikimedia.org/w/api.php?${params}`,
      errors,
      "Wikimedia Commons",
    );
    if (!response) {
      continue;
    }
    const data = (await response.json()) as {
      query?: { pages?: Record<string, { missing?: string; title?: string }> };
    };
    addMissingPageErrors(data.query?.pages ?? {}, chunk, errors, "Commons");
  }
}

async function fetchWithRetry(
  url: string,
  errors: string[],
  source: string,
): Promise<Response | null> {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(url, {
      headers: { "User-Agent": "VilketAr/0.1 (card validation)" },
    });
    if (response.ok) return response;

    if (response.status !== 429 && response.status < 500) {
      errors.push(`${source} API failed: ${response.status}`);
      return null;
    }

    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 1_000 * 2 ** attempt));
    } else {
      errors.push(`${source} API failed after retries: ${response.status}`);
    }
  }

  return null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const deckPath = `${PUBLIC_DECKS_DIR}/${args.deck}.json`;
  const current = await readJson(deckPath);
  const baseline = readGitJson(args.since, deckPath);
  const baselineKeys = new Set(baseline.map(cardKey));
  const added = current.filter((card) => !baselineKeys.has(cardKey(card)));
  const errors: string[] = [];

  if (args.expected !== null && added.length !== args.expected) {
    errors.push(`Expected ${args.expected} new cards, found ${added.length}`);
  }

  const seenKeys = new Set<string>();
  const seenQidYears = new Set<string>();
  for (const card of added) {
    const key = cardKey(card);
    if (seenKeys.has(key))
      errors.push(`Duplicate title/year: ${card.title} (${card.year})`);
    seenKeys.add(key);

    const qidKey = qidYearKey(card);
    if (card.qid && seenQidYears.has(qidKey)) {
      errors.push(`Duplicate QID/year: ${card.qid} (${card.year})`);
    }
    if (card.qid) seenQidYears.add(qidKey);

    const frontText = `${card.title}\n${card.subtitle ?? ""}`;
    if (YEAR_PATTERN.test(frontText))
      errors.push(`Year on card front: ${card.title}`);
    if (/\bQ\d+\b/u.test(frontText))
      errors.push(`QID on card front: ${card.title}`);
    if (!card.image) errors.push(`Missing image: ${card.title}`);
    if (!card.wikipediaSlug)
      errors.push(`Missing Wikipedia slug: ${card.title}`);
    if (card.qid?.startsWith("manual-"))
      errors.push(`Manual QID: ${card.title}`);
    if ((card.pageViews ?? 0) < 100_000)
      errors.push(`Low recognition score: ${card.title}`);
    if (
      args.excludeMusic &&
      MUSIC_PATTERNS.some((pattern) =>
        pattern.test(
          `${card.title}\n${card.subtitle ?? ""}\n${card.fact ?? ""}`,
        ),
      )
    ) {
      errors.push(`Music-like card in excluded batch: ${card.title}`);
    }
  }

  if (args.excludeMusic) {
    const music = await readJson(`${PUBLIC_DECKS_DIR}/${MUSIC_DECK}.json`);
    const musicKeys = new Set(music.map(cardKey));
    for (const card of added) {
      if (musicKeys.has(cardKey(card)))
        errors.push(`Card also present in music deck: ${card.title}`);
    }

    const baselineMusic = readGitJson(
      args.since,
      `${PUBLIC_DECKS_DIR}/${MUSIC_DECK}.json`,
    );
    if (JSON.stringify(music) !== JSON.stringify(baselineMusic)) {
      errors.push("Music deck changed while music was excluded");
    }
  }

  if (!args.offline) {
    await validateWikipedia(added, errors);
    await validateCommons(added, errors);
  }

  if (errors.length > 0) {
    console.error(`Card validation failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`Validated ${added.length} new cards in ${args.deck}.`);
  console.log(
    `Wikipedia pages, Commons images, duplicates, front text, and music isolation passed.`,
  );
}

await main();
