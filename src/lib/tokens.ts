/**
 * @file src/lib/tokens.ts
 * @description Secure token helpers for password reset flows.
 */

export function generateToken(bytes = 32): string {
  const array = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
