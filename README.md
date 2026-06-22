# Sauce Demo QA Automation — Senior QA Engineer Take-Home

A complete QA foundation for [saucedemo.com](https://www.saucedemo.com): test strategy, a Playwright + TypeScript UI automation framework using the Page Object Model, API automation against the [Fake Store API](https://fakestoreapi.com/docs), an exploratory bug report, and a 30/60/90 QA leadership proposal.

## Documents

| Document | Purpose |
|---|---|
| [`TestStrategy.md`](./TestStrategy.md) | Scope, out-of-scope, risk assessment, test approach, test pyramid |
| [`BugReport.md`](./BugReport.md) | 3 defects found via exploratory testing, with repro steps and severity |
| [`QAImprovementProposal.md`](./QAImprovementProposal.md) | First 30/60/90-day plan, quality metrics, engineering collaboration |
| This file | Setup instructions and framework architecture |


## Architecture

```
.
├── pages/                    # Page Object Model — one class per page/flow
│   ├── BasePage.ts           # Shared nav, hamburger menu, logout/reset
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts       # Models all 3 checkout routes as one flow
├── fixtures/
│   ├── test-data.ts          # Users, invalid-login cases, checkout data
│   └── auth.fixture.ts       # Custom `loggedInPage` fixture (DRY login)
├── schemas/
│   └── fakeStoreApi.schemas.ts  # zod schemas = runtime contract checks
├── tests/
│   ├── ui/                   # login, cart, checkout, sorting (regression)
│   └── api/                  # users, auth, products, carts
├── playwright.config.ts      # Two projects: "ui" (browser) and "api" (HTTP)
└── .github/workflows/ci.yml  # Runs both suites on PR + nightly
```

**Why this structure:** Page Object Model keeps every selector in exactly one place, so a UI change requires one edit, not a find-and-replace across every spec file. Test specs read like a list of business actions (`addProductToCart`, `goToCheckout`) rather than CSS selectors, which is what makes the suite readable to non-automation engineers reviewing a PR. The `auth.fixture.ts` custom fixture removes login boilerplate from every spec that needs an authenticated session — a small thing, but it's the difference between a framework that stays maintainable and one that rots as specs multiply.

API tests use Playwright's built-in `request` fixture rather than a separate HTTP client (e.g. axios/supertest), so UI and API tests share one test runner, one config format, and one CI step shape. Every API response is validated against a `zod` schema instead of spot-checked field-by-field — this means a renamed or dropped field fails loudly with a precise diff instead of silently passing because nobody happened to assert that specific field.

## Setup

**Prerequisites:** Node.js 18+ and npm.

```bash
npm install
npx playwright install --with-deps chromium
```

## Running the Tests

```bash
npm test                  # everything: UI + API
npm run test:ui           # UI suite only (saucedemo.com)
npm run test:api          # API suite only (fakestoreapi.com)
npm run test:ui:headed    # UI suite with a visible browser, useful for debugging
npm run report            # open the last HTML report
```

Run a single file or grep a test name directly with the Playwright CLI, e.g. `npx playwright test tests/ui/checkout.spec.ts` or `npx playwright test -g "successful login"`.

## Verification Performed

This repo was built and verified inside a sandboxed development environment with restricted network egress. What was verified there:

- `npx tsc --noEmit` — the entire framework type-checks cleanly with no errors.
- `npx playwright test --list` — all **38 tests across 8 spec files** (20 UI, 18 API) are discovered correctly with no syntax or configuration issues.
- A live run against `fakestoreapi.com` was attempted, but the sandbox's network allowlist blocks that host (`x-deny-reason: host_not_allowed`) — confirmed with a direct `curl`, not a framework bug. The API suite is written to run unmodified once executed somewhere with normal internet access, e.g. the included GitHub Actions workflow, or a developer's own machine.
- `saucedemo.com` is JavaScript-rendered (a React SPA), so its markup isn't visible to a plain HTTP fetch either; selectors in the page objects were cross-verified against the application's documented `data-test` attributes from multiple independent, current automation references rather than guessed, but a live run is the next step in a real environment.

**Recommended next step for a reviewer:** run `npm test` locally or push to GitHub and let the included Actions workflow run both suites — both are expected to pass end-to-end outside this sandbox's network restrictions.

## Design Decisions Worth Calling Out

- **One config, two projects** (`playwright.config.ts`): UI and API tests have different `baseURL`s and only the UI project needs a browser context. Keeping them as projects in one config (rather than two separate config files) means one `npx playwright test` command can still run everything, while `--project=ui`/`--project=api` lets either run in isolation — useful for keeping CI stages fast and for separating signal when only one layer breaks.
- **No hardcoded waits.** Playwright's auto-waiting plus explicit `expect(...).toHaveURL(...)`/`toBeVisible()` polling is used throughout instead of `page.waitForTimeout()`, which is a common source of both flakiness and unnecessarily slow suites.
- **Cancel and validation-error paths are tested, not just happy paths.** A checkout suite that only proves the happy path works will not catch the class of bug most likely to actually reach production: a user who makes a mistake, fixes it, and tries again.
- **`@smoke` tags** mark the critical-path subset (login, core cart operations, checkout completion, core API contracts) referenced in `TestStrategy.md`'s exit criteria, so a fast subset can be run on every PR (`npx playwright test -g @smoke`) while the full suite runs nightly.
