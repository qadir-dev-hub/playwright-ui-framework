const path = require('path');
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const htmlPath = path.resolve(
    __dirname,
    'docs',
    'wdio-appium-current-process.html',
  );
  const pdfPath = path.resolve(
    __dirname,
    'docs',
    'wdio-appium-current-process.pdf',
  );

  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, {
    waitUntil: 'load',
  });

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '14mm',
      right: '12mm',
      bottom: '14mm',
      left: '12mm',
    },
  });

  await browser.close();
  console.log(`PDF created at ${pdfPath}`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
