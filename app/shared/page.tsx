import type { Metadata } from "next";
import { Suspense } from "react";
import { SharedPicks } from "../../components/picks";
import { shareTitle } from "../../lib/sharing";

const description = "See the artists on this shared Glasto 2027 list. An unofficial Glastonbury planner.";
export const metadata: Metadata = {
  title: { absolute: shareTitle },
  description,
  openGraph: { title: shareTitle, description, type: "website", locale: "en_GB" },
  robots: { index: false },
};

export default function Page() {
  return (
    <Suspense fallback={<main id="main" className="wrap detail"><h1>Shared picks</h1><p role="status">Loading picks…</p></main>}>
      <SharedPicks />
    </Suspense>
  );
}
