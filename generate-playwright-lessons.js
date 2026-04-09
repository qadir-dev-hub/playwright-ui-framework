const fs = require('fs');
const path = require('path');

const outputDir = path.resolve(__dirname, 'docs', 'playwright-lessons');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function paragraph(text) {
  return `<p>${escapeHtml(text)}</p>`;
}

function bulletList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function numberedList(items) {
  return `<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`;
}

function codeBlock(code, lang = 'ts') {
  return `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`;
}

function renderLesson(lesson) {
  let html = `<section class="lesson" id="${lesson.id}">`;
  html += `<h2>${escapeHtml(lesson.number + '. ' + lesson.title)}</h2>`;
  html += paragraph(lesson.intro);

  if (lesson.why) {
    html += `<h3>Why It Matters</h3>`;
    html += paragraph(lesson.why);
  }

  if (lesson.learn?.length) {
    html += `<h3>What To Know</h3>`;
    html += bulletList(lesson.learn);
  }

  if (lesson.workflow?.length) {
    html += `<h3>Recommended Workflow</h3>`;
    html += numberedList(lesson.workflow);
  }

  if (lesson.exampleTitle || lesson.exampleCode) {
    html += `<h3>${escapeHtml(lesson.exampleTitle || 'Example')}</h3>`;
    if (lesson.exampleText) {
      html += paragraph(lesson.exampleText);
    }
    if (lesson.exampleCode) {
      html += codeBlock(lesson.exampleCode, lesson.exampleLang || 'ts');
    }
  }

  if (lesson.pitfalls?.length) {
    html += `<h3>Common Mistakes</h3>`;
    html += bulletList(lesson.pitfalls);
  }

  if (lesson.practice?.length) {
    html += `<h3>Practice Ideas</h3>`;
    html += bulletList(lesson.practice);
  }

  if (lesson.checklist?.length) {
    html += `<h3>Definition Of Done</h3>`;
    html += bulletList(lesson.checklist);
  }

  html += `</section>`;
  return html;
}

function renderVolume(volume) {
  const toc = volume.lessons
    .map((lesson) => `<li><a href="#${lesson.id}">${escapeHtml(lesson.number + '. ' + lesson.title)}</a></li>`)
    .join('');

  const lessonsHtml = volume.lessons.map(renderLesson).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(volume.title)}</title>
  <style>
    :root {
      --bg: #f4efe5;
      --paper: #fffdf8;
      --ink: #1f2937;
      --muted: #5e6773;
      --accent: #0f6a64;
      --accent-soft: #dff3ef;
      --border: #d7d1c6;
      --code-bg: #17202b;
      --code-ink: #f5f8fc;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 28px;
      font-family: Georgia, "Times New Roman", serif;
      color: var(--ink);
      background: linear-gradient(180deg, #ece3d2 0%, var(--bg) 100%);
      line-height: 1.55;
      font-size: 15px;
    }
    .page {
      max-width: 960px;
      margin: 0 auto;
      background: var(--paper);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 40px 48px 56px;
      box-shadow: 0 18px 50px rgba(49, 39, 28, 0.08);
    }
    h1, h2, h3 {
      font-family: "Trebuchet MS", Arial, sans-serif;
      line-height: 1.2;
      margin: 0 0 14px;
    }
    h1 { font-size: 32px; margin-bottom: 8px; }
    h2 {
      font-size: 24px;
      margin-top: 34px;
      padding-top: 14px;
      border-top: 2px solid var(--accent-soft);
    }
    h3 { font-size: 18px; margin-top: 20px; }
    p { margin: 0 0 12px; }
    ul, ol { margin: 10px 0 14px 24px; }
    li { margin: 4px 0; }
    a { color: var(--accent); text-decoration: none; }
    .lead { color: var(--muted); font-size: 17px; margin-bottom: 18px; }
    .note {
      background: var(--accent-soft);
      border-left: 4px solid var(--accent);
      padding: 14px 16px;
      border-radius: 10px;
      margin: 16px 0 22px;
    }
    .toc {
      border: 1px solid var(--border);
      background: #fff;
      border-radius: 12px;
      padding: 16px 18px;
      margin: 20px 0 28px;
    }
    .lesson { break-inside: avoid-page; }
    pre {
      background: var(--code-bg);
      color: var(--code-ink);
      border-radius: 12px;
      padding: 16px 18px;
      overflow-x: auto;
      margin: 14px 0 18px;
    }
    code { font-family: Consolas, "Courier New", monospace; font-size: 0.95em; }
    .footer { margin-top: 28px; color: var(--muted); font-size: 13px; }
    @media print {
      body { background: #fff; padding: 0; }
      .page {
        box-shadow: none;
        border: none;
        border-radius: 0;
        max-width: none;
        padding: 0;
      }
      pre, .toc, .note, .lesson { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <main class="page">
    <h1>${escapeHtml(volume.title)}</h1>
    <p class="lead">${escapeHtml(volume.subtitle)}</p>
    <div class="note">${escapeHtml(volume.note)}</div>
    <div class="toc">
      <h3>Table Of Contents</h3>
      <ol>${toc}</ol>
    </div>
    ${lessonsHtml}
    <p class="footer">Generated for the Playwright UI Framework learning series.</p>
  </main>
</body>
</html>`;
}

const volumes = [];

volumes.push({
  file: 'playwright-lessons-volume-1-core-skills.html',
  title: 'Playwright Mastery Series Volume 1',
  subtitle: 'Core power skills: API plus UI, mocking, auth, frames, advanced locators, test data, and scalable fixtures.',
  note: 'This volume moves from basic UI automation into the patterns that make a framework faster, cleaner, and easier to scale.',
  lessons: [
    {
      id: 'lesson-01',
      number: 1,
      title: 'API + UI Testing Together',
      intro: 'Playwright is not only a browser tool. It can make HTTP requests, seed data, clean up data, and then verify the UI against the backend state. That combination is one of its strongest real-world advantages.',
      why: 'If every test prepares data through the UI, the suite gets slow and fragile. Using the API for setup and the UI for validation gives you faster, more focused tests.',
      learn: [
        'Use the request fixture for setup and cleanup.',
        'Keep the UI test focused on the behavior you actually care about.',
        'Seed data through POST calls and verify it through the page.',
        'Use API cleanup to remove leftovers and reduce flaky shared-state failures.',
      ],
      workflow: [
        'Create the data through an API call.',
        'Open the page that should display that data.',
        'Assert the UI shows the expected result.',
        'Clean up the record through API if the environment requires it.',
      ],
      exampleTitle: 'Example: create a todo through API, verify through UI',
      exampleCode: `import { test, expect } from '@playwright/test';

test('new todo is visible in the UI', async ({ request, page }) => {
  const response = await request.post('https://example.com/api/todos', {
    data: { title: 'Learn Playwright hybrid tests' },
  });

  expect(response.ok()).toBeTruthy();

  await page.goto('https://example.com/todos');
  await expect(page.getByText('Learn Playwright hybrid tests')).toBeVisible();
});`,
      pitfalls: [
        'Using the UI to set up ten steps before the assertion you care about.',
        'Skipping response validation and assuming API setup succeeded.',
        'Leaving data behind so later tests collide with it.',
      ],
      practice: [
        'Pick one existing UI test and replace the setup part with API seeding.',
        'Add cleanup through API for the same scenario.',
      ],
      checklist: [
        'You can explain when API setup is better than UI setup.',
        'You can write one API seed plus one UI verification test.',
      ],
    },
    {
      id: 'lesson-02',
      number: 2,
      title: 'Network Interception And Mocking',
      intro: 'Sometimes you want the browser to behave as if the backend returned a different response, failed, or responded slowly. Playwright lets you intercept requests with page.route and shape those responses intentionally.',
      why: 'Mocking is useful for edge cases, unstable third-party services, and flows that are hard to produce in a real environment. It also helps you validate how the UI responds to backend problems.',
      learn: [
        'Use page.route to intercept requests.',
        'Use route.fulfill to return mock JSON.',
        'Use route.abort to simulate failures.',
        'Use route.continue when you only want to inspect or slightly modify a request.',
      ],
      exampleTitle: 'Example: mock a user profile response',
      exampleCode: `test('profile page shows mocked user', async ({ page }) => {
  await page.route('**/api/profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        name: 'Aqsa Qadri',
        role: 'QA Engineer',
      }),
    });
  });

  await page.goto('/profile');
  await expect(page.getByText('Aqsa Qadri')).toBeVisible();
  await expect(page.getByText('QA Engineer')).toBeVisible();
});`,
      pitfalls: [
        'Mocking everything and losing confidence in real integration behavior.',
        'Using very broad route patterns that accidentally intercept unrelated calls.',
        'Forgetting to keep the mock shape aligned with the real API contract.',
      ],
      practice: [
        'Simulate a 500 error and verify the UI error message.',
        'Mock an empty-state response and verify the empty-state component.',
      ],
      checklist: [
        'You can intercept a request and return a custom response.',
        'You know when a mock is appropriate and when it hides too much reality.',
      ],
    },
    {
      id: 'lesson-03',
      number: 3,
      title: 'Authentication Patterns',
      intro: 'Authentication strategy affects speed, maintainability, and reliability more than almost any other framework decision. Playwright gives you multiple ways to handle auth, and each one fits a different kind of test.',
      why: 'If every test logs in through the UI, the suite becomes slow and noisy. If auth is handled well, most tests can start from the correct state immediately.',
      learn: [
        'UI login is best when you are testing the login flow itself.',
        'API login is often best for test setup.',
        'Storage state is best for reusable authenticated sessions.',
        'Role-based users often need different setup files or fixtures.',
      ],
      exampleTitle: 'Example: authentication setup test',
      exampleCode: `import path from 'path';
import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

const authFile = path.resolve(__dirname, '../playwright/.auth/student.json');

setup('log in and save storage state', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAsStudent();
  await loginPage.expectLoginSuccess();
  await page.context().storageState({ path: authFile });
});`,
      pitfalls: [
        'Using one shared account for every parallel test without understanding data collisions.',
        'Saving stale storage state and forgetting tokens expire.',
        'Testing login everywhere instead of separating setup from verification.',
      ],
      practice: [
        'Create one setup test that saves storage state.',
        'Create one second test that reuses that saved state.',
      ],
      checklist: [
        'You can explain UI login, API login, and storageState tradeoffs.',
        'You can save and reuse an authenticated session.',
      ],
    },
    {
      id: 'lesson-04',
      number: 4,
      title: 'Frames, Popups, And Multi-Page Workflows',
      intro: 'Real applications often include iframes, third-party widgets, and flows that open new tabs or windows. Playwright handles these well, but you need the right object for the right surface.',
      why: 'Many tests fail simply because the element is inside a frame or the app opened a new page and the test kept looking in the original one.',
      learn: [
        'Use frameLocator for iframe content.',
        'Use context.waitForEvent("page") or page.waitForEvent("popup") for new tabs.',
        'Keep track of which page object represents which tab.',
        'Avoid guessing; explicitly wait for the new page or frame interaction point.',
      ],
      exampleTitle: 'Example: wait for a popup and assert on the new page',
      exampleCode: `test('help link opens a popup', async ({ page }) => {
  await page.goto('/dashboard');

  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Help' }).click();
  const popup = await popupPromise;

  await popup.waitForLoadState();
  await expect(popup).toHaveURL(/help/);
  await expect(popup.getByRole('heading', { name: /Help Center/i })).toBeVisible();
});`,
      pitfalls: [
        'Using normal page locators for iframe content.',
        'Clicking and then trying to guess the popup timing.',
        'Not naming variables clearly when two or more pages are active.',
      ],
      practice: [
        'Automate one iframe interaction with frameLocator.',
        'Automate one new-tab flow and assert on the popup page.',
      ],
      checklist: [
        'You know when to use page, context, popup, and frameLocator.',
      ],
    },
    {
      id: 'lesson-05',
      number: 5,
      title: 'Advanced Locator Strategy',
      intro: 'Basic locators are not enough for large or messy applications. Advanced locator work is about keeping selectors readable, resilient, and precise even when the DOM is noisy.',
      why: 'Strong locator strategy is one of the biggest differences between stable tests and flaky tests.',
      learn: [
        'Prefer user-facing locators first: role, label, placeholder, text, test ID.',
        'Use filter, has, and hasText to narrow locators semantically.',
        'Use first, last, and nth only when the order is truly part of the UI meaning.',
        'Read strict mode errors as a design signal, not an annoyance.',
      ],
      exampleTitle: 'Example: narrow a card locator by contained text',
      exampleCode: `const planCard = page.locator('[data-testid="plan-card"]').filter({
  has: page.getByRole('heading', { name: 'Enterprise' }),
});

await planCard.getByRole('button', { name: 'Choose plan' }).click();`,
      pitfalls: [
        'Falling back to CSS too early just because it looks shorter.',
        'Using nth as a shortcut when the UI has meaningful labels available.',
        'Ignoring strict mode instead of improving selector precision.',
      ],
      practice: [
        'Take three existing selectors and rewrite them to be more semantic.',
        'Create one locator that uses filter({ hasText }) and one that uses filter({ has }).',
      ],
      checklist: [
        'You can describe a locator in terms of user meaning, not just DOM shape.',
      ],
    },
    {
      id: 'lesson-06',
      number: 6,
      title: 'Test Data Strategy',
      intro: 'A strong test framework treats data as a first-class design concern. Test data should be deliberate, reusable, and safe for parallel runs.',
      why: 'Many flaky tests are really data problems: reused accounts, mutated records, shared names, or hidden dependencies on records that were created manually.',
      learn: [
        'Separate static data from generated data.',
        'Use unique data when tests create records in parallel.',
        'Keep environment-specific data out of test files.',
        'Prefer factories or builders over random inline strings everywhere.',
      ],
      exampleTitle: 'Example: use a small factory for unique names',
      exampleCode: `export function buildUser(overrides = {}) {
  const unique = Date.now();
  return {
    firstName: 'Aqsa',
    lastName: 'Qadri',
    email: \`aqsa.\${unique}@example.com\`,
    ...overrides,
  };
}`,
      pitfalls: [
        'Hardcoding the same email or username across many write tests.',
        'Mixing environment config with scenario data.',
        'Making tests depend on manually created records.',
      ],
      practice: [
        'Create a simple builder for one entity in your project.',
        'Mark which of your current tests use static data versus dynamic data.',
      ],
      checklist: [
        'You can explain when test data should be static, dynamic, or seeded.',
      ],
    },
    {
      id: 'lesson-07',
      number: 7,
      title: 'Scalable Fixture Design',
      intro: 'Fixtures should reduce setup noise, not create mystery. As a framework grows, fixture design becomes one of the main determinants of readability.',
      why: 'A good fixture layer makes tests short and expressive. A bad fixture layer hides too much, becomes tangled, and is hard to debug.',
      learn: [
        'Create fixtures for shared resources and repeated setup, not for every helper function.',
        'Split fixture files by responsibility when the project grows.',
        'Keep one central export for tests, even if internal fixture files are split.',
        'Default to test-scoped fixtures unless you have a strong reason to widen scope.',
      ],
      exampleTitle: 'Example: split fixtures internally but expose one entry point',
      exampleCode: `import { test as base, expect } from '@playwright/test';
import { pageFixtures, type PageFixtures } from './page-fixtures';
import { authFixtures, type AuthFixtures } from './auth-fixtures';

type FrameworkFixtures = PageFixtures & AuthFixtures;

export const test = base.extend<FrameworkFixtures>({
  ...pageFixtures,
  ...authFixtures,
});

export { expect };`,
      pitfalls: [
        'Hiding too much business logic inside fixtures.',
        'Creating giant fixture files with dozens of unrelated concerns.',
        'Using worker-scoped fixtures before you fully understand the tradeoffs.',
      ],
      practice: [
        'Review one fixture and ask whether it really belongs there or should live in a page object or utility.',
      ],
      checklist: [
        'You can explain why a fixture exists and what problem it removes from the test body.',
      ],
    },
  ],
});

volumes.push({
  file: 'playwright-lessons-volume-2-scaling-and-ci.html',
  title: 'Playwright Mastery Series Volume 2',
  subtitle: 'Scaling and CI: sharding, debugging, enterprise architecture, roles, environments, conventions, and flaky tests.',
  note: 'This volume is about moving from a project that works locally to a framework that keeps working under team pressure and CI load.',
  lessons: [
    {
      id: 'lesson-08',
      number: 8,
      title: 'Large-Suite Execution And Sharding',
      intro: 'When a suite gets large, one machine is not enough. Sharding splits the test run across multiple jobs or machines so the total wall-clock time stays reasonable.',
      why: 'Without sharding, large UI suites become too slow to be useful. Teams stop trusting them or stop running them frequently.',
      learn: [
        'Playwright supports --shard=x/y to split the run into deterministic slices.',
        'GitHub Actions matrix jobs pair naturally with Playwright sharding.',
        'Report merging becomes important as soon as you shard.',
      ],
      exampleTitle: 'Example: run shard 3 of 10',
      exampleCode: `npx playwright test --shard=3/10`,
      exampleLang: 'text',
      pitfalls: [
        'Running thousands of UI tests in one CI job and calling that scalable.',
        'Ignoring artifact and report merging until debugging becomes painful.',
        'Using shared test data that breaks when shards run in parallel.',
      ],
      practice: [
        'Take a suite of several files and simulate sharding locally with two shards.',
      ],
      checklist: [
        'You can explain what sharding solves and what it does not solve.',
      ],
    },
    {
      id: 'lesson-09',
      number: 9,
      title: 'CI Debugging And Artifact Analysis',
      intro: 'A good automation engineer can explain why a test failed in CI, not just rerun it locally and hope. Playwright gives you rich artifacts; the skill is learning how to read them efficiently.',
      why: 'Most expensive automation time is spent in failure analysis, not in writing straightforward happy-path scripts.',
      learn: [
        'Start with the terminal error and failing line.',
        'Open the HTML report next.',
        'Use traces when the failure path is unclear.',
        'Compare local and CI environment differences: viewport, headless mode, timing, data, and permissions.',
      ],
      exampleTitle: 'Debug workflow for a CI-only failure',
      exampleCode: `1. Read the failing locator or assertion in the job log
2. Download the playwright-report artifact
3. Open the trace.zip from test-results
4. Compare CI URL, env, and storage state with local run
5. Reproduce locally with --headed or --debug if needed`,
      exampleLang: 'text',
      pitfalls: [
        'Jumping straight to waitForTimeout without understanding the failure.',
        'Ignoring the screenshot, trace, or video attachments that already tell the story.',
      ],
      practice: [
        'Take one failing test and write a short root-cause summary using only report artifacts.',
      ],
      checklist: [
        'You have a repeatable investigation order for CI failures.',
      ],
    },
    {
      id: 'lesson-10',
      number: 10,
      title: 'Enterprise Framework Architecture',
      intro: 'Enterprise-scale architecture is less about fancy abstractions and more about operational clarity: who owns what, how tests are organized, how suites run, and how the framework evolves safely.',
      why: 'A framework can have excellent code and still fail the team if its structure does not support growth, ownership, and debugging.',
      learn: [
        'Organize by business domain or product area, not by random technical layers alone.',
        'Keep a clean public surface for tests and helpers.',
        'Separate framework internals from domain-specific test code.',
        'Bias toward conventions that reduce decision fatigue for contributors.',
      ],
      exampleTitle: 'Example: a scalable high-level structure',
      exampleCode: `tests/
  checkout/
  orders/
  users/
pages/
fixtures/
data-builders/
config/
utils/
docs/
.github/workflows/`,
      pitfalls: [
        'Creating deep inheritance trees because older Selenium frameworks did that.',
        'Letting utilities become a dump folder.',
        'Mixing business data, framework config, and environment secrets in one place.',
      ],
      practice: [
        'Sketch what your current repo structure would look like if the suite had 500 tests instead of 5.',
      ],
      checklist: [
        'You can explain where a new page object, fixture, test data file, and CI helper should live.',
      ],
    },
    {
      id: 'lesson-11',
      number: 11,
      title: 'Role-Based Testing',
      intro: 'Many apps behave differently for admins, managers, analysts, and standard users. A real framework needs a clean way to model these roles without duplicating everything.',
      why: 'Role-based access is often a business-critical behavior. If the framework cannot express roles well, tests become repetitive and confusing.',
      learn: [
        'Use distinct users and often distinct storageState files per role.',
        'Name fixtures clearly: adminPage, managerSession, standardUserState.',
        'Keep role choice visible in the test scenario when it matters.',
      ],
      exampleTitle: 'Example: role-specific storage state files',
      exampleCode: `test.describe('admin features', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' });

  test('admin can delete a user', async ({ page }) => {
    await page.goto('/admin/users');
    await page.getByRole('button', { name: 'Delete user' }).click();
  });
});`,
      pitfalls: [
        'Using one privileged account for every test because it is convenient.',
        'Hiding the role choice so deeply that tests no longer explain who is acting.',
      ],
      practice: [
        'Design fixtures for two roles in one feature area and compare how readable the tests become.',
      ],
      checklist: [
        'You can express the acting user role clearly in a test.',
      ],
    },
    {
      id: 'lesson-12',
      number: 12,
      title: 'Environment Management At Scale',
      intro: 'One environment file is fine at the beginning. At scale, environment handling becomes a discipline around naming, safety, secrets, and visibility.',
      why: 'Teams lose time when nobody is sure which env a suite is targeting, what config was loaded, or whether the runner even had the correct secrets.',
      learn: [
        'Choose env files predictably, such as .env.qa, .env.staging, and .env.prod.',
        'Print the selected environment and base URL at run start.',
        'Fail early if the env file is missing or required values are empty.',
        'Keep secrets out of source control for real environments.',
      ],
      exampleTitle: 'Example: visible env loading',
      exampleCode: `const testEnv = process.env.ENV ?? 'qa';
const envFile = path.resolve(__dirname, 'environments', \`.env.\${testEnv}\`);

if (!fs.existsSync(envFile)) {
  throw new Error(\`Environment file not found: \${envFile}\`);
}

dotenv.config({ path: envFile });
console.log(\`Using env file: \${envFile}\`);
console.log(\`Base URL: \${process.env.BASE_URL}\`);`,
      pitfalls: [
        'Silently defaulting to the wrong environment.',
        'Committing real secrets in example env files.',
        'Reading environment values before dotenv loads them.',
      ],
      practice: [
        'Make one config value mandatory and fail fast when it is missing.',
      ],
      checklist: [
        'You can always tell which env the suite is using before tests start.',
      ],
    },
    {
      id: 'lesson-13',
      number: 13,
      title: 'Project Structure And Conventions',
      intro: 'Conventions are underrated. A framework scales when contributors make similar decisions by default, not when every file invents its own style.',
      why: 'Clear conventions reduce review overhead, onboarding time, and maintenance cost.',
      learn: [
        'Pick naming patterns and stick to them: login.page.ts, login.spec.ts, test-fixtures.ts.',
        'Keep test names behavior-focused and readable.',
        'Use code comments sparingly and only where they help with intent.',
        'Prefer one obvious import path for common framework surfaces.',
      ],
      exampleTitle: 'Example naming patterns',
      exampleCode: `pages/
  login.page.ts
  checkout.page.ts

tests/
  login.spec.ts
  checkout.spec.ts

fixtures/
  test-fixtures.ts`,
      pitfalls: [
        'Mixing singular and plural naming randomly.',
        'Letting page objects become utility classes and vice versa.',
      ],
      practice: [
        'Write down three conventions for your repo and enforce them in new files.',
      ],
      checklist: [
        'A new contributor can guess where a file should live before asking.',
      ],
    },
    {
      id: 'lesson-14',
      number: 14,
      title: 'Flaky Test Diagnosis',
      intro: 'Flaky tests are tests that sometimes pass and sometimes fail without a real product change. The goal is not just to rerun them until green; the goal is to find the instability source.',
      why: 'Flakiness erodes trust faster than almost anything else in test automation.',
      learn: [
        'Separate product race conditions from automation timing issues.',
        'Check whether the test relies on unstable data, order, or environment assumptions.',
        'Replace generic waits with state-based assertions.',
        'Use traces to find the first divergence point.',
      ],
      exampleTitle: 'Replace a sleep with a state assertion',
      exampleCode: `// fragile
await page.waitForTimeout(5000);

// better
await expect(page.getByText('Order submitted')).toBeVisible();`,
      pitfalls: [
        'Masking flakiness by increasing timeouts everywhere.',
        'Ignoring data collisions caused by parallel runs.',
        'Calling a test flaky when the app itself is racing.',
      ],
      practice: [
        'Take one test that uses waitForTimeout and replace it with a state-based wait.',
      ],
      checklist: [
        'You can describe a flaky failure in terms of root cause, not just symptom.',
      ],
    },
  ],
});

volumes.push({
  file: 'playwright-lessons-volume-3-browser-and-execution.html',
  title: 'Playwright Mastery Series Volume 3',
  subtitle: 'Browser and execution strategy: cross-browser design, parallelism, report merging, storage state, visual, accessibility, and component testing.',
  note: 'This volume focuses on how Playwright behaves across browsers, projects, artifacts, and testing modes beyond classic end-to-end flows.',
  lessons: [
    {
      id: 'lesson-15',
      number: 15,
      title: 'Cross-Browser Strategy',
      intro: 'Playwright can run Chromium, Firefox, and WebKit. The real question is not whether you can run all three, but how you decide when and where that coverage is worth the cost.',
      why: 'Cross-browser coverage adds confidence, but it also increases runtime and failure surface area. Mature teams choose coverage intentionally.',
      learn: [
        'Use Playwright projects to define browsers cleanly.',
        'Run broad browser coverage for critical flows, not necessarily every experiment.',
        'Treat browser-specific failures as product feedback until proven otherwise.',
      ],
      exampleTitle: 'Example: multi-browser projects',
      exampleCode: `projects: [
  { name: 'chromium', use: { browserName: 'chromium' } },
  { name: 'firefox', use: { browserName: 'firefox' } },
  { name: 'webkit', use: { browserName: 'webkit' } },
]`,
      pitfalls: [
        'Running every browser on every commit when feedback time matters more.',
        'Ignoring browser coverage entirely until production bugs appear.',
      ],
      practice: [
        'Choose one flow that truly deserves cross-browser coverage and explain why.',
      ],
      checklist: [
        'You can justify your browser coverage strategy instead of running all browsers by habit.',
      ],
    },
    {
      id: 'lesson-16',
      number: 16,
      title: 'Parallel Execution Strategy',
      intro: 'Parallel execution is one of the fastest ways to reduce runtime, but it forces you to confront hidden shared-state problems.',
      why: 'A suite that only passes with one worker usually has deeper design issues waiting to surface later.',
      learn: [
        'Workers run tests in parallel processes.',
        'fullyParallel changes how aggressively tests may run.',
        'Isolation and data design determine whether parallelism is safe.',
      ],
      exampleTitle: 'Example commands',
      exampleCode: `npx playwright test --workers=4
npx playwright test --workers=1`,
      exampleLang: 'text',
      pitfalls: [
        'Using shared accounts or shared records in write tests.',
        'Assuming execution order.',
        'Turning workers down to one instead of fixing isolation problems.',
      ],
      practice: [
        'Run the same suite with one worker and then four workers and compare what breaks.',
      ],
      checklist: [
        'Your tests do not depend on order or shared mutable state.',
      ],
    },
    {
      id: 'lesson-17',
      number: 17,
      title: 'Report Merging',
      intro: 'Once you shard or split runs across jobs, one report is no longer automatic. Merging reports is how you preserve a usable debugging experience at scale.',
      why: 'Without merged reporting, each shard tells only part of the story and triage becomes slow.',
      learn: [
        'Generate per-shard blob or raw reports.',
        'Merge artifacts after all shards finish.',
        'Publish one final HTML report for human review.',
      ],
      exampleTitle: 'Typical pattern',
      exampleCode: `1. Run shard jobs and save per-shard report artifacts
2. Download all shard artifacts in a final job
3. Merge them into one final report
4. Upload the merged report for the team`,
      exampleLang: 'text',
      pitfalls: [
        'Keeping only per-shard reports and expecting triage to stay easy.',
        'Merging inconsistently so the final report misses results.',
      ],
      practice: [
        'Sketch what a two-shard workflow would need in order to produce one final report.',
      ],
      checklist: [
        'You understand why report merging matters before the suite becomes large.',
      ],
    },
    {
      id: 'lesson-18',
      number: 18,
      title: 'Storage State And Session Reuse',
      intro: 'Storage state deserves its own lesson because it is a central Playwright concept, not just an auth trick. It is how you capture session state and reapply it deliberately.',
      why: 'Session reuse can make suites dramatically faster, but only if used with discipline.',
      learn: [
        'Save state after successful login.',
        'Use test.use({ storageState }) to load it for a file or describe block.',
        'Refresh or recreate saved state when it expires.',
      ],
      exampleTitle: 'Example: reuse saved state in a test',
      exampleCode: `const authFile = path.resolve(__dirname, '../playwright/.auth/student.json');

test.use({ storageState: authFile });

test('user starts authenticated', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/logged-in-successfully/');
  await expect(page.getByRole('link', { name: /log out/i })).toBeVisible();
});`,
      pitfalls: [
        'Assuming saved state never expires.',
        'Loading a storageState file for the wrong environment or role.',
      ],
      practice: [
        'Create one setup file and one reuse test in your own project.',
      ],
      checklist: [
        'You can create and consume a storageState file confidently.',
      ],
    },
    {
      id: 'lesson-19',
      number: 19,
      title: 'Visual Testing',
      intro: 'Visual testing checks whether the UI looks the way it should, not only whether the DOM or text exists. Playwright supports screenshot comparison to catch layout or styling regressions.',
      why: 'Some bugs are obvious to users but invisible to text-only assertions: spacing, clipping, alignment, missing icons, broken themes.',
      learn: [
        'Use screenshot comparisons intentionally, not everywhere.',
        'Stabilize data and animations before taking visual snapshots.',
        'Scope screenshots to components or regions when full-page diffs are too noisy.',
      ],
      exampleTitle: 'Example: compare a component screenshot',
      exampleCode: `await expect(page.getByTestId('profile-card')).toHaveScreenshot('profile-card.png');`,
      pitfalls: [
        'Running visual checks on unstable, data-heavy pages without control over content.',
        'Ignoring animation, dynamic timestamps, or ads.',
      ],
      practice: [
        'Choose one stable component and add a screenshot assertion.',
      ],
      checklist: [
        'You know when a screenshot assertion adds value and when it adds noise.',
      ],
    },
    {
      id: 'lesson-20',
      number: 20,
      title: 'Accessibility Testing',
      intro: 'Accessibility testing is about whether users with assistive technologies can navigate and understand the app. Playwright can support this through role-based locators, keyboard testing, and integrations like axe.',
      why: 'Accessible apps are better apps, and Playwright already nudges you toward accessible design through role-first locator strategy.',
      learn: [
        'Prefer role and label locators because they reflect accessible semantics.',
        'Test keyboard navigation and focus movement.',
        'Add automated accessibility scanning carefully and review findings meaningfully.',
      ],
      exampleTitle: 'Example: a keyboard-first assertion',
      exampleCode: `await page.keyboard.press('Tab');
await expect(page.getByRole('button', { name: 'Submit' })).toBeFocused();`,
      pitfalls: [
        'Treating accessibility as a one-time scan instead of an ongoing quality concern.',
        'Using only test IDs and never checking keyboard or role behavior.',
      ],
      practice: [
        'Take one form and verify it can be used without a mouse.',
      ],
      checklist: [
        'You can explain how locator strategy and accessibility reinforce each other.',
      ],
    },
    {
      id: 'lesson-21',
      number: 21,
      title: 'Component Testing',
      intro: 'Component testing sits between unit tests and full end-to-end tests. It lets you exercise a UI component in isolation with real browser rendering.',
      why: 'Some UI behavior is too visual or interactive for unit tests but too small to justify full end-to-end setup.',
      learn: [
        'Component tests are useful for focused UI logic and rendering states.',
        'They complement, not replace, end-to-end tests.',
        'The main question is whether your team benefits from the extra layer.',
      ],
      exampleTitle: 'Mental model',
      exampleCode: `Unit test -> tiny logic
Component test -> one rendered component with browser behavior
E2E test -> full app workflow`,
      exampleLang: 'text',
      pitfalls: [
        'Trying to replace all E2E tests with component tests.',
        'Adding component testing before the team actually needs it.',
      ],
      practice: [
        'Pick one interactive component and ask whether a component test would be a better fit than a full E2E test.',
      ],
      checklist: [
        'You can describe where component testing fits in your overall pyramid.',
      ],
    },
  ],
});

volumes.push({
  file: 'playwright-lessons-volume-4-real-world-browser-workflows.html',
  title: 'Playwright Mastery Series Volume 4',
  subtitle: 'Real-world browser workflows: mobile, files, permissions, performance-aware testing, utilities, page object quality, and hybrid architecture.',
  note: 'This volume covers browser behaviors and framework design choices that show up quickly in real product work.',
  lessons: [
    {
      id: 'lesson-22',
      number: 22,
      title: 'Mobile And Responsive Testing',
      intro: 'Responsive behavior is not only about screen size. It affects navigation patterns, touch interactions, visible elements, and sometimes whole user journeys.',
      why: 'A desktop-only suite can miss broken menus, hidden controls, or touch-specific issues.',
      learn: [
        'Use Playwright device descriptors for common mobile profiles.',
        'Assert on the mobile-specific UI, not just the same desktop assumptions in a smaller viewport.',
        'Keep mobile coverage focused on flows that matter most.',
      ],
      exampleTitle: 'Example: run with a mobile project',
      exampleCode: `projects: [
  {
    name: 'Mobile Chrome',
    use: { ...devices['Pixel 5'] },
  },
]`,
      pitfalls: [
        'Calling viewport resizing mobile coverage without checking mobile UI behavior.',
        'Ignoring hamburger navigation, touch targets, or different copy paths.',
      ],
      practice: [
        'Take one desktop test and adapt it for the mobile menu flow.',
      ],
      checklist: [
        'You know which flows need responsive coverage in your product.',
      ],
    },
    {
      id: 'lesson-23',
      number: 23,
      title: 'Download And Upload Workflows',
      intro: 'Files are common in real applications: upload evidence, import CSVs, download reports, export invoices. Playwright has built-in support for both directions.',
      why: 'File workflows often feel tricky in browser automation, but Playwright makes them much more approachable than older tools.',
      learn: [
        'Use setInputFiles for upload fields.',
        'Use page.waitForEvent("download") for downloads.',
        'Assert on file names, file presence, or downstream UI effects.',
      ],
      exampleTitle: 'Example: handle a download',
      exampleCode: `const downloadPromise = page.waitForEvent('download');
await page.getByRole('button', { name: 'Export CSV' }).click();
const download = await downloadPromise;

expect(await download.suggestedFilename()).toContain('.csv');`,
      pitfalls: [
        'Trying to automate OS file pickers directly when a file input exists.',
        'Not waiting for the download event before clicking.',
      ],
      practice: [
        'Create one upload test and one download assertion in a safe demo app.',
      ],
      checklist: [
        'You can automate both an upload and a download flow confidently.',
      ],
    },
    {
      id: 'lesson-24',
      number: 24,
      title: 'Browser Permissions And Geolocation',
      intro: 'Modern apps ask for location, notifications, camera, microphone, clipboard, and other permissions. Browser automation needs to model those states explicitly.',
      why: 'If you do not control permissions, tests can fail due to prompts, blocked features, or inconsistent local settings.',
      learn: [
        'Use context options to grant permissions.',
        'Set geolocation when location-aware behavior matters.',
        'Treat permissions as part of the scenario setup, not an afterthought.',
      ],
      exampleTitle: 'Example: create a context with location',
      exampleCode: `const context = await browser.newContext({
  geolocation: { latitude: 43.6532, longitude: -79.3832 },
  permissions: ['geolocation'],
});

const page = await context.newPage();
await page.goto('/store-locator');`,
      pitfalls: [
        'Expecting the browser to remember local permission choices in CI.',
        'Testing location-based features without controlling the coordinates.',
      ],
      practice: [
        'Simulate two locations and verify the UI changes appropriately.',
      ],
      checklist: [
        'You can grant a permission and explain why the test needs it.',
      ],
    },
    {
      id: 'lesson-25',
      number: 25,
      title: 'Performance-Aware Testing',
      intro: 'Playwright is not a full performance testing tool, but it can still help you watch for obviously slow or broken user-critical flows.',
      why: 'Users experience performance through UI behavior. Some automation checks can protect against severe regressions even if they are not full load tests.',
      learn: [
        'Track obvious flow timings for critical user journeys.',
        'Use performance checks as guardrails, not exact benchmark truth.',
        'Focus on what the user notices: time to render, time to complete key actions, long blocking spinners.',
      ],
      exampleTitle: 'Example: simple timing guardrail',
      exampleCode: `const start = Date.now();
await page.goto('/dashboard');
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
const elapsed = Date.now() - start;

expect(elapsed).toBeLessThan(5000);`,
      pitfalls: [
        'Treating Playwright timing as a substitute for dedicated performance tooling.',
        'Using strict timing thresholds in unstable environments.',
      ],
      practice: [
        'Add one soft timing guardrail to a critical page load.',
      ],
      checklist: [
        'You know the difference between performance-aware UI checks and real performance testing.',
      ],
    },
    {
      id: 'lesson-26',
      number: 26,
      title: 'Reusable Test Utilities',
      intro: 'Utilities should make common tasks clearer, not hide the framework under layers of wrappers. Good utilities solve repeated problems that are not page-specific.',
      why: 'A messy utils folder becomes a maintenance trap. A focused one saves time and keeps tests readable.',
      learn: [
        'Utilities are good for generators, parsing, formatting, and cross-cutting helpers.',
        'Page-specific behavior should stay in page objects.',
        'Generic wrappers around click, fill, and wait are usually unnecessary in Playwright.',
      ],
      exampleTitle: 'Example: a small data utility',
      exampleCode: `export function uniqueEmail(prefix = 'user') {
  return \`\${prefix}.\${Date.now()}@example.com\`;
}`,
      pitfalls: [
        'Creating clickElement or typeText wrappers for everything.',
        'Letting utilities become the place where any code lands when nobody knows where it belongs.',
      ],
      practice: [
        'Review your utilities and move anything page-specific into a page object.',
      ],
      checklist: [
        'Every utility in your repo solves a real repeated problem.',
      ],
    },
    {
      id: 'lesson-27',
      number: 27,
      title: 'Page Object Design Quality',
      intro: 'Page objects should express user intent and centralize page behavior. They should not become giant god classes or thin wrappers around every Playwright method.',
      why: 'Page objects can improve readability dramatically, but poor page object design creates indirection without value.',
      learn: [
        'Expose meaningful page actions and assertions.',
        'Keep selectors and page-specific logic close together.',
        'Avoid giant base pages with generic wrappers unless you have a proven need.',
      ],
      exampleTitle: 'Good page object shape',
      exampleCode: `class CheckoutPage {
  async applyCoupon(code: string) { ... }
  async placeOrder() { ... }
  async expectOrderSummary(total: string) { ... }
}`,
      pitfalls: [
        'Adding methods like clickBlueButtonTopRight because they mirror the DOM instead of the business action.',
        'Creating enormous page objects that cover several screens or dialogs at once.',
      ],
      practice: [
        'Review one page object and ask whether each method expresses business intent or raw mechanics.',
      ],
      checklist: [
        'Your page object methods read like actions a user or business workflow would understand.',
      ],
    },
    {
      id: 'lesson-28',
      number: 28,
      title: 'Hybrid API/UI Architecture',
      intro: 'A hybrid framework treats API and UI as complementary tools. It does not force everything through one layer.',
      why: 'This is often the sweet spot for real-world quality: API for setup and cleanup, UI for user-visible verification.',
      learn: [
        'Decide which layer gives the fastest, clearest signal for each scenario.',
        'Let API fixtures or helpers prepare state when UI setup is wasteful.',
        'Keep the test story understandable even when it uses both layers.',
      ],
      exampleTitle: 'Hybrid test story',
      exampleCode: `1. Create account via API
2. Log in through storageState
3. Open billing page in UI
4. Assert invoice badge is visible
5. Delete test invoice via API`,
      exampleLang: 'text',
      pitfalls: [
        'Hiding so much setup in API code that the test story becomes hard to follow.',
        'Forcing everything through UI because it feels more realistic, even when it wastes runtime.',
      ],
      practice: [
        'Rewrite one existing test into a cleaner hybrid version.',
      ],
      checklist: [
        'You can justify which steps belong in API and which belong in UI.',
      ],
    },
  ],
});

volumes.push({
  file: 'playwright-lessons-volume-5-operations-and-maturity.html',
  title: 'Playwright Mastery Series Volume 5',
  subtitle: 'Operations and maturity: runners, governance, Docker, secrets, metrics, MCP strategy, and how to present your framework work publicly.',
  note: 'This final volume is about operating a test framework as a real engineering asset, not just a local codebase.',
  lessons: [
    {
      id: 'lesson-29',
      number: 29,
      title: 'Self-Hosted Versus GitHub-Hosted Runners',
      intro: 'GitHub-hosted runners are convenient and fast to start with. Self-hosted runners give more control, and they become more attractive as suite size, environment complexity, or cost pressure grows.',
      why: 'Runner strategy affects runtime, cost, stability, security, and access to private internal systems.',
      learn: [
        'GitHub-hosted runners are excellent for getting started.',
        'Self-hosted runners are common for large or internal enterprise suites.',
        'The decision is operational, not just technical.',
      ],
      exampleTitle: 'Decision lens',
      exampleCode: `GitHub-hosted:
- low setup
- easy maintenance
- good for public and early-stage repos

Self-hosted:
- more control
- access to private networks
- better fit for large-scale internal suites`,
      exampleLang: 'text',
      pitfalls: [
        'Assuming self-hosted is automatically better because it sounds more advanced.',
        'Ignoring cost and queue-time pain on hosted runners once the suite gets large.',
      ],
      practice: [
        'Write a short comparison for your current project and one imagined enterprise version of it.',
      ],
      checklist: [
        'You know the operational tradeoffs, not just the feature list.',
      ],
    },
    {
      id: 'lesson-30',
      number: 30,
      title: 'Suite Governance',
      intro: 'Governance means who owns tests, how failures are triaged, how flaky tests are handled, and how the suite stays healthy over time.',
      why: 'Many automation suites fail socially rather than technically. No ownership means no maintenance.',
      learn: [
        'Assign ownership by domain or feature area.',
        'Define what happens when a test becomes flaky.',
        'Keep failure triage visible and repeatable.',
        'Set standards for when tests can be skipped or quarantined.',
      ],
      exampleTitle: 'Governance questions every team should answer',
      exampleCode: `Who owns checkout tests?
When can a test be quarantined?
Who reviews flaky failures?
What is the SLA for fixing a broken critical test?`,
      exampleLang: 'text',
      pitfalls: [
        'Treating the suite as nobody’s responsibility.',
        'Letting quarantined tests accumulate forever.',
      ],
      practice: [
        'Create a simple ownership model even if you are the only contributor today.',
      ],
      checklist: [
        'You can describe how the suite will stay healthy as it grows.',
      ],
    },
    {
      id: 'lesson-31',
      number: 31,
      title: 'Dockerized Playwright Setup',
      intro: 'Docker can make local and CI environments more consistent by packaging the runtime, dependencies, and browser support together.',
      why: 'If the suite behaves differently across machines, containers can reduce environment drift.',
      learn: [
        'Use Docker when consistency matters more than local simplicity.',
        'Package Node, dependencies, and browser-compatible system libraries together.',
        'Keep the container setup understandable and documented.',
      ],
      exampleTitle: 'Dockerfile idea',
      exampleCode: `FROM mcr.microsoft.com/playwright:v1.58.0-jammy
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npx", "playwright", "test"]`,
      pitfalls: [
        'Adding Docker before the team actually needs it.',
        'Treating containers as magic while still leaving env and secrets unclear.',
      ],
      practice: [
        'Containerize one Playwright project and compare the experience to your local machine.',
      ],
      checklist: [
        'You understand why and when Docker reduces environment problems.',
      ],
    },
    {
      id: 'lesson-32',
      number: 32,
      title: 'Secrets Management',
      intro: 'Secrets are credentials, tokens, keys, and sensitive environment values. Mature frameworks treat them carefully from the beginning.',
      why: 'Poor secrets handling creates security risk and operational confusion very quickly.',
      learn: [
        'Keep real secrets out of source control.',
        'Use CI secret stores for protected values.',
        'Use example env files for documentation without exposing real credentials.',
      ],
      exampleTitle: 'Safe pattern',
      exampleCode: `.env.example
.env.qa.example

CI secrets:
LOGIN_USER
LOGIN_PASSWORD
API_TOKEN`,
      exampleLang: 'text',
      pitfalls: [
        'Committing a real .env file because it is convenient.',
        'Logging sensitive values in CI output.',
      ],
      practice: [
        'Audit your repo and identify which values are safe examples versus real secrets.',
      ],
      checklist: [
        'You can explain where each sensitive value should live locally and in CI.',
      ],
    },
    {
      id: 'lesson-33',
      number: 33,
      title: 'Test Metrics And Trend Tracking',
      intro: 'As suites grow, a pass or fail summary is not enough. Metrics help you understand runtime, flakiness, failure clusters, and whether the framework is improving or degrading.',
      why: 'You cannot manage what you do not measure. Metrics turn anecdotal pain into visible patterns.',
      learn: [
        'Track runtime, pass rate, retry count, flaky failure frequency, and ownership hot spots.',
        'Use metrics to drive cleanup work, not to punish teams.',
        'Watch trends, not only one-off numbers.',
      ],
      exampleTitle: 'Useful metrics',
      exampleCode: `- average suite runtime
- average PR smoke runtime
- retry count per week
- top failing tests
- top failing domains
- percentage of quarantined tests`,
      exampleLang: 'text',
      pitfalls: [
        'Collecting metrics nobody uses.',
        'Focusing on vanity numbers instead of decision-making metrics.',
      ],
      practice: [
        'Pick three metrics that would actually help you improve your current framework.',
      ],
      checklist: [
        'You know which measurements would tell you whether the suite is getting healthier.',
      ],
    },
    {
      id: 'lesson-34',
      number: 34,
      title: 'Playwright MCP Usage Strategy',
      intro: 'If you plan to use Playwright MCP or agent-assisted browser workflows, the important lesson is to treat it as an accelerator, not as a replacement for framework design.',
      why: 'Tooling can help discovery and exploration, but maintainable test assets still need clear structure, naming, and ownership.',
      learn: [
        'Use MCP and agent tools for exploration, debugging, and rapid investigation.',
        'Translate useful discoveries into stable page objects and tests.',
        'Do not let one-off exploratory output replace framework conventions.',
      ],
      exampleTitle: 'Good use of MCP in a framework workflow',
      exampleCode: `1. Explore a page quickly with MCP
2. Identify strong locators and stable flows
3. Convert those findings into page object methods
4. Commit clean framework code, not temporary exploratory steps`,
      exampleLang: 'text',
      pitfalls: [
        'Relying on ad hoc generated steps without turning them into maintainable abstractions.',
        'Skipping review of locator quality because a tool found something that works once.',
      ],
      practice: [
        'Use exploratory tooling to map a page, then rewrite the result as a clean page object manually.',
      ],
      checklist: [
        'You use tooling to accelerate understanding while still protecting framework quality.',
      ],
    },
    {
      id: 'lesson-35',
      number: 35,
      title: 'Writing An Article Or Case Study About Your Framework',
      intro: 'Documenting what you built is a force multiplier. It clarifies your own thinking, helps others learn, and turns a personal project into something portfolio-worthy.',
      why: 'A good technical write-up shows not only that you can code, but that you can explain tradeoffs, architecture, and lessons learned.',
      learn: [
        'Tell the story of the problem, not just the final folder tree.',
        'Explain why certain framework choices were made.',
        'Include failures, fixes, and tradeoffs because they teach the most.',
        'Use diagrams or folder trees when they improve clarity.',
      ],
      exampleTitle: 'Strong article outline',
      exampleCode: `1. Why I built the framework
2. The stack I chose and why
3. The project structure
4. Auth, fixtures, and environment handling
5. Reporting and CI
6. Scaling lessons and what I would improve next`,
      exampleLang: 'text',
      pitfalls: [
        'Writing a changelog instead of a story.',
        'Listing tools without explaining decisions.',
      ],
      practice: [
        'Draft the article outline before the framework feels “finished.”',
      ],
      checklist: [
        'You can explain your framework to both a beginner and an experienced engineer.',
      ],
    },
  ],
});

fs.mkdirSync(outputDir, { recursive: true });

for (const volume of volumes) {
  const html = renderVolume(volume);
  fs.writeFileSync(path.join(outputDir, volume.file), html, 'utf8');
}

const indexPath = path.join(outputDir, 'README.txt');
fs.writeFileSync(
  indexPath,
  [
    'Playwright Mastery Series',
    '',
    'Generated lesson volumes:',
    ...volumes.map((volume) => `- ${volume.file}`),
  ].join('\n'),
  'utf8',
);

console.log(`Generated ${volumes.length} lesson volumes in ${outputDir}`);
