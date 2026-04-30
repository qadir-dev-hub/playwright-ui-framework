import { expect, Page } from '@playwright/test';
import { SiteHeaderPage } from './site-header.page';

export class CoursesPage {
  readonly header: SiteHeaderPage;

  constructor(private readonly page: Page) {
    this.header = new SiteHeaderPage(page);
  }

  async goto() {
    await this.page.goto('https://practicetestautomation.com/courses/');
  }

  async clickCoursesFromHeader() {
    await this.header.clickCourses();
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(
      'https://practicetestautomation.com/courses/',
    );
    await expect(
      this.page.getByRole('heading', { name: 'Courses', exact: true }),
    ).toBeVisible();
  }

  async expectLearningTextVisible() {
    await expect(this.learningText).toBeVisible();
  }

  async pause(milliseconds: number) {
    await this.page.waitForTimeout(milliseconds);
  }

  get learningText() {
    return this.page
      .locator('strong')
      .filter({ hasText: 'What you\u2019ll learn in this course:' })
      .first();
  }
}
