# Gamma Terminal

A Bloomberg-style trading and market intelligence terminal — built on the web.

Gamma Terminal brings the dense, function-driven workflow of a professional finance terminal to the browser: a command palette for navigating between functions, a workspace of stacked tabs, dark navy surfaces with the signature orange accent, and dedicated screens for quotes, fundamentals, options, fixed income, FX, crypto, news, and more.

## Stack

- **TanStack Start** (React 19 + Vite 7) — file-based routing, SSR-ready
- **Tailwind CSS v4** with a custom Bloomberg-inspired design system (`src/styles.css`)
- **TanStack Query** for data fetching
- **Zustand** for workspace / tab state
- **Recharts** + **lightweight-charts** for visualizations
- **Lovable Cloud** ready (auth, database, storage, edge functions) when you need a backend

## Functions

The terminal ships with a catalog of Bloomberg-style function codes. Open the command palette with `:` and type a code (optionally with a ticker), e.g. `AAPL DES`.

| Code        | Purpose                                  |
|-------------|------------------------------------------|
| `CC`        | Command Center — markets briefing        |
| `DES`       | Security description                     |
| `SCORECARD` | Intelligence verdict for a ticker        |
| `HP`        | Historical price chart                   |
| `FA`        | Financial analysis                       |
| `KEY`       | Key statistics                           |
| `DVD`       | Dividends                                |
| `EE`        | Earnings estimates                       |
| `MOV`       | Top movers                               |
| `WEI`       | World equity indices                     |
| `CURV`      | Yield curve                              |
| `OMON`      | Options monitor                          |
| `CRYPTO`    | Crypto dashboard                         |
| `FXC`       | FX cross rates                           |
| `NI`        | News                                     |
| `QR`        | Quote / recent trades                    |
| `HELP`      | Function index                           |

## Keyboard

- `:` — open command palette
- `Ctrl + ←` / `Ctrl + →` — switch tabs
- `Esc` — close palette

## Project layout

```
src/
  routes/            TanStack Start routes (entry: index.tsx)
  TerminalApp.tsx    Terminal shell (header, tabs, status bar, palette)
  components/        UI primitives + terminal chrome
  functions/         One file per function code (CC, DES, MOV, …)
  lib/               api, formatters, signals, news, helpers
  store/             Zustand workspace store
  styles.css         Design system + bb-* component classes
```

## Design system

Defined entirely in `src/styles.css` via Tailwind v4 `@theme` tokens:

- Surface scale `--color-bb-bg`, `--color-bb-bg-2`, `--color-bb-bg-3`
- Bloomberg orange `--color-bb-orange` (`#FA8000`) as the only saturated accent
- Yellow / cyan / green / red / magenta semantic accents
- Inter for body, JetBrains Mono with tabular numerics for all data

Reusable component classes: `bb-panel`, `bb-header`, `bb-table`, `bb-button`, `bb-input`, `bb-tab`, `bb-fkey`, `bb-status-live`, `bb-positive` / `bb-negative`.

## Data

The data layer in `src/lib/api.ts` calls `/api/v1`, which is the [OpenBB Platform](https://github.com/OpenBB-finance/OpenBB) REST API (50+ providers, free Yahoo Finance default). To wire it up, run an OpenBB API instance locally on `:6900` and proxy `/api` to it, or swap `BASE` in `src/lib/api.ts` to a hosted provider (Finnhub, Polygon, Alpha Vantage, FMP, …).

The News function (`NI`) uses bundled mock data, so it works out of the box with no backend.

## Develop

```bash
bun install
bun run dev
```

Open the preview, press `:` and start typing a function code or ticker.

## Credits

Inspired by [BBterminal by gommalabs](https://github.com/gommalabs/Gamma-Terminal). Reworked into a TanStack Start application with a refreshed Bloomberg-inspired design system.
