import { artistIds, type Priority, type Selections } from "../data/lineup.ts";

export const storageKey = "glasto-2027-picks";
export const priorities = [
  ["must", "Must see"], ["want", "Want to see"], ["maybe", "Maybe"],
] as const;
const codes = { must: "m", want: "w", maybe: "b" } as const;
const fromCode = new Map<string, Priority>([["m", "must"], ["w", "want"], ["b", "maybe"]]);

export function readSelections(raw: string | null): Selections {
  try {
    const data = JSON.parse(raw ?? "null");
    if (data?.version !== 1 || typeof data.selections !== "object" || !data.selections) return {};
    return Object.fromEntries(Object.entries(data.selections).filter(([id, value]) =>
      artistIds.has(id) && priorities.some(([priority]) => priority === value),
    )) as Selections;
  } catch {
    return {};
  }
}

export function encodeSelections(selections: Selections) {
  return Object.keys(selections).filter((id) => artistIds.has(id)).sort()
    .map((id) => `${id}:${codes[selections[id]]}`).join(",");
}

export function decodeSelections(raw: string | null, version: string | null): Selections {
  if (!raw || (version !== "1" && version !== null)) return {};
  const picks: Selections = {};
  for (const entry of raw.split(",")) {
    const [id, code, extra] = entry.split(":");
    const priority = fromCode.get(code);
    if (extra === undefined && artistIds.has(id) && priority && !picks[id]) picks[id] = priority;
  }
  return picks;
}

export function mergeSelections(current: Selections, incoming: Selections): Selections {
  return { ...incoming, ...current };
}

export function toggleSelection(current: Selections, id: string): Selections {
  if (!current[id]) return { ...current, [id]: "want" };
  return removeSelection(current, id);
}

export function removeSelection(current: Selections, id: string): Selections {
  const next = { ...current };
  delete next[id];
  return next;
}
