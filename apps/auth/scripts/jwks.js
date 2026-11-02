import * as fs from 'node:fs'
import * as path from 'node:path'
import * as crypto from 'node:crypto'
import 'dotenv/config'

const KEYS_SIZE = Number(process.env.KEYS_SIZE);
const KEYS_ALG = process.env.KEYS_ALG;

const { privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: KEYS_SIZE,
    publicKeyEncoding: {
        format: 'jwk'
    },
    privateKeyEncoding: {
        format: 'jwk'
    },
})

const kid = crypto.randomUUID();

privateKey.kid = kid;
privateKey.use = 'sig';
privateKey.alg = KEYS_ALG;


const jwks = {
    keys: [privateKey]
}

const secretPath = path.join(process.cwd(), 'secrets')

if(!fs.existsSync(secretPath))
    fs.mkdirSync(secretPath, { recursive: true })

const jwksFile = path.join(secretPath, 'jwks.json')

fs.writeFileSync(jwksFile, JSON.stringify(jwks, null, 2));

console.log(`Success generated JWKs`);



