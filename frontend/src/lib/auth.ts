import { UserProfile } from '@/types/auth';

export function getUserFromSession(): UserProfile | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  // Phase II: Mock user data
  // TODO: Decode JWT in future phases
  return {
    name: 'User',
    email: 'user@example.com',
    avatar: null
  };
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
