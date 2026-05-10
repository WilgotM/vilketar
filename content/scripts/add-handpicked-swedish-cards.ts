import { readFile, writeFile } from "fs/promises";
import path from "path";
import { Card } from "../../types/cards";

const PUBLIC_DECKS_DIR = path.join(process.cwd(), "public/decks");
const INDEX_FILE = path.join(PUBLIC_DECKS_DIR, "index.json");

const CLASSICS_DECK_ID = "all-swedish-classics-all";
const CLASSICS_GROUP_ID = "all-swedish-classics";

type HandpickedCard = {
  deckIds: string[];
  fact: string;
  pageTitle: string;
  pageViews: number;
  subtitle: string;
  title: string;
  year: number;
};

const CARDS: HandpickedCard[] = [
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-entertainment-music"],
    fact: "ABBA bildas i Stockholm.",
    pageTitle: "ABBA",
    pageViews: 500_000,
    subtitle: "Svensk popgrupp",
    title: "ABBA bildas",
    year: 1972,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-entertainment-songs"],
    fact: "ABBA vinner Eurovision Song Contest med Waterloo.",
    pageTitle: "Waterloo (sång)",
    pageViews: 420_000,
    subtitle: "Svensk Eurovision-klassiker",
    title: "”Waterloo” vinner Eurovision",
    year: 1974,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-entertainment-songs"],
    fact: "Dancing Queen släpps och blir en av ABBAs största låtar.",
    pageTitle: "Dancing Queen",
    pageViews: 360_000,
    subtitle: "Låt av ABBA",
    title: "”Dancing Queen” släpps",
    year: 1976,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-entertainment-music"],
    fact: "Roxette bildas av Marie Fredriksson och Per Gessle.",
    pageTitle: "Roxette",
    pageViews: 220_000,
    subtitle: "Svensk popduo",
    title: "Roxette bildas",
    year: 1986,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-entertainment-music"],
    fact: "Ace of Base bildas i Göteborg.",
    pageTitle: "Ace of Base",
    pageViews: 180_000,
    subtitle: "Svensk popgrupp",
    title: "Ace of Base bildas",
    year: 1990,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-entertainment-songs"],
    fact: "Euphoria vinner Eurovision Song Contest för Sverige.",
    pageTitle: "Euphoria (sång)",
    pageViews: 300_000,
    subtitle: "Låt framförd av Loreen",
    title: "”Euphoria” vinner Eurovision",
    year: 2012,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-entertainment-songs"],
    fact: "Heroes vinner Eurovision Song Contest för Sverige.",
    pageTitle: "Heroes (Måns Zelmerlöw)",
    pageViews: 220_000,
    subtitle: "Låt framförd av Måns Zelmerlöw",
    title: "”Heroes” vinner Eurovision",
    year: 2015,
  },
  {
    deckIds: [
      "all-sweden",
      "all-sweden-allt",
      "all-people-famous-deaths-contemporary",
    ],
    fact: "Astrid Lindgren föds i Vimmerby.",
    pageTitle: "Astrid Lindgren",
    pageViews: 420_000,
    subtitle: "Svensk barnboksförfattare",
    title: "Astrid Lindgren föds",
    year: 1907,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-entertainment-characters"],
    fact: "Pippi Långstrump ges ut och blir en svensk barnboksklassiker.",
    pageTitle: "Pippi Långstrump",
    pageViews: 320_000,
    subtitle: "Barnboksfigur av Astrid Lindgren",
    title: "Pippi Långstrump ges ut",
    year: 1945,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-entertainment-books"],
    fact: "Emil i Lönneberga ges ut.",
    pageTitle: "Emil i Lönneberga",
    pageViews: 180_000,
    subtitle: "Barnbok av Astrid Lindgren",
    title: "”Emil i Lönneberga” ges ut",
    year: 1963,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-entertainment-books"],
    fact: "Ronja Rövardotter ges ut.",
    pageTitle: "Ronja Rövardotter",
    pageViews: 180_000,
    subtitle: "Barnbok av Astrid Lindgren",
    title: "”Ronja Rövardotter” ges ut",
    year: 1981,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-entertainment-characters"],
    fact: "Bamse dyker upp första gången.",
    pageTitle: "Bamse",
    pageViews: 180_000,
    subtitle: "Svensk seriefigur",
    title: "Bamse dyker upp första gången",
    year: 1966,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-business-companies"],
    fact: "Ikea grundas av Ingvar Kamprad.",
    pageTitle: "Ikea",
    pageViews: 500_000,
    subtitle: "Svenskt möbelföretag",
    title: "Ikea grundas",
    year: 1943,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-business-companies"],
    fact: "Volvo grundas i Göteborg.",
    pageTitle: "Volvo",
    pageViews: 350_000,
    subtitle: "Svenskt industriföretag",
    title: "Volvo grundas",
    year: 1927,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-business-companies"],
    fact: "H&M grundas i Västerås.",
    pageTitle: "Hennes & Mauritz",
    pageViews: 280_000,
    subtitle: "Svenskt klädföretag",
    title: "H&M grundas",
    year: 1947,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-technology-websites"],
    fact: "Spotify grundas i Stockholm.",
    pageTitle: "Spotify",
    pageViews: 450_000,
    subtitle: "Svensk musiktjänst",
    title: "Spotify grundas",
    year: 2006,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-technology-video-games"],
    fact: "Minecraft släpps.",
    pageTitle: "Minecraft",
    pageViews: 600_000,
    subtitle: "Svenskt datorspel",
    title: "”Minecraft” släpps",
    year: 2011,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-business-companies"],
    fact: "Klarna grundas i Stockholm.",
    pageTitle: "Klarna",
    pageViews: 160_000,
    subtitle: "Svenskt fintechbolag",
    title: "Klarna grundas",
    year: 2005,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-history-revolts"],
    fact: "Sverige går över till högertrafik.",
    pageTitle: "Högertrafikomläggningen",
    pageViews: 260_000,
    subtitle: "Svensk trafikomläggning",
    title: "Högertrafiken införs",
    year: 1967,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-history-nations"],
    fact: "Sverige blir medlem i Europeiska unionen.",
    pageTitle: "Sverige och Europeiska unionen",
    pageViews: 200_000,
    subtitle: "Svensk samtidshistoria",
    title: "Sverige går med i EU",
    year: 1995,
  },
  {
    deckIds: [
      "all-sweden",
      "all-sweden-allt",
      "all-people-famous-deaths-contemporary",
    ],
    fact: "Olof Palme mördas i Stockholm.",
    pageTitle: "Mordet på Olof Palme",
    pageViews: 500_000,
    subtitle: "Svensk samtidshistoria",
    title: "Olof Palme mördas",
    year: 1986,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-history-battles"],
    fact: "Estoniakatastrofen inträffar på Östersjön.",
    pageTitle: "Estoniakatastrofen",
    pageViews: 300_000,
    subtitle: "Fartygskatastrof på Östersjön",
    title: "Estoniakatastrofen inträffar",
    year: 1994,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-entertainment-tv"],
    fact: "Melodifestivalen arrangeras för första gången.",
    pageTitle: "Melodifestivalen",
    pageViews: 500_000,
    subtitle: "Svensk musiktävling",
    title: "Melodifestivalen startar",
    year: 1959,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-entertainment-tv"],
    fact: "På spåret börjar sändas i SVT.",
    pageTitle: "På spåret",
    pageViews: 260_000,
    subtitle: "Svenskt tv-program",
    title: "”På spåret” börjar sändas",
    year: 1987,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-entertainment-tv"],
    fact: "Solsidan börjar sändas i TV4.",
    pageTitle: "Solsidan",
    pageViews: 220_000,
    subtitle: "Svensk tv-serie",
    title: "”Solsidan” börjar sändas",
    year: 2010,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-sport-svensk-sport"],
    fact: "Sverige tar VM-brons i fotboll i USA.",
    pageTitle: "Världsmästerskapet i fotboll 1994",
    pageViews: 300_000,
    subtitle: "Svenskt fotbollsminne",
    title: "Sverige tar VM-brons i fotboll",
    year: 1994,
  },
  {
    deckIds: ["all-sweden", "all-sweden-allt", "all-sport-svensk-sport"],
    fact: "Tre Kronor tar OS-guld i ishockey i Lillehammer.",
    pageTitle: "Ishockey vid olympiska vinterspelen 1994",
    pageViews: 240_000,
    subtitle: "Svenskt ishockeyminne",
    title: "Tre Kronor tar OS-guld",
    year: 1994,
  },
];

function countDifficulty(cards: Card[]) {
  return {
    easy: cards.filter((card) => (card.pageViews ?? 0) >= 250_000).length,
    normal: cards.filter((card) => (card.pageViews ?? 0) >= 100_000).length,
    hard: cards.filter((card) => (card.pageViews ?? 0) >= 50_000).length,
  };
}

function slugFromTitle(title: string): string {
  return encodeURIComponent(title.replaceAll(" ", "_"));
}

async function getPageMetadata(pageTitle: string) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    piprop: "name",
    prop: "pageimages|pageprops",
    redirects: "1",
    titles: pageTitle,
  });
  const response = await fetch(`https://sv.wikipedia.org/w/api.php?${params}`, {
    headers: {
      "User-Agent":
        "VilketAr/0.1 (https://vilketar.pages.dev; Wikimedia metadata for open-source timeline game)",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${pageTitle}: ${response.status}`);
  }

  const data = (await response.json()) as {
    query?: {
      pages?: Record<
        string,
        {
          pageimage?: string;
          pageprops?: {
            wikibase_item?: string;
          };
          title?: string;
        }
      >;
    };
  };
  const page = Object.values(data.query?.pages ?? {})[0];

  return {
    image: page?.pageimage ?? "",
    qid: page?.pageprops?.wikibase_item ?? `manual-${slugFromTitle(pageTitle)}`,
    title: page?.title ?? pageTitle,
  };
}

async function sleep(ms: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getPageMetadataWithRetry(pageTitle: string) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await getPageMetadata(pageTitle);
    } catch (error) {
      lastError = error;
      await sleep(750 * (attempt + 1));
    }
  }

  throw lastError;
}

async function readDeck(deckId: string): Promise<Card[]> {
  const filePath = path.join(PUBLIC_DECKS_DIR, `${deckId}.json`);
  return JSON.parse(await readFile(filePath, "utf8")) as Card[];
}

async function writeDeck(deckId: string, cards: Card[]) {
  const filePath = path.join(PUBLIC_DECKS_DIR, `${deckId}.json`);
  const sortedCards = cards.sort(
    (left, right) =>
      (right.pageViews ?? 0) - (left.pageViews ?? 0) || left.year - right.year,
  );

  await writeFile(filePath, `${JSON.stringify(sortedCards, null, 2)}\n`);
}

async function main() {
  const cardsByDeckId = new Map<string, Card[]>();
  const metadataByTitle = new Map<
    string,
    Awaited<ReturnType<typeof getPageMetadata>>
  >();
  const classicsCards: Card[] = [];

  for (const card of CARDS) {
    const metadata =
      metadataByTitle.get(card.pageTitle) ??
      (await getPageMetadataWithRetry(card.pageTitle));
    metadataByTitle.set(card.pageTitle, metadata);
    await sleep(150);

    const runtimeCard: Card = {
      fact: card.fact,
      image: metadata.image,
      pageViews: card.pageViews,
      qid: metadata.qid,
      subtitle: card.subtitle,
      title: card.title,
      wikipediaSlug: slugFromTitle(metadata.title),
      year: card.year,
    };
    classicsCards.push(runtimeCard);

    for (const deckId of card.deckIds) {
      const cards = cardsByDeckId.get(deckId) ?? (await readDeck(deckId));
      const withoutDuplicate = cards.filter((existingCard) => {
        return (
          existingCard.qid !== runtimeCard.qid &&
          existingCard.title !== runtimeCard.title
        );
      });
      withoutDuplicate.push(runtimeCard);
      cardsByDeckId.set(deckId, withoutDuplicate);
    }
  }

  for (const [deckId, cards] of cardsByDeckId) {
    await writeDeck(deckId, cards);
  }

  await writeDeck(CLASSICS_DECK_ID, classicsCards);

  const index = JSON.parse(await readFile(INDEX_FILE, "utf8")) as {
    children: Array<Record<string, unknown>>;
  };
  const difficultyCounts = countDifficulty(classicsCards);
  const classicsNode = {
    id: CLASSICS_GROUP_ID,
    slug: "svenska-klassiker",
    title: "Svenska klassiker",
    themeHue: 15,
    frequency: 2.45,
    difficultyCounts,
    minScore: 1000,
    children: [
      {
        id: CLASSICS_DECK_ID,
        slug: "allt",
        title: "Allt",
        themeHue: 15,
        frequency: 1,
        difficultyCounts,
        minScore: 1000,
      },
    ],
  };
  const existingIndex = index.children.findIndex((child) => {
    return child.id === CLASSICS_GROUP_ID;
  });

  if (existingIndex >= 0) {
    index.children[existingIndex] = classicsNode;
  } else {
    const swedenIndex = index.children.findIndex((child) => {
      return child.id === "all-sweden";
    });
    index.children.splice(Math.max(swedenIndex + 1, 0), 0, classicsNode);
  }

  await writeFile(INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`);

  console.log(`Added ${CARDS.length} handpicked Swedish cards.`);
}

await main();
