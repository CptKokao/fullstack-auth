import { Module, Global } from '@nestjs/common';
import { drizzleProvider, DRIZZLE_PROVIDER } from './drizzle.provider';
import * as schema from './schema';

@Global() // Делаем его глобальным, если хотим использовать по всему приложению без повторного импорта
@Module({
  providers: [...drizzleProvider],
  exports: [DRIZZLE_PROVIDER],
})
export class DrizzleModule {}