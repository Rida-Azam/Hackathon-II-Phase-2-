import { UserProfile } from '@/types/auth';
import { decodeJwt } from 'jose';

export function getUserFromSession(): UserProfile | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  try {
    // Check if it's a mock token (for backward compatibility)
    if (token.startsWith('fake-jwt-token')) {
      console.log('[Auth] Mock token detected, returning default user');
      return {
        name: 'Demo User',
        email: 'demo@example.com',
        avatar: null
      };
    }

    // Decode real JWT token
    const payload = decodeJwt(token);
    console.log('[Auth] JWT decoded successfully:', payload);

    // Extract user information from JWT payload
    return {
      name: (payload.name as string) || (payload.email as string)?.split('@')[0] || 'User',
      email: (payload.email as string) || (payload.sub as string) || 'user@example.com',
      avatar: (payload.avatar as string) || null
    };
  } catch (error) {
    console.error('[Auth] Failed to decode JWT:', error);
    // Fallback to default user if decoding fails
    return {
      name: 'User',
      email: 'user@example.com',
      avatar: null
    };
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
}

export function logout(): void {
  localStorage.removeItem('auth_token');
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  window.location.href = '/login';
}
