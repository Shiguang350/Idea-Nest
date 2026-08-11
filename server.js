const http = require('http');
const fs = require('fs');
const path = require('path');
const apiHandler = require('./api/generate-image');

const root = __dirname;
const port = Number(process.env.PORT) || 8080;
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
};

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');

  if (url.pathname === '/api/generate-image') {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const rawBody = Buffer.concat(chunks).toString('utf8');
      const headers = {};
      const mockRes = {
        statusCode: 200,
        setHeader(key, value) { headers[key] = value; },
        status(code) { this.statusCode = code; return this; },
        json(data) {
          const payload = JSON.stringify(data);
          res.writeHead(this.statusCode, {
            'Content-Type': 'application/json',
            ...headers,
          });
          res.end(payload);
        },
        end() { res.end(); },
      };
      apiHandler({ method: req.method, body: rawBody }, mockRes);
    });
    return;
  }

  const pathname = decodeURIComponent(url.pathname);
  let filePath = pathname === '/' ? path.join(root, 'index.html') : path.join(root, pathname);
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream',
    });
    res.end(data);
  });
}).listen(port, '127.0.0.1', () => {
  console.log(`灵感收集本地预览: http://127.0.0.1:${port}`);
});
