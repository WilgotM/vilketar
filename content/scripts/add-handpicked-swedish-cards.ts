import { readFile, readdir, writeFile } from "fs/promises";
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

type ClassicTuple = [
  pageTitle: string,
  title: string,
  year: number,
  subtitle: string,
  fact: string,
  pageViews: number,
];

function includesAny(value: string, patterns: readonly RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(value));
}

function inferClassicDeckIds(input: ClassicTuple): string[] {
  const [pageTitle, title, , subtitle, fact] = input;
  const text = `${pageTitle}\n${title}\n${subtitle}\n${fact}`;
  const deckIds = new Set<string>(["all-sweden", "all-sweden-allt"]);

  if (
    includesAny(text, [
      /artist|musik|pop|rock|metal|\bDJ\b|låt|vissångare|band|musikgrupp|låtskrivare|producent|Melodifestivalen|Eurovision|Allsång|Idol|Så mycket bättre|Sommar i P1|Melodikrysset/i,
    ])
  ) {
    deckIds.add("all-entertainment-music");
  }

  if (
    /låt|sång|Eurovision|Främling|Waterloo|Dancing|Levels|Tattoo/i.test(text)
  ) {
    deckIds.add("all-entertainment-songs");
  }

  if (
    /film|premiär|filmserie|Bergman|Jönssonligan|Beck|Wallander/i.test(text)
  ) {
    deckIds.add("all-entertainment-films");
  }

  if (
    /tv|TV|program|serie|SVT|TV4|Bolibompa|Kalle Anka|Rederiet|Robinson|Bingolotto|Rapport/i.test(
      text,
    )
  ) {
    deckIds.add("all-entertainment-tv");
  }

  if (
    /bok|roman|författare|Lindgren|Lagerlöf|Strindberg|Moberg|Backman|barnbok|bokserie/i.test(
      text,
    )
  ) {
    deckIds.add("all-entertainment-books");
  }

  if (
    /figur|Bamse|Alfons|Pettson|Findus|Mamma Mu|Sune|Bert|Pippi|Laban/i.test(
      text,
    )
  ) {
    deckIds.add("all-entertainment-characters");
  }

  if (/seriefigur|serietidning|Bamse/i.test(text)) {
    deckIds.add("all-entertainment-comics");
  }

  if (/brädspel|utomhusspel|Monopol|Kubb/i.test(text)) {
    deckIds.add("all-entertainment-board-games");
  }

  if (
    includesAny(text, [
      /företag|varumärke|butikskedja|dagligvaru|flygbolag|kafferosteri|järnvägsaktör|Ikea|Volvo|H&M|Ericsson|Saab|Scania|Electrolux|Husqvarna|Koenigsegg|Polestar|Systembolaget|Apoteket|Pressbyrån|\bICA\b|\bCoop\b|Klarna|Oatly|Fjällräven|Tetra Pak|Atlas Copco|Hasselblad|Bahco|Bofors/i,
    ])
  ) {
    deckIds.add("all-business-companies");
  }

  if (
    /godis|choklad|kaviar|läsk|kaffe|vodka|livsmedel|maträtt|mattradition|bakverk|korv|snus|Marabou|Kexchoklad|Ahlgrens|Kalles|Gevalia|Löfbergs|Absolut|Julmust|Trocadero|Köttbullar|Semla|Kanelbulle|Falukorv|Surströmming|Ostkaka|Smörgåstårta/i.test(
      text,
    )
  ) {
    deckIds.add("all-business-food-drink");
  }

  if (
    /tidning|dagstidning|kvällstidning|radio|nyhetsprogram|public service|Sveriges Radio|Sveriges Television|TV4|Kamratposten|Dagens Nyheter|Aftonbladet|Svenska Dagbladet/i.test(
      text,
    )
  ) {
    deckIds.add("all-business-media");
  }

  if (
    /internetforum|annonssajt|webb|betaltjänst|e-legitimation|musiktjänst|Spotify|Skype|Flashback|Blocket|Swish|Bank-id/i.test(
      text,
    )
  ) {
    deckIds.add("all-technology-websites");
  }

  if (
    /mobilspel|datorspel|Minecraft|Candy Crush|Battlefield|Mirror's Edge|It Takes Two|Valheim/i.test(
      text,
    )
  ) {
    deckIds.add("all-technology-video-games");
  }

  if (/mobilapp|Kry/i.test(text)) {
    deckIds.add("all-technology-mobile-apps");
  }

  if (/stridsflygplan|flyger|Jas Gripen/i.test(text)) {
    deckIds.add("all-engineering-aeroplanes");
  }

  if (/\bbil\b|elbilmärke|sportbil|Volvo|Koenigsegg|Polestar/i.test(text)) {
    deckIds.add("all-engineering-cars");
  }

  if (
    /uppfinning|patent|pacemaker|skiftnyckel|kullager|Bluetooth|Tetra Brik|dynamit|tändsticka/i.test(
      text,
    )
  ) {
    deckIds.add("all-engineering-weapons");
    deckIds.add("all-technology-websites");
  }

  if (
    /\bbro\b|nöjespark|museum|arena|stadion|kyrka|domkyrka|stadshus|hotell|Göta kanal|Turning Torso|Liseberg|Gröna Lund|Skansen|Vasamuseet|Globen|Öresundsbron|Uppsala domkyrka|Stockholms stadshus|Icehotel/i.test(
      text,
    )
  ) {
    deckIds.add("all-architecture-modern");
  }

  if (
    /arena|stadion|Vasaloppet|fotboll|ishockey|OS-guld|Wimbledon|VM-guld|VM-brons|idrott|skidlopp|simmare|tennisspelare|stavhoppare|golfspelare|boxare|bordtennis/i.test(
      text,
    )
  ) {
    deckIds.add("all-sport-svensk-sport");
    deckIds.add(SPORT_MOMENTS_DECK_ID);
  }

  if (
    /kung|drottning|regent|Gustav Vasa|Karl XII|Kristina|Karl XIV Johan/i.test(
      text,
    )
  ) {
    deckIds.add("all-leaders-rulers-europe-sweden");
  }

  if (
    /Nobel|blodbad|Slaget vid|\bslag\b|folkomröstning|mördas|brand|Lasermannen|\bEU\b|grundlagen|nationaldag|midsommar|lucia|Allemansrätten|Miljonprogrammet|Metoo|Akademien|historisk|samtidshistoria|tragedi|kriminalfall|klimataktivist/i.test(
      text,
    )
  ) {
    deckIds.add("all-history-battles");
  }

  if (/Kalmarunionen|\bEU\b|Europeiska unionen|Sverige går med/i.test(text)) {
    deckIds.add("all-history-nations");
  }

  if (/Stormaktstiden|högtid|tradition|Lucia|Midsommar/i.test(text)) {
    deckIds.add("all-history-eras");
  }

  if (/skolstrejk|Metoo|folkomröstning/i.test(text)) {
    deckIds.add("all-history-revolts");
  }

  return Array.from(deckIds);
}

function classicCard(input: ClassicTuple): HandpickedCard {
  const [pageTitle, title, year, subtitle, fact, pageViews] = input;

  return {
    deckIds: inferClassicDeckIds(input),
    fact,
    pageTitle,
    pageViews,
    subtitle,
    title,
    year,
  };
}

const EXTRA_CLASSIC_CARDS: HandpickedCard[] = (
  [
    [
      "Avicii",
      "Avicii slår igenom",
      2011,
      "Svensk DJ och musikproducent",
      "Avicii slår igenom internationellt med Levels.",
      420_000,
    ],
    [
      "Levels",
      "”Levels” släpps",
      2011,
      "Låt av Avicii",
      "Levels blir Aviciis internationella genombrott.",
      300_000,
    ],
    [
      "Wake Me Up (Avicii-låt)",
      "”Wake Me Up” släpps",
      2013,
      "Låt av Avicii",
      "Wake Me Up blir en av Aviciis största låtar.",
      300_000,
    ],
    [
      "Robyn",
      "Robyn slår igenom",
      1995,
      "Svensk popartist",
      "Robyn slår igenom som tonårsartist.",
      260_000,
    ],
    [
      "Dancing On My Own",
      "”Dancing On My Own” släpps",
      2010,
      "Låt av Robyn",
      "Dancing On My Own blir en modern svensk popklassiker.",
      260_000,
    ],
    [
      "The Cardigans",
      "The Cardigans bildas",
      1992,
      "Svensk popgrupp",
      "The Cardigans bildas i Jönköping.",
      220_000,
    ],
    [
      "Lovefool",
      "”Lovefool” släpps",
      1996,
      "Låt av The Cardigans",
      "Lovefool blir The Cardigans stora internationella hit.",
      220_000,
    ],
    [
      "Europe (musikgrupp)",
      "Europe bildas",
      1979,
      "Svenskt rockband",
      "Europe bildas i Upplands Väsby.",
      220_000,
    ],
    [
      "The Final Countdown (sång)",
      "”The Final Countdown” släpps",
      1986,
      "Låt av Europe",
      "The Final Countdown blir en av Sveriges mest kända rocklåtar.",
      240_000,
    ],
    [
      "Kent (musikgrupp)",
      "Kent bildas",
      1990,
      "Svenskt rockband",
      "Kent bildas i Eskilstuna.",
      260_000,
    ],
    [
      "Håkan Hellström",
      "Håkan Hellström solodebuterar",
      2000,
      "Svensk artist",
      "Håkan Hellström släpper sitt första soloalbum.",
      260_000,
    ],
    [
      "Veronica Maggio",
      "Veronica Maggio albumdebuterar",
      2006,
      "Svensk popartist",
      "Veronica Maggio släpper sitt debutalbum.",
      220_000,
    ],
    [
      "Gyllene Tider",
      "Gyllene Tider bildas",
      1978,
      "Svensk popgrupp",
      "Gyllene Tider bildas i Halmstad.",
      220_000,
    ],
    [
      "Sommartider",
      "”Sommartider” släpps",
      1982,
      "Låt av Gyllene Tider",
      "Sommartider blir en svensk sommarklassiker.",
      220_000,
    ],
    [
      "Per Gessle",
      "Per Gessle solodebuterar",
      1983,
      "Svensk artist",
      "Per Gessle släpper sitt första soloalbum.",
      180_000,
    ],
    [
      "Marie Fredriksson",
      "Marie Fredriksson solodebuterar",
      1984,
      "Svensk artist",
      "Marie Fredriksson släpper sitt första soloalbum.",
      180_000,
    ],
    [
      "Laleh",
      "Laleh albumdebuterar",
      2005,
      "Svensk artist",
      "Laleh släpper sitt debutalbum.",
      180_000,
    ],
    [
      "Tove Lo",
      "Tove Lo slår igenom",
      2014,
      "Svensk popartist",
      "Tove Lo slår igenom internationellt.",
      220_000,
    ],
    [
      "Zara Larsson",
      "Zara Larsson vinner Talang",
      2008,
      "Svensk popartist",
      "Zara Larsson vinner TV-programmet Talang.",
      260_000,
    ],
    [
      "Loreen",
      "Loreen vinner Eurovision igen",
      2023,
      "Svensk artist",
      "Loreen blir första kvinna att vinna Eurovision två gånger.",
      300_000,
    ],
    [
      "Tattoo (låt)",
      "”Tattoo” vinner Eurovision",
      2023,
      "Låt framförd av Loreen",
      "Tattoo vinner Eurovision Song Contest för Sverige.",
      260_000,
    ],
    [
      "Carola Häggkvist",
      "Carola slår igenom",
      1983,
      "Svensk artist",
      "Carola slår igenom i Melodifestivalen med Främling.",
      260_000,
    ],
    [
      "Främling (sång)",
      "”Främling” slår igenom",
      1983,
      "Låt framförd av Carola",
      "Främling blir ett av Melodifestivalens största genombrott.",
      220_000,
    ],
    [
      "Fångad av en stormvind",
      "”Fångad av en stormvind” vinner Eurovision",
      1991,
      "Låt framförd av Carola",
      "Fångad av en stormvind vinner Eurovision Song Contest.",
      220_000,
    ],
    [
      "Diggi loo diggi ley",
      "”Diggi-loo diggi-ley” vinner Eurovision",
      1984,
      "Låt av Herreys",
      "Diggi-loo diggi-ley vinner Eurovision Song Contest.",
      200_000,
    ],
    [
      "Stad i ljus",
      "”Stad i ljus” vinner Melodifestivalen",
      1988,
      "Låt framförd av Tommy Körberg",
      "Stad i ljus vinner Melodifestivalen.",
      180_000,
    ],
    [
      "Cornelis Vreeswijk",
      "Cornelis Vreeswijk albumdebuterar",
      1964,
      "Svensk-nederländsk vissångare",
      "Cornelis Vreeswijk släpper sitt första album.",
      220_000,
    ],
    [
      "Evert Taube",
      "Evert Taube debuterar",
      1920,
      "Svensk vissångare",
      "Evert Taube debuterar som författare och visdiktare.",
      220_000,
    ],
    [
      "Ted Gärdestad",
      "Ted Gärdestad albumdebuterar",
      1972,
      "Svensk artist",
      "Ted Gärdestad släpper sitt debutalbum.",
      220_000,
    ],
    [
      "Tomas Ledin",
      "Tomas Ledin albumdebuterar",
      1972,
      "Svensk artist",
      "Tomas Ledin släpper sitt debutalbum.",
      180_000,
    ],
    [
      "Eva Dahlgren",
      "Eva Dahlgren albumdebuterar",
      1978,
      "Svensk artist",
      "Eva Dahlgren släpper sitt debutalbum.",
      180_000,
    ],
    [
      "Max Martin",
      "Max Martin får sitt stora genombrott",
      1998,
      "Svensk låtskrivare och producent",
      "Max Martin får ett internationellt genombrott som låtskrivare.",
      300_000,
    ],
    [
      "Swedish House Mafia",
      "Swedish House Mafia bildas",
      2008,
      "Svensk DJ-grupp",
      "Swedish House Mafia bildas.",
      220_000,
    ],
    [
      "First Aid Kit (musikgrupp)",
      "First Aid Kit bildas",
      2007,
      "Svensk musikduo",
      "First Aid Kit bildas av systrarna Klara och Johanna Söderberg.",
      180_000,
    ],
    [
      "The Hives",
      "The Hives bildas",
      1993,
      "Svenskt rockband",
      "The Hives bildas i Fagersta.",
      180_000,
    ],
    [
      "Ghost (musikgrupp)",
      "Ghost bildas",
      2006,
      "Svenskt rockband",
      "Ghost bildas i Linköping.",
      260_000,
    ],
    [
      "Opeth",
      "Opeth bildas",
      1990,
      "Svenskt metalband",
      "Opeth bildas i Stockholm.",
      180_000,
    ],
    [
      "Allsång på Skansen",
      "Allsång på Skansen börjar sändas",
      1979,
      "Svenskt musikprogram",
      "Allsång på Skansen börjar sändas i tv.",
      220_000,
    ],
    [
      "Så mycket bättre",
      "”Så mycket bättre” börjar sändas",
      2010,
      "Svenskt musikprogram",
      "Så mycket bättre börjar sändas i TV4.",
      220_000,
    ],
    [
      "Idol (Sverige)",
      "”Idol” börjar sändas",
      2004,
      "Svenskt tv-program",
      "Idol börjar sändas i Sverige.",
      220_000,
    ],
    [
      "Sällskapsresan",
      "”Sällskapsresan” har premiär",
      1980,
      "Svensk filmkomedi",
      "Sällskapsresan har premiär.",
      260_000,
    ],
    [
      "Jönssonligan",
      "Jönssonligan får sin första film",
      1981,
      "Svensk filmserie",
      "Den första filmen om Jönssonligan har premiär.",
      260_000,
    ],
    [
      "Fanny och Alexander",
      "”Fanny och Alexander” har premiär",
      1982,
      "Film av Ingmar Bergman",
      "Fanny och Alexander har premiär.",
      260_000,
    ],
    [
      "Det sjunde inseglet",
      "”Det sjunde inseglet” har premiär",
      1957,
      "Film av Ingmar Bergman",
      "Det sjunde inseglet har premiär.",
      260_000,
    ],
    [
      "Persona (film)",
      "”Persona” har premiär",
      1966,
      "Film av Ingmar Bergman",
      "Persona har premiär.",
      220_000,
    ],
    [
      "Fucking Åmål",
      "”Fucking Åmål” har premiär",
      1998,
      "Svensk film",
      "Fucking Åmål har premiär.",
      260_000,
    ],
    [
      "Så som i himmelen",
      "”Så som i himmelen” har premiär",
      2004,
      "Svensk film",
      "Så som i himmelen har premiär.",
      220_000,
    ],
    [
      "En man som heter Ove (film)",
      "”En man som heter Ove” har premiär",
      2015,
      "Svensk film",
      "En man som heter Ove har premiär.",
      260_000,
    ],
    [
      "Hundraåringen som klev ut genom fönstret och försvann (film)",
      "”Hundraåringen” har premiär",
      2013,
      "Svensk filmkomedi",
      "Hundraåringen som klev ut genom fönstret och försvann har premiär.",
      240_000,
    ],
    [
      "Snabba Cash",
      "”Snabba Cash” har premiär",
      2010,
      "Svensk film",
      "Snabba Cash har premiär.",
      260_000,
    ],
    [
      "Ondskan (film)",
      "”Ondskan” har premiär",
      2003,
      "Svensk film",
      "Ondskan har premiär.",
      220_000,
    ],
    [
      "Låt den rätte komma in (film)",
      "”Låt den rätte komma in” har premiär",
      2008,
      "Svensk film",
      "Låt den rätte komma in har premiär.",
      220_000,
    ],
    [
      "Änglagård (film)",
      "”Änglagård” har premiär",
      1992,
      "Svensk film",
      "Änglagård har premiär.",
      200_000,
    ],
    [
      "Män som hatar kvinnor (film)",
      "”Män som hatar kvinnor” har premiär",
      2009,
      "Svensk film",
      "Män som hatar kvinnor har premiär.",
      260_000,
    ],
    [
      "Utvandrarna (film, 1971)",
      "”Utvandrarna” har premiär",
      1971,
      "Svensk film",
      "Utvandrarna har premiär.",
      220_000,
    ],
    [
      "Nybyggarna (film)",
      "”Nybyggarna” har premiär",
      1972,
      "Svensk film",
      "Nybyggarna har premiär.",
      180_000,
    ],
    [
      "Kalle Anka och hans vänner önskar God Jul",
      "Kalle Anka visas på julafton",
      1960,
      "Svensk tv-tradition",
      "Kalle Anka och hans vänner önskar God Jul börjar visas i svensk tv.",
      300_000,
    ],
    [
      "Rederiet",
      "”Rederiet” börjar sändas",
      1992,
      "Svensk tv-serie",
      "Rederiet börjar sändas i SVT.",
      220_000,
    ],
    [
      "Tre kronor (TV-serie)",
      "”Tre kronor” börjar sändas",
      1994,
      "Svensk tv-serie",
      "Tre kronor börjar sändas i TV4.",
      180_000,
    ],
    [
      "Expedition Robinson",
      "”Expedition Robinson” börjar sändas",
      1997,
      "Svenskt realityprogram",
      "Expedition Robinson börjar sändas i Sverige.",
      260_000,
    ],
    [
      "Bingolotto",
      "”Bingolotto” börjar sändas",
      1989,
      "Svenskt tv-program",
      "Bingolotto börjar sändas i lokal-tv.",
      220_000,
    ],
    [
      "Parlamentet (TV-program)",
      "”Parlamentet” börjar sändas",
      1999,
      "Svenskt humorprogram",
      "Parlamentet börjar sändas i TV4.",
      180_000,
    ],
    [
      "Doobidoo",
      "”Doobidoo” börjar sändas",
      2005,
      "Svenskt tv-program",
      "Doobidoo börjar sändas i SVT.",
      180_000,
    ],
    [
      "Historieätarna",
      "”Historieätarna” börjar sändas",
      2012,
      "Svenskt tv-program",
      "Historieätarna börjar sändas i SVT.",
      180_000,
    ],
    [
      "Vår tid är nu",
      "”Vår tid är nu” börjar sändas",
      2017,
      "Svensk tv-serie",
      "Vår tid är nu börjar sändas i SVT.",
      180_000,
    ],
    [
      "Bron (TV-serie)",
      "”Bron” börjar sändas",
      2011,
      "Svensk-dansk tv-serie",
      "Bron börjar sändas.",
      260_000,
    ],
    [
      "Beck (filmserie)",
      "Beck får sin första film",
      1997,
      "Svensk filmserie",
      "Den moderna filmserien om Martin Beck startar.",
      260_000,
    ],
    [
      "Wallander (filmer)",
      "Wallander blir filmserie",
      1994,
      "Svensk kriminalserie",
      "Wallander börjar filmatiseras.",
      220_000,
    ],
    [
      "NileCity 105,6",
      "”NileCity 105,6” börjar sändas",
      1995,
      "Svenskt humorprogram",
      "NileCity 105,6 börjar sändas i SVT.",
      180_000,
    ],
    [
      "Hipp Hipp!",
      "”Hipp Hipp!” börjar sändas",
      2001,
      "Svenskt humorprogram",
      "Hipp Hipp! börjar sändas i SVT.",
      180_000,
    ],
    [
      "Grotesco",
      "”Grotesco” börjar sändas",
      2007,
      "Svenskt humorprogram",
      "Grotesco börjar sändas i SVT.",
      180_000,
    ],
    [
      "Fem myror är fler än fyra elefanter",
      "”Fem myror” börjar sändas",
      1973,
      "Svenskt barnprogram",
      "Fem myror är fler än fyra elefanter börjar sändas.",
      260_000,
    ],
    [
      "Bolibompa",
      "”Bolibompa” börjar sändas",
      1987,
      "Svenskt barnprogram",
      "Bolibompa börjar sändas i SVT.",
      220_000,
    ],
    [
      "Björnes magasin",
      "”Björnes magasin” börjar sändas",
      1987,
      "Svenskt barnprogram",
      "Björnes magasin börjar sändas i SVT.",
      180_000,
    ],
    [
      "Hylands hörna",
      "”Hylands hörna” börjar sändas",
      1962,
      "Svenskt tv-program",
      "Hylands hörna börjar sändas i tv.",
      180_000,
    ],
    [
      "Fråga Lund",
      "”Fråga Lund” börjar sändas",
      1962,
      "Svenskt tv-program",
      "Fråga Lund börjar sändas i SVT.",
      180_000,
    ],
    [
      "Rapport (TV-program)",
      "”Rapport” börjar sändas",
      1969,
      "Svenskt nyhetsprogram",
      "Rapport börjar sändas i Sveriges Television.",
      200_000,
    ],
    [
      "Karlsson på taket",
      "Karlsson på taket ges ut",
      1955,
      "Barnbok av Astrid Lindgren",
      "Karlsson på taket ges ut.",
      220_000,
    ],
    [
      "Madicken",
      "Madicken ges ut",
      1960,
      "Barnbok av Astrid Lindgren",
      "Madicken ges ut.",
      180_000,
    ],
    [
      "Bröderna Lejonhjärta",
      "”Bröderna Lejonhjärta” ges ut",
      1973,
      "Barnbok av Astrid Lindgren",
      "Bröderna Lejonhjärta ges ut.",
      220_000,
    ],
    [
      "Mio, min Mio",
      "”Mio, min Mio” ges ut",
      1954,
      "Barnbok av Astrid Lindgren",
      "Mio, min Mio ges ut.",
      180_000,
    ],
    [
      "Nils Holgerssons underbara resa genom Sverige",
      "Nils Holgerssons resa ges ut",
      1906,
      "Bok av Selma Lagerlöf",
      "Nils Holgerssons underbara resa genom Sverige ges ut.",
      220_000,
    ],
    [
      "Gösta Berlings saga",
      "”Gösta Berlings saga” ges ut",
      1891,
      "Roman av Selma Lagerlöf",
      "Gösta Berlings saga ges ut.",
      180_000,
    ],
    [
      "Utvandrarna (roman)",
      "”Utvandrarna” ges ut",
      1949,
      "Roman av Vilhelm Moberg",
      "Utvandrarna ges ut.",
      220_000,
    ],
    [
      "Röda rummet",
      "”Röda rummet” ges ut",
      1879,
      "Roman av August Strindberg",
      "Röda rummet ges ut.",
      180_000,
    ],
    [
      "Aniara",
      "”Aniara” ges ut",
      1956,
      "Verk av Harry Martinson",
      "Aniara ges ut.",
      180_000,
    ],
    [
      "Män som hatar kvinnor",
      "”Män som hatar kvinnor” ges ut",
      2005,
      "Roman av Stieg Larsson",
      "Män som hatar kvinnor ges ut.",
      260_000,
    ],
    [
      "En man som heter Ove",
      "”En man som heter Ove” ges ut",
      2012,
      "Roman av Fredrik Backman",
      "En man som heter Ove ges ut.",
      220_000,
    ],
    [
      "Lilla spöket Laban",
      "Lilla spöket Laban ges ut",
      1965,
      "Svensk barnboksfigur",
      "Lilla spöket Laban ges ut.",
      180_000,
    ],
    [
      "Pettson och Findus",
      "Pettson och Findus debuterar",
      1984,
      "Svensk barnboksserie",
      "Pettson och Findus debuterar i bokform.",
      220_000,
    ],
    [
      "Alfons Åberg",
      "Alfons Åberg ges ut",
      1972,
      "Svensk barnboksfigur",
      "Den första boken om Alfons Åberg ges ut.",
      260_000,
    ],
    [
      "Mamma Mu",
      "Mamma Mu dyker upp",
      1985,
      "Svensk barnboksfigur",
      "Mamma Mu dyker upp i radio.",
      180_000,
    ],
    [
      "Sune (bokserie)",
      "Sune debuterar",
      1984,
      "Svensk bokserie",
      "Sune debuterar som svensk barn- och ungdomsfigur.",
      180_000,
    ],
    [
      "Bert (bokserie)",
      "Bert debuterar",
      1987,
      "Svensk bokserie",
      "Bert debuterar i bokform.",
      180_000,
    ],
    [
      "Kamratposten",
      "Kamratposten börjar ges ut",
      1892,
      "Svensk barntidning",
      "Kamratposten börjar ges ut.",
      180_000,
    ],
    [
      "Dagens Nyheter",
      "Dagens Nyheter grundas",
      1864,
      "Svensk dagstidning",
      "Dagens Nyheter grundas.",
      220_000,
    ],
    [
      "Aftonbladet",
      "Aftonbladet grundas",
      1830,
      "Svensk kvällstidning",
      "Aftonbladet grundas.",
      220_000,
    ],
    [
      "Svenska Dagbladet",
      "Svenska Dagbladet grundas",
      1884,
      "Svensk dagstidning",
      "Svenska Dagbladet grundas.",
      180_000,
    ],
    [
      "Marabou",
      "Marabou grundas",
      1916,
      "Svenskt chokladvarumärke",
      "Marabou grundas.",
      220_000,
    ],
    [
      "Kexchoklad",
      "Kexchoklad lanseras",
      1938,
      "Svenskt godis",
      "Kexchoklad lanseras.",
      180_000,
    ],
    [
      "Ahlgrens bilar",
      "Ahlgrens bilar lanseras",
      1953,
      "Svenskt godis",
      "Ahlgrens bilar lanseras.",
      220_000,
    ],
    [
      "Kalles kaviar",
      "Kalles kaviar lanseras",
      1954,
      "Svenskt smörgåspålägg",
      "Kalles kaviar lanseras.",
      220_000,
    ],
    [
      "Oatly",
      "Oatly grundas",
      1994,
      "Svenskt livsmedelsföretag",
      "Oatly grundas.",
      220_000,
    ],
    [
      "Absolut Vodka",
      "Absolut Vodka lanseras",
      1979,
      "Svenskt spritvarumärke",
      "Absolut Vodka lanseras internationellt.",
      260_000,
    ],
    [
      "Cloetta",
      "Cloetta grundas",
      1862,
      "Svenskt konfektyrföretag",
      "Cloetta grundas.",
      180_000,
    ],
    [
      "Gevalia",
      "Gevalia grundas",
      1853,
      "Svenskt kaffevarumärke",
      "Gevalia grundas.",
      180_000,
    ],
    [
      "Löfbergs",
      "Löfbergs grundas",
      1906,
      "Svenskt kafferosteri",
      "Löfbergs grundas i Karlstad.",
      180_000,
    ],
    [
      "Fjällräven",
      "Fjällräven grundas",
      1960,
      "Svenskt friluftsföretag",
      "Fjällräven grundas.",
      220_000,
    ],
    [
      "Kånken",
      "Kånken lanseras",
      1978,
      "Svensk ryggsäck",
      "Fjällrävens ryggsäck Kånken lanseras.",
      180_000,
    ],
    [
      "Tetra Pak",
      "Tetra Pak grundas",
      1951,
      "Svenskt förpackningsföretag",
      "Tetra Pak grundas.",
      260_000,
    ],
    [
      "Ericsson",
      "Ericsson grundas",
      1876,
      "Svenskt telekomföretag",
      "Ericsson grundas.",
      300_000,
    ],
    [
      "Saab AB",
      "Saab grundas",
      1937,
      "Svenskt industriföretag",
      "Saab grundas.",
      260_000,
    ],
    [
      "Scania",
      "Scania bildas",
      1911,
      "Svensk fordonstillverkare",
      "Scania bildas genom en sammanslagning.",
      220_000,
    ],
    [
      "Electrolux",
      "Electrolux grundas",
      1919,
      "Svenskt vitvaruföretag",
      "Electrolux grundas.",
      260_000,
    ],
    [
      "Husqvarna",
      "Husqvarna grundas",
      1689,
      "Svenskt industriföretag",
      "Husqvarna grundas som gevärsfaktori.",
      220_000,
    ],
    [
      "Koenigsegg",
      "Koenigsegg grundas",
      1994,
      "Svensk sportbilstillverkare",
      "Koenigsegg grundas.",
      260_000,
    ],
    [
      "Polestar",
      "Polestar blir bilmärke",
      2017,
      "Svenskt elbilsmärke",
      "Polestar blir ett fristående elbilsmärke.",
      220_000,
    ],
    [
      "Systembolaget",
      "Systembolaget bildas",
      1955,
      "Svenskt detaljhandelsmonopol",
      "Systembolaget bildas i sin moderna form.",
      260_000,
    ],
    [
      "Apoteket AB",
      "Apoteket bildas",
      1971,
      "Svenskt apoteksbolag",
      "Apoteket bildas som statligt bolag.",
      180_000,
    ],
    [
      "SJ",
      "SJ bildas",
      1856,
      "Svensk järnvägsaktör",
      "Statens Järnvägar bildas.",
      220_000,
    ],
    [
      "SAS Group",
      "SAS bildas",
      1946,
      "Skandinaviskt flygbolag",
      "SAS bildas genom skandinaviskt samarbete.",
      240_000,
    ],
    [
      "Pressbyrån",
      "Pressbyrån grundas",
      1899,
      "Svensk butikskedja",
      "Pressbyrån grundas.",
      180_000,
    ],
    [
      "Ica",
      "ICA bildas",
      1938,
      "Svensk dagligvarukedja",
      "ICA bildas.",
      260_000,
    ],
    [
      "Coop Sverige",
      "Coop Sverige bildas",
      1899,
      "Svensk dagligvarurörelse",
      "Den kooperativa dagligvarurörelsen etableras i Sverige.",
      180_000,
    ],
    [
      "Liseberg",
      "Liseberg öppnar",
      1923,
      "Nöjespark i Göteborg",
      "Liseberg öppnar i Göteborg.",
      260_000,
    ],
    [
      "Gröna Lund",
      "Gröna Lund öppnar",
      1883,
      "Nöjespark i Stockholm",
      "Gröna Lund öppnar i Stockholm.",
      260_000,
    ],
    [
      "Skansen",
      "Skansen öppnar",
      1891,
      "Friluftsmuseum i Stockholm",
      "Skansen öppnar.",
      260_000,
    ],
    [
      "Vasamuseet",
      "Vasamuseet öppnar",
      1990,
      "Museum i Stockholm",
      "Vasamuseet öppnar.",
      260_000,
    ],
    [
      "Avicii Arena",
      "Globen invigs",
      1989,
      "Arena i Stockholm",
      "Globen invigs i Stockholm.",
      260_000,
    ],
    [
      "Vasaloppet",
      "Första Vasaloppet körs",
      1922,
      "Svenskt skidlopp",
      "Det första Vasaloppet körs.",
      300_000,
    ],
    [
      "Nobelpriset",
      "Nobelpriset delas ut första gången",
      1901,
      "Internationellt pris från Sverige",
      "Nobelpriset delas ut första gången.",
      500_000,
    ],
    [
      "Stockholms blodbad",
      "Stockholms blodbad äger rum",
      1520,
      "Svensk historisk händelse",
      "Stockholms blodbad äger rum.",
      300_000,
    ],
    [
      "Gustav Vasa",
      "Gustav Vasa blir kung",
      1523,
      "Svensk kung",
      "Gustav Vasa väljs till kung.",
      300_000,
    ],
    [
      "Kalmarunionen",
      "Kalmarunionen bildas",
      1397,
      "Nordisk union",
      "Kalmarunionen bildas.",
      260_000,
    ],
    [
      "Stormaktstiden",
      "Stormaktstiden börjar",
      1611,
      "Svensk historisk epok",
      "Sveriges stormaktstid tar sin början.",
      260_000,
    ],
    [
      "Slaget vid Poltava",
      "Slaget vid Poltava äger rum",
      1709,
      "Svensk historisk händelse",
      "Slaget vid Poltava äger rum.",
      260_000,
    ],
    [
      "Karl XII",
      "Karl XII blir kung",
      1697,
      "Svensk kung",
      "Karl XII blir kung av Sverige.",
      260_000,
    ],
    [
      "Drottning Kristina",
      "Drottning Kristina blir regent",
      1632,
      "Svensk drottning",
      "Drottning Kristina blir Sveriges regent.",
      260_000,
    ],
    [
      "Karl XIV Johan",
      "Karl XIV Johan blir kung",
      1818,
      "Svensk kung",
      "Karl XIV Johan blir kung av Sverige och Norge.",
      260_000,
    ],
    [
      "Sveriges nationaldag",
      "Sveriges nationaldag blir helgdag",
      2005,
      "Svensk högtid",
      "Sveriges nationaldag blir allmän helgdag.",
      220_000,
    ],
    [
      "Midsommar",
      "Midsommarafton blir officiell helgdag",
      1953,
      "Svensk högtid",
      "Midsommarfirandet får modern placering i kalendern.",
      260_000,
    ],
    [
      "Lucia",
      "Luciafirande får modern form",
      1927,
      "Svensk tradition",
      "Det moderna offentliga luciafirandet etableras.",
      220_000,
    ],
    [
      "Kräftskiva",
      "Kräftskivan blir svensk tradition",
      1900,
      "Svensk mattradition",
      "Kräftskivan etableras som svensk sensommartradition.",
      180_000,
    ],
    [
      "Allemansrätten",
      "Allemansrätten skrivs in i grundlagen",
      1994,
      "Svensk rättighet",
      "Allemansrätten skrivs in i regeringsformen.",
      220_000,
    ],
    [
      "Miljonprogrammet",
      "Miljonprogrammet startar",
      1965,
      "Svenskt bostadsprogram",
      "Miljonprogrammet startar.",
      220_000,
    ],
    [
      "Folkomröstningen om kärnkraften i Sverige 1980",
      "Sverige röstar om kärnkraft",
      1980,
      "Svensk folkomröstning",
      "Sverige folkomröstar om kärnkraften.",
      220_000,
    ],
    [
      "Folkomröstningen om införande av euron i Sverige 2003",
      "Sverige röstar om euron",
      2003,
      "Svensk folkomröstning",
      "Sverige folkomröstar om att införa euron.",
      220_000,
    ],
    [
      "Mordet på Anna Lindh",
      "Anna Lindh mördas",
      2003,
      "Svensk samtidshistoria",
      "Anna Lindh mördas i Stockholm.",
      260_000,
    ],
    [
      "Diskoteksbranden i Göteborg",
      "Diskoteksbranden i Göteborg inträffar",
      1998,
      "Svensk tragedi",
      "Diskoteksbranden i Göteborg inträffar.",
      260_000,
    ],
    [
      "Lasermannen",
      "Lasermannen grips",
      1992,
      "Svenskt kriminalfall",
      "Lasermannen grips av polis.",
      260_000,
    ],
    [
      "Greta Thunberg",
      "Greta Thunberg skolstrejkar",
      2018,
      "Svensk klimataktivist",
      "Greta Thunberg inleder sin skolstrejk för klimatet.",
      420_000,
    ],
    [
      "Metoo",
      "Metoo får globalt genomslag",
      2017,
      "Social rörelse",
      "Metoo får stort genomslag även i Sverige.",
      300_000,
    ],
    [
      "Svenska Akademien",
      "Svenska Akademien grundas",
      1786,
      "Svensk kulturinstitution",
      "Svenska Akademien grundas av Gustav III.",
      220_000,
    ],
    [
      "Sveriges Radio",
      "Sveriges Radio startar",
      1925,
      "Svenskt public service-bolag",
      "Sveriges Radio startar som Radiotjänst.",
      260_000,
    ],
    [
      "Sveriges Television",
      "Sveriges Television bildas",
      1979,
      "Svenskt tv-bolag",
      "Sveriges Television bildas.",
      260_000,
    ],
    [
      "TV4",
      "TV4 börjar sända",
      1990,
      "Svensk tv-kanal",
      "TV4 börjar sända.",
      260_000,
    ],
    [
      "Zlatan Ibrahimović",
      "Zlatan landslagsdebuterar",
      2001,
      "Svensk fotbollsspelare",
      "Zlatan Ibrahimović debuterar i Sveriges landslag.",
      420_000,
    ],
    [
      "Björn Borg",
      "Björn Borg vinner Wimbledon",
      1976,
      "Svensk tennisspelare",
      "Björn Borg vinner Wimbledon för första gången.",
      300_000,
    ],
    [
      "Ingemar Stenmark",
      "Ingemar Stenmark vinner OS-guld",
      1980,
      "Svensk alpin skidåkare",
      "Ingemar Stenmark vinner OS-guld.",
      260_000,
    ],
    [
      "Gunde Svan",
      "Gunde Svan vinner OS-guld",
      1984,
      "Svensk längdskidåkare",
      "Gunde Svan vinner OS-guld.",
      220_000,
    ],
    [
      "Thomas Wassberg",
      "Thomas Wassberg vinner OS-guld",
      1980,
      "Svensk längdskidåkare",
      "Thomas Wassberg vinner OS-guld.",
      200_000,
    ],
    [
      "Charlotte Kalla",
      "Charlotte Kalla vinner OS-guld",
      2010,
      "Svensk längdskidåkare",
      "Charlotte Kalla vinner OS-guld.",
      260_000,
    ],
    [
      "Sarah Sjöström",
      "Sarah Sjöström vinner OS-guld",
      2016,
      "Svensk simmare",
      "Sarah Sjöström vinner OS-guld.",
      260_000,
    ],
    [
      "Therese Alshammar",
      "Therese Alshammar tar VM-guld",
      1999,
      "Svensk simmare",
      "Therese Alshammar tar VM-guld.",
      180_000,
    ],
    [
      "Carolina Klüft",
      "Carolina Klüft vinner OS-guld",
      2004,
      "Svensk friidrottare",
      "Carolina Klüft vinner OS-guld.",
      260_000,
    ],
    [
      "Stefan Holm",
      "Stefan Holm vinner OS-guld",
      2004,
      "Svensk höjdhoppare",
      "Stefan Holm vinner OS-guld.",
      220_000,
    ],
    [
      "Armand Duplantis",
      "Duplantis sätter världsrekord",
      2020,
      "Svensk stavhoppare",
      "Armand Duplantis sätter världsrekord i stavhopp.",
      300_000,
    ],
    [
      "Henrik Lundqvist",
      "Henrik Lundqvist NHL-debuterar",
      2005,
      "Svensk ishockeymålvakt",
      "Henrik Lundqvist debuterar i NHL.",
      260_000,
    ],
    [
      "Peter Forsberg",
      "Peter Forsberg avgör OS-finalen",
      1994,
      "Svensk ishockeyspelare",
      "Peter Forsberg avgör OS-finalen på straff.",
      260_000,
    ],
    [
      "Mats Sundin",
      "Mats Sundin blir draftad först",
      1989,
      "Svensk ishockeyspelare",
      "Mats Sundin blir första europé att väljas först i NHL-draften.",
      220_000,
    ],
    [
      "Börje Salming",
      "Börje Salming NHL-debuterar",
      1973,
      "Svensk ishockeyspelare",
      "Börje Salming debuterar i NHL.",
      220_000,
    ],
    [
      "Ingemar Johansson",
      "Ingemar Johansson blir världsmästare",
      1959,
      "Svensk boxare",
      "Ingemar Johansson blir världsmästare i tungviktsboxning.",
      220_000,
    ],
    [
      "Jan-Ove Waldner",
      "Jan-Ove Waldner vinner OS-guld",
      1992,
      "Svensk bordtennisspelare",
      "Jan-Ove Waldner vinner OS-guld i bordtennis.",
      220_000,
    ],
    [
      "Anja Pärson",
      "Anja Pärson vinner OS-guld",
      2006,
      "Svensk alpin skidåkare",
      "Anja Pärson vinner OS-guld.",
      220_000,
    ],
    [
      "Pernilla Wiberg",
      "Pernilla Wiberg vinner OS-guld",
      1992,
      "Svensk alpin skidåkare",
      "Pernilla Wiberg vinner OS-guld.",
      200_000,
    ],
    [
      "Annika Sörenstam",
      "Annika Sörenstam vinner US Open",
      1995,
      "Svensk golfspelare",
      "Annika Sörenstam vinner US Open.",
      220_000,
    ],
    [
      "Henrik Stenson",
      "Henrik Stenson vinner The Open",
      2016,
      "Svensk golfspelare",
      "Henrik Stenson vinner The Open Championship.",
      220_000,
    ],
    [
      "Nils van der Poel",
      "Nils van der Poel vinner OS-guld",
      2022,
      "Svensk skridskoåkare",
      "Nils van der Poel vinner OS-guld.",
      260_000,
    ],
    [
      "Göteborgsvarvet",
      "Göteborgsvarvet arrangeras första gången",
      1980,
      "Svenskt motionslopp",
      "Göteborgsvarvet arrangeras första gången.",
      180_000,
    ],
    [
      "Stockholms stadion",
      "Stockholms stadion invigs",
      1912,
      "Svensk idrottsarena",
      "Stockholms stadion invigs.",
      180_000,
    ],
    [
      "Råsunda fotbollsstadion",
      "Råsunda invigs",
      1937,
      "Svensk fotbollsarena",
      "Råsunda fotbollsstadion invigs.",
      180_000,
    ],
    [
      "Friends Arena",
      "Friends Arena invigs",
      2012,
      "Svensk fotbollsarena",
      "Friends Arena invigs.",
      220_000,
    ],
    [
      "Ullevi",
      "Ullevi invigs",
      1958,
      "Svensk arena",
      "Ullevi invigs i Göteborg.",
      220_000,
    ],
    [
      "Turning Torso",
      "Turning Torso invigs",
      2005,
      "Byggnad i Malmö",
      "Turning Torso invigs.",
      260_000,
    ],
    [
      "Öresundsbron",
      "Öresundsbron invigs",
      2000,
      "Bro mellan Sverige och Danmark",
      "Öresundsbron invigs.",
      300_000,
    ],
    [
      "Vasa (regalskepp)",
      "Regalskeppet Vasa bärgas",
      1961,
      "Svenskt regalskepp",
      "Regalskeppet Vasa bärgas.",
      300_000,
    ],
    [
      "Stockholms tunnelbana",
      "Stockholms tunnelbana öppnar",
      1950,
      "Svensk kollektivtrafik",
      "Stockholms tunnelbana öppnar.",
      220_000,
    ],
    [
      "Göta kanal",
      "Göta kanal invigs",
      1832,
      "Svensk kanal",
      "Göta kanal invigs.",
      220_000,
    ],
    [
      "Icehotel",
      "Icehotel öppnar",
      1989,
      "Hotell i Jukkasjärvi",
      "Icehotel öppnar i Jukkasjärvi.",
      180_000,
    ],
    [
      "Kiruna kyrka",
      "Kiruna kyrka invigs",
      1912,
      "Svensk kyrkobyggnad",
      "Kiruna kyrka invigs.",
      180_000,
    ],
    [
      "Uppsala domkyrka",
      "Uppsala domkyrka invigs",
      1435,
      "Svensk domkyrka",
      "Uppsala domkyrka invigs.",
      220_000,
    ],
    [
      "Stockholms stadshus",
      "Stockholms stadshus invigs",
      1923,
      "Byggnad i Stockholm",
      "Stockholms stadshus invigs.",
      260_000,
    ],
    [
      "Dalahäst",
      "Dalahästen blir symbol för Sverige",
      1939,
      "Svensk symbol",
      "Dalahästen får internationellt genomslag vid världsutställningen i New York.",
      180_000,
    ],
    [
      "Surströmming",
      "Surströmming blir handelsvara",
      1940,
      "Svensk maträtt",
      "Surströmming blir en etablerad svensk handelsvara.",
      180_000,
    ],
    [
      "Köttbullar",
      "Köttbullar blir husmanskost",
      1755,
      "Svensk maträtt",
      "Köttbullar etableras i svensk matkultur.",
      220_000,
    ],
    [
      "Semla",
      "Semlan blir svensk klassiker",
      1900,
      "Svenskt bakverk",
      "Semlan etableras som svensk klassiker.",
      220_000,
    ],
    [
      "Kanelbulle",
      "Kanelbullen blir populär",
      1920,
      "Svenskt bakverk",
      "Kanelbullen blir vanlig i Sverige.",
      220_000,
    ],
    [
      "Falukorv",
      "Falukorven får skyddad beteckning",
      1973,
      "Svensk korv",
      "Falukorv får skyddad beteckning i Sverige.",
      180_000,
    ],
    [
      "Snus",
      "Snus blir vanligt i Sverige",
      1800,
      "Svensk tobaksprodukt",
      "Snus blir vanligt i Sverige.",
      220_000,
    ],
    [
      "Ostkaka",
      "Ostkaka blir svensk klassiker",
      1500,
      "Svensk maträtt",
      "Ostkaka blir en del av svensk matkultur.",
      180_000,
    ],
  ] satisfies ClassicTuple[]
).map(classicCard);

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

const CLASSIC_CARDS = [...CARDS, ...EXTRA_CLASSIC_CARDS];

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

async function removeCardsFromExistingDecks(
  cardsByDeckId: Map<string, Card[]>,
  cardsToRemove: Card[],
) {
  const removeQids = new Set(cardsToRemove.map((card) => card.qid));
  const removeTitles = new Set(cardsToRemove.map((card) => card.title));
  const deckIds = (await readdir(PUBLIC_DECKS_DIR))
    .filter(
      (fileName) => fileName.endsWith(".json") && fileName !== "index.json",
    )
    .map((fileName) => fileName.replace(/\.json$/, ""));

  for (const deckId of deckIds) {
    const existingCards = cardsByDeckId.get(deckId) ?? (await readDeck(deckId));
    const filteredCards = existingCards.filter((card) => {
      return !removeQids.has(card.qid) && !removeTitles.has(card.title);
    });

    if (filteredCards.length !== existingCards.length) {
      cardsByDeckId.set(deckId, filteredCards);
    }
  }
}

async function main() {
  const cardsByDeckId = new Map<string, Card[]>();
  const metadataByTitle = new Map<
    string,
    Awaited<ReturnType<typeof getPageMetadata>>
  >();
  const classicsCards: Card[] = [];
  const sportMomentCards: Card[] = [];
  const preparedCards: Array<{
    card: HandpickedCard;
    runtimeCard: Card;
  }> = [];

  const classicCardSet = new Set<HandpickedCard>(CLASSIC_CARDS);

  for (const card of [...CLASSIC_CARDS, ...SPORT_CARDS]) {
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
    preparedCards.push({ card, runtimeCard });
  }

  const classicRuntimeCards = preparedCards
    .filter(({ card }) => classicCardSet.has(card))
    .map(({ runtimeCard }) => runtimeCard);
  await removeCardsFromExistingDecks(cardsByDeckId, classicRuntimeCards);

  for (const { card, runtimeCard } of preparedCards) {
    if (classicCardSet.has(card)) {
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

  console.log(
    `Added ${CLASSIC_CARDS.length} handpicked Swedish classic cards.`,
  );
}

await main();
