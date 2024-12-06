// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

const BASE_URL = 'https://indianaqichecker.netlify.app';

function generateRobots() {
  const robots = `User-agent: *
Allow: /
Allow: /city/
Disallow: /api/

Sitemap: ${BASE_URL}/sitemap.xml`;

  const publicDir = path.join(projectRoot, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
}

generateRobots();