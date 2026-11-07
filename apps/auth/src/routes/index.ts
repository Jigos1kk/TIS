import { Router } from "express";
import systemRoutes from "./system.route.js";
import { createOidcRouter } from "./oidc.route.js";
import { createAuthRouter } from "./auth.route.js";
import { createDeviceRouter } from "./device.route.js";
import { AuthController } from "../controllers/auth.controller.js";
import { DeviceController } from "../controllers/device.controller.js";
import { OidcController } from "../controllers/oidc.controller.js";
import Provider from "oidc-provider";

// Mounts all application routers into a single entry point
export function createRouter(
  provider: Provider,
  authController: AuthController,
  deviceController: DeviceController,
  oidcController: OidcController
): Router {
  const router = Router();

  router.use("/", systemRoutes);
  router.use("/api/auth", createAuthRouter(authController));
  router.use("/api/devices", createDeviceRouter(deviceController));
  router.use("/oidc", createOidcRouter(provider, oidcController));

  return router;
}
