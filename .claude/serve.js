// Saytni ko'rish uchun oddiy mahalliy server: node .claude/serve.js
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const port = 8080;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath.endsWith("/")) urlPath += "index.html";
  const file = path.join(root, urlPath);

  // Loyiha papkasidan tashqaridagi va yashirin fayllar berilmaydi
  if (!file.startsWith(root + path.sep) || /(^|[\\/])\./.test(path.relative(root, file))) {
    res.writeHead(403); return res.end();
  }

  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Topilmadi"); }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, () => console.log(`http://localhost:${port}`));
