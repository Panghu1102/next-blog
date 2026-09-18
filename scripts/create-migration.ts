import { getPayload } from "payload";
import configPromise from "../payload.config.migration";

async function run() {
  const args = process.argv.slice(2);
  let nameArg = "init_schema";

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--name=")) {
      nameArg = args[i].split("=")[1];
    } else if (args[i] === "--name" && args[i + 1]) {
      nameArg = args[i + 1];
    } else if (!args[i].startsWith("-") && i === 0) {
      nameArg = args[i];
    }
  }

  const config = await configPromise;
  const payload = await getPayload({ config, disableDBConnect: true });

  if (!payload.db.createMigration) {
    throw new Error("Database adapter does not support createMigration.");
  }

  await payload.db.createMigration({
    file: "",
    migrationName: nameArg,
    payload,
  });

  console.log("Migration created successfully!");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration generation failed:", err);
  process.exit(1);
});
