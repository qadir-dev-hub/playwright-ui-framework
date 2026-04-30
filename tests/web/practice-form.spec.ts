import path from 'path';
import { expect, test } from '../../fixtures/test-fixtures';

test('user can submit the practice form', async ({ practiceFormPage }) => {
  await practiceFormPage.goto();

  await practiceFormPage.fillStudentRegistrationForm({
    firstName: 'Aqsa',
    lastName: 'Qadri',
    email: 'aqsa@example.com',
    gender: 'Female',
    mobile: '1234567890',
    subject: 'Maths',
    hobbies: ['Reading'],
    picturePath: path.resolve(__dirname, '../package.json'),
    currentAddress: 'Toronto, Ontario',
    state: 'NCR',
    city: 'Delhi',
  });

  await practiceFormPage.submit();
  await practiceFormPage.expectSubmissionModal();
  await practiceFormPage.expectSubmittedValue('Student Name', 'Aqsa Qadri');
  await practiceFormPage.expectSubmittedValue('Student Email', 'aqsa@example.com');
  await practiceFormPage.expectSubmittedValue('Gender', 'Female');
  await practiceFormPage.expectSubmittedValue('Mobile', '1234567890');
  await practiceFormPage.pause(3000);

});

test('practice form page shows the expected left navigation', async ({
  page,
  practiceFormPage,
}) => {
  await practiceFormPage.goto();
  await practiceFormPage.expectPracticeFormLeftPanel();

  
  await expect(page.locator('.left-pannel')).toHaveScreenshot([
  'images',
  'practice-form-left-panel.png',
]);

  await expect(page.locator('.left-pannel')).toBeVisible();
});
