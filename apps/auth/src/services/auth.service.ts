import crypto from 'node:crypto';
import { UserRepository } from '../database/repository/user.repository.js';
import { EmailTokenRepository } from '../database/repository/email-token.repository.js';
import { PasswordResetRepository } from '../database/repository/password-reset.repository.js';
import { IEmailService } from './email.interface.js';
import {
  RegisterUserDto,
  RegisterUserDtoType,
  LoginDto,
  LoginDtoType,
  ConfirmEmailDto,
  ConfirmEmailDtoType,
  RequestPasswordResetDto,
  RequestPasswordResetDtoType,
  ConfirmPasswordResetDto,
  ConfirmPasswordResetDtoType,
} from './dto/auth.dto.js';
import { User } from '../database/entity/User.entity.js';
import { AppError } from '../common/errors/app-error.js';
import { hashPassword, verifyPassword } from '../common/utils/password.util.js';

// Handles core user authentication, registration and account lifecycle
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private emailTokenRepo: EmailTokenRepository,
    private passwordResetRepo: PasswordResetRepository,
    private emailService: IEmailService
  ) {}

  async register(
    dto: RegisterUserDtoType,
    config: { requireEmailConfirmation: boolean }
  ): Promise<User> {
    const validated = RegisterUserDto.parse(dto);

    const existingUser = await this.userRepo.findByEmail(validated.email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const { hash, salt } = await hashPassword(validated.password);
    const sub = crypto.randomUUID();

    const user = await this.userRepo.save({
      sub,
      username: validated.username,
      usernameNormalize: validated.username.toLowerCase(),
      email: validated.email,
      emailNormalize: validated.email.toLowerCase(),
      firstName: validated.firstName,
      lastName: validated.lastName,
      displayName: validated.displayName || validated.username,
      passwordHash: hash,
      salt,
      isEmailVerified: !config.requireEmailConfirmation,
      isActive: true,
    });

    if (config.requireEmailConfirmation) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await this.emailTokenRepo.save({
        token,
        expiresAt,
        user,
      });

      await this.emailService.sendVerificationEmail(user.email, token);
    }

    return user;
  }

  async login(dto: LoginDtoType): Promise<{ sub: string; user: User }> {
    const validated = LoginDto.parse(dto);

    let user = await this.userRepo.findByEmail(validated.login);
    if (!user) {
      user = await this.userRepo.findOne({ where: { username: validated.login } });
    }

    if (!user || !user.passwordHash || !user.salt) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('User account is deactivated', 403);
    }

    const isValid = await verifyPassword(validated.password, user.passwordHash, user.salt);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    return {
      sub: user.sub,
      user,
    };
  }

  async confirmEmail(dto: ConfirmEmailDtoType): Promise<void> {
    const validated = ConfirmEmailDto.parse(dto);

    const tokenRecord = await this.emailTokenRepo.findOne({
      where: { token: validated.token },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    await this.userRepo.save({
      id: tokenRecord.user.id,
      isEmailVerified: true,
    });

    await this.emailTokenRepo.softDelete(tokenRecord.id);
  }

  async requestPasswordReset(dto: RequestPasswordResetDtoType): Promise<void> {
    const validated = RequestPasswordResetDto.parse(dto);

    const user = await this.userRepo.findByEmail(validated.email);
    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.passwordResetRepo.save({
      token,
      expiresAt,
      user,
    });

    await this.emailService.sendPasswordResetEmail(user.email, token);
  }

  async confirmPasswordReset(dto: ConfirmPasswordResetDtoType): Promise<void> {
    const validated = ConfirmPasswordResetDto.parse(dto);

    const resetRecord = await this.passwordResetRepo.findOne({
      where: { token: validated.token },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const { hash, salt } = await hashPassword(validated.newPassword);
    await this.userRepo.save({
      id: resetRecord.user.id,
      passwordHash: hash,
      salt,
    });

    await this.passwordResetRepo.softDelete(resetRecord.id);
  }
}
