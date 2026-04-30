import { test } from '../../fixtures/test-fixtures';

test('courses page shows the expected learning text after clicking Courses', async ({
  coursesPage,
}) => {
  await coursesPage.goto();
  await coursesPage.expectLoaded();
  await coursesPage.clickCoursesFromHeader();
  await coursesPage.expectLoaded();
  await coursesPage.expectLearningTextVisible();
  await coursesPage.pause(5000);

});
