import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { Card } from "../../types/cards";

const PUBLIC_DECKS_DIR = path.join(process.cwd(), "public/decks");

// Vanliga stoppord för att skilja engelska från svenska
const ENGLISH_STOPWORDS = new Set([
  "the",
  "of",
  "and",
  "is",
  "was",
  "for",
  "on",
  "with",
  "by",
  "becomes",
  "founded",
  "released",
  "published",
  "completed",
  "born",
  "died",
  "first",
  "flies",
  "debuts",
  "takes",
  "place",
  "emperor",
  "king",
  "queen",
  "president",
  "prime",
  "minister",
  "dynasty",
  "reign",
  "archaeological",
  "culture",
  "art",
  "movement",
  "begins",
  "launches",
]);

const SWEDISH_STOPWORDS = new Set([
  "och",
  "att",
  "en",
  "ett",
  "av",
  "blir",
  "är",
  "för",
  "på",
  "med",
  "i",
  "som",
  "har",
  "släpps",
  "grundas",
  "mördas",
  "vinner",
  "dör",
  "föds",
  "ges",
  "ut",
  "utges",
  "kronas",
  "kung",
  "drottning",
  "kejsare",
  "president",
  "statsminister",
  "dynasti",
  "börjar",
  "äger",
  "rum",
  "lanseras",
  "premiär",
  "bildas",
  "slår",
  "igenom",
  "debuterar",
  "solodebuterar",
  "albumdebuterar",
  "romandebuterar",
]);

function detectLanguage(
  title: string,
  subtitle: string,
  fact: string,
): "sv" | "en" {
  const combinedText = `${title} ${subtitle} ${fact}`.toLowerCase();

  // Ta bort specialtecken och splitta till ord
  const regex = new RegExp("[.,/#!$%^&*;:{}=\\-_`~()‘’“”\"']", "g");
  const words = combinedText.replace(regex, "").split(/\s+/);

  let englishCount = 0;
  let swedishCount = 0;

  // Kontrollera om texten innehåller svenska bokstäver å, ä, ö
  const hasSwedishLetters = /[åäö]/i.test(combinedText);
  if (hasSwedishLetters) {
    swedishCount += 2; // Ge extra vikt till svenska bokstäver
  }

  for (const word of words) {
    if (ENGLISH_STOPWORDS.has(word)) englishCount++;
    if (SWEDISH_STOPWORDS.has(word)) swedishCount++;
  }

  // Fallback: om inga stoppord matchas, titta på svenska bokstäver
  if (englishCount === 0 && swedishCount === 0) {
    return hasSwedishLetters ? "sv" : "en";
  }

  return swedishCount >= englishCount ? "sv" : "en";
}

async function main() {
  console.log("Skannar public/decks efter engelska kort...");

  const files = (await readdir(PUBLIC_DECKS_DIR)).filter(
    (file) => file.endsWith(".json") && file !== "index.json",
  );

  let totalCards = 0;
  let englishCardsCount = 0;
  let swedishCardsCount = 0;

  const englishTexts = new Set<string>();
  const deckStats: Array<{
    deckId: string;
    total: number;
    english: number;
    percentage: string;
  }> = [];

  for (const file of files) {
    const deckId = file.replace(".json", "");
    const filePath = path.join(PUBLIC_DECKS_DIR, file);
    const content = await readFile(filePath, "utf8");
    const cards = JSON.parse(content) as Card[];

    let deckEnglishCount = 0;

    for (const card of cards) {
      totalCards++;
      const lang = detectLanguage(
        card.title,
        card.subtitle || "",
        card.fact || "",
      );

      if (lang === "en") {
        deckEnglishCount++;
        englishCardsCount++;

        // Samla unika texter som behöver översättas
        englishTexts.add(`TITLE: ${card.title}`);
        if (card.subtitle) englishTexts.add(`SUBTITLE: ${card.subtitle}`);
        if (card.fact) englishTexts.add(`FACT: ${card.fact}`);
      } else {
        swedishCardsCount++;
      }
    }

    deckStats.push({
      deckId,
      total: cards.length,
      english: deckEnglishCount,
      percentage:
        cards.length > 0
          ? `${Math.round((deckEnglishCount / cards.length) * 100)}%`
          : "0%",
    });
  }

  // Sortera lekar efter flest engelska kort
  deckStats.sort((a, b) => b.english - a.english);

  console.log("\n=== SKANNINGSRESULTAT ===");
  console.log(`Totalt antal skannade lekar: ${files.length}`);
  console.log(`Totalt antal kort: ${totalCards}`);
  console.log(
    `Svenska kort: ${swedishCardsCount} (${Math.round((swedishCardsCount / totalCards) * 100)}%)`,
  );
  console.log(
    `Engelska kort: ${englishCardsCount} (${Math.round((englishCardsCount / totalCards) * 100)}%)`,
  );
  console.log(
    `Unika engelska textsträngar att översätta: ${englishTexts.size}`,
  );

  // Spara de unika engelska textsträngarna till en fil för referens
  const reportPath = path.join(
    process.cwd(),
    "content/cache/english-texts-report.txt",
  );
  await writeFile(
    reportPath,
    Array.from(englishTexts).sort().join("\n"),
    "utf8",
  );
  console.log(
    `\nRapport över unika engelska texter sparad till: ${reportPath}`,
  );

  console.log("\nTopplekarna med flest engelska kort:");
  deckStats.slice(0, 10).forEach((stat) => {
    console.log(
      `- ${stat.deckId}: ${stat.english}/${stat.total} engelska (${stat.percentage})`,
    );
  });
}

main().catch(console.error);
