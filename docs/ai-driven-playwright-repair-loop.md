# AI-Driven Playwright Failure Analysis And Repair Loop

This document explains, from scratch, how to build a workflow where an AI agent can:

1. run a Playwright test
2. detect a failure
3. inspect logs and generated artifacts
4. inspect the browser state with Playwright MCP
5. update framework code
6. rerun the test
7. verify the fix

This is not a "magic self-healing test" idea. It is a practical engineering loop built from a few capabilities working together.

## 1. The Big Picture

To make this work, the AI needs access to five things:

1. Test execution
2. Failure artifacts
3. Browser investigation
4. Code editing
5. Verification reruns

If any one of those is missing, the loop becomes weak.

For example:
- if the AI can run tests but cannot read artifacts, it will guess
- if it can read artifacts but cannot inspect the live browser, it may misdiagnose UI issues
- if it can inspect the browser but cannot edit code, it cannot fix anything
- if it can patch code but cannot rerun, it cannot verify whether the fix worked

## 2. What Each Layer Does

### Layer 1: Playwright test runner

This is how the AI runs tests and reproduces failures.

Examples:

```powershell
npx playwright test
npx playwright test tests/login.spec.ts
npx playwright test tests/login.spec.ts --project=chromium
```

### Layer 2: Playwright artifacts

This is how the AI understands what failed.

Useful artifacts:
- terminal error output
- HTML report
- JSON report
- trace
- screenshot
- video
- `error-context.md`

### Layer 3: Playwright MCP

This is how the AI interactively inspects the browser and reproduces the failure in a live session.

Useful for:
- checking whether the element really exists
- testing locators quickly
- inspecting console output
- inspecting network requests
- checking frames, popups, or auth state

### Layer 4: Code editing

This is how the AI applies a fix to:
- page objects
- tests
- fixtures
- config
- environment handling

### Layer 5: Rerun and verification

This is how the AI confirms the fix is real.

The AI should rerun:
1. the exact failed test first
2. nearby related tests second
3. broader coverage only if needed

## 3. The Minimum Viable Architecture

A practical AI-repair setup looks like this:

```text
AI agent
  -> runs Playwright test
  -> reads logs + artifacts
  -> uses Playwright MCP to inspect live browser state
  -> edits framework code
  -> reruns targeted tests
```

In your project, that means:

```text
playwright-ui-framework/
  pages/
  fixtures/
  tests/
  config/
  environments/
  playwright/
    .auth/
  playwright-report/
  test-results/
  docs/
```

## 4. What You Need In The Repo

To support this loop well, your repo should provide:

### A. Stable framework structure

Keep failures easy to patch by having:
- locators in page objects
- shared setup in fixtures
- environment values in config and env files
- auth state in setup tests or setup projects

This reduces guesswork about where the fix belongs.

### B. Good artifact generation

The AI needs more than terminal output.

Your current config already keeps:
- trace on retry
- screenshot on failure
- video on failure

That is a good start.

## 5. Recommended Playwright Config For AI Debugging

For an AI-friendly failure analysis loop, I recommend this style:

```ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const testEnv = process.env.ENV ?? 'qa';
const envFile = path.resolve(__dirname, 'environments', `.env.${testEnv}`);

if (!fs.existsSync(envFile)) {
  throw new Error(`Environment file not found: ${envFile}`);
}

dotenv.config({ path: envFile });

console.log(`Running tests against environment: ${testEnv}`);
console.log(`Using env file: ${envFile}`);
console.log(`Base URL: ${process.env.BASE_URL}`);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Why this is better for AI

Because it gives the AI:
- visible environment context
- HTML report for humans
- JSON report for machine parsing
- trace for deep debugging
- screenshot and video for visual confirmation

## 6. Why JSON Reporting Matters

JSON output is one of the most important additions.

Without it, the AI often has to infer structure from terminal text.

With it, the AI can parse:
- failing test name
- file path
- line number
- project/browser
- attachment references
- retry behavior

This makes automated diagnosis much more reliable.

## 7. Artifact Files The AI Should Read

When a test fails, the AI should check these in order:

1. terminal output
2. `test-results/results.json`
3. test-specific `error-context.md`
4. screenshot
5. trace
6. video if necessary

### Typical artifact paths

```text
playwright-report/
test-results/
test-results/results.json
test-results/<failed-test-folder>/error-context.md
test-results/<failed-test-folder>/trace.zip
test-results/<failed-test-folder>/test-failed-1.png
test-results/<failed-test-folder>/video.webm
```

## 8. What The AI Should Look For First

When the AI begins diagnosis, it should not start by changing code.

It should first ask:

1. Did the page open successfully?
2. Was the correct environment loaded?
3. Was the user authenticated if required?
4. Is the failing locator wrong or too broad?
5. Is the test expecting the wrong state?
6. Is the issue timing, data, auth, frame, popup, or real app behavior?

This avoids random patching.

## 9. Where Playwright MCP Fits

Playwright MCP should be used after the AI has read the failure artifacts and needs to inspect the app live.

MCP is best for:
- reproducing the failing UI path
- inspecting the current page structure
- checking console messages
- checking network requests
- confirming whether a locator is still valid
- identifying frame and popup issues
- checking whether auth state is really present

MCP is not the whole repair system. It is the browser investigation layer.

## 10. The Full Failure Repair Loop

This is the practical sequence I recommend.

### Step 1: run the failing test

Run the smallest useful target.

Example:

```powershell
npx playwright test tests/auth-with-storage-state.spec.ts
```

If the failure came from CI, rerun only that specific test locally first.

### Step 2: parse the failure

Read:
- the failing line
- the assertion text
- the test title
- the browser/project
- the attachment paths

### Step 3: inspect JSON report

Read `test-results/results.json` to confirm:
- exact test ID
- project name
- retry count
- attachment references

### Step 4: inspect visual artifacts

Read:
- screenshot
- `error-context.md`
- trace

This often already reveals the root cause.

Examples:
- browser is on the wrong URL
- a DNS error page opened
- modal did not open
- a popup stole focus
- the wrong text is displayed

### Step 5: reproduce with MCP

Use Playwright MCP to:
- open the same route
- use the same auth state if needed
- inspect the real element tree
- verify the page assumptions interactively

### Step 6: classify the failure

The AI should decide which category fits best:
- locator drift
- assertion mismatch
- timing issue
- missing auth state
- wrong environment
- frame or popup handling issue
- data dependency issue
- real application defect

### Step 7: patch the smallest correct place

Examples:
- page object if locator changed
- fixture if setup is wrong
- config if base URL or storage state is wrong
- test file if the assertion is incorrect

### Step 8: rerun the same test

Always verify with the smallest rerun first.

Example:

```powershell
npx playwright test tests/auth-with-storage-state.spec.ts --headed
```

### Step 9: rerun nearby related tests

If the fix touched a shared page object or fixture, run related tests too.

### Step 10: summarize root cause and fix

The AI should leave behind a short explanation:
- what failed
- why it failed
- what changed
- what was rerun

## 11. What The AI Can Fix Well

This system works best for:
- broken locators
- stale text assertions
- auth or storage state problems
- config mistakes
- retry/report/artifact misconfiguration
- page object drift after UI changes
- frame or popup handling issues

## 12. What The AI May Not Be Able To Fix Automatically

This system is much weaker when the issue is:
- a true backend outage
- a real app defect
- an unclear business rule
- unstable test data across environments
- a hidden permissions/security issue

In those cases, the AI can often still diagnose and explain the problem, even if it should not auto-fix it.

## 13. Local Loop vs CI Loop

There are two useful operating modes.

### Local loop

The AI:
- runs the test locally
- reads local artifacts
- uses local MCP
- patches code
- reruns locally

This is the easiest version to implement and the best place to start.

### CI-assisted loop

The AI:
- receives CI failure context
- reads uploaded artifacts
- checks out code
- reproduces locally or in a separate runner
- patches on a branch
- reruns targeted tests

This is more powerful, but also more complex.

## 14. Recommended CI Pattern

If you want this to work from GitHub Actions, your workflow should:

1. run tests
2. always upload artifacts on failure
3. keep machine-readable results
4. allow an AI agent to access:
   - repo code
   - workflow logs
   - uploaded artifacts
   - a branch for fixes

Example artifact upload step:

```yaml
- name: Upload Playwright report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: |
      playwright-report/
      test-results/
    retention-days: 7
```

## 15. How To Make MCP Use The Same Auth As The Framework

This is one of the best ways to align the two systems.

If your framework writes:

```text
playwright/.auth/student.json
```

then MCP can reuse it.

Conceptually:

```text
Playwright auth setup test -> saves storage state
MCP isolated session -> loads same storage state
AI explores authenticated UI with the same session model as the test framework
```

This helps the AI reproduce authenticated failures accurately.

## 16. Recommended Documentation In The Repo

Add a dedicated docs area for this repair loop.

Suggested structure:

```text
docs/
  ai-driven-playwright-repair-loop.md
  playwright-mcp/
    setup.md
    debugging.md
    recipes.md
```

This keeps the workflow understandable for future-you or teammates.

## 17. A Realistic Example

Suppose this test fails:

```text
tests/auth-with-storage-state.spec.ts
```

with:

```text
Expected Log out link to be visible
```

A strong AI loop would do this:

1. rerun only `auth-with-storage-state.spec.ts`
2. read `results.json`
3. inspect screenshot and trace
4. see whether the page is actually logged out
5. use MCP with the same storage state file
6. confirm whether the saved auth file expired or the page changed
7. patch:
   - auth setup
   - login page object
   - storage state path
   - or the assertion itself
8. rerun the same test
9. rerun auth-related tests

That is a realistic, high-value loop.

## 18. Practical Improvements For Your Current Repo

For your current `playwright-ui-framework`, I would recommend:

1. Add JSON reporting to `playwright.config.ts`
2. Keep `trace: 'retain-on-failure'`
3. Keep screenshots and video on failure
4. Ensure auth setup files are easy to rerun in isolation
5. Keep page objects small and patchable
6. Add a short MCP debugging note in docs

## 19. Suggested Commands The AI Should Use

Examples the AI would use during the loop:

```powershell
npx playwright test tests/auth.setup.spec.ts
npx playwright test tests/auth-with-storage-state.spec.ts
npx playwright test tests/practice-form.spec.ts --headed
npx playwright show-report
```

And for traces:

```powershell
npx playwright show-trace test-results/<failed-test-folder>/trace.zip
```

## 20. The Most Important Design Rule

The most important rule in this whole document is:

```text
Use MCP to investigate.
Use framework code to encode the solution.
Use Playwright test reruns to verify the fix.
```

That is the difference between a useful AI-assisted repair loop and an unstable pile of one-off agent actions.

## 21. Final Recommendation

Start with the local version of this loop first.

That means:

1. improve artifact output
2. keep your framework structure clean
3. use MCP for browser-side investigation
4. let the AI patch code locally
5. rerun targeted tests

Once that feels solid, extend the same pattern to CI.

## 22. Optional Next Step

If you want, the next useful deliverable after this documentation would be:

- a concrete repo implementation checklist, or
- actual updates to your `playwright.config.ts` and CI workflow to make your current framework AI-repair-friendly.
