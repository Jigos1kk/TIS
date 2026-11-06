import crypto from "node:crypto";
import { userRepository, UserRepository } from "../database/repository/user.repository.js";
import { ReqRegisterDto, ResRegisterDto, RegistrationStatus } from "./dto/register.dto.js";
import { ServiceResult } from "../interfaces/system.interface.js";
import { hashPassword } from "../common/utils/password.util.js";
import { ConflictError } from "../common/errors/app-error.js";

export class UserService {
  constructor(private userRepo: UserRepository = userRepository) {}

  async register(data: ReqRegisterDto): Promise<ServiceResult<RegistrationStatus, ResRegisterDto>> {
    const emailNormalize = data.email.trim().toLowerCase();
    const usernameNormalize = data.username.trim().toLowerCase();

    const existingUser = await this.userRepo.findByEmailOrUsername(emailNormalize, usernameNormalize);
    if (existingUser) {
      const fieldErrors: Record<string, string[]> = {};
      if (existingUser.emailNormalize === emailNormalize) {
        fieldErrors.email = ["Email is already in use"];
      }
      if (existingUser.usernameNormalize === usernameNormalize) {
        fieldErrors.username = ["Username is already in use"];
      }

      throw new ConflictError(
        existingUser.emailNormalize === emailNormalize && existingUser.usernameNormalize === usernameNormalize
          ? "Email and username are already taken"
          : existingUser.emailNormalize === emailNormalize
            ? "Email is already taken"
            : "Username is already taken"
      );
    }

    const { hash, salt } = await hashPassword(data.password);
    const sub = crypto.randomUUID();

    const user = await this.userRepo.createUser({
      sub,
      username: data.username,
      usernameNormalize,
      email: data.email,
      emailNormalize,
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.displayName || `${data.firstName}${data.lastName ? ` ${data.lastName}` : ""}`.trim(),
      locale: data.locale || "ru",
      timezone: data.timezone || "Europe/Moscow",
      passwordHash: hash,
      salt,
      isActive: true,
      isEmailVerified: false,
    });

    return {
      status: "pending",
      data: new ResRegisterDto({
        sub: user.sub,
        email: user.email,
        verification_expires_in: 3600,
      }),
    };
  }
}

export const userService = new UserService();
