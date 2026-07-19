import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  shouldStartDailyShareTutorial,
  shouldStartDailyTutorial,
} from "../lib/daily-tutorial";

describe("daily tutorial", () => {
  test("starts for a new daily game on a new device", () => {
    assert.equal(
      shouldStartDailyTutorial({
        playedCardCount: 0,
        restoredFromSnapshot: false,
        status: null,
      }),
      true,
    );
  });

  test("can resume while only the automatic start card has landed", () => {
    assert.equal(
      shouldStartDailyTutorial({
        playedCardCount: 1,
        restoredFromSnapshot: true,
        status: null,
      }),
      true,
    );
  });

  test("does not interrupt an advanced restored game", () => {
    assert.equal(
      shouldStartDailyTutorial({
        playedCardCount: 2,
        restoredFromSnapshot: true,
        status: null,
      }),
      false,
    );
  });

  test("does not repeat after completion or skip", () => {
    for (const status of ["completed", "skipped"] as const) {
      assert.equal(
        shouldStartDailyTutorial({
          playedCardCount: 0,
          restoredFromSnapshot: false,
          status,
        }),
        false,
      );
    }
  });

  test("shows the share tutorial once after a daily result", () => {
    assert.equal(shouldStartDailyShareTutorial(null), true);
    assert.equal(shouldStartDailyShareTutorial("completed"), false);
    assert.equal(shouldStartDailyShareTutorial("skipped"), false);
  });
});
