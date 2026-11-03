// Lighthouse on the release build: node lh.mjs / /blog/ ...
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const urls = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];
for (const u of urls) {
  fs.rmSync('lh.json', { force: true });
  try {
    execFileSync(process.execPath, ['node_modules/lighthouse/cli/index.js', 'http://localhost:8765' + u, '--quiet', '--chrome-flags=--headless=new', '--only-categories=performance,accessibility,best-practices,seo', '--output=json', '--output-path=lh.json'], { env: { ...process.env, CHROME_PATH: 'C:/Program Files/Google/Chrome/Application/chrome.exe' }, stdio: 'ignore' });
  } catch (e) { /* lighthouse may exit non-zero on Windows temp cleanup */ }
  const r = JSON.parse(fs.readFileSync('lh.json', 'utf8')), a = r.audits;
  console.log(u.padEnd(30), Object.values(r.categories).map((x) => x.title.split(' ')[0] + ' ' + Math.round(x.score * 100)).join(' | '), '| LCP', a['largest-contentful-paint'].displayValue, '| TBT', a['total-blocking-time'].displayValue, '| CLS', a['cumulative-layout-shift'].displayValue);
}
process.exit(0);

