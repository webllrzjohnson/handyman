import Database from "better-sqlite3";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const dbPath = join(process.cwd(), "local-data.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

try {
  // Create migrations table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS __drizzle_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT NOT NULL,
      created_at INTEGER
    )
  `);

  // Get all migration files
  const migrationsDir = join(process.cwd(), "drizzle");
  const migrationFiles = readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort();

  // Get already applied migrations
  const applied = db.prepare("SELECT hash FROM __drizzle_migrations").all() as { hash: string }[];
  const appliedSet = new Set(applied.map(m => m.hash));

  // Apply new migrations
  for (const file of migrationFiles) {
    const hash = file.replace(".sql", "");
    if (!appliedSet.has(hash)) {
      console.log(`Applying migration: ${file}`);
      const migrationSQL = readFileSync(join(migrationsDir, file), "utf8");
      db.exec(migrationSQL);
      db.prepare("INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)").run(hash, Date.now());
      console.log(`✅ Applied: ${file}`);
    }
  }

  console.log("✅ All migrations completed successfully!");
} catch (error) {
  console.error("❌ Migration failed:", error);
  process.exit(1);
}

db.close();
