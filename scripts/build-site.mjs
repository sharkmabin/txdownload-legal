import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const data = JSON.parse(fs.readFileSync(path.join(root, "src", "policies.json"), "utf8"));

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

const languageLinks = (currentCode) =>
  data.locales
    .map((locale) => {
      const active = locale.code === currentCode ? " aria-current=\"page\"" : "";
      return `<a${active} href="${data.baseUrl}/privacy/${locale.code}/">${escapeHtml(locale.name)}</a>`;
    })
    .join("");

const layout = ({ lang, title, description, body }) => `<!doctype html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <style>
    :root {
      color-scheme: light dark;
      --bg: #f7f8fb;
      --panel: #ffffff;
      --text: #172033;
      --muted: #5e6b82;
      --line: #dfe5ef;
      --accent: #0b6bcb;
      --accent-soft: #e8f2ff;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #10141d;
        --panel: #171d29;
        --text: #eef3fb;
        --muted: #a7b2c5;
        --line: #2a3344;
        --accent: #74b7ff;
        --accent-soft: #152941;
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Noto Sans CJK SC", "Noto Sans Thai", "Noto Sans KR", "Noto Sans JP", Arial, sans-serif;
      line-height: 1.65;
    }
    main {
      width: min(920px, calc(100% - 32px));
      margin: 0 auto;
      padding: 36px 0 56px;
    }
    header, section, footer {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 22px;
      margin-bottom: 14px;
    }
    h1 {
      margin: 0 0 8px;
      font-size: clamp(2rem, 5vw, 3rem);
      line-height: 1.12;
      letter-spacing: 0;
    }
    h2 {
      margin: 0 0 10px;
      font-size: 1.18rem;
      letter-spacing: 0;
    }
    p { margin: 0; }
    .meta, .summary, footer { color: var(--muted); }
    .summary {
      background: var(--accent-soft);
      border-color: var(--line);
    }
    .language-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 18px;
    }
    a {
      color: var(--accent);
      text-underline-offset: 3px;
    }
    .language-nav a {
      display: inline-flex;
      align-items: center;
      min-height: 36px;
      padding: 6px 10px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--panel);
      text-decoration: none;
      font-weight: 650;
    }
    .language-nav a[aria-current="page"] {
      background: var(--accent);
      border-color: var(--accent);
      color: white;
    }
  </style>
</head>
<body>
  <main>
${body}
  </main>
</body>
</html>
`;

const renderPolicy = (locale) => layout({
  lang: locale.htmlLang,
  title: locale.title,
  description: locale.summary,
  body: `    <header>
      <h1>${escapeHtml(locale.title)}</h1>
      <p class="meta">${escapeHtml(locale.updatedLabel)}</p>
      <nav class="language-nav" aria-label="${escapeHtml(locale.languageLabel)}">${languageLinks(locale.code)}</nav>
    </header>
    <section class="summary">
      <h2>${escapeHtml(locale.summaryTitle)}</h2>
      <p>${escapeHtml(locale.summary)}</p>
    </section>
${locale.sections.map((section) => `    <section>
      <h2>${escapeHtml(section.title)}</h2>
      <p>${escapeHtml(section.body)}</p>
    </section>`).join("\n")}
    <footer>
      <h2>${escapeHtml(locale.contactLabel)}</h2>
      <p>${escapeHtml(locale.contactText)} <a href="${escapeHtml(data.contactUrl)}">${escapeHtml(data.contactUrl)}</a></p>
    </footer>`
});

const renderIndex = () => layout({
  lang: "en",
  title: "TXDownloader Legal Pages",
  description: "TXDownloader privacy policy language index.",
  body: `    <header>
      <h1>TXDownloader Legal Pages</h1>
      <p class="meta">Updated: ${escapeHtml(data.updated)} | Version: V${escapeHtml(data.version)}</p>
    </header>
    <section class="summary">
      <h2>Privacy Policy</h2>
      <p>Select a language to view the TXDownloader privacy policy.</p>
      <nav class="language-nav" aria-label="Privacy policy languages">${languageLinks("")}</nav>
    </section>`
});

fs.writeFileSync(path.join(root, "index.html"), renderIndex());
ensureDir(path.join(root, "privacy"));
fs.writeFileSync(path.join(root, "privacy", "index.html"), renderIndex());

for (const locale of data.locales) {
  const dir = path.join(root, "privacy", locale.code);
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, "index.html"), renderPolicy(locale));
}

console.log(`Generated ${data.locales.length} localized privacy pages.`);
