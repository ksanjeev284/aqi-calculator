import fs from 'fs';
import path from 'path';
import { INDIAN_CITIES } from '../utils/constants.js';

const BASE_URL = 'https://indianaqichecker.netlify.app';

async function generateSitemap() {
  const pages = [
    '',  // homepage
    ...INDIAN_CITIES.map(city => `/city/${city.value.toLowerCase()}`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages.map(page => `
        <url>
          <loc>${BASE_URL}${page}</loc>
          <changefreq>hourly</changefreq>
          <priority>${page === '' ? '1.0' : '0.8'}</priority>
        </url>
      `).join('')}
    </urlset>`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
}

generateSitemap();