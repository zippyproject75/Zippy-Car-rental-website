import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run migrations.");
}

const directory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../migrations");
const files = (await readdir(directory)).filter((file) => file.endsWith(".sql")).sort();
const sql = postgres(connectionString, {
  max: 1,
  connect_timeout: 10,
  prepare: false,
  ssl: process.env.NODE_ENV === "production" ? "require" : undefined,
});

function splitStatements(source) {
  const statements = [];
  let start = 0;
  let quote = null;
  let dollarTag = null;
  let lineComment = false;
  let blockComment = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (dollarTag) {
      if (source.startsWith(dollarTag, index)) {
        index += dollarTag.length - 1;
        dollarTag = null;
      }
      continue;
    }
    if (quote) {
      if (char === quote && next === quote) {
        index += 1;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === "-" && next === "-") {
      lineComment = true;
      index += 1;
    } else if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
    } else if (char === "'" || char === '"') {
      quote = char;
    } else if (char === "$") {
      const match = source.slice(index).match(/^\$[A-Za-z_][A-Za-z0-9_]*\$|^\$\$/);
      if (match) dollarTag = match[0];
    } else if (char === ";") {
      const statement = source.slice(start, index).trim();
      if (statement) statements.push(statement);
      start = index + 1;
    }
  }

  const remainder = source.slice(start).trim();
  if (remainder) statements.push(remainder);
  if (quote || dollarTag || blockComment) {
    throw new Error("Migration contains an unterminated SQL quote or comment.");
  }
  return statements;
}

try {
  await sql`CREATE TABLE IF NOT EXISTS schema_migrations (
    name text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`;

  for (const file of files) {
    const [existing] = await sql`SELECT name FROM schema_migrations WHERE name = ${file}`;
    if (existing) {
      console.info(`Already applied: ${file}`);
      continue;
    }

    const migration = await readFile(path.join(directory, file), "utf8");
    await sql.begin(async (transaction) => {
      for (const statement of splitStatements(migration)) {
        await transaction.unsafe(statement);
      }
      await transaction`INSERT INTO schema_migrations (name) VALUES (${file})`;
    });
    console.info(`Applied: ${file}`);
  }
} finally {
  await sql.end();
}
