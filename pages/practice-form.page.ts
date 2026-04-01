import { expect, Page } from '@playwright/test';

type Gender = 'Male' | 'Female' | 'Other';
type Hobby = 'Sports' | 'Reading' | 'Music';

export type PracticeFormData = {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  mobile: string;
  subject?: string;
  hobbies?: Hobby[];
  picturePath?: string;
  currentAddress?: string;
  state?: string;
  city?: string;
};

export class PracticeFormPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/automation-practice-form');
    await expect(
      this.page.getByRole('heading', { name: 'Practice Form' }),
    ).toBeVisible();
  }

  async fillStudentRegistrationForm(data: PracticeFormData) {
    await this.page.getByPlaceholder('First Name').fill(data.firstName);
    await this.page.getByPlaceholder('Last Name').fill(data.lastName);
    await this.page.getByPlaceholder('name@example.com').fill(data.email);
    await this.selectGender(data.gender);
    await this.page.getByPlaceholder('Mobile Number').fill(data.mobile);

    if (data.subject) {
      await this.addSubject(data.subject);
    }

    if (data.hobbies?.length) {
      for (const hobby of data.hobbies) {
        await this.selectHobby(hobby);
      }
    }

    if (data.picturePath) {
      await this.page.locator('#uploadPicture').setInputFiles(data.picturePath);
    }

    if (data.currentAddress) {
      await this.page.locator('#currentAddress').fill(data.currentAddress);
    }

    if (data.state) {
      await this.selectState(data.state);
    }

    if (data.city) {
      await this.selectCity(data.city);
    }
  }

  async submit() {
    await this.page.locator('#submit').click();
  }

async expectSubmissionModal() {
  await expect(
    this.page.getByText('Thanks for submitting the form', { exact: true }),
  ).toBeVisible();
}


  async expectSubmittedValue(label: string, value: string) {
    const row = this.page.locator('.table-responsive tr').filter({
      has: this.page.getByText(label, { exact: true }),
    });
    await expect(row).toContainText(value);
  }

  private async selectGender(gender: Gender) {
    await this.page.getByText(gender, { exact: true }).click();
  }

  private async addSubject(subject: string) {
    const subjectsInput = this.page.locator('#subjectsInput');
    await subjectsInput.fill(subject);
    await subjectsInput.press('Enter');
  }

  private async selectHobby(hobby: Hobby) {
    await this.page.getByText(hobby, { exact: true }).click();
  }

  private async selectState(state: string) {
    await this.page.locator('#state').click();
    await this.page.getByText(state, { exact: true }).click();
  }

  private async selectCity(city: string) {
    await this.page.locator('#city').click();
    await this.page.getByText(city, { exact: true }).click();
  }
  async pause(time: number) {
    await this.page.waitForTimeout(time);
  }
}
