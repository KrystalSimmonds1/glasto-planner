import type { Selections } from "../data/lineup.ts";
import { encodeSelections } from "./selections.ts";

export const shareTitle = "My Glasto 2027 picks";

export function createShareData(origin: string, picks: Selections) {
  const url = new URL("/shared", origin);
  url.searchParams.set("v", "1");
  url.searchParams.set("p", encodeSelections(picks));

  return { title: shareTitle, url: url.href };
}

