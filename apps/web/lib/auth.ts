import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "pokeforge_session";

// In a real app this comes from an env var. For this demo, a fixed secret is fine.
const SECRET = process.env.SESSION_SECRET ?? "pokeforge-dev-secret-do-not-use-in-prod";

/**
 * Produce a signed session token: `<trainerId>.<hmac>`.
 * The HMAC uses SHA-256 over `trainerId` with `SECRET`.
 */
export function signSession(trainerId: string): string {
  const sig = createHmac("sha256", SECRET).update(trainerId).digest("hex");
  return `${trainerId}.${sig}`;
}

/**
 * Verify and decode a session token.
 * Returns the trainerId if valid, null otherwise.
 */
export function verifySession(token: string): string | null {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const trainerId = token.slice(0, dotIndex);
  const providedSig = token.slice(dotIndex + 1);
  const expectedSig = createHmac("sha256", SECRET).update(trainerId).digest("hex");

  try {
    const a = Buffer.from(providedSig, "hex");
    const b = Buffer.from(expectedSig, "hex");
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  return trainerId;
}

/**
 * Extract the session token from a Cookie header string.
 */
export function getSessionToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key?.trim() === SESSION_COOKIE) return rest.join("=").trim();
  }
  return null;
}

/**
 * Produce a Set-Cookie header value that sets the session cookie.
 */
export function makeSetCookieHeader(trainerId: string): string {
  const token = signSession(trainerId);
  return `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`;
}

/**
 * Produce a Set-Cookie header value that clears the session cookie.
 */
export function makeClearCookieHeader(): string {
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}
