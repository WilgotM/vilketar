import assert from "node:assert/strict";
import { test } from "node:test";
import { getCanonicalMusicCard } from "../lib/music-card-details";
import { Card } from "../types/cards";

const mixedSnapshotCard: Card = {
  fact: "”Drag Me Down” framförs av One Direction.",
  image: "",
  pageViews: 300000,
  qid: "spotify:2K87XMYnUMqLcX3zvtAF4G",
  subtitle: "One Direction",
  title: "Drag Me Down",
  wikipediaSlug: null,
  year: 2015,
};

test("hydrates mixed-game Spotify cards from the canonical music deck", () => {
  const canonicalCard = getCanonicalMusicCard(mixedSnapshotCard);

  assert.equal(canonicalCard?.title, "Drag Me Down");
  assert.equal(canonicalCard?.music?.artist, "One Direction");
  assert.equal(canonicalCard?.music?.spotifyTrackId, "2K87XMYnUMqLcX3zvtAF4G");
});

test("hydrates old music snapshots by title and artist", () => {
  const oldSnapshotCard: Card = {
    ...mixedSnapshotCard,
    qid: "Q999999999",
  };

  const canonicalCard = getCanonicalMusicCard(oldSnapshotCard);

  assert.equal(canonicalCard?.qid, "spotify:2K87XMYnUMqLcX3zvtAF4G");
  assert.equal(canonicalCard?.music?.artist, "One Direction");
});
