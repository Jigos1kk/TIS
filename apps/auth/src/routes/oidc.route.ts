import { Router } from 'express'
import { env } from "../config/env";
import { loadJWKS, loadCookies } from "../providers";
import Provider from 'oidc-provider';

const router = Router();
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
    cookies: await loadCookies(),
    features: {
        devInteractions: { enabled: true },
    },
});

router.use("/", oidc.callback())

export default router