import assert from "node:assert/strict";
import { test } from "node:test";
import { hideYearsOnCardFront } from "../lib/card-front-text";

test("card fronts hide explicit years and ranges", () => {
  assert.equal(
    hideYearsOnCardFront("Regent av England och Irland 1558–1603"),
    "Regent av England och Irland",
  );
  assert.equal(
    hideYearsOnCardFront("Fransk titulärkung 1793–1795"),
    "Fransk titulärkung",
  );
  assert.equal(
    hideYearsOnCardFront(
      "Först hinduiskt och sedan islamiskt rike mellan 1399 och 1799",
    ),
    "Först hinduiskt och sedan islamiskt rike",
  );
});

test("card fronts hide centuries without damaging normal names", () => {
  assert.equal(
    hideYearsOnCardFront("Mongolväldets erövringar under 1200-talet"),
    "Mongolväldets erövringar",
  );
  assert.equal(
    hideYearsOnCardFront("Windows 95 lanseras"),
    "Windows 95 lanseras",
  );
  assert.equal(
    hideYearsOnCardFront("iPhone 15 lanseras"),
    "iPhone 15 lanseras",
  );
});
