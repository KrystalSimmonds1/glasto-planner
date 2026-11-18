"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFestivalSelections } from "./use-festival-selections";

export function Header() {
  const path = usePathname();
  const { count } = useFestivalSelections();
  return (
    <header className="masthead">
      <div className="wrap masthead-inner">
        <Link href="/" className="wordmark">GLASTO <span>2027</span></Link>
        <nav aria-label="Main navigation" className="nav">
          <Link href="/" aria-current={path === "/" ? "page" : undefined}>Lineup</Link>
          <Link href="/my-glasto" aria-current={path === "/my-glasto" ? "page" : undefined}>
            My Glasto{count > 0 && <>
              <span className="nav-count" aria-hidden="true">({count})</span>
              <span className="sr-only">, {count} {count === 1 ? "pick" : "picks"} saved</span>
            </>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
