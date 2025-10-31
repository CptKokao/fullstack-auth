// src/drizzle/drizzle.provider.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';

export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';

export const drizzleProvider = [
  {
    provide: DRIZZLE_PROVIDER,
    useFactory: (configService: ConfigService) => {
      const connectionString = configService.getOrThrow<string>('POSTGRES_URI');
      console.log(connectionString)
      const pool = new Pool({
        connectionString,
      });
      return drizzle(pool, { schema }); 
    },
    inject: [ConfigService],
  },
];


// Экспортируйте тип:
// export type DrizzleType = Awaited<ReturnType<typeof drizzleProvider[0]['useFactory']>>;