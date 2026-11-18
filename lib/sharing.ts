import { artists, type Selections } from "../data/lineup.ts";
import { encodeSelections, priorities } from "./selections.ts";

export function createShareData(origin: string, picks: Selections) {
  const names = priorities.flatMap(([priority]) =>
    artists.filter(({ id }) => picks[id] === priority).map(({ name }) => name),
  );
  const firstNames = names.slice(0, 4).join(", ");
  const text = names.length > 4 ? `${firstNames} + ${names.length - 4} more` : firstNames;
  const url = new URL("/shared", origin);
  url.searchParams.set("v", "1");
  url.searchParams.set("p", encodeSelections(picks));

  return { title: "My Glasto 2027 picks", text, url: url.href };
}

export function createShareEmail({ title, text, url }: ReturnType<typeof createShareData>) {
  const body = ["Here are my Glasto 2027 picks:", "", text, "", "View my picks:", url].join("\r\n");
  return `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}
