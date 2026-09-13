import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const payloadLoadEnv = join(
  projectRoot,
  "node_modules",
  "payload",
  "dist",
  "bin",
  "loadEnv.js",
);

if (!existsSync(payloadLoadEnv)) {
  console.log("[postinstall] Payload loadEnv.js not found; skipping patch.");
  process.exit(0);
}

const source = readFileSync(payloadLoadEnv, "utf8");
const broken = "import nextEnvImport from '@next/env';\nimport { findUpSync } from '../utilities/findUp.js';\nconst { loadEnvConfig } = nextEnvImport;";
const fixed = "import * as nextEnvImport from '@next/env';\nimport { findUpSync } from '../utilities/findUp.js';\nconst { loadEnvConfig } = nextEnvImport.default ?? nextEnvImport;";

if (source.includes(fixed)) {
  console.log("[postinstall] Payload loadEnv.js is already patched.");
  process.exit(0);
}

if (!source.includes(broken)) {
  console.log("[postinstall] Payload loadEnv.js does not match the known broken import; leaving it unchanged.");
  process.exit(0);
}

writeFileSync(payloadLoadEnv, source.replace(broken, fixed));
console.log("[postinstall] Patched Payload loadEnv.js for @next/env ESM/CJS interop.");
