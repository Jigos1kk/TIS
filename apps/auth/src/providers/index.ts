import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const secretsPath = path.join(process.cwd(), 'secrets');
const jwksPath = path.join(secretsPath, 'jwks.json');
const cookiesPath = path.join(secretsPath, 'cookies.json');

export async function loadJWKS() {
    try {
        const jwksData = await fs.promises.readFile(jwksPath, 'utf-8');
        return JSON.parse(jwksData);
    } catch (error) {
        throw new Error(`Error load JWKS`);
    }
}

export async function loadCookies() {
    try {
        const cookiesData = await fs.promises.readFile(cookiesPath, 'utf-8');
        return JSON.parse(cookiesData);
    } catch (error) {
        throw new Error(`Error load Cookies`);
    }
}