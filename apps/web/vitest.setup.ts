import { execSync } from "child_process";
import path from "path";

// Use a separate test database so seeds don't stomp the dev DB.
process.env.DATABASE_URL = `file:${path.resolve(import.meta.dirname, "prisma/test.db")}`;

// Ensure test DB schema is up to date before the suite runs.
execSync("pnpm prisma migrate deploy", {
  cwd: import.meta.dirname,
  stdio: "inherit",
  env: { ...process.env },
});
