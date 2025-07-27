import { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, userData?: Partial<Profile>) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

export interface SignUpData {
  email: string;
  password: string;
  username?: string;
  full_name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}
