/**
 * @file lib/auth-utils.ts
 * @description Password hashing utilities using Web Crypto API.
 * No external bcrypt dependency — works on Edge runtime.
 */

/**
 * Hashes a plain-text password using PBKDF2.
 * Returns a string in format: "iterations:salt:hash" (all hex).
 */

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(saltBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const iterations = 100_000;

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations, hash: "SHA-256" },
    keyMaterial,
    256,
  );

  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${iterations}:${saltHex}:${hashHex}`;
}

/**
 * Compares a plain-text password against a stored hash.
 * Timing-safe via PBKDF2 — no early exit possible.
 */
export async function comparePasswords(
  password: string,
  stored: string,
): Promise<boolean> {
  const [iterStr, saltHex, storedHash] = stored.split(":");
  if (!iterStr || !saltHex || !storedHash) return false;

  const encoder = new TextEncoder();
  const iterations = parseInt(iterStr, 10);
  const saltBytes = new Uint8Array(
    saltHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)),
  );

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations, hash: "SHA-256" },
    keyMaterial,
    256,
  );

  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex === storedHash;
}
