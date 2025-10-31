// src/drizzle/schema.ts

import { pgTable, text, timestamp, serial, uuid, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// --------------------------------------------------------------------------------
// 1. Определение ENUM'ов
// В Drizzle ENUM'ы объявляются с помощью pgEnum
// --------------------------------------------------------------------------------

export const userRoleEnum = pgEnum('user_role', ['REGULAR', 'ADMIN']);
export const authMethodEnum = pgEnum('auth_method', ['CREDENTIALS', 'GOOGLE', 'YANDEX']);
export const tokenTypeEnum = pgEnum('token_type', ['VERIFICATION', 'TWO_FACTOR', 'PASSWORD_RESET']);

// --------------------------------------------------------------------------------
// 2. Определение таблиц
// --------------------------------------------------------------------------------

// Соответствует модели User
export const users = pgTable('users', {
    // id String @id @default(uuid())
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),

    // email String @unique
    email: text('email').notNull().unique(),
    
    // password String
    password: text('password').notNull(),

    // displayName String
    displayName: text('display_name').notNull(),
    
    // picture String?
    picture: text('picture'),

    // role UserRole @default(REGULAR)
    role: userRoleEnum('role').default('REGULAR').notNull(),

    // isVerified Boolean @default(false) @map("is_verified")
    isVerified: boolean('is_verified').default(false).notNull(),
    
    // isTwoFactorEnabled Boolean @default(false) @map("is_two_factor_enabled")
    isTwoFactorEnabled: boolean('is_two_factor_enabled').default(false).notNull(),

    // method AuthMethod
    method: authMethodEnum('method').notNull(),

    // createdAt DateTime @default(now()) @map("created_at")
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    
    // updatedAt DateTime @updatedAt @map("updated_at")
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(), // Drizzle не имеет встроенного @updatedAt, используем триггеры БД или обновляем вручную/в сервисе
}, (table) => {
    // Дополнительные индексы или ограничения, если нужны
    return {
        // Пример индекса
        // emailIndex: index("email_idx").on(table.email),
    }
});


// Соответствует модели Account
export const accounts = pgTable('accounts', {
    // id String @id @default(uuid())
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),

    // type String
    type: text('type').notNull(),
    
    // provider String
    provider: text('provider').notNull(),
    
    // refreshToken String? @map("refresh_token")
    refreshToken: text('refresh_token'),
    
    // accessToken String? @map("access_token")
    accessToken: text('access_token'),
    
    // expiresAt Int @map("expires_at")
    expiresAt: integer('expires_at'), // PostgreSQL использует integer для небольших целых чисел

    // userId String? @map("user_id")
    userId: uuid('user_id'),

    // createdAt DateTime @default(now()) @map("created_at")
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    
    // updatedAt DateTime @updatedAt @map("updated_at")
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Соответствует модели Token
export const tokens = pgTable('tokens', {
    // id String @id @default(uuid())
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),

    // email String
    email: text('email').notNull(),
    
    // token String @unique
    token: text('token').notNull().unique(),
    
    // type TokenType
    type: tokenTypeEnum('type').notNull(),
    
    // expiresIn DateTime @map("expires_in")
    expiresIn: timestamp('expires_in', { withTimezone: true }).notNull(),

    // createdAt DateTime @default(now()) @map("created_at")
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});


// --------------------------------------------------------------------------------
// 3. Определение отношений (Relations)
// --------------------------------------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
    // accounts Account[]
    accounts: many(accounts),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    // user User? @relation(fields: [userId], references: [id])
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

// Экспорт всех схем для инициализации Drizzle-клиента
// export * from './schema';