import { Page } from '@playwright/test';

export class SiteHeaderPage {
  constructor(private readonly page: Page) {}

  get coursesLink() {
    return this.page.getByRole('link', { name: 'Courses', exact: true });
  }

  async clickCourses() {
    await this.coursesLink.click();
  }
}
