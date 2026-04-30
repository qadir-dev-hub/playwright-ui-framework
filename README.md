# Playwright UI Framework

A Playwright UI automation framework built from scratch with TypeScript.

This project is being built as a learning-first but professional framework foundation. The goal is to keep the structure clean, understandable, and easy to grow into a real-world UI automation project.

## Tech Stack

- Playwright
- TypeScript
- Node.js
- dotenv

## Current Framework Features

- Playwright test runner with HTML reporting
- Environment-based configuration
- Page Object Model structure
- Custom fixture wiring
- Screenshot, video, and trace support for failed or retried tests
- First working sample around the DemoQA Practice Form
- Project-level WDIO MCP config for Android native-app automation via Appium

## Project Structure

```text
playwright-ui-framework/
  config/
    env.ts
  environments/
    .env.qa
  fixtures/
    test-fixtures.ts
  pages/
    practice-form.page.ts
  test-data/
  tests/
    practice-form.spec.ts
  utils/
  playwright.config.ts
  package.json
  README.md
```

## Folder Purpose

- `tests/` contains test scenarios
- `pages/` contains page objects
- `fixtures/` contains custom Playwright fixtures
- `config/` contains configuration helpers
- `environments/` contains environment variable files
- `test-data/` is reserved for reusable test input
- `utils/` is reserved for shared helper functions

## Setup

Install dependencies:

```bash
npm install
```

## Environment Configuration

This framework loads environment files from the `environments/` folder.

Current example:

```text
environments/.env.qa
```

Example values:

```env
ENV=qa
BASE_URL=https://demoqa.com
LOGIN_USER=testuser@example.com
LOGIN_PASSWORD=Password123
```

The Playwright config loads the environment dynamically using:

```ts
const testEnv = process.env.ENV ?? 'qa';
dotenv.config({ path: path.resolve(__dirname, 'environments', `.env.${testEnv}`) });
```

That means:

- `ENV=qa` loads `.env.qa`
- later `ENV=staging` can load `.env.staging`
- later `ENV=prod` can load `.env.prod`

## Running Tests

Run all tests:

```bash
npm run test
```

Run tests with a visible browser:

```bash
npm run test:headed
```

Run tests in debug mode:

```bash
npm run test:debug
```

Open the HTML report:

```bash
npm run report
```

Run a single test file:

```bash
npx playwright test tests/practice-form.spec.ts
```

## Current Reporter and Artifacts

The framework currently uses:

- HTML report
- `trace: 'on-first-retry'`
- `screenshot: 'only-on-failure'`
- `video: 'retain-on-failure'`

Generated artifacts are stored in:

- `playwright-report/`
- `test-results/`

These folders are ignored by Git.

## Framework Pattern

The framework currently uses:

1. Page Object Model for page-specific logic
2. Custom fixtures for injecting page objects into tests
3. Environment files for configuration

Example fixture usage:

```ts
import { test, expect } from '../fixtures/test-fixtures';

test('example', async ({ practiceFormPage }) => {
  await practiceFormPage.goto();
});
```

## Current Example

The first framework example automates the DemoQA Practice Form:

- page object: `pages/practice-form.page.ts`
- fixture: `fixtures/test-fixtures.ts`
- test: `tests/practice-form.spec.ts`

This demonstrates:

- page navigation
- field entry
- checkbox and radio interactions
- file upload
- dropdown selection
- modal validation

## Next Planned Enhancements

- more page objects
- more reusable fixtures
- better environment handling
- GitHub Actions CI
- richer test data strategy
- reusable framework conventions

## Notes

This project is intentionally being built step by step from scratch to support both framework quality and Playwright learning.

For native-app automation through WebdriverIO MCP, see [docs/wdio-mcp-native-apps.md](/c:/Studies/Agentic%20AI/playwright-ui-framework/docs/wdio-mcp-native-apps.md).
