# ✅ TaskManagerPlus – Automated Tests (UI & API)

This repository contains the automated test suite for the **TaskManagerPlus ecosystem**, covering:

- 🖥️ End-to-End UI Tests (Playwright)
- 🔌 API Tests
- 📊 Execution Reports
- 🤖 AI-powered Analysis (via taskmanagerplus-ai-analyzer)

It is designed as a **portfolio-ready QA automation project**, focused on real execution, traceability, and evidence-based testing.

---

## 🚀 Tech Stack

- Playwright (TypeScript)
- Node.js
- REST API Testing
- GitHub Actions (CI-ready)
- HTML & JSON Reports
- AI Analysis Integration

---

## 📁 Project Structure

```
taskmanagerplus-tests/
│
├── ui-tests/            # Playwright UI tests
│   ├── tests/           # Test scenarios
│   ├── pages/           # Page Objects
│   └── reports/         # Playwright reports (JSON/HTML)
│
├── api-tests/           # API test suite
│
├── test-results/        # Playwright execution artifacts
│
├── scripts/             # Utility scripts
│
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Prerequisites

- Node.js 18+
- Git
- Chrome / Edge (for Playwright)

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Install Playwright Browsers

```bash
npx playwright install
```

---

## ▶️ Running Tests

### 🖥️ UI Tests

```bash
npm run test:ui
```

Or directly:

```bash
npx playwright test
```

---

### 🔌 API Tests

```bash
npm run test:api
```

---

## 📊 Reports

After execution, Playwright generates:

- 📄 HTML Report
- 📄 JSON Report
- 📂 Trace files

Open the HTML report:

```bash
npx playwright show-report
```

---

## 🤖 AI Analysis (Optional)

This project integrates with:

➡️ **taskmanagerplus-ai-analyzer**

Which can:

- Detect root causes
- Identify flaky tests
- Generate insights
- Suggest new test cases

Example:

```bash
npm run analyze:real:openai -- "<path>/playwright-report.json"
```

---

## 📸 Portfolio Snapshots

After a real execution, you can generate versioned snapshots using the analyzer:

```bash
npm run analyze:real:snapshot "<path>/playwright-report.json"
```

Snapshots are stored under:

```
out/examples/
```

They serve as **proof of execution and analysis** for portfolio and documentation.

---

## 🔄 CI/CD Ready

This project is prepared for:

- GitHub Actions
- Jenkins pipelines
- Regression suites
- Scheduled runs

Reports and artifacts can be archived automatically.

---

## 🎯 Project Goals

✔ Build reliable automated tests  
✔ Produce real execution evidence  
✔ Enable AI-driven insights  
✔ Serve as a public QA portfolio  
✔ Demonstrate modern testing practices  

---

## 👨‍💻 Author

**Maicon Fang**  
QA Engineer | Automation | AI in Testing  

🔗 GitHub: https://github.com/maiconfang  
🔗 Portfolio: https://maiconfang.github.io/portfolio/

---

## 📜 License

MIT License
