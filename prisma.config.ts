import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { defineConfig } from "prisma/config";

if (existsSync(".env.local")) {
  loadEnvFile(".env.local");
}

const directUrl = process.env.DIRECT_URL?.trim();
const runtimeUrl = process.env.DATABASE_URL?.trim();
const datasourceUrl = directUrl || runtimeUrl;

if (!datasourceUrl) {
  throw new Error("DIRECT_URL or DATABASE_URL must be set for Prisma CLI commands.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: datasourceUrl,
  },
});
