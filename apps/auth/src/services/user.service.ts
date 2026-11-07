import { userRepository, UserRepository } from "../database/repository/user.repository.js";
import { ReqRegisterDto, ResRegisterDto, RegistrationStatus } from "./dto/register.dto.js";
import { ServiceResult } from "../interfaces/system.interface.js";

export class UserService {
  constructor(private userRepo: UserRepository = userRepository) {}

  async register(data: ReqRegisterDto): Promise<ServiceResult<RegistrationStatus, ResRegisterDto>> {
    const user = await this.userRepo.createUser({
      sub: data.sub,
      username: data.username,
      usernameNormalize: data.usernameNormalize,
      email: data.email,
      emailNormalize: data.emailNormalize,
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.displayName,
      locale: data.locale,
      timezone: data.timezone,
      passwordHash: data.passwordHash,
      salt: data.salt,
      isActive: data.isActive,
      isEmailVerified: data.isEmailVerified,
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
