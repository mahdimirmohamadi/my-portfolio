# ~/lab/pomodoro: spec

Agreed with the owner on 2026-10-02, before building. Every decision below was made by the owner, so change it only if the owner asks.

## Scope

- A solo pomodoro timer that any visitor can use. There are no accounts, no server and no shared rooms: everything stays in the visitor's browser.
- The lofi radio is **not** part of this work. It comes later.
- The timer is available in both English (`/lab/pomodoro`) and Persian (`/fa/lab/pomodoro`).

## Routes and navigation

- `/lab` is the hub. It holds two plastic "devices" side by side (not a card grid), each with an LED:
  - **Pomodoro timer:** a lit LED, and the whole device links to `/lab/pomodoro`. It shows a live hint, such as `3 pomodoros today` or `running · 12:40`.
  - **Lofi radio:** an unlit LED and a `soon` sticker. It is not clickable.
- `/lab/pomodoro` is the timer page.
- Search engines can index both pages, and both are in the sitemap. Today `/lab` is `noindex` and filtered out of the sitemap, so remove that filter.
- The navbar gets a "Lab" link. The phone dock gets one too.

## Timer

- **The cycle:** focus, short break, and a long break every N focus sessions. Every length can be changed, and there are presets (25/5, 50/10) as well as custom values.

| Setting | Default | Range |
|---|---|---|
| Focus length | 25 min | 5–90 min |
| Short break | 5 min | 1–30 min |
| Long break | 15 min | 1–30 min |
| Long break every | 4 focus sessions | 2–8 |
| Daily goal | 8 pomodoros | 1–20 |
| Auto-start next phase | off | on/off |
| Chime | on | on/off |

- **Controls:** start, pause/resume, **Stop** during a focus (ends it early, saved as abandoned) and **Skip break** during a break (straight to the next focus).
- **The clock:** it is based on timestamps, not on counting ticks, so it stays correct in a background tab.
- **One timer per browser:** every open tab mirrors it live. Closing one tab abandons nothing while another tab still has it open.
- **When a phase ends:**
  - The tab title counts down while a phase runs.
  - A soft two-note chime plays. It is synthesized with WebAudio, so there is no audio file. It can be muted.
  - A browser notification appears. Permission is asked when the visitor starts their first session, never on page load.

## Ending a session early, reloading and closing

- **Stopping early:** the session is saved as **abandoned**. It appears in the history, marked as abandoned. It doesn't count in the stats, the heatmap or the goal, and it gets no reward.
- **Reload (F5):** the session resumes. The page tells a reload from a close with a `sessionStorage` marker, which survives a reload but not a closed tab.
- **Closing the tab** while a session is running or paused abandons it. Two warnings cover this:
  - the browser's generic `beforeunload` prompt, whose text browsers don't let the page change;
  - a line on the page near the controls: "Closing this tab ends the session as abandoned."
- **Moving to another page of the site** doesn't close anything. Thanks to the persistent dock, the timer keeps running.

## Category and topic

- **The category** is required and pre-filled with the last one used.
- **The topic** is optional free text. As the visitor types, it suggests topics from their past sessions.
- Both can be changed until the session ends.
- **Default categories:** Study, Work, Code, Reading. They have no colours: categories are told apart by name, and the stats use ink bars.
- **Renaming** a category updates every past session.
- **Deleting** a category asks first. Its sessions move to "Uncategorized". The last category can't be deleted.

## Reward (anime image)

- The image is shown after a **finished focus session** only. Break endings and abandoned sessions get no image.
- The images are files in `src/assets/anime/`, which the site discovers automatically (`import.meta.glob`) and optimizes at build time. Nothing is written under the image: no caption, no credit.
- **The order:** a shuffled deck per browser, so no image repeats until every image has been seen.
- **Manual start (auto-start off):** the image takes the place of the clock on the glass screen and a "Start break" key sits under it. The clock comes back when the break starts.
- **Auto-start on:** the image fills the screen and the break countdown sits small in a corner. Tapping the image, or waiting 20 seconds, brings the clock back.
- **Test images:** five characters, downloaded to this machine only: Frieren (Wikipedia), and Kaneki, Levi, Violet Evergarden and Spike Spiegel (Kitsu). Gojo was planned too, but no source with his image was reachable from this network (MyAnimeList, AniList and Fandom don't respond here). They're small (about 225x350) and are placeholders; the owner will replace them with his own.

## Look (the Git Graph world)

Revised on 2026-10-03 after the owner found the first version complicated: **minimal, one centred column, the timer is the page.**

- The timer device is the only thing on screen at first:
  - A glass screen with the phase, the big phosphor digits, the elapsed-time hairline, and today as lit dots ("3 of 8 today"). Persian digits are used in FA.
  - One input line for the category and the topic.
  - The primary key, and a second key only when it applies.
- **History** and **Settings** are two small keys under the device. Each opens a drawer, one at a time:
  - **History:** this week, the year heatmap, and the sessions, ten at a time.
  - **Settings:** the timer lengths and switches, the categories, and your data.
- Every row in History and in the categories has one **Edit** key. Delete sits inside the edit form and asks before deleting.
- **Nix:** one Nix stands on the device's top edge and changes pose with the phase, crossfading in 150ms. No new poses are needed.

| Phase | Pose |
|---|---|
| Ready (nothing running) | `desk` |
| Focus | `type` |
| Paused | `think` |
| Short break | `tea` |
| Long break | `sleep` |
| Reward showing | `thumbs` |

- Follow the DESIGN.md rules: lime only for lit things, no blur shadows and no gradients. Motion is limited to transform and opacity, and is removed under reduced motion or `html[data-lite]`. Use logical properties and RTL mirroring.

## Dock mini-timer

- It mounts in `BaseLayout`'s persistent `dock` slot as a React island (`client:idle`, `transition:persist="lab-dock"`).
- It is visible only while a session is running or paused, and is hidden on `/lab/pomodoro` itself.
- It shows the phase, `mm:ss` and the category, and has a pause/resume key. Tapping it opens `/lab/pomodoro`.

## History and stats

- **The list of sessions** shows the date and time, length, category, topic and status (finished or abandoned). The visitor can edit a session's category or topic, and can delete a session after confirming in the page (no browser `confirm()`).
- **Totals:** today's count against the goal is shown on the timer's screen. This week, broken down by category, is shown in the History drawer.
- **A year-long heatmap**, GitHub-style:
  - Each square lights up more the more pomodoros were finished that day.
  - A category filter narrows it.
  - On phones it scrolls sideways and opens at today.
  - The calendar follows the language: English weeks start on Monday, with Gregorian month labels; Persian weeks start on Saturday, with Jalali month labels and Persian digits.

## Data

- Everything lives in `localStorage`: sessions, categories, settings, the image deck, and the live timer state shared across tabs. Every read and write is wrapped in `try/catch`.
- **Export** downloads a JSON backup file.
- **Import** merges a backup:
  - Sessions are added by `id`, so duplicates are skipped and importing the same file twice changes nothing.
  - Categories and settings are combined.
- **Clear all** wipes everything, after confirming in the page.
- **Hint shown beside export:** "Your history lives in this browser only. To keep it on another device, export it here and import the file there."

## Where the code is

- `src/lib/pomodoro/store.ts`: the data model, defaults, limits, and the guarded `localStorage` document shared by every tab.
- `src/lib/pomodoro/engine.ts`: the clock. It handles phase transitions, catch-up after sleep, one tab ending a phase (Web Locks), tab heartbeats (only while a session is active), abandonment when the last tab closed, the chime, notifications and the tab title.
- `src/lib/pomodoro/data.ts`: settings, categories, history edits, the image deck, export and import.
- `src/lib/pomodoro/calendar.ts`: day and week keys, the heatmap grid, and Jalali and Gregorian labels.
- `src/components/lab/MiniTimer.astro`: the dock mini-timer. It also starts the engine on every page.
- `src/components/lab/pomodoro/*.tsx` and `pomodoro.css`: the page app.
- `src/pages/[...lang]/lab/index.astro` and `pomodoro.astro`: the hub and the page.
- Strings are the `lab.*` and `pomo.*` keys in `src/i18n/ui.ts`.
