import { z } from 'zod';

export const RegisterDeviceSchema = z.object({
  fingerprint: z.string().min(1),
  hardwareId: z.string().min(1),
  userId: z.number(),
});

export type RegisterDeviceInput = z.infer<typeof RegisterDeviceSchema>;

export const RegisterUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).default('User'),
  lastName: z.string().optional(),
  displayName: z.string().optional(),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
export type ReqRegisterDto = RegisterUserInput;

export const AuthenticateSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});

export type AuthenticateInput = z.infer<typeof AuthenticateSchema>;

export const RequestPasswordResetSchema = z.object({
  email: z.string().email(),
});

export type RequestPasswordResetInput = z.infer<typeof RequestPasswordResetSchema>;

export const ConfirmPasswordResetSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
});

export type ConfirmPasswordResetInput = z.infer<typeof ConfirmPasswordResetSchema>;
