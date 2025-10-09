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

## ✍️ Final Note

This README was updated to help others see how GitHub Copilot can be used practically in an E2E testing project with Playwright and TypeScript.

Feel free to explore the project, try the prompts above, and tweak them to your needs. 🚀
