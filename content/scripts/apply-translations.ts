import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { Card } from "../../types/cards";

const PUBLIC_DECKS_DIR = path.join(process.cwd(), "public/decks");
const CACHE_FILE = path.join(
  process.cwd(),
  "content/cache/translations-sv.json",
);

async function main() {
  console.log("Laddar översättningscache...");
  let cache: Record<string, string> = {};
  try {
    const cacheContent = await readFile(CACHE_FILE, "utf8");
    cache = JSON.parse(cacheContent) as Record<string, string>;
  } catch {
    console.error(
      "Hittade inte translations-sv.json. Kör translate-english-cards.ts först!",
    );
    return;
  }

  const files = (await readdir(PUBLIC_DECKS_DIR)).filter(
    (file) => file.endsWith(".json") && file !== "index.json",
  );

  console.log(`Hittade ${files.length} kortlekar att uppdatera.`);
  let translatedCardsCount = 0;

  for (const file of files) {
    const filePath = path.join(PUBLIC_DECKS_DIR, file);
    const content = await readFile(filePath, "utf8");
    const cards = JSON.parse(content) as Card[];
    let modified = false;

    const updatedCards = cards.map((card) => {
      let cardModified = false;
      const newCard = { ...card };

      if (cache[card.title]) {
        newCard.title = cache[card.title];
        cardModified = true;
      }
      if (card.subtitle && cache[card.subtitle]) {
        newCard.subtitle = cache[card.subtitle];
        cardModified = true;
      }
      if (card.fact && cache[card.fact]) {
        newCard.fact = cache[card.fact];
        cardModified = true;
      }

      if (cardModified) {
        translatedCardsCount++;
        modified = true;
      }

      return newCard;
    });

    if (modified) {
      await writeFile(
        filePath,
        JSON.stringify(updatedCards, null, 2) + "\n",
        "utf8",
      );
      console.log(`Uppdaterade ${file}`);
    }
  }

  console.log(
    `\nFärdig! Översatte totalt ${translatedCardsCount} kort i kortlekarna.`,
  );
}

main().catch(console.error);
