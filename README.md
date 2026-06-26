# qa-taskmaster

A task management app built as a complete QA learning project. Every layer of the **Testing Pyramid** is covered — from fast unit tests all the way up to full E2E browser automation.

**78 tests · 99% line coverage · 93% branch coverage**

---

## What This Project Teaches

| Skill | Tool | Where |
|---|---|---|
| Unit testing | Vitest | `src/__tests__/unit/` |
| Component testing | React Testing Library | `src/__tests__/component/` |
| Integration testing | Vitest + MSW | `src/__tests__/integration/` |
| API mocking | MSW (Mock Service Worker) | `src/mocks/` |
| API testing | Vitest + MSW | `src/__tests__/api/` |
| E2E automation | Playwright | `tests/e2e/` |
| Page Object Model | Playwright | `tests/e2e/pom/` |
| Smoke testing | Playwright | `tests/e2e/smoke.spec.ts` |
| Regression testing | Playwright | `tests/e2e/regression.spec.ts` |
| Negative testing | Playwright | `tests/e2e/negative.spec.ts` |
| Code coverage | Vitest v8 | `npm run test:coverage` |
| CI/CD pipeline | GitHub Actions | `.github/workflows/ci.yml` |
| Test documentation | Markdown | `docs/` |

---

## Tech Stack

- **App:** React 18 · TypeScript · Vite · Tailwind CSS
- **Unit/Component/Integration:** Vitest · React Testing Library · jsdom
- **API Mocking:** MSW (Mock Service Worker) v2
- **E2E:** Playwright (Chrome · Firefox · Safari · Mobile)
- **Coverage:** @vitest/coverage-v8
- **CI:** GitHub Actions

---

## Getting Started

```bash
# Clone and install
git clone https://github.com/arushiSH5-cyber/qa-taskmaster.git
cd qa-taskmaster
npm install

# Install Playwright browsers (first time only)
npx playwright install
```

---

## Running the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — play with the app before running tests so you understand what's being tested.

---

## Running Tests

### All unit + component + integration + API tests
```bash
npm test
```

### By layer (recommended learning order)
```bash
npm run test:unit        # Pure function tests — fastest, simplest
npm run test:component   # React component tests with RTL
npm run test:integration # Full app flow with mocked API
npm run test:api         # HTTP layer — status codes, response shapes
```

### With visual UI (best for learning)
```bash
npm run test:ui          # Opens browser UI — see each test, filter, re-run
```

### Code coverage report
```bash
npm run test:coverage    # Shows % of lines/branches/functions covered
```

### E2E tests (requires app running on port 5173)
```bash
npm run test:e2e         # All E2E tests across all browsers
npm run test:e2e:ui      # Opens Playwright UI — watch tests click through Chrome
npm run test:smoke       # Smoke tests only — critical paths, runs first
npm run test:regression  # Regression suite — confirms nothing broke
npm run test:negative    # Negative tests — bad input, edge cases
```

---

## Project Structure

```
qa-taskmaster/
├── src/
│   ├── types/           # TypeScript interfaces (Task, TaskFilter)
│   ├── utils/
│   │   ├── taskUtils.ts     # Pure functions — best for unit testing
│   │   └── validators.ts    # Validation logic with boundary rules
│   ├── api/
│   │   └── taskApi.ts       # HTTP layer (fetch wrappers)
│   ├── mocks/
│   │   ├── handlers.ts      # MSW request handlers (fake API)
│   │   └── server.ts        # MSW Node server for Vitest
│   ├── hooks/
│   │   └── useTasks.ts      # React hook connecting API + state
│   ├── components/
│   │   ├── TaskItem.tsx
│   │   ├── TaskList.tsx
│   │   ├── AddTaskForm.tsx
│   │   └── FilterBar.tsx
│   ├── __tests__/
│   │   ├── setup.ts             # Global test setup (jest-dom, MSW lifecycle)
│   │   ├── unit/                # Unit tests — pure functions
│   │   ├── component/           # Component tests — React Testing Library
│   │   ├── integration/         # Integration tests — full app render
│   │   └── api/                 # API tests — HTTP layer with MSW
│   └── App.tsx
├── tests/
│   └── e2e/
│       ├── pom/
│       │   └── TaskPage.ts      # Page Object Model — centralises selectors
│       ├── smoke.spec.ts        # Smoke tests
│       ├── addTask.spec.ts      # Add task user flow
│       ├── regression.spec.ts   # Regression suite
│       └── negative.spec.ts     # Negative / edge case tests
├── docs/
│   ├── TEST_PLAN.md             # QA test plan document
│   └── BUG_REPORT_TEMPLATE.md  # Bug report format
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI pipeline
├── vitest.config.ts
└── playwright.config.ts
```

---

## Key QA Concepts Demonstrated

### The Testing Pyramid
```
        /\
       /E2E\        ← few, slow — Playwright tests
      /------\
     / Integr \     ← some — full App + MSW
    /----------\
   / Component  \   ← more — RTL tests
  /--------------\
 /   Unit Tests   \ ← many, fast — pure functions
```

### AAA Pattern (every test follows this)
```ts
it('filters tasks by status', () => {
  // Arrange — set up test data
  const tasks = [{ status: 'todo' }, { status: 'done' }]

  // Act — call the thing being tested
  const result = filterTasks(tasks, { status: 'todo' })

  // Assert — check the result
  expect(result).toHaveLength(1)
})
```

### Boundary Value Analysis
The validator tests cover: 2 chars (fail), 3 chars (pass), 100 chars (pass), 101 chars (fail) — testing the edges where bugs hide.

### Mocking vs Stubbing vs Spying
- **MSW** mocks the entire network layer
- **`vi.fn()`** creates spy functions to assert how many times and with what args a function was called
- **`vi.fn().mockReturnValue(x)`** stubs a specific return value

### Page Object Model
`tests/e2e/pom/TaskPage.ts` centralises all Playwright selectors. If a button label changes, you fix it in one place — not across every test file.

### Test Isolation
`afterEach` resets MSW mock data so tests never affect each other. A test that adds data in step 1 can't cause step 2 to fail.

---

## CI/CD Pipeline

`.github/workflows/ci.yml` runs 4 jobs in parallel on every push:

1. **Unit & Component Tests** → uploads coverage report
2. **Integration Tests**
3. **API Tests**
4. **E2E Tests** (runs after unit tests pass)

---

## Interview Q&A

**Q: What's the difference between unit and integration tests?**
> Unit tests test one function in complete isolation — no API, no DOM, no other code. Integration tests render the full app and test multiple pieces working together, including the API layer (mocked with MSW).

**Q: Why use MSW instead of mocking `fetch` directly?**
> MSW intercepts at the network level, so your actual `fetch()` calls run unchanged. You're testing real code paths, not mock wrappers. It also lets you test error states (404, 500) easily.

**Q: What is the Page Object Model?**
> A design pattern where each page of the app has a class that wraps all Playwright selectors and actions. If a button's label changes, you update it in the POM class — not across 10 test files.

**Q: What is negative testing?**
> Deliberately providing bad input to confirm the app handles it gracefully — empty fields, strings that are too long, impossible search terms. Most developers only test the happy path.

---

## Coverage Thresholds

Configured in `vitest.config.ts` — the build fails if coverage drops below:

| Metric | Threshold | Actual |
|---|---|---|
| Lines | 80% | **99%** |
| Functions | 80% | **99%** |
| Branches | 70% | **93%** |
| Statements | 80% | **99%** |
