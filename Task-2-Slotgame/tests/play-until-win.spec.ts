import { test, expect, devices } from '@playwright/test';
import type { Page } from '@playwright/test';

// Emulate an iPhone 13, but keep Chromium as the engine (devices['iPhone 13']
test.use({ ...devices['iPhone 13'], defaultBrowserType: 'chromium' });

const GAME_URL = 'https://zig.services/games/gazicashkiosk';
const MAX_SPINS = 40; // observed win chance is ~19% per spin, so 40 comfortably covers a bad streak

function findGameFrame(page: Page) {
  // The game boots into a nested iframe chain (modal -> outer.html -> inner.html).
  // inner.html is where the actual game UI lives.
  return page.frames().find((f) => f.url().includes('inner.html'));
}

test('play the game until a win occurs and check the win display matches the API', async ({ page }, testInfo) => {
  await page.goto(GAME_URL);

  const playGameButton = page.getByRole('button', { name: ' Play game' });
  await playGameButton.waitFor();

  // The click occasionally lands before the page has finished loading and does
  // nothing, so give it a couple of retries until the game frame shows up.
  for (let attempt = 0; attempt < 3 && !findGameFrame(page); attempt++) {
    await playGameButton.click();
    await expect
      .poll(() => !!findGameFrame(page), { timeout: 8_000 })
      .toBe(true)
      .catch(() => {});
  }
  const gameFrame = findGameFrame(page);
  if (!gameFrame) throw new Error('game frame never loaded');

  // The game fades in from a loading splash screen - give that a moment to
  // finish so the click below actually lands on the real spin button.
  await page.waitForTimeout(8_000);

  // Click the spin button on the canvas itself and this actually plays like a real spin, reels and all.
  const canvas = gameFrame.locator('canvas');

  let win;
  for (let spin = 1; spin <= MAX_SPINS && !win; spin++) {
    const outcome = page.waitForResponse((res) => res.url().includes('/demo?') && res.request().method() === 'POST');
    const settled = page.waitForResponse((res) => res.url().includes('/settle'));
    settled.catch(() => {}); // avoid an unhandled rejection if this spin's click below misses

    await canvas.click({ position: { x: 195, y: 487 } });
    const response = await outcome.catch(() => null);
    if (!response) continue; // click landed while the button was still mid-transition, try again

    const { winningClass } = await response.json();
    if (winningClass.winnings.amountInMinor > 0) {
      win = winningClass;
    }

    // The round isn't done until the ticket settles and the balance is
    // re-fetched - that's also what re-enables the play button for the next spin.
    await settled;
    await page.waitForResponse((res) => res.url().includes('/customerState')).catch(() => {});
  }

  expect(win, `no win landed in ${MAX_SPINS} spins`).toBeTruthy();

  const expectedText = `€${win.winnings.amount}`;
  await expect
    .poll(() => gameFrame.evaluate(() => document.getElementById('textfield-winnings')?.getAttribute('data-value')), {
      timeout: 20_000,
    })
    .toBe(expectedText);

  // Keep visual proof of the confirmed win, not just on failure.
  const screenshotPath = testInfo.outputPath('win-confirmed.png');
  await page.screenshot({ path: screenshotPath });
  await testInfo.attach('win confirmed', { path: screenshotPath, contentType: 'image/png' });
});
