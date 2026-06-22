# Test Strategy — Sauce Demo (saucedemo.com)

**Author:** Regi Saputra
**Application Under Test:** https://www.saucedemo.com

---

## 1. Purpose

This document defines the testing approach for Sauce Demo, an e-commerce demo application covering authentication, product browsing, cart management, and checkout. It is written as the founding QA strategy artifact for a team that currently has no automation framework, no documented quality standards, and no formal test process — the goal is not just to describe *how this assignment was tested*, but to set a pattern the team can keep using afterward.

## 2. Scope

### 2.1 In Scope

- **Authentication**: successful login, invalid credential handling, account lockout (`locked_out_user`), session boundaries (accessing protected pages while logged out).
- **Product catalog**: inventory listing, product detail data, sorting (name/price, ascending/descending).
- **Cart management**: add/remove single and multiple items, badge count accuracy, cart persistence across navigation.
- **Checkout**: customer information validation, order summary math (subtotal/tax/total), order completion, cancel flows.
- **API layer** (Fake Store API, used as a stand-in REST service for this assignment): users, authentication, products, categories, and carts endpoints — positive, negative, and schema validation.
- **Cross-functional concerns**: basic accessibility smells encountered incidentally during UI testing, and visual/data consistency between the six special Sauce Demo user personas (`standard_user`, `problem_user`, `error_user`, `visual_user`, `performance_glitch_user`, `locked_out_user`), since these personas exist specifically to seed known defects for QA practice.

### 2.2 Out of Scope

- **Payment processing**: Sauce Demo's checkout is a simulated flow with no real payment gateway, so PCI-relevant scenarios (card validation, payment failures, fraud checks) are not applicable.
- **Backend/database verification**: no direct DB access is available; all assertions are made through the UI and the public API surface.
- **Load/performance testing**.
- **Security testing**.
- **Cross-browser/cross-device matrix**: automation targets Chromium headless for speed and CI reliability/
- **Localization/internationalization**: the application is English-only with no locale switching.
- **The Fake Store API's write operations** (`POST`/`PUT`/`PATCH`/`DELETE`) for products/carts/users beyond what's required by the assignment.

## 3. Test Approach

### 3.1 Test Levels and the Test Pyramid

```
            ▲
           ╱ ╲          UI End-to-End (Playwright)
          ╱   ╲         ~20 scenarios: login, cart, checkout, sorting
         ╱─────╲        Slow, high-fidelity, run on every PR
        ╱       ╲
       ╱  API    ╲      API Tests (Playwright request context)
      ╱  Testing  ╲     ~18 scenarios: schema, contract, negative cases
     ╱─────────────╲    Fast, stable, run on every commit
    ╱               ╲
   ╱  Exploratory /   ╲ Manual/exploratory testing
  ╱  Static Analysis   ╲ Risk-based, charter-driven, pre-release
 ╱───────────────────────╲
```

Sauce Demo has no backend the team controls, so a conventional unit-test base isn't available to us as testers; in a real engineering org, that base would be owned by developers and this pyramid would sit on top of it.

### 3.2 Functional UI Testing

Implemented with Playwright + TypeScript using the Page Object Model (see `README.md` for architecture). Covers the six required scenarios (successful login, invalid login, add to cart, remove from cart, complete checkout) plus a regression suite for product sorting. Each spec is independent and idempotent — no test depends on state left behind by another, which is what makes `fullyParallel: true` safe in `playwright.config.ts`.

### 3.3 API Testing

Implemented against the Fake Store API using Playwright's built-in `request` fixture (no separate HTTP client needed, which keeps the toolchain to one language and one test runner). Coverage includes:
- Positive cases: valid requests return correct status codes, correct content types, and schema-valid bodies.
- Negative cases: invalid credentials, non-existent resources, malformed input.
- Schema validation: every response is validated against a `zod` schema (`schemas/fakeStoreApi.schemas.ts`), so a field being renamed, retyped, or dropped fails the build with a precise diff instead of silently passing.
- Cross-resource integrity: cart line items are checked against the products list to confirm referenced product IDs actually exist — a class of bug that single-endpoint testing alone won't catch.

### 3.4 Exploratory Testing

Session-based exploratory testing was performed using Sauce Demo's built-in "broken" personas (`problem_user`, `error_user`, `visual_user`), which exist specifically to seed defects for QA practice. This is documented separately in `BugReport.md`. Exploratory testing is treated as a complement to automation, not a replacement — automation catches regressions on what we already know to check; exploration is how we find what we don't yet know to check.


## 4. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Checkout flow breaks (blocks revenue) | Medium | Critical | Highest test density here: happy path, multi-item, validation, and cancel are all covered; flagged as priority #1 for any future smoke suite |
| Cart state desyncs between pages (badge vs. actual contents) | Medium | High | Explicit assertions that cart state is consistent across inventory, cart, and checkout pages, not just within one page |
| Silent pricing/math errors (tax, totals) | Low-Medium | High | Automated subtotal+tax=total check on every checkout test, not just a snapshot of displayed text |
| API contract drift (field renamed/removed) | Medium | Medium | Schema validation on every response rather than spot-checking a few fields |
| Flaky UI tests from network/animation timing | Medium | Medium (erodes trust in suite) | Playwright auto-waiting, explicit `expect` polling, no hard sleeps, retries enabled in CI only |
| Test suite becomes a maintenance burden as the app grows | Medium | High (long-term) | Page Object Model isolates selectors from test logic; one locator change updates one file, not N specs |
| False confidence from public demo app being unusually stable | Low | Medium | Strategy and framework are written to generalize to a real product, not tuned to this one app's quirks |

## 5. Test Environments & Tools

| Layer | Tool | Rationale |
|---|---|---|
| UI automation | Playwright + TypeScript | Auto-waiting reduces flakiness vs. Selenium; native TypeScript support; built-in trace/video/screenshot capture speeds up debugging failures |
| API automation | Playwright `request` fixture + `zod` | One toolchain for both UI and API reduces context-switching and CI complexity; `zod` gives typed, readable schema validation |
| CI | GitHub Actions | Runs both suites on every PR and nightly; uploads HTML + JUnit reports as artifacts |
| Reporting | Playwright HTML reporter, JUnit XML | HTML for humans debugging locally/in CI; JUnit for any future integration with a test management or CI dashboard tool |

## 6. Entry & Exit Criteria

**Entry criteria** for a test cycle: build/deploy is accessible, no blocking environment issues, test data available.

**Exit criteria** for sign-off: all `@smoke`-tagged tests pass (these cover the critical paths: login, core cart operations, checkout completion, core API contracts), no open Critical/High severity defects in scope, and any known issues are documented with a clear severity and workaround.

## 7. Defect Management

Defects are logged with title, description, reproduction steps, expected vs. actual result, severity, and a recommendation (see `BugReport.md` for the template applied to this assignment). Severity is assessed by user impact, not by how interesting the bug is to find — a cosmetic issue on a high-traffic page can outrank a functional bug in a rarely used flow.

