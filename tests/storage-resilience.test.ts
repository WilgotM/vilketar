import assert from "node:assert/strict";
import { test } from "node:test";
import {
  clearDailyGameSnapshot,
  loadDailyGameSnapshot,
  markStartedDailyGameProgress,
  saveDailyGameSnapshot,
} from "../lib/daily-storage";
import {
  consumeFreePlayIntroShown,
  loadFreePlayDifficulty,
  markFreePlayIntroShown,
  saveFreePlayDifficulty,
} from "../lib/free-play-storage";
import { loadHighscore, saveHighscore } from "../lib/highscore-storage";
import { loadStoredDisplayName, saveStoredDisplayName } from "../lib/leagues";
import { DailyGameSnapshot } from "../types/routes";

function withStorage(
  name: "localStorage" | "sessionStorage",
  storage: Partial<Storage>,
  run: () => void,
) {
  const previousDescriptor = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, {
    configurable: true,
    value: storage,
  });

  try {
    run();
  } finally {
    if (previousDescriptor) {
      Object.defineProperty(globalThis, name, previousDescriptor);
    } else {
      Reflect.deleteProperty(globalThis, name);
    }
  }
}

function throwingStorage(): Partial<Storage> {
  const fail = () => {
    throw new DOMException("Storage blocked", "SecurityError");
  };

  return {
    getItem: fail,
    removeItem: fail,
    setItem: fail,
  };
}

test("high scores reject corrupt values and tolerate blocked storage", () => {
  withStorage(
    "localStorage",
    { getItem: () => "not-a-number", setItem: () => undefined },
    () => assert.equal(loadHighscore("/play/all", "normal"), 0),
  );
  withStorage("localStorage", throwingStorage(), () => {
    assert.equal(loadHighscore("/play/all", "normal"), 0);
    assert.doesNotThrow(() => saveHighscore("/play/all", "normal", 12));
  });
});

test("free-play preferences tolerate unavailable browser storage", () => {
  withStorage("localStorage", throwingStorage(), () => {
    assert.equal(loadFreePlayDifficulty(), "normal");
    assert.doesNotThrow(() => saveFreePlayDifficulty("hard"));
  });
  withStorage("sessionStorage", throwingStorage(), () => {
    assert.doesNotThrow(() => markFreePlayIntroShown("/play/all"));
    assert.equal(consumeFreePlayIntroShown("/play/all"), false);
  });
});

test("daily storage rejects malformed snapshots", () => {
  const malformedSnapshot = JSON.stringify({
    dateKey: "2026-08-08",
    deckCursors: [],
    lives: "three",
    next: null,
    nextButOne: null,
    played: [],
    randomState: null,
    recentDeckIds: [],
  });

  withStorage("localStorage", { getItem: () => malformedSnapshot }, () =>
    assert.equal(loadDailyGameSnapshot(), null),
  );
});

test("daily persistence never interrupts an in-memory game", () => {
  withStorage("localStorage", throwingStorage(), () => {
    const snapshot = {
      dateKey: "2026-08-08",
      deckCursors: [],
      lives: 3,
      next: null,
      nextButOne: null,
      played: [],
      randomState: null,
      recentDeckIds: [],
    } satisfies DailyGameSnapshot;

    assert.doesNotThrow(() => saveDailyGameSnapshot(snapshot));
    assert.doesNotThrow(() => clearDailyGameSnapshot());
    assert.doesNotThrow(() => markStartedDailyGameProgress(snapshot.dateKey));
  });
});

test("league profile preferences tolerate blocked storage", () => {
  withStorage("localStorage", throwingStorage(), () => {
    assert.equal(loadStoredDisplayName(), "");
    assert.doesNotThrow(() => saveStoredDisplayName("Testlaget"));
  });
});
