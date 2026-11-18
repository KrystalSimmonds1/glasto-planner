import type { Metadata } from "next";
import { Suspense } from "react";
import { SharedPicks } from "../../components/picks";

export const metadata: Metadata = { title: "Shared picks", robots: { index: false } };

export default function Page() {
  return (
    <Suspense fallback={<main id="main" className="wrap detail"><h1>Shared picks</h1><p role="status">Loading picks…</p></main>}>
      <SharedPicks />
    </Suspense>
  );
}
