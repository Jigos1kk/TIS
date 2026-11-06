import { BaseRepository } from "./base.repository.js"; // Путь к вашему базовому репозиторию
import { User } from "../entity/User.entity.js";

export interface UserData {
  sub: string;
  username: string;
  usernameNormalize: string;
  email: string;
  emailNormalize: string;
  firstName: string;
  lastName?: string;
  displayName: string;
  locale?: string;
  timezone?: string;
  passwordHash: string;
  salt: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

export class UserRepository extends BaseRepository<User> {
  constructor() {
    // Передаем класс сущности в базовый конструктор
    super(User); 
  }

  // --- Специфичные методы для User ---

  async findBySub(sub: string): Promise<User | null> {
    // Используем базовый метод findOneBy
    return this.findOneBy({ sub });
  }

  async findByEmailNormalize(emailNormalize: string): Promise<User | null> {
    return this.findOneBy({ emailNormalize });
  }

  async findByUsernameNormalize(usernameNormalize: string): Promise<User | null> {
    return this.findOneBy({ usernameNormalize });
  }

  async findByEmailOrUsername(emailNormalize: string, usernameNormalize: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder("user")
      .where("user.emailNormalize = :emailNormalize", { emailNormalize })
      .orWhere("user.usernameNormalize = :usernameNormalize", { usernameNormalize })
      .getOne();
  }

  async createUser(userData: UserData): Promise<User> {
    return this.create(userData as any); 
  }
}

export const userRepository = new UserRepository();