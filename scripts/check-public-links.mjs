import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, normalize, relative, resolve } from "node:path";

const root = resolve(process.argv[2] || ".vercel/output/static");
const pagesBase = "/Valkyrie-Aero/";

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function localTarget(documentPath, raw) {
  const clean = raw.split(/[?#]/, 1)[0];
  if (!clean || /^(?:https?:|mailto:|tel:|data:|#)/i.test(raw)) return null;
  if (clean.startsWith(pagesBase)) return join(root, clean.slice(pagesBase.length));
  if (clean.startsWith("/")) return null;
  return normalize(join(dirname(documentPath), clean));
}

const htmlFiles = walk(root).filter((file) => file.endsWith(".html"));
const failures = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    const target = localTarget(file, match[1]);
    if (!target) continue;
    const candidates = [target, join(target, "index.html")];
    if (!candidates.some((candidate) => existsSync(candidate) && statSync(candidate).isFile())) {
      failures.push(`${relative(root, file)} -> ${match[1]}`);
    }
  }
}

if (failures.length) {
  console.error(`Broken public links:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML files: all local links and assets resolve.`);
