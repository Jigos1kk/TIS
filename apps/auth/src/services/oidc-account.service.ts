import { UserRepository } from '../database/repository/user.repository.js';
import { Account, AccountClaims } from 'oidc-provider';

// Resolves user identity and claims for oidc-provider
export class OidcAccountService {
  constructor(private userRepo: UserRepository) {}

  async getAccount(userId: string): Promise<Account | undefined> {
    let user = await this.userRepo.findOne({ where: { sub: userId } });
    if (!user && !Number.isNaN(Number(userId))) {
      user = await this.userRepo.findOne({ where: { id: Number(userId) } });
    }

    if (!user || !user.isActive) {
      return undefined;
    }

    return {
      accountId: user.sub,
      async claims(_use, scope) {
        const result: AccountClaims = {
          sub: user!.sub,
        };

        const scopes = scope ? scope.split(' ') : [];

        if (scopes.includes('profile')) {
          result.name = user!.displayName || `${user!.firstName} ${user!.lastName || ''}`.trim();
          result.given_name = user!.firstName;
          result.family_name = user!.lastName;
          result.preferred_username = user!.username;
          result.locale = user!.locale;
          result.zoneinfo = user!.timezone;
        }

        if (scopes.includes('email')) {
          result.email = user!.email;
          result.email_verified = user!.isEmailVerified;
        }

        return result;
      },
    };
  }
}
