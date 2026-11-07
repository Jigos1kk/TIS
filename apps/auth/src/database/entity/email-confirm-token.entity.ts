import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './User.entity';

@Entity()
export class EmailConfirmToken extends BaseEntity {
  @Column({ type: "varchar" })
  token!: string;

  @Column({ type: "timestamp" })
  expiresAt!: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;
}
