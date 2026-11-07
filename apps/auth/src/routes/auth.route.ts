import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

// Configures REST endpoints for auth operations
export function createAuthRouter(authController: AuthController): Router {
  const router = Router();

  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.get('/email-confirmation', authController.confirmEmail);
  router.post('/password-reset/request', authController.requestPasswordReset);
  router.post('/password-reset/confirm', authController.confirmPasswordReset);

  return router;
}

export default createAuthRouter;
