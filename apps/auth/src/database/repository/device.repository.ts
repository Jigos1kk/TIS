import { Repository } from 'typeorm';
import { Device } from '../../database/entity/device.entity';
import { BaseRepository } from '../../database/repository/base.repository';

export class DeviceRepository extends BaseRepository<Device> {
  constructor(repository: Repository<Device>) {
    super(repository);
  }
}
