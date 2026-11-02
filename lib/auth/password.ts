import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

export const MIN_PASSWORD_LENGTH = 12;

const params = { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const KEY_LENGTH = 32;

function derive(password: string, salt: Buffer, options: ScryptOptions) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, options, (error, key) => (error ? reject(error) : resolve(key)));
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await derive(password, salt, params);
  return `scrypt$${params.N}$${params.r}$${params.p}$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, N, r, p, salt, key] = stored.split("$");
  if (scheme !== "scrypt" || !key) return false;
  const expected = Buffer.from(key, "base64");
  const actual = await derive(password, Buffer.from(salt, "base64"), { N: Number(N), r: Number(r), p: Number(p), maxmem: params.maxmem });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Compared against when an email is unknown, so response time does not reveal which emails exist.
export const decoyHash = "scrypt$32768$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
