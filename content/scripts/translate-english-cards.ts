import { readFile, writeFile } from "fs/promises";
import path from "path";

const CACHE_FILE = path.join(
  process.cwd(),
  "content/cache/translations-sv.json",
);
const REPORT_FILE = path.join(
  process.cwd(),
  "content/cache/english-texts-report.txt",
);

// Läs API-nyckel från .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const BATCH_SIZE = 50; // Översätt 50 strängar i taget för att spara anrop (RPD-gränsen på 1500)

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Anropar Gemini 1.5 Flash REST API direkt utan externa paket
async function translateBatch(texts: string[]): Promise<string[]> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY saknas i miljövariablerna (.env)");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `Du är en expertöversättare för ett svenskt historiskt tidslinjespel. Översätt följande engelska textsträngar till naturlig, idiomatisk svenska.

Riktlinjer för översättning:
- Översätt titlar, händelser och beskrivningar till naturlig svenska.
- För böcker: använd formuleringar som "ges ut", "utges" eller "publiceras" (t.ex. "‘Dune’ is published" blir "‘Dune’ ges ut"). Undvik "är publicerad".
- För filmer/teater: använd "har premiär" eller "släpps" (t.ex. "premiere" -> "har premiär").
- För byggnader/strukturer: använd "står klart" eller "färdigställs" (t.ex. "is completed" -> "står klart" / "färdigställs").
- För personer: "becomes president" -> "blir president", "dies" -> "dör", "is born" -> "föds".
- Behåll formateringar som enkla citationstecken (t.ex. ‘Title’).
- Returnera SVARET ENDAST som en giltig JSON-array av strängar i exakt samma ordning som indatan. Svara inte med markdown-kodblock (inga \`\`\`json), ingen förklarande text. Bara själva JSON-arrayen.

Indata array:
${JSON.stringify(texts, null, 2)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `Gemini API svarade med status ${response.status}: ${errText}`,
    );
  }

  const json = (await response.json()) as any;
  let textResponse = json.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Extrahera den rena JSON-arrayen med regex (hitta allt mellan det första [ och sista ])
  const jsonMatch = textResponse.match(/\[\s*[\s\S]*\s*\]/);
  if (jsonMatch) {
    textResponse = jsonMatch[0];
  }

  const parsed = JSON.parse(textResponse);
  if (!Array.isArray(parsed)) {
    throw new Error("Svaret från Gemini var inte en array.");
  }
  if (parsed.length !== texts.length) {
    throw new Error(
      `Antal översättningar matchar inte indata. Fick ${parsed.length}, skickade ${texts.length}.`,
    );
  }

  return parsed.map((t) => String(t));
}

async function main() {
  if (!GEMINI_API_KEY) {
    console.error("Fel: GEMINI_API_KEY saknas i .env!");
    return;
  }

  // Ladda befintlig cache
  let cache: Record<string, string> = {};
  try {
    const cacheContent = await readFile(CACHE_FILE, "utf8");
    cache = JSON.parse(cacheContent) as Record<string, string>;
  } catch {
    console.log("Ingen befintlig översättningscache hittades. Skapar en ny.");
  }

  // Ladda rapporten över engelska texter
  let reportText = "";
  try {
    reportText = await readFile(REPORT_FILE, "utf8");
  } catch {
    console.error(
      "Hittade inte english-texts-report.txt. Kör find-english-cards.ts först!",
    );
    return;
  }

  const lines = reportText.split("\n").filter(Boolean);
  const rawTexts = lines
    .map((line) => {
      if (line.startsWith("TITLE: ")) return line.slice(7);
      if (line.startsWith("SUBTITLE: ")) return line.slice(10);
      if (line.startsWith("FACT: ")) return line.slice(6);
      return line;
    })
    .filter((text) => text.trim().length > 0);

  const uniqueTexts = Array.from(new Set(rawTexts));
  const textsToTranslate = uniqueTexts.filter((text) => !cache[text]);

  console.log(`\n=== ÖVERSÄTTNINGSSTATUS (GEMINI) ===`);
  console.log(`Totalt antal unika texter: ${uniqueTexts.length}`);
  console.log(
    `Redan översatta i cache: ${uniqueTexts.length - textsToTranslate.length}`,
  );
  console.log(`Kvar att översätta: ${textsToTranslate.length}`);

  if (textsToTranslate.length === 0) {
    console.log("Allt är redan översatt!");
    return;
  }

  // Dela upp i batchar om BATCH_SIZE
  const batches: string[][] = [];
  for (let i = 0; i < textsToTranslate.length; i += BATCH_SIZE) {
    batches.push(textsToTranslate.slice(i, i + BATCH_SIZE));
  }

  console.log(`\nStartar översättning av ${batches.length} batch(ar)...`);
  console.log(
    "Väntar 4 sekunder mellan anropen för att säkra gränsen på 15 anrop per minut (RPM).",
  );

  let successCount = 0;

  for (let index = 0; index < batches.length; index++) {
    const batch = batches[index];
    const displayIndex = index + 1;

    console.log(
      `[Batch ${displayIndex}/${batches.length}] Skickar ${batch.length} strängar till Gemini...`,
    );

    let retries = 3;
    while (retries > 0) {
      try {
        const translatedBatch = await translateBatch(batch);

        // Lägg till i cache
        for (let i = 0; i < batch.length; i++) {
          cache[batch[i]] = translatedBatch[i];
        }

        // Spara cachen direkt efter varje batch
        await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
        successCount++;
        break; // Lyckades, bryt retry-loopen
      } catch (error) {
        retries--;
        console.error(
          `Misslyckades med Batch ${displayIndex}. Fel:`,
          (error as Error).message,
        );
        if (retries > 0) {
          console.log(
            `Väntar 10 sekunder före försök igen... (${retries} försök kvar)`,
          );
          await sleep(10000);
        } else {
          console.error(
            "Kunde inte översätta denna batch efter flera försök. Cachen är sparad med vad som hittills översatts.",
          );
          return;
        }
      }
    }

    // Vänta 4,5 sekunder för att säkert ligga under 15 RPM (15 anrop per minut = max 1 anrop per 4 sek)
    if (index < batches.length - 1) {
      await sleep(4500);
    }
  }

  console.log(
    `\nÖversättning klar! Cachen sparad till: ${CACHE_FILE} (${successCount} lyckade batchar)`,
  );
}

main().catch(console.error);
