import { Repository } from 'typeorm';
import { PasswordResetToken } from '../../database/entity/password-reset-token.entity';
import { BaseRepository } from '../../database/repository/base.repository';

export class PasswordResetRepository extends BaseRepository<PasswordResetToken> {
  constructor(repository: Repository<PasswordResetToken>) {
    super(repository);
  }
}
