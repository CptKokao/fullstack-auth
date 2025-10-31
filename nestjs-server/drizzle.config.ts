
import { defineConfig } from 'drizzle-kit';


export default defineConfig({
  dialect: 'postgresql', // или 'mysql', 'sqlite'
  schema: './drizzle/schema.ts',
  out: './drizzle/__generate__', 
  dbCredentials: {
    url: process.env.POSTGRES_URI,
  },
});