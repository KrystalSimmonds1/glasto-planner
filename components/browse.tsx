"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { filterArtists, genres, type Genre } from "../data/lineup";
import { useFestivalSelections } from "./use-festival-selections";

export function Browse() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<Genre | "All">("All");
  const input = useRef<HTMLInputElement>(null);
  const { ready, count, isSelected, toggle } = useFestivalSelections();
  const results = filterArtists(query, genre);

  return (
    <main id="main" className="wrap browse">
      <div className="intro">
        <h1>Who do you<br className="headline-break" /> want to see?</h1>
        <div className="search" role="search">
          <span className="magnifier" aria-hidden="true" />
          <input ref={input} type="search" aria-label="Search artists" placeholder="Search artists…" value={query}
            onChange={(event) => setQuery(event.target.value)} />
          {query && <button type="button" aria-label="Clear search" onClick={() => {
            setQuery("");
            input.current?.focus();
          }}>×</button>}
        </div>
      </div>

      <div className="genres" role="group" aria-label="Filter by genre">
        {(["All", ...genres] as const).map((item) => (
          <button key={item} type="button" className="genre-filter" aria-pressed={genre === item}
            onClick={() => setGenre(item)}>{item}</button>
        ))}
      </div>

      <div className="list-heading">
        <h2>{genre === "All" ? "The lineup" : genre}</h2>
        <p role="status">{results.length} {results.length === 1 ? "artist" : "artists"}</p>
      </div>

      {results.length > 0 ? (
        <ul className="artist-grid" role="list">
          {results.map(({ id, name, primaryGenre }) => {
            const selected = isSelected(id);
            return (
              <li key={id}>
                <button type="button" className="artist-row" aria-pressed={selected} aria-label={name}
                  disabled={!ready} onClick={() => toggle(id)}>
                  <span className="artist-label">
                    <span className="artist-name">{name}</span>
                    <span className="artist-genre">{primaryGenre}</span>
                  </span>
                  <span className="pick-mark" aria-hidden="true">{selected ? "✓" : "+"}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="empty">
          <h3>{query.trim() ? `No artists found for “${query.trim()}”.` : "No artists in this genre."}</h3>
          <p>Try another search or genre.</p>
        </div>
      )}
      <span className="sr-only" role="status">{count} {count === 1 ? "pick" : "picks"} saved</span>
      {count > 0 && (
        <div className="picks-dock">
          <Link href="/my-glasto" className="picks-link">
            <span>{count} {count === 1 ? "pick" : "picks"}</span>
            <span>My Glasto <span aria-hidden="true">→</span></span>
          </Link>
        </div>
      )}
    </main>
  );
}

