import "reflect-metadata";
import { env } from "../config/env"
import { DataSource } from "typeorm";
// import { User } from "../entity/User";

const options = env.dbOptions;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: options.host || "localhost",
  port: options.port || 5432,
  username: options.user || "admin",
  password: options.password || "secret_password",
  database: options.database || "tis_database",
  synchronize: true, 
  logging: true,
  entities: [],
  migrations: [],
  subscribers: [],
});

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Error during database connection:", error);
    process.exit(1);
  }
}