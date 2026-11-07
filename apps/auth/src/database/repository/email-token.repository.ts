import { Repository } from 'typeorm';
import { EmailConfirmToken } from '../../database/entity/email-confirm-token.entity';
import { BaseRepository } from '../../database/repository/base.repository';

export class EmailTokenRepository extends BaseRepository<EmailConfirmToken> {
  constructor(repository: Repository<EmailConfirmToken>) {
    super(repository);
  }
}
