import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

process.env.NODE_ENV !== 'production' ? config({ path: '.env' }) : config({ path: '.env.local' }); // or .env.local
config({ path: '.env.local' });
export default {
  schema: './utils/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql', // Add this line
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
