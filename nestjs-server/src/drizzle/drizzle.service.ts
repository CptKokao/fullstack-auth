// src/drizzle/drizzle.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema'; // Импортируйте все ваши схемы

// Определяем тип вашего Drizzle-клиента для удобства
export type DB = NodePgDatabase<typeof schema>;

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  // Делаем db публичным, чтобы его можно было инжектировать и использовать
  public db: DB;
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {}
  public async onModuleInit(): Promise<void> {
    // 1. Получаем строку подключения
    const connectionString =
      this.configService.getOrThrow<string>('POSTGRES_URI');

    if (!connectionString) {
      throw new Error('POSTGRES_URI not found in environment variables.');
    }

    // 2. Создаем пул подключений pg
    this.pool = new Pool({
      connectionString,
    });

    // Опционально: Проверка соединения
    // try {
    //   await this.pool.query('SELECT 1');
    //   console.log('PostgreSQL Pool connected successfully.');
    // } catch (e) {
    //   console.error('Failed to connect to PostgreSQL Pool:', e);
    //   throw e;
    // }

    // 3. Создаем Drizzle-клиент с привязкой к схеме
    this.db = drizzle(this.pool, { schema: schema, logger: true }) as DB;
  }

  public async onModuleDestroy(): Promise<void> {
    // 4. Закрываем пул подключений при завершении работы NestJS
    if (this.pool) {
      await this.pool.end();
      console.log('PostgreSQL Pool disconnected.');
    }
  }
}
