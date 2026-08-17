# Medispharm & AWMU — Invitation Site

A personalized invitation site built with Next.js (App Router) + Tailwind + Framer Motion.

## How personalization works (no folder-per-person needed)

You do **not** need to create a page or folder for each of the 80 doctors. Instead:

- There's **one** page template: `app/invite/[slug]/page.tsx`
- There's **one** data file: `data/guests.json` — a list of `{ name, slug }`
- Every guest gets a unique `slug` (e.g. `dr-john-smith-4f2a`), and their link is:

  ```
  https://your-site.vercel.app/invite/dr-john-smith-4f2a
  ```

- When that page loads, it looks up the name for that slug and renders the invitation
  with `Dear Dr. John Smith` (or however you phrase it) automatically.

This is the same pattern as a product page (`/product/[slug]`) — one template,
many data-driven pages — so it scales to 80 or 8,000 guests with the same amount of code.

## Adding your 80 guests

1. Open `data/guests.csv` and replace the sample names with your real list — one name per line, keep the `name` header.
2. Run:
   ```bash
   npm run gen:links
   ```
   This creates:
   - `data/guests.json` — used by the site itself
   - `data/guest-links.csv` — the actual links to send out, one row per guest (open in Excel/Sheets)
3. Deploy (see below), then send each person their row from `guest-links.csv` by email/WhatsApp.

Re-run `npm run gen:links` any time you add more names — it won't duplicate existing slugs' *names*, but note it will regenerate the whole file, so keep `guests.csv` as your source of truth.

## Adding your photo

The invitation is a swipeable, full-screen experience with 4 panels, in this order:

1. **Greeting** — "MedisPharm and AWMU invite you to celebrate" (+ your event title, once you set it)
2. **Date, time & location** — with an embedded map and an "Open in Maps" link
3. **Countdown** — live days/hours/minutes/seconds until the event
4. **Guest name + RSVP** — "Dear [Name], will you attend?"

**One photo is used everywhere** — all 4 panels, plus the fallback and "invite
not found" pages — for a consistent look throughout. Drop your photo into
`public/images/` named exactly `photo-1.jpg`.

If it's missing, the site falls back to a generated brand-blue gradient
instead of breaking — so nothing looks empty even before you add it.

Want a different photo per screen instead of one everywhere? Open
`components/InviteCard.tsx` and add more entries back into the `PHOTOS` array
(e.g. `photo-2.jpg`, `photo-3.jpg`) — each panel already requests its own index.

### The map

`lib/event.ts` has a `mapQuery` field — a plain address or place name (e.g.
`"Le Royal Hotel, Beirut, Lebanon"`). This drives both the embedded map on
screen 2 and the "Open in Maps" link. No API key needed — just be as specific
as possible for the map to center correctly.

### The schedule (timeline on screen 2)

`lib/event.ts` also has a `schedule` array — each entry is one row on the
vertical timeline (time, label like "Reception", venue, city). Add more
entries if your event has multiple stops (e.g. Cocktail Hour, Dinner, Awards) —
each gets its own row with a connecting line.

### The event title

`lib/event.ts` has a `title` field, currently empty. It only appears on the
greeting screen once you fill it in — leave it blank and that line just won't render.

## Editing event details

Everything about the event itself — date, time, venue, dress code, host names — lives in one file: `lib/event.ts`.

## Email on confirmation

Uses [Resend](https://resend.com) (free tier is generous, simplest email API to wire into Next.js).

1. Sign up at resend.com, verify a sending domain (or use their test domain while developing).
2. Copy `.env.example` to `.env.local` and fill in:
   - `RESEND_API_KEY`
   - `ORGANIZER_EMAIL` — where YOU want to receive confirmations
   - `FROM_EMAIL` — must be on your verified domain
3. Every time a guest clicks "Confirm response," an email lands in `ORGANIZER_EMAIL` saying who responded and whether they're attending.

This keeps things simple on purpose — your inbox *is* the guest list. If later you want a live
dashboard of who's confirmed, that's a natural upgrade (e.g. add Vercel KV or a Google Sheet), but
it's not required for this to work.

## Running locally

```bash
npm install
npm run gen:links   # builds data/guests.json + the links CSV
npm run dev
```

Then visit e.g. `http://localhost:3000/invite/dr-john-smith-4f2a` (use a slug from your generated `guests.json`).

## Deploying

The easiest path is [Vercel](https://vercel.com) (made by the Next.js team, free for this use case):

1. Push this project to a GitHub repo.
2. Import it in Vercel.
3. Add the same environment variables from `.env.local` in the Vercel project settings.
4. Deploy — you'll get a URL like `https://medispharm-awmu.vercel.app`.
5. Set `SITE_URL` to that URL, re-run `npm run gen:links` locally to get final links with the real domain, and send them out.

## Structure

```
app/
  layout.tsx              global fonts + shell
  page.tsx                generic fallback if someone visits the root URL
  invite/[slug]/page.tsx  the personalized invitation — one template for everyone
  api/rsvp/route.ts       sends the confirmation email
components/
  Collage.tsx             background photo grid
  InviteCard.tsx          the invitation card + reveal animation
  RSVPForm.tsx            attending / not attending + confirm button
data/
  guests.csv              <- you edit this (plain name list)
  guests.json             <- generated, used by the site
lib/
  event.ts                <- you edit this (date, time, venue...)
  guests.ts               lookup helper
scripts/
  generate-guest-links.js turns guests.csv into guests.json + guest-links.csv
```
