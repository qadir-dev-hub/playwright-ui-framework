import { expect, Page } from '@playwright/test';

type Gender = 'Male' | 'Female' | 'Other';
type Hobby = 'Sports' | 'Reading' | 'Music';
type LeftPanelSection = {
  header: string;
  items: string[];
  expanded?: boolean;
  activeItem?: string;
};

const practiceFormLeftPanelSections: LeftPanelSection[] = [
  {
    header: 'Elements',
    items: [
      'Text Box',
      'Check Box',
      'Radio Button',
      'Web Tables',
      'Buttons',
      'Links',
      'Broken Links - Images',
      'Upload and Download',
      'Dynamic Properties',
    ],
    expanded: false,
  },
  {
    header: 'Forms',
    items: ['Practice Form'],
    expanded: true,
    activeItem: 'Practice Form',
  },
  {
    header: 'Alerts, Frame & Windows',
    items: [
      'Browser Windows',
      'Alerts',
      'Frames',
      'Nested Frames',
      'Modal Dialogs',
    ],
    expanded: false,
  },
  {
    header: 'Widgets',
    items: [
      'Accordian',
      'Auto Complete',
      'Date Picker',
      'Slider',
      'Progress Bar',
      'Tabs',
      'Tool Tips',
      'Menu',
      'Select Menu',
    ],
    expanded: false,
  },
  {
    header: 'Interactions',
    items: ['Sortable', 'Selectable', 'Resizable', 'Droppable', 'Dragabble'],
    expanded: false,
  },
  {
    header: 'Book Store Application',
    items: ['Login', 'Book Store', 'Profile', 'Book Store API'],
    expanded: false,
  },
];

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

   async gotoUrl(url: string,headerText?: string) {
    await this.page.goto(`/${url}`);

    if (headerText) {
      await expect(
      this.page.getByRole('heading', { name: headerText }),
    ).toBeVisible();
    }
    
  }

  async expectPracticeFormLeftPanel() {
    const leftPanel = this.page.locator('.left-pannel');
    await expect(leftPanel).toBeVisible();

    for (const section of practiceFormLeftPanelSections) {
      const sectionGroup = leftPanel
        .locator('.element-group')
        .filter({ hasText: section.header })
        .first();

      await expect(sectionGroup.locator('.group-header')).toContainText(
        section.header,
      );
      await expect(sectionGroup.locator('.menu-list .text')).toHaveText(
        section.items,
      );

      const sectionBody = sectionGroup.locator('.element-list');
      if (section.expanded) {
        await expect(sectionBody).toHaveClass(/show/);
      } else {
        await expect(sectionBody).not.toHaveClass(/show/);
      }

      if (section.activeItem) {
        await expect(sectionGroup.locator('li.active')).toContainText(
          section.activeItem,
        );
      }
    }
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

  async mimicFailedSubmission() {

    await this.page.route('**demoqa.com/**', async (route) => {
  await route.abort();
});


  }
}
