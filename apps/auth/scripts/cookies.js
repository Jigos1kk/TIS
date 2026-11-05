import * as fs from "node:fs"
import * as path from "node:path"
import * as crypto from 'node:crypto'
import 'dotenv/config'

const COOKIES_COUNT = Number(process.env.COOKIES_COUNT);
const COOKIES_BYTES = Number(process.env.COOKIES_BYTES);

const keys = [];

while(keys.length < COOKIES_COUNT)
    keys.push(crypto.randomBytes(COOKIES_BYTES).toString("hex"))

const secretPath = path.join(process.cwd(), 'secrets')

if(!fs.existsSync(secretPath))
    fs.mkdirSync(secretPath, { recursive: true })

const cookiesFile = path.join(secretPath, 'cookies.json')

fs.writeFileSync(cookiesFile, JSON.stringify({ keys }, null, 2));

console.log(`Success generated Cookies`);

