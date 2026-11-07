import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

// Entity to store all oidc-provider models (Session, Client, Grant, Token, etc.)
@Entity({ name: 'oidc_payloads' })
export class OidcPayload extends BaseEntity {
  @Column({ type: "varchar" })
  @Index()
  modelName!: string;

  @Column({ type: "varchar" })
  @Index({ unique: true })
  uid!: string;

  @Column({ type: 'jsonb' })
  payload!: Record<string, unknown>;

  @Column({ type: "varchar", nullable: true })
  @Index()
  userCode?: string;

  @Column({ type: "varchar", nullable: true })
  @Index()
  grantId?: string;

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  expiresAt?: Date;
}
