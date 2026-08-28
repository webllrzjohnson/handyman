import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { join } from "path";

const dbPath = join(process.cwd(), "local-data.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

try {
  const migrationSQL = readFileSync(join(process.cwd(), "drizzle", "0000_sloppy_spiral.sql"), "utf8");
  db.exec(migrationSQL);
  console.log("✅ Database migrated successfully!");
} catch (error) {
  console.error("❌ Migration failed:", error);
  process.exit(1);
}

db.close();
