import crypto from "node:crypto";

const SCRYPT_KEYLEN = 64;

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.randomBytes(16).toString("hex");

  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, SCRYPT_KEYLEN, (err, derivedKey) => {
      if (err) {
        return reject(err);
      }
      resolve({
        hash: derivedKey.toString("hex"),
        salt,
      });
    });
  });
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, SCRYPT_KEYLEN, (err, derivedKey) => {
      if (err) {
        return reject(err);
      }
      const hashBuffer = Buffer.from(hash, "hex");
      if (hashBuffer.length !== derivedKey.length) {
        return resolve(false);
      }
      resolve(crypto.timingSafeEqual(hashBuffer, derivedKey));
    });
  });
}
