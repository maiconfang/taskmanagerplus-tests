# Failure Scenarios (Domain-based)

This folder contains **negative** and **intentionally failing** tests designed to generate rich error data for the AI Analyzer.

## Structure

- `province/`
  - `api/` API failure scenarios for Province endpoints
  - `ui/` UI failure scenarios for Province screens
- `task/`
  - `api/` API failure scenarios for Task endpoints
  - `ui/` UI failure scenarios for Task screens
- `users/`
  - `api/` API failure scenarios for User endpoints
  - `ui/` UI failure scenarios for User screens 
- `group/`
  - Placeholders to keep the structure consistent. Implement when ready.

## Naming convention

`<domain>.<layer>.<category>.<scenario>.spec.ts`

Examples:
- `task.api.auth.missing-token.spec.ts`
- `province.ui.timing.search-race.spec.ts`
  

# 🧪 Running Failure Scenarios Tests

This section explains how to execute only the tests inside the:

    ui-tests/tests/failure-scenarios/

There are multiple ways to run them depending on your workflow.

------------------------------------------------------------------------

## ✅ 1️⃣ Run All Failure Scenarios (Recommended)

From inside the `ui-tests` folder:

``` bash
npx playwright test tests/failure-scenarios
```

``` bash
npx playwright test tests/failure-scenarios --project=chromium
```


This runs: - Province failures - Task failures - Group failures - API
and UI negative scenarios

------------------------------------------------------------------------

## ✅ 2️⃣ Run Only Failure Scenarios for a Specific Domain

### ▶ Task Only

``` bash
npx playwright test tests/failure-scenarios/task
```

### ▶ Province Only

``` bash
npx playwright test tests/failure-scenarios/province
```

### ▶ Group Only

``` bash
npx playwright test tests/failure-scenarios/group
```

### ▶ User Only

``` bash
npx playwright test tests/failure-scenarios/users
```
```bash
npx playwright test tests/failure-scenarios/users/api --project=chromium
```

------------------------------------------------------------------------

## ✅ 3️⃣ Run Only API Failures

``` bash
npx playwright test tests/failure-scenarios/task/api
```

Or:

``` bash
npx playwright test tests/failure-scenarios/province/api
```

------------------------------------------------------------------------

## ✅ 4️⃣ Run Only UI Failures

``` bash
npx playwright test tests/failure-scenarios/task/ui
```

------------------------------------------------------------------------

## ✅ 5️⃣ Run in a Specific Browser (Chromium Example)

``` bash
npx playwright test tests/failure-scenarios --project=chromium
```

------------------------------------------------------------------------

## ✅ 6️⃣ Run in Headed Mode (See Browser)

``` bash
npx playwright test tests/failure-scenarios --project=chromium --headed
```

------------------------------------------------------------------------

## ✅ 7️⃣ Run Using Grep (If You Add Tags)

If tests are tagged like:

``` ts
test.describe('@failure @task', () => {
```

You can run:

``` bash
npx playwright test --grep @failure
```

Or:

``` bash
npx playwright test --grep @task
```

------------------------------------------------------------------------

## 💡 Recommended Script (Optional)

You can add this to your `package.json`:

``` json
"scripts": {
  "test:failures": "playwright test tests/failure-scenarios --project=chromium"
}
```

Then run:

``` bash
npm run test:failures
```

------------------------------------------------------------------------

## 🎯 Why This Structure Is Useful

-   Keeps negative tests isolated
-   Makes AI Analyzer classification easier
-   Allows selective execution in CI pipelines
-   Supports scaling across domains (Task, Province, Group, etc.)

------------------------------------------------------------------------

You can include this section directly in your main README.md under a
dedicated heading like:

    ## 🧪 Failure Scenarios


## Notes

- Some tests are **intentional failures** (wrong expectations on purpose).
- Some tests are **control/pass** tests included for comparison inside the same suite.
- Keep comments in **English** to make the Analyzer output consistent.
