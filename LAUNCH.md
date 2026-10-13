# LAUNCH.md — How to run and work on this portfolio

Everything you need to start, edit, build and deploy the site. Run every command
from the project folder:

```bash
cd ~/Downloads/pramoth-portfolio
```

---

## 1. Quick start (development)

```bash
npm install        # first time only — installs dependencies
npm run dev        # starts the dev server with hot reload
```

Then open **http://localhost:3000** in your browser.
Any file you edit is reflected in the browser instantly (no restart needed).

- If port 3000 is busy, Next.js automatically picks 3001, 3002, … — the
  terminal prints the actual URL under `Local:`.
- To view from your phone (same Wi-Fi), use the `Network:` URL the terminal
  prints, e.g. `http://192.168.29.114:3000`.
- Stop the server with `Ctrl + C`.

## 2. Production build (what gets deployed)

```bash
npm run build      # compiles an optimized static build into .next/
npm run start      # serves that build at http://localhost:3000
```

Always run `npm run build` before deploying — it also catches TypeScript
errors.

**Fastest local viewing (no lag), without disturbing a running dev server** —
production builds can use their own folder so they never clash with dev:

```bash
NEXT_DIST_DIR=.next-prod npx next build
NEXT_DIST_DIR=.next-prod npx next start -p 3005   # open http://localhost:3005
```

If a plain dev server starts returning 500 errors after a plain build (they
share `.next/` by default), clear the cache and restart:

```bash
rm -rf .next
npm run dev
```

---

## 2b. Extra pages & tools

| URL | What it is |
|---|---|
| `/resume` | Print-ready one-page résumé generated from the data files. "Download PDF" opens the print dialog. |
| `/visitors?key=…` | Owner-only visitor log (key = `VISITOR_KEY` in `.env.local`). Terminal: `./visitors.sh`. |
| `/opengraph-image` | Auto-generated social preview card used by LinkedIn / WhatsApp link previews. |

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` once you have a domain — canonical URLs, Open Graph URLs and the sitemap stay off until then.

## 3. Where everything lives (edit these, not the components)

All of your personal content is plain data in `src/data/` — change it there
and the site updates everywhere automatically:

| File | What it controls |
|---|---|
| `src/data/site.ts` | Name, role, tagline, email, GitHub/LinkedIn links, company (Scrapify Ecotech Pvt Ltd · iTNT Hub, Anna University, Guindy), nav items |
| `src/data/experience.ts` | Work experience (Scrapify, 2026 – Present) and education (Meenakshi Sundararajan Engineering College, 2021 – 2025) |
| `src/data/projects.ts` | All projects, their summaries, tech chips, GitHub repo links, and the NEXVA flagship case study |
| `src/data/skills.ts` | The six skill groups and their chips |
| `src/data/achievements.ts` | Awards (not shown on the home page right now, but used by the stats counter) |

Anything written like `[VERIFY]` or `[ADD INFORMATION]` shows up **highlighted
in yellow** on the site — replace it with real facts before publishing.

### Your photo

- `public/profile.jpg` — original portrait (used nowhere right now)
- `public/profile-cutout.png` — background-removed version shown in the hero

To use a new photo: replace `profile.jpg`, remove its background (any tool —
remove.bg works), save the result as `public/profile-cutout.png`, refresh.

---

## 4. How the site is put together

**Stack:** Next.js 15 · React 19 · Tailwind CSS 3 · Framer Motion 12 · TypeScript

**Page flow** (`src/app/page.tsx`): Hero → tech marquee → About → Experience →
Skills → Projects → Contact. Each project card links to a full case-study page
at `/projects/<slug>`.

**Sections** live in `src/sections/`, reusable pieces in `src/components/`:

| File | What it does |
|---|---|
| `components/Portrait.tsx` | Hero photo scene: radar sweep, spinning orbit rings with ROS2/PY/C++/JS/AI badges, PCB circuit traces with travelling light pulses, floating code glyphs |
| `components/Effects.tsx` | Animation toolkit: scroll progress bar, cursor spotlight, magnetic buttons, 3D tilt cards, count-up counters, rotating role words, particle constellation, back-to-top |
| `components/Marquee.tsx` | The scrolling technology strip under the hero |
| `components/HeroVisual.tsx` | The animated LiDAR robot graphic (shown in About) |
| `sections/Story.tsx` | About + Experience (with the "By the numbers" stats card) |
| `app/globals.css` | Theme utilities: shimmer gradient text, glow, grid/dot backgrounds, scrollbar |
| `tailwind.config.ts` | Colors (dark green theme) and all animation keyframes |

**Animation behavior:** everything honors the OS "reduce motion" setting,
the particle canvas pauses when the tab is hidden, and the heavy decorations
hide on mobile so phones get a fast, clean page.

---

## 5. Common tasks

```bash
# Type-check without building
npx tsc --noEmit

# Change the dev port explicitly
npx next dev -p 4000

# See what's using port 3000
lsof -i :3000
```

**Add a project:** copy an existing entry in `src/data/projects.ts`, give it a
unique `slug`, and it appears in the grid and gets its own case-study page
automatically.

**Reorder/remove sections:** edit the list in `src/app/page.tsx` and the
matching `navItems` in `src/data/site.ts`.

---

## 6. Deploying (free, recommended: Vercel)

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → sign in with GitHub → **Import** the repo.
3. Keep the defaults (Vercel detects Next.js) and deploy — you get a live
   `*.vercel.app` URL, and every `git push` redeploys automatically.
4. Set the environment variable `NEXT_PUBLIC_SITE_URL` to your live URL so
   SEO metadata and the sitemap use the right domain.

Before going live, make the `nexva_ws` GitHub repo **public** — the flagship
project links to it and the link is currently 404 (private).

---

## 7. Troubleshooting

| Symptom | Fix |
|---|---|
| Page shows 500 after running a build | `rm -rf .next && npm run dev` |
| Dev server picked a different port | Read the `Local:` line in the terminal |
| Warning about "multiple lockfiles" | Harmless — there's a stray `~/package-lock.json`; the config already pins the project root |
| Photo edits not showing | Hard-refresh the browser (`Ctrl + Shift + R`) |
| Yellow highlighted text on the site | That's a `[VERIFY]` placeholder in `src/data/` — fill it in |
