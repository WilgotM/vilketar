import { readFile, writeFile } from "fs/promises";
import path from "path";
import { Card } from "../../types/cards";
import { buildGeneratedSportMomentCards } from "./build-sport-moment-cards";

const PUBLIC_DECKS_DIR = path.join(process.cwd(), "public/decks");
const INDEX_FILE = path.join(PUBLIC_DECKS_DIR, "index.json");

const CLASSICS_DECK_ID = "all-swedish-classics-all";
const CLASSICS_GROUP_ID = "all-swedish-classics";
const SPORT_MOMENTS_DECK_ID = "all-sport-sportogonblick";

type DifficultyCounts = {
  easy: number;
  normal: number;
  hard: number;
};

type HandpickedCard = {
  deckIds: string[];
  fact: string;
  image?: string;
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

const SPORT_CARDS: HandpickedCard[] = [
  {
    deckIds: [
      SPORT_MOMENTS_DECK_ID,
      "all-sweden",
      "all-sweden-allt",
      "all-sport-svensk-sport",
    ],
    fact: "Sverige spelar VM-final i fotboll på Råsunda mot Brasilien.",
    image: "Pele_con_brasil_(cropped).jpg",
    pageTitle: "Världsmästerskapet i fotboll 1958",
    pageViews: 360_000,
    subtitle: "Fotbolls-VM på hemmaplan",
    title: "Sverige spelar VM-final i fotboll",
    year: 1958,
  },
  {
    deckIds: [SPORT_MOMENTS_DECK_ID],
    fact: "Diego Maradona leder Argentina till VM-guld i Mexiko.",
    pageTitle: "Världsmästerskapet i fotboll 1986",
    pageViews: 460_000,
    subtitle: "Klassiskt fotbolls-VM",
    title: "Maradona dominerar fotbolls-VM",
    year: 1986,
  },
  {
    deckIds: [SPORT_MOMENTS_DECK_ID],
    fact: "Danmark vinner EM i fotboll efter finalseger mot Tyskland.",
    image: "Peter_Schmeichel-2011.jpeg",
    pageTitle: "Finalen av Europamästerskapet i fotboll 1992",
    pageViews: 260_000,
    subtitle: "Nordisk fotbollsskräll",
    title: "Danmark vinner fotbolls-EM",
    year: 1992,
  },
  {
    deckIds: [
      SPORT_MOMENTS_DECK_ID,
      "all-sweden",
      "all-sweden-allt",
      "all-sport-svensk-sport",
    ],
    fact: "Sverige tar VM-brons i fotboll i USA.",
    pageTitle: "Världsmästerskapet i fotboll 1994",
    pageViews: 420_000,
    subtitle: "Svenskt fotbollsminne",
    title: "Sverige tar VM-brons i fotboll",
    year: 1994,
  },
  {
    deckIds: [
      SPORT_MOMENTS_DECK_ID,
      "all-sweden",
      "all-sweden-allt",
      "all-sport-svensk-sport",
    ],
    fact: "Tre Kronor tar OS-guld i ishockey efter Peter Forsbergs berömda straff.",
    image: "Peter_Forsberg_2016-03-17_001_(cropped).jpg",
    pageTitle: "Ishockey vid olympiska vinterspelen 1994",
    pageViews: 320_000,
    subtitle: "Svenskt ishockeyminne",
    title: "Tre Kronor tar OS-guld",
    year: 1994,
  },
  {
    deckIds: [SPORT_MOMENTS_DECK_ID],
    fact: "Bosmandomen förändrar villkoren för spelare och klubbar i europeisk fotboll.",
    image: "Jean-Marc_Bosman_Panini_Standard_Liege_(cropped).png",
    pageTitle: "Bosmandomen",
    pageViews: 300_000,
    subtitle: "Avgörande fotbollsdom",
    title: "Bosmandomen förändrar fotbollen",
    year: 1995,
  },
  {
    deckIds: [SPORT_MOMENTS_DECK_ID],
    fact: "Manchester United vänder Champions League-finalen mot Bayern München på tilläggstid.",
    pageTitle: "Uefa Champions League",
    pageViews: 360_000,
    subtitle: "Champions League-drama",
    title: "Manchester United vänder finalen",
    year: 1999,
  },
  {
    deckIds: [SPORT_MOMENTS_DECK_ID],
    fact: "Luís Figo lämnar Barcelona för Real Madrid och blir en symbol för Galácticos-eran.",
    pageTitle: "Luís Figo",
    pageViews: 260_000,
    subtitle: "Omtalad spelarövergång",
    title: "Figo går till Real Madrid",
    year: 2000,
  },
  {
    deckIds: [
      SPORT_MOMENTS_DECK_ID,
      "all-sweden",
      "all-sweden-allt",
      "all-sport-svensk-sport",
    ],
    fact: "Sverige tar silver i damernas fotbolls-VM efter final mot Tyskland.",
    image: "Victoria_Svensson.jpg",
    pageTitle: "Världsmästerskapet i fotboll för damer 2003",
    pageViews: 240_000,
    subtitle: "Svenskt damlandslagsminne",
    title: "Sverige spelar VM-final i damfotboll",
    year: 2003,
  },
  {
    deckIds: [
      SPORT_MOMENTS_DECK_ID,
      "all-sweden",
      "all-sweden-allt",
      "all-sport-svensk-sport",
    ],
    fact: "Carolina Klüft vinner OS-guld i sjukamp i Aten.",
    pageTitle: "Carolina Klüft",
    pageViews: 220_000,
    subtitle: "Svensk friidrottsklassiker",
    title: "Carolina Klüft vinner OS-guld",
    year: 2004,
  },
  {
    deckIds: [
      SPORT_MOMENTS_DECK_ID,
      "all-sweden",
      "all-sweden-allt",
      "all-sport-svensk-sport",
    ],
    fact: "Sverige tar OS-guld i ishockey i Turin med flera NHL-stjärnor i laget.",
    image:
      "Henrik_Lundqvist_awarded_as_the_best_goalie_of_all_time_in_Swedish_hockey-2.jpg",
    pageTitle: "Henrik Lundqvist",
    pageViews: 250_000,
    subtitle: "Svenskt ishockeyminne",
    title: "Tre Kronor tar OS-guld igen",
    year: 2006,
  },
  {
    deckIds: [SPORT_MOMENTS_DECK_ID],
    fact: "Cristiano Ronaldo lämnar Manchester United för Real Madrid.",
    pageTitle: "Cristiano Ronaldo",
    pageViews: 520_000,
    subtitle: "Stor spelarövergång",
    title: "Cristiano Ronaldo går till Real Madrid",
    year: 2009,
  },
  {
    deckIds: [
      SPORT_MOMENTS_DECK_ID,
      "all-sweden",
      "all-sweden-allt",
      "all-sport-svensk-sport",
    ],
    fact: "Zlatan Ibrahimović lämnar Inter för Barcelona.",
    pageTitle: "Zlatan Ibrahimović",
    pageViews: 380_000,
    subtitle: "Svensk spelarövergång",
    title: "Zlatan går till Barcelona",
    year: 2009,
  },
  {
    deckIds: [
      SPORT_MOMENTS_DECK_ID,
      "all-sweden",
      "all-sweden-allt",
      "all-sport-svensk-sport",
    ],
    fact: "Sarah Sjöström vinner OS-guld på 100 meter fjärilsim.",
    pageTitle: "Sarah Sjöström",
    pageViews: 260_000,
    subtitle: "Svenskt simminne",
    title: "Sarah Sjöström vinner OS-guld",
    year: 2016,
  },
  {
    deckIds: [SPORT_MOMENTS_DECK_ID],
    fact: "Usain Bolt avslutar sin olympiska guldera i Rio de Janeiro.",
    pageTitle: "Usain Bolt",
    pageViews: 460_000,
    subtitle: "Olympisk friidrottsikon",
    title: "Bolt tar sitt sista OS-guld",
    year: 2016,
  },
  {
    deckIds: [SPORT_MOMENTS_DECK_ID],
    fact: "Neymar lämnar Barcelona för Paris Saint-Germain i fotbollens dyraste övergång.",
    pageTitle: "Neymar",
    pageViews: 480_000,
    subtitle: "Rekordstor spelarövergång",
    title: "Neymar blir dyraste fotbollsspelaren",
    year: 2017,
  },
  {
    deckIds: [SPORT_MOMENTS_DECK_ID],
    fact: "Frankrike vinner herrarnas fotbolls-VM efter final mot Kroatien.",
    pageTitle: "Världsmästerskapet i fotboll 2018",
    pageViews: 420_000,
    subtitle: "Modernt fotbolls-VM",
    title: "Frankrike vinner fotbolls-VM",
    year: 2018,
  },
  {
    deckIds: [
      SPORT_MOMENTS_DECK_ID,
      "all-sweden",
      "all-sweden-allt",
      "all-sport-svensk-sport",
    ],
    fact: "Armand Duplantis sätter världsrekord i stavhopp.",
    pageTitle: "Armand Duplantis",
    pageViews: 300_000,
    subtitle: "Svenskt friidrottsminne",
    title: "Duplantis sätter världsrekord",
    year: 2020,
  },
  {
    deckIds: [SPORT_MOMENTS_DECK_ID],
    fact: "Lionel Messi lämnar Barcelona och skriver på för Paris Saint-Germain.",
    pageTitle: "Lionel Messi",
    pageViews: 520_000,
    subtitle: "Historisk spelarövergång",
    title: "Messi lämnar Barcelona",
    year: 2021,
  },
  {
    deckIds: [SPORT_MOMENTS_DECK_ID],
    fact: "Argentina vinner herrarnas fotbolls-VM efter finaldramat mot Frankrike.",
    image: "Lionel_Messi_Player_of_the_Year_2011.jpg",
    pageTitle: "Världsmästerskapet i fotboll 2022",
    pageViews: 500_000,
    subtitle: "Fotbollsfinal med Messi",
    title: "Argentina vinner fotbolls-VM",
    year: 2022,
  },
];

function countDifficulty(cards: Card[]): DifficultyCounts {
  const uniqueCards = Array.from(
    new Map(cards.map((card) => [card.qid, card])).values(),
  );

  return {
    easy: uniqueCards.filter((card) => (card.pageViews ?? 0) >= 250_000).length,
    normal: uniqueCards.filter((card) => (card.pageViews ?? 0) >= 100_000)
      .length,
    hard: uniqueCards.filter((card) => (card.pageViews ?? 0) >= 50_000).length,
  };
}

function addDifficultyCounts(left: DifficultyCounts, right: DifficultyCounts) {
  return {
    easy: left.easy + right.easy,
    normal: left.normal + right.normal,
    hard: left.hard + right.hard,
  };
}

function readDifficultyCounts(value: unknown): DifficultyCounts {
  if (!value || typeof value !== "object") {
    return { easy: 0, normal: 0, hard: 0 };
  }

  const counts = value as Partial<Record<"easy" | "normal" | "hard", unknown>>;

  return {
    easy: typeof counts.easy === "number" ? counts.easy : 0,
    normal: typeof counts.normal === "number" ? counts.normal : 0,
    hard: typeof counts.hard === "number" ? counts.hard : 0,
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
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as Card[];
  } catch {
    return [];
  }
}

async function writeDeck(deckId: string, cards: Card[]) {
  const filePath = path.join(PUBLIC_DECKS_DIR, `${deckId}.json`);
  const dedupedCards = Array.from(
    new Map(cards.map((card) => [card.qid, card])).values(),
  );
  const sortedCards = dedupedCards.sort(
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
  const sportMomentCards: Card[] = [];

  for (const card of [...CARDS, ...SPORT_CARDS]) {
    const metadata =
      metadataByTitle.get(card.pageTitle) ??
      (await getPageMetadataWithRetry(card.pageTitle));
    metadataByTitle.set(card.pageTitle, metadata);
    await sleep(150);

    const runtimeCard: Card = {
      fact: card.fact,
      image: card.image ?? metadata.image,
      pageViews: card.pageViews,
      qid: metadata.qid,
      subtitle: card.subtitle,
      title: card.title,
      wikipediaSlug: slugFromTitle(metadata.title),
      year: card.year,
    };
    if (CARDS.includes(card)) {
      classicsCards.push(runtimeCard);
    }

    if (card.deckIds.includes(SPORT_MOMENTS_DECK_ID)) {
      sportMomentCards.push(runtimeCard);
    }

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

  const generatedSportCards = await buildGeneratedSportMomentCards();
  sportMomentCards.push(...generatedSportCards);

  for (const [deckId, cards] of cardsByDeckId) {
    await writeDeck(deckId, cards);
  }

  await writeDeck(CLASSICS_DECK_ID, classicsCards);
  await writeDeck(SPORT_MOMENTS_DECK_ID, sportMomentCards);

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

  const sportNode = index.children.find((child) => child.id === "all-sport") as
    | { children?: Array<Record<string, unknown>>; difficultyCounts?: unknown }
    | undefined;
  if (sportNode) {
    const sportMomentCounts = countDifficulty(sportMomentCards);
    const svenskSportCards =
      cardsByDeckId.get("all-sport-svensk-sport") ??
      (await readDeck("all-sport-svensk-sport"));
    const svenskSportCounts = countDifficulty(svenskSportCards);
    const sportMomentNode = {
      id: SPORT_MOMENTS_DECK_ID,
      slug: "sportogonblick",
      title: "Sportögonblick",
      themeHue: 144,
      frequency: 2.6,
      difficultyCounts: sportMomentCounts,
      minScore: 1000,
    };
    const svenskSportNode = {
      id: "all-sport-svensk-sport",
      slug: "svensk-sport",
      title: "Svensk sport",
      themeHue: 120,
      frequency: 2,
      difficultyCounts: svenskSportCounts,
      minScore: 1000,
    };
    const children = sportNode.children ?? [];
    const remainingChildren = children.filter((child) => {
      return (
        child.id !== SPORT_MOMENTS_DECK_ID &&
        child.id !== "all-sport-svensk-sport"
      );
    });
    const nextChildren = [
      sportMomentNode,
      svenskSportNode,
      ...remainingChildren,
    ];

    sportNode.children = nextChildren;
    sportNode.difficultyCounts = nextChildren.reduce<DifficultyCounts>(
      (sum, child) =>
        addDifficultyCounts(sum, readDifficultyCounts(child.difficultyCounts)),
      { easy: 0, normal: 0, hard: 0 },
    );
  }

  await writeFile(INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`);

  console.log(`Added ${CARDS.length} handpicked Swedish cards.`);
}

await main();
