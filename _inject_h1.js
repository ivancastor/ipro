// Injects a static <h1> inside every div#page-hero so Google indexes it without JS
const fs = require('fs');
const path = require('path');

const EXCLUDE = new Set(['admin.html', 'termos.html', 'conectar-whatsapp.html', 'index.html']);

const files = fs.readdirSync(__dirname)
  .filter(f => f.endsWith('.html') && !EXCLUDE.has(f));

let updated = 0;
let alreadyOk = 0;
let noHero = 0;

for (const file of files) {
  const filePath = path.join(__dirname, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // Skip if already has a static h1 in the page-hero div
  if (/<div\s[^>]*id="page-hero"[^>]*>\s*<h1/i.test(html)) {
    alreadyOk++;
    continue;
  }

  // Find page-hero div and extract data-title
  const heroMatch = html.match(/<div\s([^>]*id="page-hero"[^>]*)>/i);
  if (!heroMatch) {
    noHero++;
    continue;
  }

  const attrsStr = heroMatch[1];
  const titleMatch = attrsStr.match(/data-title="([^"]+)"/);
  if (!titleMatch) {
    noHero++;
    continue;
  }

  const title = titleMatch[1];

  // Add <h1> as first child of the page-hero div
  const oldDiv = heroMatch[0]; // e.g. <div id="page-hero" data-title="..." ...>
  const newDiv = oldDiv + `<h1 class="sr-only">${title}</h1>`;

  html = html.replace(oldDiv, newDiv);
  fs.writeFileSync(filePath, html, 'utf8');
  updated++;
  console.log(`✅ ${file} → H1: "${title}"`);
}

console.log(`\nDone: ${updated} updated, ${alreadyOk} already OK, ${noHero} no page-hero`);
