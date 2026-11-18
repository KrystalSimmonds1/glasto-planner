"use client";

import { useSyncExternalStore } from "react";
import { type Priority, type Selections } from "../data/lineup";
import {
  encodeSelections, mergeSelections, readSelections, removeSelection, storageKey, toggleSelection,
} from "../lib/selections";

const empty = { selections: {} as Selections, ready: false };
let snapshot = empty;
const listeners = new Set<() => void>();

function publish(selections: Selections) {
  snapshot = { selections, ready: true };
  listeners.forEach((listener) => listener());
}

function syncStorage() {
  try {
    publish(readSelections(window.localStorage.getItem(storageKey)));
  } catch {
    if (!snapshot.ready) publish({});
  }
}

function onStorage(event: StorageEvent) {
  if (event.key === storageKey || event.key === null) syncStorage();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  if (!snapshot.ready) syncStorage();
  return () => {
    listeners.delete(listener);
    if (!listeners.size) window.removeEventListener("storage", onStorage);
  };
}

function update(change: (current: Selections) => Selections) {
  const selections = change(snapshot.selections);
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ version: 1, selections }));
  } catch {
    // The current session still works with in-memory picks.
  }
  publish(selections);
}

export function useFestivalSelections() {
  const { selections, ready } = useSyncExternalStore(subscribe, () => snapshot, () => empty);

  return {
    selections, ready, count: Object.keys(selections).length,
    isSelected: (id: string) => Boolean(selections[id]),
    toggle: (id: string) => update((current) => toggleSelection(current, id)),
    remove: (id: string) => update((current) => removeSelection(current, id)),
    setPriority: (id: string, priority: Priority) => update((current) =>
      current[id] ? { ...current, [id]: priority } : current),
    clear: () => update(() => ({})),
    exportPicks: () => encodeSelections(selections),
    importPicks: (incoming: Selections) => update((current) => mergeSelections(current, incoming)),
  };
}
