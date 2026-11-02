import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const secretsPath = path.join(process.cwd(), 'secrets');
const jwksPath = path.join(secretsPath, 'jwks.json');

export async function loadJWKS() {
    try {
        console.log(jwksPath);
        
        const jwksData = await fs.promises.readFile(jwksPath, 'utf-8');
        return JSON.parse(jwksData);
    } catch (error) {
        throw new Error(`Error load JWKS`);
    }
}