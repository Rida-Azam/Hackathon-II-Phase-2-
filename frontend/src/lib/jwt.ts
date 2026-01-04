import { SignJWT } from 'jose';

// JWT configuration
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key-here';
const ALGORITHM = 'HS256';
const EXPIRATION = '24h'; // Token expires in 24 hours

interface JWTPayload {
  sub: string; // User ID
  email: string;
  name?: string;
  avatar?: string | null;
}

/**
 * Generate a JWT token for a user
 * @param payload - User information to encode in the JWT
 * @returns JWT token string
 */
export async function generateJWT(payload: JWTPayload): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);

  const jwt = await new SignJWT({
    sub: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split('@')[0],
    avatar: payload.avatar || null,
  })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(EXPIRATION)
    .sign(secret);

  return jwt;
}

/**
 * Verify if a JWT token is valid and not expired
 * @param token - JWT token to verify
 * @returns boolean indicating if token is valid
 */
export function isTokenExpired(token: string): boolean {
  try {
    if (token.startsWith('fake-jwt-token')) {
      return false; // Mock tokens never expire
    }

    // Decode without verification (just to check expiration)
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;

    if (!exp) return false; // No expiration set

    return Date.now() >= exp * 1000;
  } catch {
    return true; // If we can't decode, consider it expired
  }
}
