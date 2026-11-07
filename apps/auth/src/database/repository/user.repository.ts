import { Repository } from 'typeorm';
import { User } from '../../database/entity/User.entity';
import { BaseRepository } from '../../database/repository/base.repository';

// Repository for User entity
export class UserRepository extends BaseRepository<User> {
  constructor(repository: Repository<User>) {
    super(repository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByEmailNormalize(emailNormalize: string): Promise<User | null> {
    return this.repository.findOne({ where: { emailNormalize } });
  }

  async findByUsernameNormalize(usernameNormalize: string): Promise<User | null> {
    return this.repository.findOne({ where: { usernameNormalize } });
  }
}
