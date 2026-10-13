# Pramoth S — Portfolio

Personal portfolio for **Pramoth S, Product Development Engineer** — robotics (ROS 2), embedded systems, AI / computer vision and product design.

Built with **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion · Lucide**.

## Run it

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL (and optionally GITHUB_TOKEN)
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Deploy (Vercel, free)

1. Push this folder to a GitHub repo.
2. Import it at vercel.com → New Project.
3. Add environment variables `NEXT_PUBLIC_SITE_URL` (your final URL) and optionally `GITHUB_TOKEN`.
4. Deploy.

## Edit your content — no UI code needed

| File | What it controls |
|---|---|
| `src/data/site.ts` | Name, role, tagline, links, About text, "From idea to product" steps, featured GitHub repos |
| `src/data/projects.ts` | Every project card and its 14-part case study |
| `src/data/skills.ts` | Skill groups and the tech-ecosystem diagram |
| `src/data/experience.ts` | Experience timeline and education |
| `src/data/achievements.ts` | Achievement cards |

Any text in `[SQUARE BRACKETS]` is rendered with a yellow highlight on the site so you can spot what still needs real information. **Replace all of them before sharing the link.** Search the project for `[` to find them.

### To fill in before publishing
- `experience.ts` — company name, dates, location, responsibilities, institution
- `achievements.ts` — exact wording and year for each achievement
- `projects.ts` — repo links, tech and details for the computer-vision projects; results, challenges and testing for NEXVA
- `layout.tsx` — `alumniOf` institution in the structured data

### Adding a project
Copy an entry in `projects.ts`, give it a unique `slug`, set `category`, and fill the fields. It appears in the grid, gets its own `/projects/<slug>` page, and is added to the sitemap automatically. Put images in `public/projects/` and set `image: "/projects/name.jpg"`.

## Structure

```
src/
  app/              layout (SEO, fonts, JSON-LD), home page, project pages, sitemap, robots, icon
  sections/         page sections (Hero, Story, Skills, Projects, Proof, Contact)
  components/       Navbar, diagrams, Robotics Lab, project cards, motion helpers
  data/             all editable content
  lib/github.ts     GitHub API (server-side, cached 1 h, fails gracefully)
```

## Notes
- GitHub data is fetched on the server; the token never reaches the browser. Without a token the public API limit (60 req/h) is plenty thanks to hourly caching.
- Animations respect the OS "reduce motion" setting.
- The Robotics Lab section uses clearly labelled example values; it is an explainer, not live telemetry.
