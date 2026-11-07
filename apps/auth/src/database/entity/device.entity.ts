import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './User.entity';

@Entity()
export class Device extends BaseEntity {
  @Column({ type: "varchar" })
  fingerprint!: string;

  @Column({ type: "varchar" })
  hardwareId!: string;

  @ManyToOne(() => User, (user) => user.id)
  user!: User;
}
