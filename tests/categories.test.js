import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getAllPlayRoutePaths,
  getAllSelectionRoute,
  getCategoryDefinitions,
  getGroupAllSelectionRoute,
  getLeafSelectionRoute,
  getSelectionRouteParentPath,
  getSelectionRoutePath,
  getSelectionRouteShareLabel,
} from "../lib/categories";

test("top-level categories stay in the intended order", () => {
  assert.deepEqual(
    getCategoryDefinitions().map((category) => category.slug),
    ["svenska-klassiker", "entertainment", "sport"],
  );
});

test("sport all route resolves to the remaining sport deck", () => {
  const route = getGroupAllSelectionRoute(["sport"]);

  assert.ok(route);
  assert.equal(getSelectionRoutePath(route), "/play/sport/all");
  assert.equal(route.nodeId, "all-sport");
  assert.equal(getSelectionRouteShareLabel(route), "Sport");
});

test("remaining leaf routes keep clean share labels and parent paths", () => {
  const route = getLeafSelectionRoute(["sport", "sportogonblick"]);

  assert.ok(route);
  assert.equal(getSelectionRoutePath(route), "/play/sport/sportogonblick");
  assert.equal(getSelectionRouteParentPath(route), "/play/sport");
  assert.equal(getSelectionRouteShareLabel(route), "Sport");
  assert.equal(route.nodeId, "all-sport-sportogonblick");
});

test("static paths include deep selectors and leaf routes", () => {
  const paths = getAllPlayRoutePaths().map((path) => path.join("/"));

  assert.ok(paths.includes(""));
  assert.ok(paths.includes("all"));
  assert.ok(paths.includes("featured"));
  assert.ok(paths.includes("featured/sportogonblick"));
  assert.ok(paths.includes("featured/svenska-klassiker"));
  assert.ok(paths.includes("featured/musik"));
  assert.ok(!paths.includes("featured/usas-presidenter"));
  assert.ok(paths.includes("browse"));
  assert.ok(paths.includes("svenska-klassiker"));
  assert.ok(paths.includes("svenska-klassiker/allt"));
  assert.ok(paths.includes("browse/svenska-klassiker"));
  assert.ok(paths.includes("sport"));
  assert.ok(paths.includes("sport/sportogonblick"));
  assert.ok(!paths.includes("leaders"));
  assert.ok(!paths.includes("browse/history"));
  assert.ok(!paths.includes("technology/websites"));
});

test("all route stays anchored at /play/all", () => {
  const route = getAllSelectionRoute();

  assert.equal(getSelectionRoutePath(route), "/play/all");
  assert.equal(getSelectionRouteParentPath(route), "/play");
  assert.equal(route.kind, "all");
  assert.equal(route.nodeId, "all");
});
