# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable product decisions

- The selected visual source is Product Design ideation option 2: a cold blue-black night river viewed from a warm wooden cabin, with horizontal verse lines and a narrow vertical learning index.
- Preserve some of option 1's generous whitespace and quiet editorial pacing.
- Each poem must have a meaningfully different composition and interaction model, not merely a new background or palette.
- Real web imagery and ImageGen assets are welcome when they materially improve the poem-specific atmosphere.
- Keep the daily poem dominant. History and study tools should remain discoverable without turning the product into a dashboard.
- Daily publishing is allowed to run in a cloud environment where GitHub/npm DNS is unavailable locally. GitHub connector data is the remote source of truth; npm bootstrap exit code `20` is a network condition, not a content failure.
- `npm run verify:offline` is the minimum pre-submit contract and must stay dependency-free; `npm run build` must continue to include it so Vercel independently gates production content.
- All daily publication dates use `Asia/Shanghai`. Do not derive the publication date from UTC.
- The scheduled-task prompt should point to `prompts/chatgpt-work-daily-task.md` instead of duplicating that file's full text.
