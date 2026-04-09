const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const outputDir = path.resolve(__dirname, 'docs', 'playwright-lessons');

(async () => {
  const htmlFiles = fs
    .readdirSync(outputDir)
    .filter((file) => file.endsWith('.html'))
    .sort();

  const browser = await chromium.launch();

  for (const file of htmlFiles) {
    const page = await browser.newPage();
    const htmlPath = path.join(outputDir, file);
    const pdfPath = htmlPath.replace(/\.html$/, '.pdf');

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

    await page.close();
    console.log(`PDF created at ${pdfPath}`);
  }

  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
