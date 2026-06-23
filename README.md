# Sauce Demo QA Automation — Senior QA Engineer Take-Home

Automation framework for testing [saucedemo.com](https://www.saucedemo.com) including UI, API, and exploratory testing, built with Playwright + TypeScript using a maintainable Page Object Model structure.

---

## Documents

| Document                   | Description                                           |
| -------------------------- | ----------------------------------------------------- |
| `TestStrategy.md`          | Test scope, approach, and risk-based testing strategy |
| `BugReport.md`             | Exploratory testing findings and defect reports       |
| `QAImprovementProposal.md` | 30/60/90-day QA improvement plan                      |
| This file                  | Project setup and execution guide                     |

---

## Tech Stack

* Playwright (UI + API automation)
* TypeScript
* Zod (API schema validation)
* GitHub Actions (CI)

---

## Project Structure

```
.
├── pages/          # Page Object Model (UI abstraction layer)
├── fixtures/       # Test data & reusable authentication setup
├── schemas/        # API response validation (Zod schemas)
├── tests/
│   ├── ui/         # UI automation tests (login, cart, checkout)
│   └── api/        # API automation tests
├── playwright.config.ts
└── .github/workflows/
```

---

## Key Design Approach

### 1. Page Object Model

All UI selectors and page actions are centralized in page classes to improve maintainability and reduce duplication.

### 2. API + UI in One Framework

Both UI and API tests run under a single Playwright setup for simplicity in CI and consistent test execution.

### 3. Risk-Based Testing Focus

Test coverage prioritizes critical business flows:

* Authentication
* Cart management
* Checkout flow
* Core API contracts

### 4. Stable Test Design

* No hard waits (`waitForTimeout` avoided)
* Uses Playwright auto-waiting and assertions
* Independent, isolated test cases

---

## Setup

### Prerequisites

* Node.js 18+
* npm

### Installation

```bash
npm install
npx playwright install chromium
```

---

## Running Tests

```bash
npm test              # Run all tests (UI + API)
npm run test:ui       # UI tests only
npm run test:api      # API tests only
npm run test:headed   # UI tests in visible browser
npm run report        # Open HTML report
```

---

## Test Coverage

### UI Tests

* Login / Logout
* Add / Remove Cart Items
* Product Sorting
* Checkout Flow

### API Tests

* Users
* Authentication
* Products
* Carts
* Schema validation

---

## Notes

* Smoke tests cover critical business flows and can be tagged using `@smoke`.
* Framework is designed to be scalable and easy to extend for future regression suites.
