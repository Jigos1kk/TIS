import { Router } from 'express';
import { OidcController } from '../controllers/oidc.controller.js';
import Provider from 'oidc-provider';

// Mounts OIDC provider middleware and interaction routes
export function createOidcRouter(provider: Provider, oidcController: OidcController): Router {
  const router = Router();

  router.get('/interaction/:uid', oidcController.renderInteraction);
  router.post('/interaction/:uid/login', oidcController.submitLogin);

  // Mounts all standard OpenID Connect endpoints
  router.use('/', provider.callback());

  return router;
}

export default createOidcRouter;
