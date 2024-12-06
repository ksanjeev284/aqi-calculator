import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://indianaqichecker.netlify.app';

async function generateRobots() {
  const robots = `User-agent: *
Allow: /
Allow: /city/
Disallow: /api/

Sitemap: ${BASE_URL}/sitemap.xml`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
}

generateRobots(); 