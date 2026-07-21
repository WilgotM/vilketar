import assert from "node:assert/strict";
import { test } from "node:test";
import musicCards from "../public/decks/all-entertainment-music.json";
import deckIndex from "../public/decks/index.json";
import { Card } from "../types/cards";
import { DeckNode } from "../types/decks";

const cards = musicCards as Card[];
const index = deckIndex as DeckNode;

function findNode(node: DeckNode, id: string): DeckNode | null {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const match = findNode(child, id);
    if (match) return match;
  }
  return null;
}

test("music deck contains a large playable song library", () => {
  assert.ok(cards.length >= 500);
  assert.ok(cards.every((card) => card.music?.spotifyTrackId));
  assert.ok(cards.every((card) => Number.isInteger(card.year)));
  assert.ok(cards.every((card) => card.subtitle === card.music?.artist));
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

test("stored Apple previews are secure streaming URLs", () => {
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
