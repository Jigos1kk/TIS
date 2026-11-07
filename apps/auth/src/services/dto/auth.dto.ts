import { z } from 'zod';

// Validates payload when registering a device fingerprint
export const RegisterDeviceDto = z.object({
  fingerprint: z.string().min(1),
  hardwareId: z.string().min(1),
  userId: z.number().int().positive(),
});

export type RegisterDeviceDtoType = z.infer<typeof RegisterDeviceDto>;

// Validates user registration fields
export const RegisterUserDto = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).default('User'),
  lastName: z.string().optional(),
  displayName: z.string().optional(),
});

export type RegisterUserDtoType = z.infer<typeof RegisterUserDto>;

// Validates user credentials on login
export const LoginDto = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});

export type LoginDtoType = z.infer<typeof LoginDto>;

// Validates email verification token
export const ConfirmEmailDto = z.object({
  token: z.string().min(1),
});

export type ConfirmEmailDtoType = z.infer<typeof ConfirmEmailDto>;

// Validates password reset request body
export const RequestPasswordResetDto = z.object({
  email: z.string().email(),
});

export type RequestPasswordResetDtoType = z.infer<typeof RequestPasswordResetDto>;

// Validates new password submission with reset token
export const ConfirmPasswordResetDto = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
});

export type ConfirmPasswordResetDtoType = z.infer<typeof ConfirmPasswordResetDto>;
