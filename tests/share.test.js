import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildDailyChallengePath,
  buildShareText,
  getDailyChallengeScore,
  getShareResults,
} from "../lib/share";

test("daily share text matches the new compact format", () => {
  const shareText = buildShareText({
    dateKey: "2026-03-23",
    difficulty: "easy",
    mode: "daily",
    // GameOver supplies the canonical route; buildShareText must add the
    // challenge parameters for every daily share entry point.
    path: "/daily",
    results: [true, false, true, true, true, false, true, true],
    score: 6,
  });

  assert.equal(
    shareText,
    [
      "#VilketÅr / Dagens spel 23 mars 2026",
      "",
      "🟩🟥🟩🟩🟩🟥🟩🟩",
      "",
      "Poäng / 6 / Brons",
      "",
      "https://xn--vilketr-jxa.se/daily?utmana=6&dag=2026-03-23",
    ].join("\n"),
  );
});

test("daily game-over sharing adds its challenge data to the current daily route", () => {
  const shareText = buildShareText({
    dateKey: "2026-03-23",
    difficulty: "easy",
    mode: "daily",
    path: "/daily",
    score: 6,
  });

  assert.match(
    shareText,
    /https:\/\/xn--vilketr-jxa\.se\/daily\?utmana=6&dag=2026-03-23$/,
  );
});

test("daily challenge links carry a score that is only valid that day", () => {
  const path = buildDailyChallengePath(14, "2026-03-23");

  assert.equal(path, "/daily?utmana=14&dag=2026-03-23");
  assert.equal(getDailyChallengeScore(path, "2026-03-23"), 14);
  assert.equal(
    getDailyChallengeScore(
      "https://xn--vilketr-jxa.se/daily?utmana=14&dag=2026-03-23",
      "2026-03-23",
    ),
    14,
  );
  assert.equal(getDailyChallengeScore(path, "2026-03-24"), null);
  assert.equal(
    getDailyChallengeScore(
      "/daily?utmana=hemligt&dag=2026-03-23",
      "2026-03-23",
    ),
    null,
  );
});

test("free play share text includes category, difficulty, score, and best", () => {
  const shareText = buildShareText({
    difficulty: "normal",
    highscore: 25,
    mode: "free-play",
    path: "/play/sport/sportogonblick",
    results: [true, false, true, true, true, false, true, true],
    score: 6,
    selectionRoute: {
      kind: "leaf",
      maxYear: null,
      minYear: null,
      nodeId: "all-sport-sportogonblick",
    },
  });

  assert.equal(
    shareText,
    [
      "#VilketÅr / Sport / Normal",
      "",
      "🟩🟥🟩🟩🟩🟥🟩🟩",
      "",
      "Poäng / 6 / Brons",
      "Bäst / 25 / Guld",
      "",
      "https://xn--vilketr-jxa.se/play/sport/sportogonblick",
    ].join("\n"),
  );
});

test("share results follow played order rather than timeline order", () => {
  const results = getShareResults([
    {
      fact: "",
      id: "b",
      image: "",
      deckId: "deck",
      deckThemeHue: 0,
      pageViews: null,
      played: {
        correct: false,
        placementIndex: 2,
        showDate: true,
      },
      qid: "Q2",
      rank: 1,
      subtitle: null,
      title: "B",
      wikipediaSlug: null,
      year: 1900,
    },
    {
      fact: "",
      id: "a",
      image: "",
      deckId: "deck",
      deckThemeHue: 0,
      pageViews: null,
      played: {
        correct: true,
        placementIndex: 0,
        showDate: true,
      },
      qid: "Q1",
      rank: 0,
      subtitle: null,
      title: "A",
      wikipediaSlug: null,
      year: 1800,
    },
    {
      fact: "",
      id: "c",
      image: "",
      deckId: "deck",
      deckThemeHue: 0,
      pageViews: null,
      played: {
        correct: true,
        placementIndex: 1,
        showDate: true,
      },
      qid: "Q3",
      rank: 2,
      subtitle: null,
      title: "C",
      wikipediaSlug: null,
      year: 2000,
    },
  ]);

  assert.deepEqual(results, [true, true, false]);
});
