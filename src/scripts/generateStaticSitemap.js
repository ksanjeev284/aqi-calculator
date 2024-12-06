// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

const BASE_URL = 'https://indianaqichecker.netlify.app';

const INDIAN_CITIES = [
  { label: 'Delhi', value: 'Delhi' },
  { label: 'Mumbai', value: 'Mumbai' },
  { label: 'Bangalore', value: 'Bengaluru' },
  { label: 'Chennai', value: 'Chennai' },
  { label: 'Kolkata', value: 'Kolkata' },
  { label: 'Hyderabad', value: 'Hyderabad' },
  { label: 'Pune', value: 'Pune' },
  { label: 'Ahmedabad', value: 'Ahmedabad' },
  { label: 'Lucknow', value: 'Lucknow' },
  { label: 'Jaipur', value: 'Jaipur' },
];

function generateSitemap() {
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

  const publicDir = path.join(projectRoot, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('Generated sitemap.xml');
}

generateSitemap();