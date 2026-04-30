const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseInline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let i = 0;
  let inCode = false;
  let codeLang = '';
  let codeLines = [];
  let inUl = false;
  let inOl = false;
  let paragraph = [];

  const closeParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${parseInline(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };

  const closeLists = () => {
    if (inUl) {
      html.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      html.push('</ol>');
      inOl = false;
    }
  };

  const closeCode = () => {
    if (inCode) {
      html.push(
        `<pre><code class="language-${escapeHtml(codeLang || 'text')}">${escapeHtml(
          codeLines.join('\n'),
        )}</code></pre>`,
      );
      inCode = false;
      codeLang = '';
      codeLines = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      closeParagraph();
      closeLists();

      if (!inCode) {
        inCode = true;
        codeLang = line.slice(3).trim();
      } else {
        closeCode();
      }
      i += 1;
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      i += 1;
      continue;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      closeParagraph();
      closeLists();
      i += 1;
      continue;
    }

    const h1 = trimmed.match(/^# (.+)$/);
    const h2 = trimmed.match(/^## (.+)$/);
    const h3 = trimmed.match(/^### (.+)$/);
    const ul = trimmed.match(/^- (.+)$/);
    const ol = trimmed.match(/^\d+\. (.+)$/);

    if (h1 || h2 || h3) {
      closeParagraph();
      closeLists();
      if (h1) html.push(`<h1>${parseInline(h1[1])}</h1>`);
      if (h2) html.push(`<h2>${parseInline(h2[1])}</h2>`);
      if (h3) html.push(`<h3>${parseInline(h3[1])}</h3>`);
      i += 1;
      continue;
    }

    if (ul) {
      closeParagraph();
      if (inOl) {
        html.push('</ol>');
        inOl = false;
      }
      if (!inUl) {
        html.push('<ul>');
        inUl = true;
      }
      html.push(`<li>${parseInline(ul[1])}</li>`);
      i += 1;
      continue;
    }

    if (ol) {
      closeParagraph();
      if (inUl) {
        html.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        html.push('<ol>');
        inOl = true;
      }
      html.push(`<li>${parseInline(ol[1])}</li>`);
      i += 1;
      continue;
    }

    paragraph.push(trimmed);
    i += 1;
  }

  closeParagraph();
  closeLists();
  closeCode();

  return html.join('\n');
}

function buildHtml(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI-Driven Playwright Failure Analysis And Repair Loop</title>
  <style>
    :root {
      --bg: #f4efe5;
      --paper: #fffdf8;
      --ink: #1f2937;
      --muted: #5e6773;
      --accent: #0f6a64;
      --accent-soft: #dff3ef;
      --border: #d7d1c6;
      --code-bg: #17202b;
      --code-ink: #f5f8fc;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 28px;
      font-family: Georgia, "Times New Roman", serif;
      color: var(--ink);
      background: linear-gradient(180deg, #ece3d2 0%, var(--bg) 100%);
      line-height: 1.6;
      font-size: 15px;
    }

    .page {
      max-width: 980px;
      margin: 0 auto;
      background: var(--paper);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 40px 48px 56px;
      box-shadow: 0 18px 50px rgba(49, 39, 28, 0.08);
    }

    h1, h2, h3 {
      font-family: "Trebuchet MS", Arial, sans-serif;
      line-height: 1.2;
      margin: 0 0 14px;
    }

    h1 { font-size: 32px; margin-bottom: 18px; }
    h2 {
      font-size: 24px;
      margin-top: 34px;
      padding-top: 14px;
      border-top: 2px solid var(--accent-soft);
    }
    h3 { font-size: 18px; margin-top: 20px; }

    p { margin: 0 0 12px; }
    ul, ol { margin: 10px 0 14px 24px; }
    li { margin: 4px 0; }

    code {
      font-family: Consolas, "Courier New", monospace;
      font-size: 0.95em;
      background: rgba(15, 106, 100, 0.08);
      padding: 2px 6px;
      border-radius: 4px;
    }

    pre {
      background: var(--code-bg);
      color: var(--code-ink);
      border-radius: 12px;
      padding: 16px 18px;
      overflow-x: auto;
      margin: 14px 0 18px;
    }

    pre code {
      background: transparent;
      padding: 0;
      color: inherit;
    }

    @media print {
      body { background: #fff; padding: 0; }
      .page {
        box-shadow: none;
        border: none;
        border-radius: 0;
        max-width: none;
        padding: 0;
      }
      pre { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <main class="page">
    ${content}
  </main>
</body>
</html>`;
}

(async () => {
  const markdownPath = path.resolve(__dirname, 'docs', 'ai-driven-playwright-repair-loop.md');
  const htmlPath = path.resolve(__dirname, 'docs', 'ai-driven-playwright-repair-loop.html');
  const pdfPath = path.resolve(__dirname, 'docs', 'ai-driven-playwright-repair-loop.pdf');

  const markdown = fs.readFileSync(markdownPath, 'utf8');
  const html = buildHtml(markdownToHtml(markdown));
  fs.writeFileSync(htmlPath, html, 'utf8');

  const browser = await chromium.launch();
  const page = await browser.newPage();

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
