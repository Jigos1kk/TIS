import type { RegisterInput, RegisterOutput } from "../../validator/user.validator.js";

const REGISTRATION_STATUSES = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
  FAILED: 'failed'
} as const;

export type RegistrationStatus = typeof REGISTRATION_STATUSES[keyof typeof REGISTRATION_STATUSES];

export type ReqRegisterDto = RegisterOutput;
export type RegisterInputDto = RegisterInput;
export type RegisterDto = ReqRegisterDto;

export class ResRegisterDto {
  public sub!: string;
  public email!: string;
  public verification_expires_in!: number;

  constructor(partial: Partial<ResRegisterDto>) {
    Object.assign(this, partial);
  }
}
