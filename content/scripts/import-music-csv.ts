import { readFile, writeFile } from "fs/promises";
import path from "path";

type MusicCandidate = {
  appleArtworkUrl: null;
  appleMatchArtist: null;
  appleMatchTitle: null;
  applePreviewUrl: null;
  appleTrackId: null;
  appleTrackViewUrl: null;
  artist: string;
  needsReview: boolean;
  reviewReason: null;
  spotifyArtworkUrl: null;
  spotifyPreviewUrl: null;
  spotifyReleaseDate: string;
  spotifyTrackId: string;
  spotifyUri: string;
  title: string;
  wikidataQid: null;
  wikipediaTitle: null;
  year: number;
  yearConfidence: string;
  yearSource: null;
};

const outputFile = path.join(
  process.cwd(),
  "content/music/vilketar-music-candidates.json",
);

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      fields.push(field);
      field = "";
    } else {
      field += character;
    }
  }

  fields.push(field);
  return fields;
}

function parseCsv(csv: string): Record<string, string>[] {
  const lines = csv.trim().split(/\r?\n/u);
  const headers = parseCsvLine(lines[0]).map((header) =>
    header.replace(/^\uFEFF/u, ""),
  );

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(
      headers.map((header, index) => [header, values[index] ?? ""]),
    );
  });
}

function toCandidate(row: Record<string, string>): MusicCandidate {
  const spotifyUri = row["Track URI"];
  const spotifyTrackId = spotifyUri.replace(/^spotify:track:/u, "");
  const year = Number(row["Release Date"].slice(0, 4));

  if (!spotifyTrackId || !Number.isInteger(year) || year < 1900) {
    throw new Error(`Ogiltig låtrad: ${JSON.stringify(row)}`);
  }

  return {
    appleArtworkUrl: null,
    appleMatchArtist: null,
    appleMatchTitle: null,
    applePreviewUrl: null,
    appleTrackId: null,
    appleTrackViewUrl: null,
    artist: row["Artist Name(s)"],
    needsReview: false,
    reviewReason: null,
    spotifyArtworkUrl: null,
    spotifyPreviewUrl: null,
    spotifyReleaseDate: row["Release Date"],
    spotifyTrackId,
    spotifyUri,
    title: row["Track Name"],
    wikidataQid: null,
    wikipediaTitle: null,
    year,
    yearConfidence: "spotify-catalog",
    yearSource: null,
  };
}

async function main() {
  const inputFile = process.argv[2];
  if (!inputFile) {
    throw new Error("Ange sökvägen till en Spotify-exporterad CSV-fil.");
  }

  const imported = parseCsv(await readFile(inputFile, "utf8")).map(toCandidate);
  const importedIds = new Set(
    imported.map((candidate) => candidate.spotifyTrackId),
  );
  if (importedIds.size !== imported.length) {
    throw new Error("CSV-filen innehåller dubbla Spotify-låtar.");
  }

  const existing = JSON.parse(
    await readFile(outputFile, "utf8"),
  ) as MusicCandidate[];
  const existingIds = new Set(
    existing.map((candidate) => candidate.spotifyTrackId),
  );
  const existingKeys = new Set(
    existing.map(
      (candidate) =>
        `${candidate.title.toLocaleLowerCase("sv-SE")}\u0000${candidate.artist.toLocaleLowerCase("sv-SE")}`,
    ),
  );
  const additions = imported.filter((candidate) => {
    const key = `${candidate.title.toLocaleLowerCase("sv-SE")}\u0000${candidate.artist.toLocaleLowerCase("sv-SE")}`;
    if (existingIds.has(candidate.spotifyTrackId) || existingKeys.has(key)) {
      return false;
    }
    existingIds.add(candidate.spotifyTrackId);
    existingKeys.add(key);
    return true;
  });

  const merged = [...existing, ...additions];
  await writeFile(outputFile, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(
    `Imported ${imported.length} rows; added ${additions.length} new music candidates (total ${merged.length}).`,
  );
}

await main();
