import { initializeDatabase } from "./database"
import { initServer } from "./server";

const bootstrap = async () => {
    await initializeDatabase();
    await initServer();
}

bootstrap()
    .then(() => {
        console.log("Application started successfully");
    })
    .catch((err) => {
        console.error("Error initializing database: ", err);
        process.exit(1);
    });