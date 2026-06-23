# Test Strategy — Sauce Demo

**Author:** Regi Saputra
**Application Under Test:** https://www.saucedemo.com

---

# 1. Objective

The objective of this testing effort is to ensure the reliability and quality of the application's core e-commerce functionality, with a focus on business-critical user journeys such as authentication, cart management, and checkout.

---

# 2. Scope

### In Scope

* Authentication (successful login, invalid login, locked-out user)
* Product Catalog (inventory display and product sorting)
* Cart Management (add/remove items, cart badge validation, cart persistence)
* Checkout Flow (customer information validation, order summary, order completion)
* API Testing (authentication, products, users, and carts endpoints)
* Exploratory testing using Sauce Demo's special user personas

### Out of Scope

* Payment gateway testing
* Database validation
* Performance and load testing
* Security testing
* Localization testing
* Cross-browser and cross-device testing

---

# 3. Test Approach

## UI Automation Testing

UI automation is implemented using Playwright and TypeScript following the Page Object Model (POM) design pattern.

Key coverage areas:

* Login
* Logout
* Add to Cart
* Remove from Cart
* Product Sorting
* Checkout Flow

## API Testing

API tests are implemented using Playwright's built-in request capabilities.

Key coverage areas:

* Positive scenarios
* Negative scenarios
* Response validation
* API contract and schema validation

## Exploratory Testing

Exploratory testing is performed to identify issues that may not be covered by automated tests, particularly using Sauce Demo's special test accounts:

* `problem_user`
* `error_user`
* `visual_user`

---

# 4. Risk-Based Testing

| Area             | Risk Level | Mitigation                                                      |
| ---------------- | ---------- | --------------------------------------------------------------- |
| Checkout Flow    | Critical   | Highest automation priority and smoke test coverage             |
| Cart Management  | High       | Validate consistency across inventory, cart, and checkout pages |
| Pricing & Totals | High       | Verify subtotal, tax, and total calculations                    |
| API Contracts    | Medium     | Implement schema validation for responses                       |
| Test Stability   | Medium     | Use Playwright auto-waiting, assertions, and CI retries         |

---

# 5. Tools

| Area              | Tool                               |
| ----------------- | ---------------------------------- |
| UI Automation     | Playwright + TypeScript            |
| API Testing       | Playwright Request API             |
| Schema Validation | Zod                                |
| CI/CD             | GitHub Actions                     |
| Reporting         | Playwright HTML Report & JUnit XML |

---

# 6. Entry & Exit Criteria

### Entry Criteria

* Test environment is accessible.
* Required test data is available.

### Exit Criteria

* All smoke tests pass successfully.
* No open Critical or High severity defects.
* Known issues are documented and communicated.

---

# 7. Defect Management

All defects should include:

* Clear description
* Reproduction steps
* Expected vs. actual results
* Severity level
* Recommended action

Defect priority is determined based on business impact and user impact rather than technical complexity.
