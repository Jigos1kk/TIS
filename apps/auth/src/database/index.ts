import "reflect-metadata";
import { env } from "../config/env.js"
import { DataSource } from "typeorm";
import { User } from "./entity/User.entity.js"
import { Device } from "./entity/device.entity.js"
import { EmailConfirmToken } from "./entity/email-confirm-token.entity.js"
import { PasswordResetToken } from "./entity/password-reset-token.entity.js"
import { OidcPayload } from "./entity/oidc-payload.entity.js"

const options = env.dbOptions;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: options.host || "localhost",
  port: options.port || 5432,
  username: options.user || "admin",
  password: options.password || "secret_password",
  database: options.database || "tis_database",
  synchronize: true, 
  logging: false,
  entities: [User, Device, EmailConfirmToken, PasswordResetToken, OidcPayload],
  migrations: [],
  subscribers: [],
});

export async function initDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Error during database connection:", error);
    process.exit(1);
  }
}