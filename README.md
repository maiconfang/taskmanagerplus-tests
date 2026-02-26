# ✅ TaskManagerPlus -- Automated Tests (UI + API + AI Integration)

This repository contains the automated test suite for the
**TaskManagerPlus ecosystem**, covering:

-   🖥️ End-to-End UI Tests (Playwright)
-   🔌 API-driven test setup & cleanup
-   📊 Execution Reports (HTML + JSON + Trace)
-   🤖 AI-powered Analysis (via taskmanagerplus-ai-analyzer)

It is designed as a **portfolio-ready QA automation project**, focused
on real execution, architectural maturity, and evidence-based testing.

------------------------------------------------------------------------

## 🚀 Tech Stack

-   Playwright (TypeScript)
-   Node.js
-   REST API (OAuth2 authentication)
-   HTML & JSON Reports
-   Trace Viewer
-   AI Analysis Integration (OpenAI-powered)

------------------------------------------------------------------------

## 📁 Project Structure

    taskmanagerplus-tests/
    │
    ├── ui-tests/
    │   ├── tests/
    │   │    └── province/                # Domain-based test organization
    │   │         province.navigation.spec.ts
    │   │         province.edit.api.spec.ts
    │   │         province.create.api.spec.ts
    │   │         province.delete.api.spec.ts
    │   │         province.ui-legacy.spec.ts
    │   │
    │   ├── pages/                        # Page Objects
    │   ├── components/                   # Reusable UI components
    │   ├── api/                          # API clients (setup & cleanup)
    │   │    authClient.ts
    │   │    provinceClient.ts
    │   │
    │   ├── config/                       # Test configuration
    │   ├── reports/                      # Playwright reports
    │   └── .auth/                        # Saved login session (ignored by Git)
    │
    ├── test-results/                     # Execution artifacts
    │
    ├── global-setup.ts
    ├── playwright.config.ts
    └── README.md

> ⚠️ Note: There is no separate `api-tests/` folder.\
> API calls are used strategically to prepare and clean test data for UI
> tests.

------------------------------------------------------------------------

## 🏗️ Architecture Strategy

### 🔌 API-Driven Setup Pattern

Instead of creating test data via UI (slow and flaky), tests use:

-   OAuth2 authentication via API
-   Token caching
-   Direct entity creation before test execution
-   Automatic cleanup after execution

This ensures:

✔ Faster execution\
✔ Reduced UI flakiness\
✔ Independent tests\
✔ Cleaner environment\
✔ Enterprise-level stability

------------------------------------------------------------------------


# 🔐 Authentication (Login Once -- Session Reuse)

UI tests use **Playwright storageState** to avoid logging in on every test.

The session is created once using `global-setup.ts` and reused across all tests.

## First Run (Generate Session)

```powershell
$env:APP_BASE_URL="http://192.168.2.12:4200"
$env:E2E_USER="luna.moon@maif.com"
$env:E2E_PASS="123"

npx playwright test
```

This generates:

ui-tests/.auth/storageState.json

> The `.auth` folder is intentionally ignored by Git.
> It contains local session data only.

---

## ⚠️ Important — Correct Session Folder

The project **must use only one session location**:

ui-tests/.auth/storageState.json

If you see something like:

ui-tests/ui-tests/.auth/
ui-tests/_auth/

You can safely delete it — it was created by a previous path misconfiguration.

---

## Session Expiration Behavior (Debug Mode)

When running tests normally, the session rarely expires.

However, during:

--debug  
--headed  
manual stepping  
API restart  

the OAuth access token may expire.

When this happens the application shows:

"Application without access permission"

This is NOT a test failure.
It means the session expired while debugging.

---

## How Tests Handle It

The test framework includes an **automatic re-login guard**:

1. Test navigates to a protected page
2. If session is invalid
3. Test performs login again automatically
4. Continues execution

This allows debugging without manually logging in repeatedly.

---

## If the Session Becomes Invalid

Simply delete the session file and rerun:

ui-tests/.auth/storageState.json

Then run again:

npx playwright test

------------------------------------------------------------------------

## ▶️ Running Tests

### ▶ Only with chrome

``` bash
npx playwright test --project=chromium
```

### ▶ Only Failure Scenarios

``` bash
npx playwright test tests/failure-scenarios --project=chromium
```


### ▶ Only with UI

``` bash
npx playwright test --project=chromium --headed
```

### ▶ With Debug

``` bash
npx playwright test --project=chromium --debug
```


---

# 🧪 Debug Evidence (Login Failures)

If login cannot be completed, debug artifacts are generated:

ui-tests/.auth/debug/

This may include:

- Screenshot
- Page HTML
- URL log

These files help identify selector or environment issues.

------------------------------------------------------------------------

### Normal Execution

``` bash
npx playwright test
```

If session expires:

1.  Delete `.auth/storageState.json`
2.  Run tests again

------------------------------------------------------------------------

## ▶️ Running Tests

Run all UI tests:

``` bash
npx playwright test
```

Run specific test:

``` bash
npx playwright test tests/province/province.edit.api.spec.ts
```

Run with debug:

``` bash
npx playwright test --debug
```

------------------------------------------------------------------------

## 📊 Reports & Failure Artifacts

After execution, Playwright generates structured reports and rich failure artifacts that are used by the AI Analyzer.

### Generated Outputs

- 📄 **HTML Report**  
  Interactive visual report for manual inspection.

- 📄 **JSON Report (`playwright-report.json`)**  
  Structured execution data used by the AI Analyzer for automated root cause analysis.

- 📂 **Test Results Directory (`test-results/`) | (`C:\dev\workspace\taskmanagerplus-tests\ui-tests\test-results`)** 
  Contains detailed artifacts for each failed test, including:
  
  - 🖼 Screenshots (captured at failure time)
  - 🎥 Video recordings of the test execution
  - 📄 `error-context.md` with assertion and stack trace details
  - 🧵 `trace.zip` (Playwright trace for deep debugging)

These artifacts provide grounded evidence that enables the AI Analyzer to classify failures, identify patterns, and suggest corrective actions.

Open report:

``` bash
npx playwright show-report
```

------------------------------------------------------------------------

# 🤖 AI Analysis Integration

This project integrates with:

➡️ **taskmanagerplus-ai-analyzer**

The analyzer processes real Playwright JSON reports and produces:

-   Root cause analysis
-   Flakiness detection
-   Evidence-based insights
-   Suggested new test cases
-   Structured Markdown & JSON outputs
-   Snapshot-based portfolio proof

------------------------------------------------------------------------

## 🧠 Example: Run AI Analysis

``` bash
npm run analyze:real:openai -- "<path>/playwright-report.json"
```

------------------------------------------------------------------------

## 📸 Portfolio Snapshots

After a real execution, you can generate versioned analysis snapshots:

``` bash
npm run analyze:real:snapshot "<path>/playwright-report.json"
```

Snapshots are stored under:

    out/examples/

These snapshots serve as:

-   📂 Execution proof
-   📊 AI analysis evidence
-   🧾 Case study material
-   🎯 Recruiter-ready documentation

------------------------------------------------------------------------

## 🧪 Testing Philosophy

  Layer         Responsibility
  ------------- -----------------------------
  API Client    Prepare & clean test data
  Page Object   Perform UI interactions
  Test Spec     Validate business behavior
  AI Analyzer   Interpret execution results

This layered approach demonstrates **advanced QA automation design
maturity**.

------------------------------------------------------------------------

## 🔄 CI/CD Ready

Prepared for:

-   GitHub Actions
-   Jenkins pipelines
-   Regression suites
-   Scheduled executions
-   AI post-processing automation

------------------------------------------------------------------------

## 🎯 Project Goals

✔ Build reliable automated tests\
✔ Produce real execution evidence\
✔ Enable AI-driven insights\
✔ Demonstrate architectural maturity\
✔ Serve as an advanced QA portfolio project

------------------------------------------------------------------------

## 👨‍💻 Author

**Maicon Fang**\
QA Engineer \| Automation \| AI in Testing

GitHub: https://github.com/maiconfang\
Portfolio: https://maiconfang.github.io/portfolio/

------------------------------------------------------------------------

## 📜 License

MIT License
