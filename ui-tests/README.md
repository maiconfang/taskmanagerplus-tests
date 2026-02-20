# 🎭 playwright-typescript-copilot

This project is a structured example of how to build end-to-end (E2E) tests using **Playwright**, **TypeScript**, and **Page Object Model (POM)** — with the help of **GitHub Copilot**.

---

## 📌 Project Goals

- Automate the login screen of an Angular application (`http://localhost:4200/#/login`)
- Apply good practices with Playwright and POM
- Explore how GitHub Copilot can assist in writing reusable and clean test code

---

## 📁 Project Structure

```
├── config/
│   └── testConfig.ts          # Optional shared config (placeholder for now)
├── pages/
│   └── LoginPage.ts           # Page Object for login functionality
├── tests/
│   └── login.spec.ts          # Test file for login scenarios
├── package.json               # Dependencies and scripts
├── playwright.config.ts       # Playwright global config (to be added later)
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Install dependencies

```bash
npm install
```

### Run all tests

```bash
npx playwright test
```

---

## ⚙️ Configuration Update

In the file `playwright.config.ts`, the following option was added:

```ts
use: {
  headless: true, // ✅ Headless activated
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
},
```

This ensures that all tests run in **headless mode** (i.e., the browser does not open visually), which is useful for CI/CD and faster test execution.

If you want to **see the test running with browser visible**, you can override this via the CLI using the `--headed` flag:

```bash
npx playwright test --headed
```

---

## 🎯 Run a Single Test in Chrome

To run a specific test in the Chromium browser, you can use the following command:

```bash
npx playwright test --project=chromium -g "should login successfully and redirect to app page"
```

This example refers to the test defined as:

```ts
test('should login successfully and redirect to app page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('luna.moon@maif.com', '123');
    await loginPage.expectWelcomeMessage('Welcome'); // Adjust the message if necessary
});
```

To see the browser window while the test runs, just add `--headed`:

```bash
npx playwright test --project=chromium -g "should login successfully and redirect to app page" --headed
```

---

## 💡 GitHub Copilot Usage

Some parts of this project were assisted by [GitHub Copilot](https://github.com/features/copilot), such as:

- Generating the initial `LoginPage.ts` with Playwright best practices
- Creating assertions for error messages
- Refactoring code into clean POM structure

> I may update or remove this section in the future. 😄

---

## ✅ Technologies

- [Playwright](https://playwright.dev)
- TypeScript
- GitHub Copilot (assistive AI)

---

## 🧠 How GitHub Copilot Helped in Practice

During this project, GitHub Copilot was an active assistant in various parts of the workflow. Here's how it contributed step by step:

### ✅ Creating the Playwright Config File

To generate the `playwright.config.ts`, I created a new file and added the following comment:

```ts
// Generate a complete Playwright config file that:
// - Uses the "tests" folder as the test directory
// - Sets a timeout of 30 seconds
// - Enables video and screenshots on failure
// - Defines 3 projects: chromium, firefox, and webkit
// - Uses default desktop devices for each project
// - Runs headed (not headless)
```

Then I pressed `Enter` and let Copilot autocomplete the full configuration.

> This made it easier and faster to create a working config file without having to search the documentation.

### ✅ Writing the Test Scenarios

Using `login.spec.ts`, I used Copilot to suggest tests by writing descriptions or comments like:

```ts
// Test invalid login
```

Then Copilot suggested complete test blocks based on the Page Object methods already defined in `LoginPage.ts`.

You can also use the right-click menu → **Copilot → Editor Inline Chat → Ask** and prompt it with:

```
Generate a test using the LoginPage object for valid login and redirection.
```

### ✅ Project Setup and Execution

After generating the config file, I could run individual tests using the command below:

```bash
npx playwright test tests/login.spec.ts --project=chromium --headed -g "should login successfully and redirect to app page"
```

This allowed me to validate one specific scenario with full browser visibility.

---

# Failure Scenarios Documentation (for AI Analyzer)

This folder contains **intentional, realistic failure scenarios** designed to generate useful Playwright/API reports for the **TaskManagerPlus AI Analyzer**.

## Goals

- Produce failures that **could realistically happen to a user** (timing, session/auth, invalid input, missing records)
- Keep tests **well-structured** (Page Objects / clients) — no “random failing asserts”
- Create reports with **repeatable failure signatures** (timeouts, 401/403, 400, 404) so the Analyzer can learn patterns

---

## How to Run

From `ui-tests/`:

```bash
# Run everything in failure-scenarios
npm run test:failures

# UI-only
npm run test:failures:ui

# API-only (Playwright request-based)
npm run test:failures:api

# Only with chrome
PS C:\dev\workspace\taskmanagerplus-tests\ui-tests> npx playwright test tests/failure-scenarios --project=chromium
```

> Tip: Run with 1 worker for more stable reproduction when debugging:
> `npx playwright test ui-tests/tests/failure-scenarios --workers=1`

---

## Scenario Matrix

| ID | File | Layer | Purpose | Why it can happen to a user | Expected failure / result | Typical report signature | Analyzer hints (root cause) |
|---|---|---|---|---|---|---|---|
| FS-UI-001 | `ui/auth.session-required.spec.ts` | UI | Validate that Province requires an authenticated session (and show what happens if session is missing/expired). | Sessions expire; users open a saved link; storageState missing; token invalid. | **Fail** when trying to access Province without login (redirect/login gate). | URL changes to login, missing expected Province header/controls, navigation assertions fail. | *Auth/session problem*, *storageState missing*, *redirect occurred*, *needs re-login guard*. |
| FS-UI-002 | `ui/timing.search-race.spec.ts` | UI | Create a realistic **race condition** by searching and validating results with a deliberately tight timeout. | Slow network, async grid refresh, heavier CI load, backend latency. | **Fail** intermittently (or consistently on slower env) with timeout. | `Timed out ... waiting for expect(locator)...`, `<element(s) not found>`, locator not visible. | *UI async refresh*, *missing wait for network/table refresh*, *use expect.poll / waitForResponse / stable locator*. |
| FS-UI-CTRL | `ui/empty-state.control.spec.ts` | UI | Control test that documents the **real empty state** behavior of the Province grid. | Users search for a non-existent Province. | **PASS** (documents behavior) — grid renders a blank row. | One `<tr>` with empty `#column-province-name` and `#column-province-abbreviation`. | *Empty state renders blank row, not 0 rows* → avoid “count == 0” assumptions. |
| FS-API-001 | `api/auth.missing-token.spec.ts` | API | Confirm API protects endpoints when Authorization header is missing. | Client/app bugs; expired token; misconfigured gateway; missing auth header. | **Fail** expecting success but receiving **401/403**. | Response status 401/403; error body may mention unauthorized/forbidden. | *Auth header missing*, *token expired*, *need bearer token*, *login step required*. |
| FS-API-002 | `api/validation.empty-fields.spec.ts` | API | Send invalid payload (missing/empty required fields) to create a Province. | Users submit empty forms; UI validation bypassed; client-side bug. | **Fail** expecting 201 but receiving **400**. | Response status 400; message about validation/required fields. | *Validation failure*, *required fields missing*, *add UI validation / server-side message mapping*. |
| FS-API-003 | `api/notfound.update-nonexistent.spec.ts` | API | Try to update a Province that does not exist (stale id). | Record deleted by another user; stale cache; race between list and edit. | **Fail** expecting success but receiving **404** (or 400 depending on API). | Response status 404; message about not found. | *Stale data / record deleted*, *handle 404 gracefully*, *refresh before update*. |

---

## Notes on Design (Why these are “good failures”)

- **Each failure** maps to a real-world risk: auth/session, async timing, invalid input, stale records.
- UI tests keep UI knowledge in `ProvincePage` (Page Object). Example: empty search result is **1 blank row** (documented by FS-UI-CTRL).
- API tests are written to capture **status + response** so the Analyzer can ground insights in evidence.

---

## Evidence Checklist (what the Analyzer should extract)

For each failed test, the Analyzer should prefer these evidence signals:

### UI Failures
- `errorMessage` (timeout, element not found)
- Locator name + action that failed (click/fill/expect visible)
- Current URL and whether redirect happened
- Screenshots/trace (if enabled) — UI timing/state evidence

### API Failures
- HTTP method + endpoint
- Status code (401/403/400/404)
- Request payload summary (which fields are missing/invalid)
- Response body message (validation/not found)

---

## Optional: Make failures more/less frequent

- To make **timing races** more frequent: reduce expect timeouts / remove waits / increase parallel workers.
- To make them less frequent: use `expect.poll`, `waitForResponse`, or wait for the table refresh trigger request.

---

## Trace Mode Recommendation

If you run failures with trace enabled, you get richer evidence for the Analyzer:

- UI: click paths, DOM state, network calls
- API: request/response timing and payloads

(Use your existing `--trace on` / project trace settings if already configured.)


---

## ✍️ Final Note

This README was updated to help others see how GitHub Copilot can be used practically in an E2E testing project with Playwright and TypeScript.

Feel free to explore the project, try the prompts above, and tweak them to your needs. 🚀
