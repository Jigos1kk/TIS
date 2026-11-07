import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './User.entity';

@Entity()
export class PasswordResetToken extends BaseEntity {
  @Column({ type: "varchar" })
  token!: string;

  @Column({ type: "timestamp" })
  expiresAt!: Date;

  @ManyToOne(() => User)
  user!: User;
}
