"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { artists, type Artist, type Selections } from "../data/lineup";
import { decodeSelections, priorities } from "../lib/selections";
import { createShareData, createShareEmail } from "../lib/sharing";
import { useFestivalSelections } from "./use-festival-selections";

function PickGroups({ picks, render }: { picks: Selections; render: (artist: Artist) => ReactNode }) {
  return priorities.map(([value, label]) => {
    const group = artists.filter(({ id }) => picks[id] === value);
    if (!group.length) return null;
    return (
      <section key={value} className="pick-group">
        <div className="list-heading"><h2>{label}</h2><span>{group.length}</span></div>
        <ul role="list">{group.map((artist) => <li key={artist.id}>{render(artist)}</li>)}</ul>
      </section>
    );
  });
}

function SharePicks({ picks }: { picks: Selections }) {
  const [status, setStatus] = useState("");
  const [manualUrl, setManualUrl] = useState("");

  async function share() {
    const data = createShareData(window.location.origin, picks);
    setStatus("");
    setManualUrl("");
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(data.url);
      setStatus("Link copied");
    } catch {
      setManualUrl(data.url);
    }
  }

  return (
    <div>
      <button type="button" className="share-action" onClick={share}>Share my picks <span aria-hidden="true">↗</span></button>
      <button type="button" className="text-action" onClick={() => {
        window.location.href = createShareEmail(createShareData(window.location.origin, picks));
      }}>Email my picks</button>
      <span role="status" className="share-status">{status}</span>
      {manualUrl && <label className="manual-link">Copy this link
        <input readOnly value={manualUrl} onFocus={(event) => event.target.select()} />
      </label>}
    </div>
  );
}

export function MyGlasto() {
  const picks = useFestivalSelections();
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  return (
    <main id="main" className="wrap detail">
      <h1 ref={heading} tabIndex={-1}>My Glasto</h1>
      {!picks.ready ? <p role="status">Loading picks…</p> : picks.count === 0 ? (
        <div className="empty">
          <h2>Nothing here yet.</h2>
          <p>Go through the lineup and pick the artists you want to see.</p>
          <Link href="/" className="action">Browse the lineup <span aria-hidden="true">→</span></Link>
        </div>
      ) : (
        <>
          <p className="subline" role="status">{picks.count} {picks.count === 1 ? "artist" : "artists"}</p>
          <SharePicks picks={picks.selections} />
          <PickGroups picks={picks.selections} render={({ id, name }) => (
            <>
              <button type="button" id={`pick-${id}`} className="artist-row disclosure"
                aria-expanded={editing === id} aria-controls={`priority-${id}`}
                onClick={() => setEditing(editing === id ? null : id)}>
                <span className="artist-name">{name}</span>
                <span className="chevron" aria-hidden="true" />
              </button>
              <div id={`priority-${id}`} hidden={editing !== id}>
                <div className="editor">
                  <div className="priority-options" role="group" aria-label={`Priority for ${name}`}>
                    {priorities.map(([value, label]) => (
                      <button key={value} type="button" className="priority-option" aria-pressed={picks.selections[id] === value}
                        onClick={() => {
                          if (picks.selections[id] === value) return;
                          picks.setPriority(id, value);
                          requestAnimationFrame(() => document.getElementById(`pick-${id}`)?.focus());
                        }}>{label}</button>
                    ))}
                  </div>
                  <button type="button" className="text-action danger" onClick={() => {
                    picks.remove(id);
                    setEditing(null);
                    heading.current?.focus();
                  }} aria-label={`Remove ${name}`}>Remove</button>
                </div>
              </div>
            </>
          )} />
        </>
      )}
      <aside className="schedule">
        <h2>When the schedule drops</h2>
        <p>We’ll lay your picks out by day and time so you can see what overlaps.</p>
      </aside>
      {picks.count > 0 && (confirmClear ? (
        <div className="confirmation" role="group" aria-label="Confirm clearing your picks">
          <p role="status">Clear all {picks.count} {picks.count === 1 ? "pick" : "picks"}?</p>
          <button type="button" className="action danger-fill" onClick={() => {
            picks.clear();
            setConfirmClear(false);
            setEditing(null);
            heading.current?.focus();
          }}>Clear all picks</button>
          <button type="button" className="text-action" onClick={() => {
            setConfirmClear(false);
            requestAnimationFrame(() => document.getElementById("clear-picks")?.focus());
          }}>Cancel</button>
        </div>
      ) : <button id="clear-picks" type="button" className="text-action danger" onClick={() => {
        setConfirmClear(true);
        requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(".confirmation button:last-child")?.focus());
      }}>Clear all picks</button>)}
    </main>
  );
}

export function SharedPicks() {
  const params = useSearchParams();
  const router = useRouter();
  const incoming = decodeSelections(params.get("p"), params.get("v"));
  const { count, ready, selections, importPicks } = useFestivalSelections();
  const [confirm, setConfirm] = useState(false);
  const newCount = Object.keys(incoming).filter((id) => !selections[id]).length;

  function addPicks() {
    importPicks(incoming);
    router.push("/my-glasto");
  }

  return (
    <main id="main" className="wrap detail">
      <h1>Shared picks</h1>
      {Object.keys(incoming).length > 0 ? (
        <>
          <p className="subline">Someone sent you their Glasto list.</p>
          <PickGroups picks={incoming} render={({ name }) => (
            <div className="artist-row"><span className="artist-name">{name}</span></div>
          )} />
          {ready && (newCount === 0 ? (
            <div className="confirmation">
              <p>You already have all these artists saved.</p>
              <Link href="/my-glasto" className="action">Open My Glasto →</Link>
            </div>
          ) : confirm ? (
            <div className="confirmation" role="group" aria-label="Confirm shared picks import">
              <h2>Add these picks to yours?</h2>
              <p role="status">You have {count} saved. This adds {newCount} {newCount === 1 ? "artist" : "artists"} and keeps your existing priorities.</p>
              <button type="button" className="action" onClick={addPicks}>Add to My Glasto</button>
              <button type="button" className="text-action" onClick={() => {
                setConfirm(false);
                requestAnimationFrame(() => document.getElementById("add-shared")?.focus());
              }}>Cancel</button>
            </div>
          ) : <button type="button" id="add-shared" className="action import-action" onClick={() => {
            if (!count) addPicks();
            else {
              setConfirm(true);
              requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(".confirmation button")?.focus());
            }
          }}>Add these to My Glasto <span aria-hidden="true">→</span></button>)}
        </>
      ) : (
        <div className="empty">
          <h2>No picks in this link.</h2>
          <Link href="/" className="action">Browse the lineup <span aria-hidden="true">→</span></Link>
        </div>
      )}
    </main>
  );
}

