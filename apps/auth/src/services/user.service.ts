import crypto from 'node:crypto';
import { UserRepository } from '../database/repository/user.repository';
import { DeviceRepository } from '../database/repository/device.repository';
import { EmailTokenRepository } from '../database/repository/email-token.repository';
import { PasswordResetRepository } from '../database/repository/password-reset.repository';
import { IEmailService } from './email.interface';
import {
  RegisterUserSchema,
  RegisterDeviceSchema,
  AuthenticateSchema,
  RequestPasswordResetSchema,
  ConfirmPasswordResetSchema,
} from './dto/register.dto';
import { AppError } from '../common/errors/app-error';
import { hashPassword, verifyPassword } from '../common/utils/password.util';
import { User } from '../database/entity/User.entity';
import { Device } from '../database/entity/device.entity';

// Registers user hardware or browser fingerprint
export class RegisterDeviceUseCase {
  constructor(
    private deviceRepo: DeviceRepository,
    private userRepo: UserRepository
  ) {}

  async execute(data: unknown): Promise<Device> {
    const input = RegisterDeviceSchema.parse(data);
    const user = await this.userRepo.findOne({ where: { id: input.userId } });
    if (!user) throw new AppError('User not found', 404);

    return this.deviceRepo.save({
      fingerprint: input.fingerprint,
      hardwareId: input.hardwareId,
      user,
    });
  }
}

// Handles user account registration and optional email verification
export class RegisterUserUseCase {
  constructor(
    private userRepo: UserRepository,
    private emailTokenRepo: EmailTokenRepository,
    private emailService: IEmailService,
    private requireEmailConfirmation: boolean
  ) {}

  async execute(data: unknown): Promise<User> {
    const input = RegisterUserSchema.parse(data);

    const existingUser = await this.userRepo.findByEmail(input.email);
    if (existingUser) throw new AppError('User with this email already exists', 400);

    const { hash, salt } = await hashPassword(input.password);
    const sub = crypto.randomUUID();

    const user = await this.userRepo.save({
      sub,
      username: input.username,
      usernameNormalize: input.username.toLowerCase(),
      email: input.email,
      emailNormalize: input.email.toLowerCase(),
      firstName: input.firstName,
      lastName: input.lastName,
      displayName: input.displayName || input.username,
      passwordHash: hash,
      salt,
      isEmailVerified: !this.requireEmailConfirmation,
      isActive: true,
    });

    if (this.requireEmailConfirmation) {
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
}

// Validates credentials and returns authenticated user
export class AuthenticateUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(data: unknown): Promise<User> {
    const input = AuthenticateSchema.parse(data);

    let user = await this.userRepo.findByEmail(input.login);
    if (!user) {
      user = await this.userRepo.findOne({ where: { username: input.login } });
    }

    if (!user || !user.passwordHash || !user.salt) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('User is disabled', 403);
    }

    const isValid = await verifyPassword(input.password, user.passwordHash, user.salt);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    return user;
  }
}

// Generates token and sends reset instructions via email
export class RequestPasswordResetUseCase {
  constructor(
    private userRepo: UserRepository,
    private resetRepo: PasswordResetRepository,
    private emailService: IEmailService
  ) {}

  async execute(data: unknown): Promise<void> {
    const input = RequestPasswordResetSchema.parse(data);
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.resetRepo.save({
      token,
      expiresAt,
      user,
    });

    await this.emailService.sendPasswordResetEmail(user.email, token);
  }
}

// Updates password if reset token is valid and unexpired
export class ConfirmPasswordResetUseCase {
  constructor(
    private resetRepo: PasswordResetRepository,
    private userRepo: UserRepository
  ) {}

  async execute(data: unknown): Promise<void> {
    const input = ConfirmPasswordResetSchema.parse(data);

    const resetToken = await this.resetRepo.findOne({
      where: { token: input.token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new AppError('Invalid or expired token', 400);
    }

    const { hash, salt } = await hashPassword(input.newPassword);
    await this.userRepo.save({
      id: resetToken.user.id,
      passwordHash: hash,
      salt,
    });

    await this.resetRepo.softDelete(resetToken.id);
  }
}

// Adapts use cases to existing UserService pattern
export class UserService {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private registerDeviceUseCase: RegisterDeviceUseCase,
    private authenticateUseCase: AuthenticateUseCase
  ) {}

  async register(data: unknown) {
    const user = await this.registerUserUseCase.execute(data);
    return {
      status: 'success',
      data: {
        id: user.id,
        sub: user.sub,
        email: user.email,
        username: user.username,
      },
    };
  }
}

import { userRepository, emailTokenRepository, deviceRepository } from '../database/repository/index.js';

// Dummy implementation of email service
export const defaultEmailService: IEmailService = {
  async sendVerificationEmail(email: string, token: string) {},
  async sendPasswordResetEmail(email: string, token: string) {},
};

export const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  emailTokenRepository,
  defaultEmailService,
  false
);

export const registerDeviceUseCase = new RegisterDeviceUseCase(
  deviceRepository,
  userRepository
);

export const authenticateUseCase = new AuthenticateUseCase(userRepository);

export const userService = new UserService(
  registerUserUseCase,
  registerDeviceUseCase,
  authenticateUseCase
);
