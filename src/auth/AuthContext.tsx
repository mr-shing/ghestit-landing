// Auth state for the ported customer app. Mirrors the Yii frontend SiteController
// flow: phone -> (existing user) OTP or password / (new user) signup -> JWT.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { api, tokenStore } from '../lib/api';

export type User = {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  fullName?: string;
  national_id?: string;
  [k: string]: unknown;
};

/** Display name with sensible fallbacks. */
export function userDisplayName(u: User | null): string {
  if (!u) return '';
  const name = (u.fullName || `${u.first_name ?? ''} ${u.last_name ?? ''}`).trim();
  return name || u.username;
}

/** What the api wants next after a phone number is submitted. */
export type SignInMode = 'login' | 'signup';

type SignInResult = { mode: SignInMode; username: string; hasPassword: boolean };

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  /** Step 1: submit phone. Tells you to OTP-login, password-login, or sign up. */
  signIn: (username: string, verifyCode?: string) => Promise<SignInResult>;
  /** Step 2a: existing user, confirm OTP code. */
  loginByCode: (username: string, code: string) => Promise<void>;
  /** Step 2b: existing user with a password. */
  loginByPassword: (username: string, password: string) => Promise<void>;
  /** Step 2c: new user, confirm OTP code to create account. */
  signup: (username: string, code: string, extra?: Record<string, unknown>) => Promise<void>;
  /** Re-send the SMS code for the pending username. */
  resendCode: (username: string) => Promise<void>;
  /** Forgot password: send a reset code to the mobile. */
  requestPasswordReset: (username: string) => Promise<void>;
  /** Forgot password: set a new password with the reset code. */
  resetPassword: (username: string, password: string, repeatPassword: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function persistAuth(json: any): void {
  const token = json?.token ?? json?.data?.token;
  // The api should send refresh_token as a string, but older builds returned the
  // whole UserRefreshTokens record — normalize either shape to the token string.
  const rawRefresh = json?.refresh_token ?? json?.data?.refresh_token ?? null;
  const refresh =
    rawRefresh && typeof rawRefresh === 'object' ? rawRefresh.urf_token ?? null : rawRefresh;
  const user = json?.user ?? json?.data?.user ?? null;
  if (token) tokenStore.set(String(token), refresh ? String(refresh) : null, user);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => tokenStore.getUser<User>());

  const signIn = useCallback(async (username: string, verifyCode?: string): Promise<SignInResult> => {
    const json = await api.post('site/sign-in', {
      SigninForm: { username, ...(verifyCode ? { verifyCode } : {}) },
    }, { auth: false });
    return {
      mode: json.mode as SignInMode,
      username: json.username ?? username,
      hasPassword: !!json.hasPassword,
    };
  }, []);

  const loginByCode = useCallback(async (username: string, code: string): Promise<void> => {
    const json = await api.post('site/login', { LoginByCode: { username, code } }, { auth: false });
    persistAuth(json);
    setUser((json.user ?? json.data?.user ?? null) as User | null);
  }, []);

  const loginByPassword = useCallback(async (username: string, password: string): Promise<void> => {
    const json = await api.post('site/login-by-password', {
      LoginByPassword: { username, password },
    }, { auth: false });
    persistAuth(json);
    setUser((json.user ?? json.data?.user ?? null) as User | null);
  }, []);

  const requestPasswordReset = useCallback(async (username: string): Promise<void> => {
    await api.post('site/request-password-reset', { PasswordResetRequestForm: { username } }, { auth: false });
  }, []);

  const resetPassword = useCallback(async (username: string, password: string, repeatPassword: string, code: string): Promise<void> => {
    await api.post('site/reset-password', {
      ResetPasswordForm: { password, repeatPassword, code },
    }, { auth: false, query: { username } });
  }, []);

  const signup = useCallback(async (username: string, code: string, extra: Record<string, unknown> = {}): Promise<void> => {
    const json = await api.post('site/signup', { SignupForm: { username, code, ...extra } }, {
      auth: false,
      query: { username },
    });
    persistAuth(json);
    setUser((json.user ?? json.data?.user ?? null) as User | null);
  }, []);

  const resendCode = useCallback(async (username: string): Promise<void> => {
    // Always send a login code — works even for users who have a password set
    // (site/sign-in only auto-sends for password-less users).
    await api.post('site/resend-code', { username }, { auth: false });
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    const urf = tokenStore.refresh;
    try {
      if (urf) await api.delete('site/refresh-token', { urf_token: urf });
    } catch {
      // best-effort server-side revoke
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!tokenStore.token,
    signIn,
    loginByCode,
    loginByPassword,
    signup,
    resendCode,
    requestPasswordReset,
    resetPassword,
    logout,
  }), [user, signIn, loginByCode, loginByPassword, signup, resendCode, requestPasswordReset, resetPassword, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
