import { test } from '../../fixtures/test-fixtures';

test('user can submit the practice form', async ({ practiceFormPage }) => {
  
  await practiceFormPage.mimicFailedSubmission();//this would block the request to the server, simulating a failed submission
  await practiceFormPage.goto();
  await practiceFormPage.pause(5000);

});