# Cash Kiosk - Play Until Win Test

Playwright test for the Cash Kiosk slot game (https://zig.services/games/gazicashkiosk).

It opens the game on a mobile (iPhone 13) viewport, plays real spins until a win occurs,
and checks that the winnings shown in the game's win display match the winnings returned
by the game's API for that spin.

## Setup

```
npm install
npx playwright install chromium
```

## Run

```
npm test
```

or, to watch it play in a real browser window:

```
npx playwright test --headed
```

## How it works

- Clicks the actual spin button on the canvas (same spot a real player would tap), so the
  game plays out for real - reels spin, the win animation plays, etc.
- Between spins it waits on the game's own network calls (`/demo`, `/settle`,
  `/customerState`) instead of a fixed delay, since that's what actually re-enables the
  play button for the next spin.
- Once a spin's API response comes back with a non-zero win, it stops spinning and checks
  that the game's on-screen `WINNINGS` value matches the API's `winnings.amount` exactly.
- On success it also saves a screenshot (`win-confirmed.png`) of the winning spin as
  evidence, attached to the test report.

## Notes

- Win chance is roughly ~19% per spin, so most runs finish in under a minute, but the test
  is allowed up to 40 spins and 20 minutes to comfortably cover a bad streak.
- The spin button's click position is a fixed coordinate tuned for the iPhone 13 viewport
  (390x844). If the emulated device changes, that coordinate would need to change with it.
