import express from "express";
import cors from "cors";
import routes from "./routes";
import Provider from "oidc-provider";

import { env } from "./config/env";

const server = express();
const port = env.port;

server.use(express.json());

server.use(cors({
    origin: "http://localhost:3001",
    credentials: true,
}));

if(env.node == "development") {
    server.use((req, res, next) => {
        console.log(`[DEBUG EXPRESS] Запрос: ${req.method} ${req.originalUrl}`);
        next();
    });
}

server.use('/', routes);

export const initServer = (): void => {
    server.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
        console.log(`OIDC Discovery URL: http://localhost:${port}/oauth/.well-known/openid-configuration`);
    });
};