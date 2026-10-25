# Amazon.in P0 Playwright Smoke Suite

This repository contains a TypeScript and Playwright smoke suite for Amazon.in's five business-critical customer journeys. Playwright was chosen for its reliable auto-waiting, browser diagnostics, and first-class TypeScript support.

## Prerequisites

- Node.js 20 or later
- Google Chrome/Chromium installed by Playwright
- Internet access to `https://www.amazon.in`

## Install and run

```powershell
npm.cmd ci
npx playwright install chromium
npm.cmd test
```

PowerShell can block `npm.ps1`; use `npm.cmd` if that happens. The default run is headless and runs all five tests in parallel.

```powershell
# Visible browser run
$env:HEADED = 'true'; npm.cmd test

# One test
npx playwright test tests/tc03-verify-cart-contents.spec.ts

# Tagged smoke suite
npm.cmd run test:smoke

# Type check
npm.cmd run typecheck

# Open the HTML report
npm.cmd run test:report
```

Set `BASE_URL` to target another permitted environment. Change the product query in `Config/test-data.json`; all five cases use this shared search keyword.

## Customize the search keyword

All five test cases use a shared search keyword configured in `Config/test-data.json`.

1. Open `Config/test-data.json`.
2. Update the value of `searchKeyword`, for example, from `wireless keyboard` to `computer mouse`.
3. Save the file.
4. Run the suite using `npm.cmd test`.

The tests will use the updated keyword without requiring changes to individual test files. Choose a keyword that returns suitable, available products on Amazon.in. Because the tests interact with a live third-party website, results and availability may vary.

## Project structure

- `Pages/` - Page Object Model classes for Amazon home, product, and cart behavior.
- `tests/` - independent `@smoke` test cases and shared journey helper.
- `Config/test-data.json` - shared base URL and product search keyword.
- `reporters/` - one post-run Excel reporter, safe for parallel execution.
- `reports/` - generated Excel execution report.
- `playwright-report/` - generated HTML report.
- `.github/workflows/` - GitHub Actions workflow and downloadable artifacts.

## Why these are P0

The suite verifies the shortest revenue-critical journey a customer can take without placing an order: find a product, review details, add it to the cart, confirm cart contents, change quantity, and proceed only as far as the sign-in boundary. TC-05 intentionally never creates an account, enters credentials, pays, or submits an order.

## Reliability and limitations

The suite uses role-based or resilient CSS locators inside Page Objects, Playwright assertions and auto-waits, screenshots, and retry traces. CAPTCHA or verification pages are detected and fail with a clear message; the suite does not attempt to bypass them. Amazon catalog content, availability, and markup can change without notice, so the tests choose a visible result for the configured keyword rather than asserting a fixed product or price.

The GitHub Actions workflow runs TypeScript validation on pushes and pull requests. Live Amazon end-to-end tests are available through a manual workflow run because Amazon's hosted-runner responses previously included CAPTCHA/verification challenges. When enabled, the live test job uses CI retries to help diagnose intermittent failures. A green default CI run therefore confirms type-checking, not that the live Amazon tests passed.

With more time, I would add a controlled test environment, accessibility checks, and broader browser coverage.

## Reports

Each run produces `reports/execution-report.xlsx` and `playwright-report/index.html`. GitHub Actions uploads the HTML report, Excel report, screenshots, and test diagnostics as workflow artifacts. `reports/sample-execution-report.xlsx` is the committed sample evidence from a passing run.
