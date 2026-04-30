import { test, expect } from '@playwright/test';
test('new todo is visible in the UI', async ({ request, page }) => {
const response = await request.post('https://example.com/api/todos', {
data: { title: 'Learn Playwright hybrid tests' },
});
expect(response.ok()).toBeTruthy();
await page.goto('https://example.com/todos');
await expect(page.getByText('Learn Playwright hybrid tests')).toBeVisible();
});