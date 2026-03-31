/**
 * @file lib/db/index.ts
 * @description Drizzle ORM client — singleton instance.
 * Uses Neon serverless driver for edge-compatible PostgreSQL.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
