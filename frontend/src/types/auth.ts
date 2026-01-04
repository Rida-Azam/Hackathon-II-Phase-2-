export interface UserProfile {
  name: string;
  email: string;
  avatar?: string | null;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface SessionData {
  token: string;
  expiresAt?: number;
}
