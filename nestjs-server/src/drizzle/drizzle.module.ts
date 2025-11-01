import { Global, Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';

@Global() // Делаем его глобальным, если хотим использовать по всему приложению без повторного импорта
@Module({
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {}
