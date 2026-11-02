import express from "express"
import cors from "cors";
// import routes from "./routes";
import Provider from "oidc-provider";

import { loadJWKS } from "./providers"
import { env } from "./config/env";

const server = express();
const port = env.port;
const oidc = new Provider(`http://localhost:${port}/oauth`, {
    jwks: await loadJWKS(),
    clients: [
        {
            client_id: 'my-client',
            client_secret: 'my-secret',
            redirect_uris: ['http://localhost:3001/callback'],
            response_types: ['code'],
            grant_types: ['authorization_code'],
        },
    ],
    cookies: {
        keys: ['your-super-secret-cookie-key-1', 'your-super-secret-cookie-key-2'],
    },
    features: {
        devInteractions: { enabled: true },
    },
});

server.use(express.json())

server.use(oidc.callback())
server.use((req, res, next) => {
    console.log(`[DEBUG EXPRESS] Запрос: ${req.method} ${req.originalUrl}`);
    next();
});

// server.use(cors({
//     origin: "*",
//     credentials: false
// }))


export const initServer = (): void => {
    server.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    })
}