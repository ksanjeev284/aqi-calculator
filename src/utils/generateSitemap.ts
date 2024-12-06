import { INDIAN_CITIES } from '../utils/constants';

export const generateSitemap = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://indianaqichecker.netlify.app';
  const lastMod = new Date().toISOString();

  const citiesXml = INDIAN_CITIES.map(city => `
    <url>
      <loc>${baseUrl}/city/${city.value.toLowerCase()}</loc>
      <lastmod>${lastMod}</lastmod>
      <changefreq>hourly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>1.0</priority>
      </url>
      ${citiesXml}
    </urlset>`;
}; 