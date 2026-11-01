# Little Fire Crew

A gentle cooperative browser toy for one grown-up and one little helper. All artwork is drawn locally with Phaser graphics; sounds are quiet Web Audio tones. No accounts, tracking, external assets, or backend.

## Run

Node.js 22.12+ (validated with Node 24).

```sh
npm ci
npm run dev
```

Open the address printed by Vite. `npm run build` type-checks and builds `dist/`; `npm run preview` serves that build.

## Play together

- Grown-up: WASD / arrows drive, Space siren (2-second cooldown), E extend/retract ladder inside the mint parking marker, H hold to water the nearest fire.
- Little helper: aim with the mouse, hold the left button to water. Click the kitten once the basket reaches the branch. Click scenery for little reactions. The red siren button also works during driving.
- The game fills the browser window; use the ⛶ button for browser fullscreen.
- P / Escape pauses; M or the music button mutes. Focus loss pauses and clears held inputs.
- Choose either round from the opening menu; the pause menu also lets you switch rounds. Round 1: water all three fires, park beneath the kitten, extend the ladder, and click the kitten. Round 2: fly the helicopter with WASD / arrows, hold the mouse button to drop water on fires, and press E while hovering near each person to winch them to safety. Extinguish the fires and rescue both people to finish. Play Again resets the adventure; Free Play opens the garden without objectives.
- Try watering the flowers, pinwheel, and puddle. There is unlimited water, no damage, and no time limit. The truck moves freely over the lawn and stays inside recoverable bounds.

## Structure and tuning

`src/config.ts` contains the guarded mission state machine and `TUNING`: movement `speed`, magnetic `aimRadius`, `extinguishSeconds` per fire, `waterRange`, particle cap, and master audio `volume`. `input.ts` handles keys and held input; `truck.ts` handles forgiving movement and parking; `objects.ts` handles fires and hose targeting; `audio.ts` synthesizes sounds. `main.ts` draws both rescue maps, runs scene updates, interactive scenery, UI, and rescue animations. All movement, watering, and effects use elapsed time. The 1280×720 game fills the viewport and can enter browser fullscreen.

## Validation

```sh
npm test
```

Playwright uses system Chromium at `/usr/bin/chromium`. Override with `CHROMIUM_PATH=/path/to/chromium npm test` if needed. Tests start their own Vite server on port 4175 (`TEST_PORT` can override it). The integration tests exercise mouse aim assistance, keyboard water fallback, both rescue rounds, free play, sound toggling, pause/focus loss, resize, restart at each stage, and ladder retraction. A garden screenshot is saved in `test-results/`. Tests use `window.__crew` to inspect state and set up isolated restart cases; the full mission and Round 2 controls use keyboard and mouse input.

A relaxed family session is intended to include exploring and watering the garden; practiced adults can complete the rescue more quickly. Audio comfort and child enjoyment still benefit from a real family play session.
