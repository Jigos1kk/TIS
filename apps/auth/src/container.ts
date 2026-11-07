import { AppDataSource } from './database/index.js';
import { User } from './database/entity/User.entity.js';
import { Device } from './database/entity/device.entity.js';
import { EmailConfirmToken } from './database/entity/email-confirm-token.entity.js';
import { PasswordResetToken } from './database/entity/password-reset-token.entity.js';

import { UserRepository } from './database/repository/user.repository.js';
import { DeviceRepository } from './database/repository/device.repository.js';
import { EmailTokenRepository } from './database/repository/email-token.repository.js';
import { PasswordResetRepository } from './database/repository/password-reset.repository.js';

import { EmailServiceAdapter } from './services/email-service.adapter.js';
import { DeviceService } from './services/device.service.js';
import { AuthService } from './services/auth.service.js';
import { OidcAccountService } from './services/oidc-account.service.js';

import { AuthController } from './controllers/auth.controller.js';
import { DeviceController } from './controllers/device.controller.js';
import { OidcController } from './controllers/oidc.controller.js';

import { OidcProviderFactory } from './oidc/oidc-provider.factory.js';
import { createRouter } from './routes/index.js';
import { Router } from 'express';
import Provider from 'oidc-provider';

export interface AppContainer {
  provider: Provider;
  router: Router;
  authController: AuthController;
  deviceController: DeviceController;
  oidcController: OidcController;
}

// Composition root building the entire dependency graph
export function createContainer(): AppContainer {
  // Repositories
  const userRepo = new UserRepository(AppDataSource.getRepository(User));
  const deviceRepo = new DeviceRepository(AppDataSource.getRepository(Device));
  const emailTokenRepo = new EmailTokenRepository(AppDataSource.getRepository(EmailConfirmToken));
  const passwordResetRepo = new PasswordResetRepository(AppDataSource.getRepository(PasswordResetToken));

  // Infrastructure adapters
  const emailService = new EmailServiceAdapter();

  // Domain services
  const deviceService = new DeviceService(deviceRepo, userRepo);
  const authService = new AuthService(userRepo, emailTokenRepo, passwordResetRepo, emailService);
  const oidcAccountService = new OidcAccountService(userRepo);

  // OIDC Provider
  const provider = OidcProviderFactory.create(oidcAccountService);

  // Presentation controllers
  const authController = new AuthController(authService, true);
  const deviceController = new DeviceController(deviceService);
  const oidcController = new OidcController(provider);

  // HTTP Routes
  const router = createRouter(provider, authController, deviceController, oidcController);

  return {
    provider,
    router,
    authController,
    deviceController,
    oidcController,
  };
}
