import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve("out");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

await stat(resolve(root, "index.html")).catch(() => {
  throw new Error("Static export missing. Run npm run build before npm run test:e2e.");
});

createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405).end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1:4322").pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }
  const requested = resolve(root, `.${pathname}`);
  if (requested !== root && !requested.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end();
    return;
  }

  let file = resolve(root, "404.html");
  let code = 404;
  for (const candidate of [requested, `${requested}.html`, resolve(requested, "index.html")]) {
    const info = await stat(candidate).catch(() => null);
    if (info?.isFile()) {
      file = candidate;
      code = 200;
      break;
    }
  }

  try {
    const body = await readFile(file);
    response.writeHead(code, {
      "Content-Type": types[extname(file)] ?? "application/octet-stream",
      "Content-Length": body.length,
      "Cache-Control": "no-store",
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(500).end("Cannot read the static export.");
  }
}).listen(4322, "127.0.0.1", () => {
  console.log("Almost Lore static export: http://127.0.0.1:4322");
});
