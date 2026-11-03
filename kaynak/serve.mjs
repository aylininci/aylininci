import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const S = path.resolve('../site');
const T = {'.html':'text/html; charset=utf-8','.png':'image/png','.webp':'image/webp','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.pdf':'application/pdf','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.woff2':'font/woff2','.mjs':'text/javascript','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]); if(p.endsWith('/')) p+='index.html'; let f=path.join(S,p);
 let g=f; if(!fs.existsSync(g)&&fs.existsSync(f+'.html')) g=f+'.html'; f=g; if(!fs.existsSync(f)){r.writeHead(404);return r.end('404');} r.writeHead(200,{'content-type':T[path.extname(f)]||'application/octet-stream'}); fs.createReadStream(f).pipe(r);}).listen(8765);
