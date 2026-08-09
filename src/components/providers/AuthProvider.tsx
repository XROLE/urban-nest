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
  role?: string;
  is_active?: boolean;
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
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // hydrate session from localStorage once on mount
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setStored(JSON.parse(raw) as StoredAuth);
    } catch {
      /* ignore corrupt storage */
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
      setAuth(data?.data ?? {});
    },
    [setAuth]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      await postAuth('/ambassadors/login', { email, password });
    },
    [postAuth]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await postAuth('/ambassadors/register', payload);
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
      login,
      register,
      logout,
    }),
    [stored, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}