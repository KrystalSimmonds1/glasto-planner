import type { Metadata, Viewport } from "next";
import { Header } from "../components/header";
import "./globals.css";

const description = "Browse the Glastonbury 2027 lineup, save your picks and share your list.";

export const metadata: Metadata = {
  title: { default: "Glasto 2027 | Lineup planner", template: "%s | Glasto 2027" },
  description,
  openGraph: { title: "Glasto 2027", description, type: "website", locale: "en_GB" },
};

export const viewport: Viewport = { themeColor: "#f6f2e8", viewportFit: "cover" };

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <a className="skip sr-only focus:not-sr-only" href="#main">Skip to content</a>
        <Header />
        {children}
        <footer className="wrap footer">
          Unofficial Glastonbury planning tool. Not affiliated with Glastonbury Festival.
        </footer>
      </body>
    </html>
  );
}
