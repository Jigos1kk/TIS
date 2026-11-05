import { BeforeInsert, BeforeUpdate, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"
import * as crypto from "node:crypto"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 36, unique: true})
    @Index()
    sub: string;

    @Column({ type: "varchar", length: 255, unique: true })
    @Index()
    username: string

    @Column({ type: "varchar", length: 255, unique: true })
    usernameNormalize: string

    @Column({ type: "varchar", length: 255, unique: true })
    @Index()
    email: string

    @Column({ type: "varchar", length: 255, unique: true })
    @Index()
    emailNormalize: string

    @Column({ type: "boolean", default: false })
    isEmailVerified: boolean

    @Column({ type: "varchar", length: 100 })
    firstName: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    lastName: string;

    @Column({ type: "varchar", length: 255 })
    displayName: string;

    @Column({ type: "varchar", length: 10, nullable: true, default: 'ru' })
    locale: string;

    @Column({ type: "varchar", length: 50, nullable: true, default: 'Europe/Moscow' })
    timezone: string; 

    @Column({ type: "varchar", length: 255, nullable: true })
    passwordHash: string; 

    @Column({ type: "varchar", length: 255, nullable: true })
    salt: string;

    @Column({ type: "boolean", default: true })
    isActive: boolean;

    @Column({ type: "boolean", default: false })
    isMfaEnabled: boolean;

}
