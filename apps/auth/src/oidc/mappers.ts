import { User } from '../database/entity/User.entity.js';
import { AccountClaims } from 'oidc-provider';

// Transforms internal user model to standard OIDC claims
export function mapUserToOidcClaims(user: User, scope?: string): AccountClaims {
  const result: AccountClaims = {
    sub: user.sub,
  };

  const scopes = scope ? scope.split(' ') : [];

  if (scopes.includes('profile')) {
    result.name = user.displayName || `${user.firstName} ${user.lastName || ''}`.trim();
    result.given_name = user.firstName;
    result.family_name = user.lastName;
    result.preferred_username = user.username;
    result.locale = user.locale;
    result.zoneinfo = user.timezone;
  }

  if (scopes.includes('email')) {
    result.email = user.email;
    result.email_verified = user.isEmailVerified;
  }

  return result;
}

// Maps internal grant structure to oidc-provider format
export function mapGrantToOidcPayload(grantId: string, clientId: string, accountId: string, scope: string) {
  return {
    jti: grantId,
    clientId,
    accountId,
    scope,
    kind: 'Grant',
  };
}

// Maps raw oidc-provider payload to structured grant data
export function mapOidcPayloadToGrant(payload: Record<string, unknown>) {
  return {
    grantId: String(payload.jti || ''),
    clientId: String(payload.clientId || ''),
    accountId: String(payload.accountId || ''),
    scope: String(payload.scope || ''),
  };
}
