import { existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const serverFunctionRoot = join(
  projectRoot,
  ".open-next",
  "server-functions",
  "default",
);

// Wrangler's module collector can receive an absolute WASM import from the
// OpenNext server bundle. In this build it resolves that import relative to
// the server-function directory, producing a duplicated absolute path.
// Mirror Next's compiled @vercel/og WASM files at that exact path.
const wasmFiles = ["yoga.wasm", "resvg.wasm"];

for (const file of wasmFiles) {
  const source = join(
    projectRoot,
    "node_modules",
    "next",
    "dist",
    "compiled",
    "@vercel",
    "og",
    file,
  );

  if (!existsSync(source)) {
    console.log(`[open-next-wasm] ${file} is not present in Next; skipping.`);
    continue;
  }

  const target = join(
    serverFunctionRoot,
    "opt",
    "buildhome",
    "repo",
    ".open-next",
    "server-functions",
    "default",
    "node_modules",
    "next",
    "dist",
    "compiled",
    "@vercel",
    "og",
    file,
  );

  mkdirSync(join(target, ".."), { recursive: true });
  copyFileSync(source, target);
  console.log(`[open-next-wasm] Mirrored ${file} for Wrangler.`);
}
