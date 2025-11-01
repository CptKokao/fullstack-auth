import { DrizzleService } from '@/drizzle/drizzle.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { eq } from 'drizzle-orm';
import { AuthMethod, users } from 'drizzle/schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  public constructor(private readonly drizzleService: DrizzleService) {}

  private get db() {
    return this.drizzleService.db;
  }

  public async findById(id: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        accounts: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'Пользователь не найден. Пожалуйста, проверьте введенные данные.',
      );
    }

    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        accounts: true,
      },
    });

    return user;
  }

  public async create(
    email: string,
    password: string,
    displayName: string,
    picture: string,
    method: AuthMethod,
    isVerified: boolean,
  ) {
    const hashedPassword = password ? await hash(password) : '';

    const createdUsers = await this.db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        displayName,
        picture,
        method: AuthMethod.CREDENTIALS,
        isVerified,
      })
      .returning();

    const newUser = createdUsers[0];

    if (!newUser) return null; // Ошибка создания

    // 2. Получаем полную сущность с отношениями
    const userWithAccounts = await this.findById(newUser.id);

    return userWithAccounts;
  }

  public async update(userId: string, dto: UpdateUserDto) {
    const existingUser = await this.findById(userId);

    // 1. Выполняем обновление
    const updatedUsers = await this.db
      .update(users)
      .set({
        email: dto.email,
        displayName: dto.name,
        isTwoFactorEnabled: dto.isTwoFactorEnabled,
      })
      .where(eq(users.id, existingUser.id))
      .returning();

    // Обновление возвращает массив с обновленными сущностями
    return updatedUsers[0];
  }
}
