const REGISTRATION_STATUSES = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
  FAILED: 'failed'
} as const;

export type RegistrationStatus = typeof REGISTRATION_STATUSES[keyof typeof REGISTRATION_STATUSES];

export class ReqRegisterDto {
  public username!: string;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName?: string;
  public displayName?: string;
  public locale?: string;
  public timezone?: string;

  constructor(partial: Partial<ReqRegisterDto>) {
    Object.assign(this, partial);
  }
}

export type RegisterDto = ReqRegisterDto;

export class ResRegisterDto {
  public sub!: string;
  public email!: string;
  public verification_expires_in!: number;

  constructor(partial: Partial<ResRegisterDto>) {
    Object.assign(this, partial);
  }
}
