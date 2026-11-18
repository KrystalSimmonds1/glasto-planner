import { artists, type Selections } from "../data/lineup.ts";
import { encodeSelections, priorities } from "./selections.ts";

export const shareTitle = "My Glasto 2027 picks";

export function createShareData(origin: string, picks: Selections) {
  const url = new URL("/shared", origin);
  url.searchParams.set("v", "1");
  url.searchParams.set("p", encodeSelections(picks));

  return { title: shareTitle, url: url.href };
}

export function createShareEmail(url: string, picks: Selections) {
  const names = priorities.flatMap(([priority]) =>
    artists.filter(({ id }) => picks[id] === priority).map(({ name }) => name),
  );
  const firstNames = names.slice(0, 4).join(", ");
  const summary = names.length > 4 ? `${firstNames} + ${names.length - 4} more` : firstNames;
  const body = ["Here are my Glasto 2027 picks:", "", summary, "", "View my picks:", url].join("\r\n");
  return `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(body)}`;
}
