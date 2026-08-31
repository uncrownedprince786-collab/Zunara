import {
  neon,
  type HTTPQueryOptions,
  type NeonQueryFunction,
} from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb() {
  const run = neon(process.env.DATABASE_URL!);
  const client = (query: string, params: unknown[], config?: HTTPQueryOptions<boolean, boolean>) =>
    run.query(query, params, config);
  return drizzle(client as unknown as NeonQueryFunction<boolean, boolean>, { schema });
}

type Database = ReturnType<typeof createDb>;

let db: Database | null = null;

export function getDb(): Database | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  if (!db) {
    db = createDb();
  }
  return db;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
