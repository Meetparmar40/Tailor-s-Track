import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config(); 
console.log(process.env.PGUSER)

const { PGUSER, PGPASSWORD, PGHOST, PGDATABASE } = process.env;

if (!PGUSER || !PGPASSWORD || !PGHOST || !PGDATABASE) {
  throw new Error("Missing PostgreSQL environment variables.");
}

export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);
