import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Schema operations should use the direct Supabase connection instead of the pooler.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
