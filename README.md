# Glasto 2027 Planner

Browse the supplied Glastonbury 2027 lineup, save artists in one tap, organise picks by priority and share them by link. This is an unofficial Glastonbury planning tool. It is not affiliated with Glastonbury Festival.

## Run locally

Use Node.js 22.16 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Run `npm run lint`, `npm run typecheck` and `npm test` for checks. Run `npm run build` to create the production export in `out/`.

## Lineup and picks

The app uses Next.js App Router, TypeScript, Tailwind CSS and static data. Routes live in `app/`, UI and browser state in `components/`, and storage and sharing logic in `lib/selections.ts`.

Edit `data/lineup.ts` to add or update an artist. Each entry has a permanent ID, billing name, primary genre and any additional genres from the vocabulary in that file. Browse filters match all assigned tags. Keep IDs stable so stored picks and shared links still resolve after billing edits.

The artist model already supports optional `stage`, `day`, `startTime` and `endTime`. Leave them unset until official information is available. When published, add official values in the data module and use 24-hour local times in `HH:mm` format.

The browser stores versioned picks in localStorage. New picks start at Want to see. When storage is blocked, picks are available in memory for the current session.

Share links use `/shared?v=1&p=…` with sorted artist IDs and one-letter priority codes. The recipient previews the list before importing. Import adds new IDs and preserves existing picks and priorities.

## Deploy to Vercel

Import the repository as a Next.js project, use the Node.js 22.x runtime or newer and keep the default build command. No environment variables or storage services are required. After deployment, open a direct `/shared` link and verify sharing from a phone.
