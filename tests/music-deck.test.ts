import assert from "node:assert/strict";
import { test } from "node:test";
import { LEGACY_SONG_CARD_TITLES } from "../content/music/legacy-song-card-migrations";
import musicCards from "../public/decks/all-entertainment-music.json";
import classicsCards from "../public/decks/all-swedish-classics-all.json";
import deckIndex from "../public/decks/index.json";
import { Card } from "../types/cards";
import { DeckNode } from "../types/decks";

const cards = musicCards as Card[];
const classics = classicsCards as Card[];
const index = deckIndex as DeckNode;

function findNode(node: DeckNode, id: string): DeckNode | null {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const match = findNode(child, id);
    if (match) return match;
  }
  return null;
}

test("music deck contains the merged playable song library", () => {
  assert.ok(cards.length >= 663);
  assert.ok(cards.every((card) => card.music?.spotifyTrackId));
  assert.ok(cards.every((card) => Number.isInteger(card.year)));
  assert.ok(cards.every((card) => card.subtitle === card.music?.artist));
  assert.ok(cards.every((card) => card.music?.previewUrl));
  assert.ok(cards.every((card) => card.music?.artworkUrl));
});

test("music deck has no duplicate artist and song combinations", () => {
  const keys = cards.map(
    (card) => `${card.title.toLocaleLowerCase("sv-SE")}::${card.subtitle}`,
  );
  assert.equal(new Set(keys).size, keys.length);
  assert.equal(
    new Set(cards.map((card) => card.music?.spotifyTrackId)).size,
    cards.length,
  );
});

test("music card titles do not expose reissue metadata", () => {
  const versionLabel =
    /\b(remaster(?:ed)?|re-recorded|radio edit|single version|album version|original mix|deluxe)\b/iu;
  assert.ok(cards.every((card) => !versionLabel.test(card.title)));
});

test("stored previews are secure streaming URLs", () => {
  const storedPreviews = cards.flatMap((card) =>
    card.music?.previewUrl ? [card.music.previewUrl] : [],
  );
  assert.ok(storedPreviews.length > 0);
  assert.ok(storedPreviews.every((url) => url.startsWith("https://")));
});

test("music deck counts make music available in every game mode", () => {
  const musicNode = findNode(index, "all-entertainment-music");
  assert.ok(musicNode);
  assert.equal(musicNode.difficultyCounts.easy, cards.length);
  assert.equal(musicNode.difficultyCounts.normal, cards.length);
  assert.equal(musicNode.difficultyCounts.hard, cards.length);
});

test("legacy song cards are removed from the Swedish classics deck", () => {
  assert.ok(classics.every((card) => !LEGACY_SONG_CARD_TITLES.has(card.title)));
});

test("migrated legacy songs are playable music cards", () => {
  const migratedSongs = [
    ["Waterloo", "ABBA"],
    ["Euphoria", "Loreen"],
    ["Dancing On My Own", "Robyn"],
    ["Tattoo", "Loreen"],
    ["Öppna landskap", "Ulf Lundell"],
    ["Lovefool", "The Cardigans"],
    ["Heroes", "Måns Zelmerlöw"],
    ["Staten & kapitalet", "Ebba Grön"],
    ["Take Me to Your Heaven", "Charlotte Perrelli"],
    ["Dom andra", "kent"],
    ["Sakta vi gå genom stan", "Monica Zetterlund"],
    ["Sånt är livet", "Anita Lindblom"],
    ["Himlen runt hörnet", "Lisa Nilsson"],
    ["Den vilda", "One More Time"],
  ];

  for (const [title, artist] of migratedSongs) {
    const card = cards.find(
      (candidate) => candidate.title === title && candidate.subtitle === artist,
    );
    assert.ok(card, `${title} by ${artist} should be in the music deck`);
    assert.ok(card.music?.previewUrl);
    assert.ok(card.music?.artworkUrl);
  }
});
