import { Router } from 'express';
import { DeviceController } from '../controllers/device.controller.js';

// Configures REST endpoints for device management
export function createDeviceRouter(deviceController: DeviceController): Router {
  const router = Router();

  router.post('/', deviceController.registerDevice);

  return router;
}
