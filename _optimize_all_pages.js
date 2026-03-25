/**
 * _optimize_all_pages.js
 * 
 * Applies performance + SEO improvements to every HTML page:
 *  1. Non-render-blocking Google Fonts
 *  2. Non-render-blocking Font Awesome
 *  3. robots meta tag
 *  4. Open Graph + Twitter Card meta (using existing title/description)
 *  5. Canonical link (using filename → URL)
 *  6. Geo / local SEO meta tags
 *  7. dns-prefetch for external CDNs
 *  8. Preload page-hero background image (service pages)
 *  9. JSON-LD LocalBusiness schema (if not present)
 */

const fs = require('fs');
const path = require('path');

const BASE_URL   = 'https://ipro.net.br';
const OG_IMAGE   = 'https://ipro.net.br/images/loja-ipro-campinas.webp';
const FONTS_URL  = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
const FONTS_URL2 = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
const FA_URL     = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';

// Pages that should be skipped (already handled or special)
const SKIP = new Set(['index.html', 'admin.html', 'termos.html', 'conectar-whatsapp.html']);

const JSON_LD = `
  <!-- ── JSON-LD Structured Data ──────────────────────────────── -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "iPro Assistência Técnica Apple",
    "alternateName": "iPro",
    "description": "Assistência Técnica Apple especializada em Campinas. Reparos em iPhone, MacBook, iPad, Apple Watch e iMac com garantia de 1 ano.",
    "url": "https://ipro.net.br",
    "telephone": "+551933245205",
    "email": "Contato@ipro.net.br",
    "image": "https://ipro.net.br/images/loja-ipro-campinas.webp",
    "logo": "https://ipro.net.br/images/logonova.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua Jorge Krug, 69",
      "addressLocality": "Campinas",
      "addressRegion": "SP",
      "postalCode": "13023-210",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -22.891888,
      "longitude": -47.060492
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": "10:00",
        "closes": "12:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": "13:00",
        "closes": "18:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "bestRating": "5",
      "worstRating": "1",
      "reviewCount": "650"
    },
    "priceRange": "$$",
    "currenciesAccepted": "BRL",
    "paymentAccepted": "Dinheiro, Cartão de Crédito, Cartão de Débito, PIX",
    "sameAs": [
      "https://www.instagram.com/ipropremium/",
      "https://www.facebook.com/iproassistenciaapple",
      "https://www.tiktok.com/@ipro"
    ]
  }
  </script>`;

function extractMeta(html, attr, value) {
  const re = new RegExp(`<meta\\s[^>]*${attr}=["']${value}["'][^>]*>`, 'i');
  return re.test(html);
}

function getMetaContent(html, nameOrProp, value) {
  const re = new RegExp(`<meta\\s[^>]*(name|property)=["']${value}["'][^>]*content=["']([^"']+)["']`, 'i');
  const re2 = new RegExp(`<meta\\s[^>]*content=["']([^"']+)["'][^>]*(name|property)=["']${value}["']`, 'i');
  let m = html.match(re) || html.match(re2);
  if (m) return m[2] || m[1];
  return '';
}

function getTitleText(html) {
  const m = html.match(/<title>([^<]+)<\/title>/i);
  return m ? m[1].trim() : '';
}

function getDescriptionText(html) {
  const m = html.match(/<meta\s[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
            || html.match(/<meta\s[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  return m ? m[1].trim() : '';
}

function getPageHeroBg(html) {
  const m = html.match(/data-bg=["']([^"']+)["']/i);
  return m ? m[1].trim() : '';
}

function processFile(filePath, filename) {
  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;

  const canonicalPath = '/' + filename;
  const canonicalURL  = BASE_URL + canonicalPath;
  const title         = getTitleText(html);
  const description   = getDescriptionText(html);
  const heroBg        = getPageHeroBg(html);

  // ── 1. Non-blocking Google Fonts (weight 400;500;600;700) ───────
  const fontsBlocking1 = `<link href="${FONTS_URL}" rel="stylesheet" />`;
  const fontsBlocking2 = `<link href="${FONTS_URL2}" rel="stylesheet" />`;
  // Also handle reversed attribute order
  const fontsBlockingAlt1 = `<link rel="stylesheet" href="${FONTS_URL}" />`;
  const fontsNonBlocking1 = `<link rel="preload" href="${FONTS_URL}" as="style" onload="this.onload=null;this.rel='stylesheet'" />\n  <noscript><link href="${FONTS_URL}" rel="stylesheet" /></noscript>`;
  const fontsNonBlocking2 = `<link rel="preload" href="${FONTS_URL2}" as="style" onload="this.onload=null;this.rel='stylesheet'" />\n  <noscript><link href="${FONTS_URL2}" rel="stylesheet" /></noscript>`;

  if (html.includes(fontsBlocking1))       html = html.replace(fontsBlocking1, fontsNonBlocking1);
  else if (html.includes(fontsBlockingAlt1)) html = html.replace(fontsBlockingAlt1, fontsNonBlocking1);
  else if (html.includes(fontsBlocking2))  html = html.replace(fontsBlocking2, fontsNonBlocking2);

  // ── 2. Non-blocking Font Awesome ────────────────────────────────
  const faBlocking   = `<link rel="stylesheet" href="${FA_URL}" crossorigin="anonymous" />`;
  const faNonBlocking = `<link rel="preload" href="${FA_URL}" as="style" crossorigin="anonymous" onload="this.onload=null;this.rel='stylesheet'" />\n  <noscript><link rel="stylesheet" href="${FA_URL}" crossorigin="anonymous" /></noscript>`;
  if (html.includes(faBlocking)) html = html.replace(faBlocking, faNonBlocking);

  // ── 3. Find insertion point (after <meta name="description"...>) ─
  // We'll insert new tags right before </head>
  const headCloseIdx = html.lastIndexOf('</head>');
  if (headCloseIdx === -1) { console.log(`  ⚠ No </head> found in ${filename}`); return; }

  let inserts = '';

  // robots
  if (!/<meta\s[^>]*name=["']robots["']/i.test(html)) {
    inserts += `  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />\n`;
  }

  // canonical
  if (!/<link\s[^>]*rel=["']canonical["']/i.test(html)) {
    inserts += `  <link rel="canonical" href="${canonicalURL}" />\n`;
  }

  // OG tags
  if (!/<meta\s[^>]*property=["']og:title["']/i.test(html)) {
    const ogTitle  = title || 'iPro Assistência Técnica Apple em Campinas';
    const ogDesc   = description || 'Assistência Técnica Apple especializada em Campinas. Nota 5.0 no Google. Garantia de 1 ano.';
    inserts += `  <meta property="og:type" content="website" />\n`;
    inserts += `  <meta property="og:url" content="${canonicalURL}" />\n`;
    inserts += `  <meta property="og:site_name" content="iPro Assistência Apple Campinas" />\n`;
    inserts += `  <meta property="og:title" content="${ogTitle}" />\n`;
    inserts += `  <meta property="og:description" content="${ogDesc}" />\n`;
    inserts += `  <meta property="og:image" content="${OG_IMAGE}" />\n`;
    inserts += `  <meta property="og:image:width" content="1200" />\n`;
    inserts += `  <meta property="og:image:height" content="630" />\n`;
    inserts += `  <meta property="og:image:alt" content="Loja iPro Assistência Técnica Apple em Campinas" />\n`;
    inserts += `  <meta property="og:locale" content="pt_BR" />\n`;
  }

  // Twitter Card
  if (!/<meta\s[^>]*name=["']twitter:card["']/i.test(html)) {
    const twTitle = title || 'iPro Assistência Técnica Apple em Campinas';
    const twDesc  = description || 'Assistência Técnica Apple especializada em Campinas. Nota 5.0 no Google. Garantia de 1 ano.';
    inserts += `  <meta name="twitter:card" content="summary_large_image" />\n`;
    inserts += `  <meta name="twitter:title" content="${twTitle}" />\n`;
    inserts += `  <meta name="twitter:description" content="${twDesc}" />\n`;
    inserts += `  <meta name="twitter:image" content="${OG_IMAGE}" />\n`;
  }

  // Geo meta tags
  if (!/<meta\s[^>]*name=["']geo\.region["']/i.test(html)) {
    inserts += `  <meta name="geo.region" content="BR-SP" />\n`;
    inserts += `  <meta name="geo.placename" content="Campinas, São Paulo, Brasil" />\n`;
    inserts += `  <meta name="geo.position" content="-22.891888;-47.060492" />\n`;
    inserts += `  <meta name="ICBM" content="-22.891888, -47.060492" />\n`;
  }

  // dns-prefetch
  if (!html.includes('dns-prefetch')) {
    inserts += `  <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />\n`;
    inserts += `  <link rel="dns-prefetch" href="https://fonts.gstatic.com" />\n`;
  }

  // Favicon
  if (!html.includes('rel="icon"')) {
    inserts += `  <link rel="icon" href="images/logonova.png" type="image/png" />\n`;
    inserts += `  <link rel="apple-touch-icon" href="images/logonova.png" />\n`;
  }

  // theme-color
  if (!html.includes('theme-color')) {
    inserts += `  <meta name="theme-color" content="#1a1a1a" />\n`;
  }

  // Preload hero background image (service pages with page-hero.js)
  if (heroBg && !html.includes(`rel="preload" as="image"`)) {
    inserts += `  <link rel="preload" as="image" href="${heroBg}" fetchpriority="high" />\n`;
  }

  // JSON-LD
  if (!html.includes('application/ld+json')) {
    inserts += JSON_LD + '\n';
  }

  if (inserts) {
    html = html.slice(0, headCloseIdx) + inserts + html.slice(headCloseIdx);
  }

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✅ Updated: ${filename}`);
  } else {
    console.log(`  — Unchanged: ${filename}`);
  }
}

// ── Run ─────────────────────────────────────────────────────────────
const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

console.log(`\n🔧 Optimizing ${files.length} HTML files...\n`);
let updated = 0;
for (const f of files) {
  if (SKIP.has(f)) { console.log(`  ⏭ Skipped: ${f}`); continue; }
  processFile(path.join(dir, f), f);
  updated++;
}
console.log(`\n✅ Done! Processed ${updated} files.\n`);
