import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);

export default {
  schema: './utils/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
