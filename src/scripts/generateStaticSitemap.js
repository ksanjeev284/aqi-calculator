// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

const BASE_URL = 'https://aqi-calculator.netlify.app';
const PUBLIC_DIR = path.join(projectRoot, 'public');

const INDIAN_CITIES = [
  { value: 'delhi', label: 'Delhi' },
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'bangalore', label: 'Bangalore' },
  { value: 'chennai', label: 'Chennai' },
  { value: 'kolkata', label: 'Kolkata' },
  { value: 'hyderabad', label: 'Hyderabad' },
  { value: 'pune', label: 'Pune' },
  { value: 'ahmedabad', label: 'Ahmedabad' },
  { value: 'lucknow', label: 'Lucknow' },
  { value: 'jaipur', label: 'Jaipur' }
];

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>`;

  // Add city pages
  INDIAN_CITIES.forEach(city => {
    sitemap += `
  <url>
    <loc>${BASE_URL}/city/${city.value}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  sitemap += '\n</urlset>';


  // Ensure public directory exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // Write sitemap
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap();