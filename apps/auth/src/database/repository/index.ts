import { AppDataSource } from '../index.js';
import { User } from '../entity/User.entity.js';
import { Device } from '../entity/device.entity.js';
import { EmailConfirmToken } from '../entity/email-confirm-token.entity.js';
import { PasswordResetToken } from '../entity/password-reset-token.entity.js';
import { UserRepository } from './user.repository.js';
import { DeviceRepository } from './device.repository.js';
import { EmailTokenRepository } from './email-token.repository.js';
import { PasswordResetRepository } from './password-reset.repository.js';

export * from './base.repository.js';
export * from './user.repository.js';
export * from './device.repository.js';
export * from './email-token.repository.js';
export * from './password-reset.repository.js';

// Factory to access repositories bound to AppDataSource
export const userRepository = new UserRepository(AppDataSource.getRepository(User));
export const deviceRepository = new DeviceRepository(AppDataSource.getRepository(Device));
export const emailTokenRepository = new EmailTokenRepository(AppDataSource.getRepository(EmailConfirmToken));
export const passwordResetRepository = new PasswordResetRepository(AppDataSource.getRepository(PasswordResetToken));
