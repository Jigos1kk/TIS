import Provider, { Configuration } from 'oidc-provider';
import fs from 'node:fs';
import path from 'node:path';
import { TypeOrmOidcAdapter } from './typeorm-oidc.adapter.js';
import { OidcAccountService } from '../services/oidc-account.service.js';
import { env } from '../config/env.js';

// Reads and parses JSON secret files safely
function loadJsonSecret<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (e) {
    console.warn(`[OidcProviderFactory] Could not load ${filePath}, using fallback`);
  }
  return fallback;
}

// Configures and instantiates the oidc-provider engine
export class OidcProviderFactory {
  static create(accountService: OidcAccountService): Provider {
    const issuer = `http://localhost:${env.port || 48921}/oidc`;

    const secretsDir = path.resolve(process.cwd(), 'secrets');
    const jwks = loadJsonSecret(path.join(secretsDir, 'jwks.json'), { keys: [] });
    const cookieKeys = loadJsonSecret(path.join(secretsDir, 'cookies.json'), ['default-cookie-secret']);

    const configuration: Configuration = {
      adapter: TypeOrmOidcAdapter,
      jwks,
      cookies: {
        keys: Array.isArray(cookieKeys) ? cookieKeys : [cookieKeys],
      },
      clients: [
        {
          client_id: 'tis-client',
          client_secret: 'tis-secret',
          grant_types: ['authorization_code', 'refresh_token'],
          response_types: ['code'],
          redirect_uris: [
            env.clientOption.url ? `${env.clientOption.url}/callback` : 'http://localhost:3000/callback',
          ],
        },
      ],
      features: {
        devInteractions: { enabled: false },
      },
      async findAccount(_ctx, id) {
        return accountService.getAccount(id);
      },
      interactions: {
        url(ctx, interaction) {
          return `/oidc/interaction/${interaction.uid}`;
        },
      },
      claims: {
        openid: ['sub'],
        profile: ['name', 'given_name', 'family_name', 'preferred_username', 'locale', 'zoneinfo'],
        email: ['email', 'email_verified'],
      },
    };

    return new Provider(issuer, configuration);
  }
}
