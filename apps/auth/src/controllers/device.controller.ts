import { Request, Response, NextFunction } from 'express';
import { DeviceService } from '../services/device.service.js';
import { RegisterDeviceDto } from '../services/dto/auth.dto.js';

// Handles REST endpoints for client devices
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  registerDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = RegisterDeviceDto.parse(req.body);
      const device = await this.deviceService.registerDevice(validated);

      res.status(201).json({
        success: true,
        status: 'device_registered',
        data: {
          uuid: device.uuid,
          fingerprint: device.fingerprint,
          hardwareId: device.hardwareId,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
