import { Adapter, AdapterPayload } from 'oidc-provider';
import { AppDataSource } from '../database/index.js';
import { OidcPayload } from '../database/entity/oidc-payload.entity.js';
import { LessThan } from 'typeorm';

// Stores and retrieves OIDC tokens, sessions and grants via TypeORM
export class TypeOrmOidcAdapter implements Adapter {
  private repository = AppDataSource.getRepository(OidcPayload);

  constructor(public name: string) {}

  async upsert(id: string, payload: AdapterPayload, expiresIn: number): Promise<void> {
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined;

    let entity = await this.repository.findOne({
      where: { modelName: this.name, uid: id },
    });

    if (!entity) {
      entity = this.repository.create({
        modelName: this.name,
        uid: id,
      });
    }

    entity.payload = payload as Record<string, unknown>;
    entity.expiresAt = expiresAt;
    entity.userCode = payload.userCode;
    entity.grantId = payload.grantId;

    await this.repository.save(entity);
  }

  async find(id: string): Promise<AdapterPayload | undefined> {
    const entity = await this.repository.findOne({
      where: { modelName: this.name, uid: id },
    });

    if (!entity) return undefined;
    if (entity.expiresAt && entity.expiresAt < new Date()) {
      await this.destroy(id);
      return undefined;
    }

    return entity.payload as AdapterPayload;
  }

  async findByUserCode(userCode: string): Promise<AdapterPayload | undefined> {
    const entity = await this.repository.findOne({
      where: { modelName: this.name, userCode },
    });

    if (!entity) return undefined;
    if (entity.expiresAt && entity.expiresAt < new Date()) {
      await this.destroy(entity.uid);
      return undefined;
    }

    return entity.payload as AdapterPayload;
  }

  async findByUid(uid: string): Promise<AdapterPayload | undefined> {
    const entity = await this.repository.findOne({
      where: { modelName: this.name, uid },
    });

    if (!entity) return undefined;
    if (entity.expiresAt && entity.expiresAt < new Date()) {
      await this.destroy(uid);
      return undefined;
    }

    return entity.payload as AdapterPayload;
  }

  async destroy(id: string): Promise<void> {
    await this.repository.delete({ modelName: this.name, uid: id });
  }

  async revokeByGrantId(grantId: string): Promise<void> {
    await this.repository.delete({ grantId });
  }

  async consume(id: string): Promise<void> {
    const entity = await this.repository.findOne({
      where: { modelName: this.name, uid: id },
    });

    if (entity && entity.payload) {
      entity.payload.consumed = Math.floor(Date.now() / 1000);
      await this.repository.save(entity);
    }
  }

  static async cleanupExpired(): Promise<void> {
    const repo = AppDataSource.getRepository(OidcPayload);
    await repo.delete({ expiresAt: LessThan(new Date()) });
  }
}
