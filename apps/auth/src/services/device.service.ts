import { DeviceRepository } from '../database/repository/device.repository.js';
import { UserRepository } from '../database/repository/user.repository.js';
import { RegisterDeviceDto, RegisterDeviceDtoType } from './dto/auth.dto.js';
import { Device } from '../database/entity/device.entity.js';
import { AppError } from '../common/errors/app-error.js';

// Manages client device registration and identity
export class DeviceService {
  constructor(
    private deviceRepo: DeviceRepository,
    private userRepo: UserRepository
  ) {}

  async registerDevice(dto: RegisterDeviceDtoType): Promise<Device> {
    const validated = RegisterDeviceDto.parse(dto);
    const user = await this.userRepo.findOne({ where: { id: validated.userId } });
    if (!user) throw new AppError('User not found', 404);

    return this.deviceRepo.save({
      fingerprint: validated.fingerprint,
      hardwareId: validated.hardwareId,
      user,
    });
  }
}
