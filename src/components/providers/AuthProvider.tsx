'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BASE_URL, parseApiError } from '@/lib/api';

export interface AmbassadorUser {
  id: string;
  full_name?: string;
  email?: string;
  whatsapp_number?: string;
  email_verified?: boolean;
  whatsapp_verified?: boolean;
  role?: string;
  is_active?: boolean;
}

export interface EmergencyContactRecord {
  name?: string;
  phone?: string;
  relationship?: string;
}

export interface AmbassadorProfile {
  id?: string;
  user_id?: string;
  referral_code?: string;
  total_referrals?: number;
  total_earnings_ngn?: number;
  pending_balance_ngn?: number;
  campus_or_region?: string | null;
  is_approved?: boolean;
  profile_picture_url?: string | null;
  emergency_contact?: EmergencyContactRecord | null;
  audience_category?: string[];
  institution_or_organization?: string | null;
  primary_operating?: string | null;
  secondary_operating?: string | null;
  verification_status?: string | null;
  email_verified?: boolean;
  whatsapp_verified?: boolean;
  ambassador_ranking?: string | null;
  state_covering?: string[];
  social_media_platform?: string[];
  social_media_handle?: string | null;
  social_media_target_audience?: string | null;
  bank_code?: string | null;
  bank_name?: string | null;
  account_number?: string | null;
  account_name?: string | null;
}

interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: { id: string; email: string };
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  whatsappNumber: string;
  password: string;
}

interface AuthContextValue {
  user: AmbassadorUser | null;
  profile: AmbassadorProfile | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<AmbassadorUser | null>;
  register: (payload: RegisterPayload) => Promise<AmbassadorUser | null>;
  logout: () => void;
}

const STORAGE_KEY = 'rmts_ambassador_auth';

interface StoredAuth {
  session: AuthSession;
  user: AmbassadorUser;
  profile: AmbassadorProfile;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

interface AuthResponseData {
  session?: AuthSession;
  user?: AmbassadorUser;
  ambassadorProfile?: AmbassadorProfile;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stored, setStored] = useState<StoredAuth | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // hydrate session from localStorage once on mount
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setStored(JSON.parse(raw) as StoredAuth);
    } catch {
      /* ignore corrupt storage */
    } finally {
      setHydrated(true);
    }
  }, []);

  const setAuth = useCallback((data: AuthResponseData) => {
    if (!data.session || !data.user) return;
    const next: StoredAuth = {
      session: data.session,
      user: data.user,
      profile: data.ambassadorProfile ?? {},
    };
    setStored(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota errors */
    }
  }, []);

  const postAuth = useCallback(
    async (path: string, body: RegisterPayload | { email: string; password: string }) => {
      const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(await parseApiError(res));
      }

      const data = (await res.json()) as {
        success?: boolean;
        data?: AuthResponseData;
      };
      const authData = data?.data ?? {};
      setAuth(authData);
      return authData.user ?? null;
    },
    [setAuth]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      return await postAuth('/ambassadors/login', { email, password });
    },
    [postAuth]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      return await postAuth('/ambassadors/register', payload);
    },
    [postAuth]
  );

  const logout = useCallback(() => {
    setStored(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: stored?.user ?? null,
      profile: stored?.profile ?? null,
      session: stored?.session ?? null,
      isAuthenticated: Boolean(stored?.session?.accessToken),
      hydrated,
      login,
      register,
      logout,
    }),
    [stored, hydrated, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}