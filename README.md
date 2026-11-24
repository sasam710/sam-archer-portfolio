# Sam Archer

Personal portfolio for product support, customer support, and support operations roles. The live site is a short introduction, three Klaviyo case studies, a client-side inbox demo, a support playbook, and a changelog.

Sam Archer is a product support specialist at Fyxer, an AI email assistant (October 2026 to present). From July 2022 to October 2026 he was a senior product expert and support pod lead at Klaviyo. He is based in Austin, TX, works Central time, and is originally from London.

## Stack

- [Next.js](https://nextjs.org/) 16 and React 19, with TypeScript
- App Router pages. The home page and changelog are static.
- The inbox demo is one client component. Triage runs in the browser from `lib/inbox-model.ts`. There is no database, no API route, and no model call.
- Vercel deploys it with zero config. No environment variables are required.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test
npm run lint
npm run build
npm start
```

`npm test` checks the triage scores, that `CHANGELOG.md` matches the changelog page, and that site copy does not pick up stray punctuation or claims this README forbids.

## Deploy on Vercel

1. Import this GitHub repo in Vercel.
2. Leave the framework preset on Next.js. Build command: `npm run build`. No install override.
3. Do not add environment variables unless you want a canonical URL (see below).
4. Deploy. Vercel assigns a free `vercel.app` URL.

Optional: set `NEXT_PUBLIC_SITE_URL` to the production origin, including `https://`, once you know the `vercel.app` host or a custom domain. The site uses it for canonical links, the sitemap, and social cards. If it is unset, Vercel uses `VERCEL_URL` at build time, and local dev uses `http://localhost:3000`.

## Resume and LinkedIn

The resume button points at `/sam-archer-resume.pdf`, which is `public/sam-archer-resume.pdf`. LinkedIn is `https://www.linkedin.com/in/sam-archer-550a4a63/`. Both URLs live in `lib/links.ts`, and the hero and the footer read that file.

## Roadmap

GitHub issues are the roadmap. Open an issue before treating a change as promised work. A sensible issue: adjust a triage weight in `lib/inbox-model.ts` if a rule should score differently.

The changelog records what already shipped. Edit `lib/changelog.ts` and `CHANGELOG.md` together. A test fails if they drift. The same notes render at `/changelog`.

## What the demo is

Postroom is a fictional AI email assistant. The ten tickets are sample data for an interview conversation: Gmail sync failing, drafts not generating, a billing question, a feature request, an outage-style cluster, and a few quieter notes. Rules assign P1 to P4, show the reason for every point, group the suspected incident, and suggest a macro you can read or copy. Nothing is sent.

## Project layout

- `app/page.tsx` home page
- `app/changelog/page.tsx` changelog
- `components/` page sections and the inbox demo
- `lib/inbox-model.ts` sample tickets, point values, and triage
- `lib/links.ts` resume, LinkedIn, and GitHub URLs
- `public/sam-archer-resume.pdf` resume
- `CHANGELOG.md` the same notes as the changelog page
