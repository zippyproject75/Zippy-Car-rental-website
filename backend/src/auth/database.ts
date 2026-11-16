import postgres, { type Sql } from "postgres";

let client: Sql | undefined;

export function getDatabase(): Sql {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL must be configured before using authentication.");
  }

  client ??= postgres(connectionString, {
    max: Number(process.env.DATABASE_POOL_SIZE ?? 5),
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
    ssl: process.env.NODE_ENV === "production" ? "require" : undefined,
  });

  return client;
}
