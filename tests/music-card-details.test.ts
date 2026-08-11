import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getCanonicalMusicCard,
  hydrateCanonicalMusicFields,
} from "../lib/music-card-details";
import { Card } from "../types/cards";

const mixedSnapshotCard: Card = {
  fact: "”Gubben i lådan” framförs av Daniel Adams-Ray.",
  image: "",
  pageViews: 300000,
  qid: "spotify:1qIAqSCPcRkkNU8dj5pIOC",
  subtitle: "Daniel Adams-Ray",
  title: "Gubben i lådan",
  wikipediaSlug: null,
  year: 2010,
};

test("hydrates mixed-game Spotify cards from the canonical music deck", () => {
  const canonicalCard = getCanonicalMusicCard(mixedSnapshotCard);

  assert.equal(canonicalCard?.title, "Gubben i lådan");
  assert.equal(canonicalCard?.music?.artist, "Daniel Adams-Ray");
  assert.equal(canonicalCard?.music?.spotifyTrackId, "1qIAqSCPcRkkNU8dj5pIOC");
});

test("hydrates old music snapshots by title and artist", () => {
  const oldSnapshotCard: Card = {
    ...mixedSnapshotCard,
    qid: "Q999999999",
  };

  const canonicalCard = getCanonicalMusicCard(oldSnapshotCard);

  assert.equal(canonicalCard?.qid, "spotify:1qIAqSCPcRkkNU8dj5pIOC");
  assert.equal(canonicalCard?.music?.artist, "Daniel Adams-Ray");
});

test("keeps daily snapshot identity while restoring playable music fields", () => {
  const oldDailySnapshotCard: Card = {
    fact: "”Gubben i lådan” framförs av Daniel Adams-Ray.",
    image: "",
    pageViews: 350000,
    qid: "legacy-daily:gubben-i-ladan",
    subtitle: "Daniel Adams-Ray",
    title: "Gubben i lådan",
    wikipediaSlug: null,
    year: 2010,
  };

  const hydratedCard = hydrateCanonicalMusicFields(oldDailySnapshotCard);

  assert.equal(hydratedCard.qid, "legacy-daily:gubben-i-ladan");
  assert.equal(hydratedCard.title, "Gubben i lådan");
  assert.equal(hydratedCard.music?.artist, "Daniel Adams-Ray");
  assert.equal(hydratedCard.music?.spotifyTrackId, "1qIAqSCPcRkkNU8dj5pIOC");
});
