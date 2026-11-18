import assert from "node:assert/strict";
import { test } from "node:test";
import { artists, filterArtists, genres } from "../data/lineup.ts";
import {
  decodeSelections, encodeSelections, mergeSelections, readSelections, removeSelection, toggleSelection,
} from "../lib/selections.ts";
import { createShareData } from "../lib/sharing.ts";

test("all 65 artists have unique IDs and valid genre tags", () => {
  assert.equal(filterArtists("", "All").length, 65);
  assert.equal(new Set(artists.map(({ id }) => id)).size, 65);
  for (const artist of artists) {
    assert.equal(artist.genres[0], artist.primaryGenre);
    assert.ok(artist.genres.every((genre) => genres.includes(genre)));
    assert.equal(artist.stage ?? artist.day ?? artist.startTime ?? artist.endTime, undefined);
  }
});

test("search ignores case and accents, and combines with genre tags", () => {
  assert.deepEqual(filterArtists("  ADELA ", "All").map(({ id }) => id), ["adela"]);
  assert.deepEqual(filterArtists("lia", "R&B / Soul").map(({ id }) => id), ["lianne-la-havas"]);
  assert.deepEqual(filterArtists("lia", "Hip-hop / Rap"), []);
  assert.ok(filterArtists("", "Pop").some(({ id }) => id === "flo"));
});

test("toggling adds Want to see and removes existing picks", () => {
  assert.deepEqual(toggleSelection({}, "flo"), { flo: "want" });
  assert.deepEqual(toggleSelection({ flo: "must" }, "flo"), {});
  assert.deepEqual(removeSelection({ flo: "must", cher: "maybe" }, "flo"), { cher: "maybe" });
});

test("versioned storage retains valid priorities and tolerates invalid records", () => {
  assert.deepEqual(readSelections('{"version":1,"selections":{"flo":"must","cher":"maybe","nao":"wrong","fake":"want"}}'),
    { flo: "must", cher: "maybe" });
  for (const raw of [null, "invalid JSON", "{}", '{"version":2,"selections":{"flo":"want"}}']) {
    assert.deepEqual(readSelections(raw), {});
  }
});

test("share URLs round trip with deterministic IDs and preserve local priorities on import", () => {
  const encoded = encodeSelections({ flo: "must", cher: "maybe", nao: "want" });
  assert.equal(encoded, "cher:b,flo:m,nao:w");
  const url = new URL(createShareData("https://example.com", { flo: "must", cher: "maybe", nao: "want" }).url);
  assert.equal(url.href, "https://example.com/shared?v=1&p=cher%3Ab%2Cflo%3Am%2Cnao%3Aw");
  const incoming = decodeSelections(url.searchParams.get("p"), url.searchParams.get("v"));
  assert.deepEqual(incoming, { flo: "must", cher: "maybe", nao: "want" });
  assert.deepEqual(mergeSelections({ flo: "want", underworld: "must" }, incoming),
    { flo: "want", cher: "maybe", nao: "want", underworld: "must" });
});

test("native share data contains only the title and the URL", () => {
  const origin = "https://example.com";
  assert.deepEqual(createShareData(origin, { flo: "maybe" }), {
    title: "My Glasto 2027 picks",
    url: "https://example.com/shared?v=1&p=flo%3Ab",
  });
});

test("share parser skips malformed entries and uses the first valid duplicate", () => {
  assert.deepEqual(decodeSelections("flo:m,flo:w,unknown:b,cher:bad,nao:m:extra,__proto__:m", "1"), { flo: "must" });
  assert.deepEqual(decodeSelections("flo:m", "2"), {});
  assert.deepEqual(decodeSelections(null, null), {});
});
