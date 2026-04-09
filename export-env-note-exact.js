const path = require('path');
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'env-note-exact.html');
  const pdfPath = path.resolve(__dirname, 'env-note-exact.pdf');

  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, {
    waitUntil: 'load',
  });

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '16mm',
      right: '14mm',
      bottom: '16mm',
      left: '14mm',
    },
  });

  await browser.close();
  console.log(`PDF created at ${pdfPath}`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
