import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getCanonicalMusicCard,
  hydrateCanonicalMusicFields,
} from "../lib/music-card-details";
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

test("keeps daily snapshot identity while restoring playable music fields", () => {
  const oldDailySnapshotCard: Card = {
    fact: "”Hey, Soul Sister” framförs av Train.",
    image: "",
    pageViews: 350000,
    qid: "legacy-daily:hey-soul-sister",
    subtitle: "Train",
    title: "Hey Soul Sister",
    wikipediaSlug: null,
    year: 2009,
  };

  const hydratedCard = hydrateCanonicalMusicFields(oldDailySnapshotCard);

  assert.equal(hydratedCard.qid, "legacy-daily:hey-soul-sister");
  assert.equal(hydratedCard.title, "Hey Soul Sister");
  assert.equal(hydratedCard.music?.artist, "Train");
  assert.equal(hydratedCard.music?.spotifyTrackId, "0KpfYajJVVGgQ32Dby7e9i");
});
