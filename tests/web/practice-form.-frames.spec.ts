
import { test } from '../../fixtures/test-fixtures';

test('user can open browser windows from the left navigation', async ({
  browserWindowsPage,
  otherPageElementsPage,
}) => {
  await otherPageElementsPage.gotoUrl('alertsWindows');
  await otherPageElementsPage.clickLeftNavItem('Browser Windows');
  const newTab = await browserWindowsPage.clickButtonAndSwitchToNewTab(
    'New Tab',
  );
  await browserWindowsPage.expectSampleHeadingVisible(newTab);

  // await practiceFormPage.fillStudentRegistrationForm({
  //   firstName: 'Aqsa',
  //   lastName: 'Qadri',
  //   email: 'aqsa@example.com',
  //   gender: 'Female',
  //   mobile: '1234567890',
  //   subject: 'Maths',
  //   hobbies: ['Reading'],
  //   picturePath: path.resolve(__dirname, '../package.json'),
  //   currentAddress: 'Toronto, Ontario',
  //   state: 'NCR',
  //   city: 'Delhi',
  // });

  // await practiceFormPage.submit();
  // await practiceFormPage.expectSubmissionModal();
  // await practiceFormPage.expectSubmittedValue('Student Name', 'Aqsa Qadri');
  // await practiceFormPage.expectSubmittedValue('Student Email', 'aqsa@example.com');
  // await practiceFormPage.expectSubmittedValue('Gender', 'Female');
  // await practiceFormPage.expectSubmittedValue('Mobile', '1234567890');
  // await practiceFormPage.pause(3000);

});

test('user can open new window message and validate the body text', async ({
  browserWindowsPage,
  otherPageElementsPage,
}) => {
  await otherPageElementsPage.gotoUrl('alertsWindows');
  await otherPageElementsPage.clickLeftNavItem('Browser Windows');
  const messageWindow = await browserWindowsPage.clickButtonAndSwitchToNewTab(
    'New Window Message',
  );
  await browserWindowsPage.expectBodyTextVisible(
    messageWindow,
    'Knowledge increases by sharing but not by saving. Please share this website with your friends and in your organization.',
  );

 const newTab = await browserWindowsPage.clickButtonAndSwitchToNewTab(
    'New Tab',
  );
  await browserWindowsPage.expectBodyTextVisible(
    newTab,
    'This is a sample page',
  );

});
