/**
 * JDA hisobi uchun auth konteksti.
 *
 * Ilova ochilganda saqlangan token tekshiriladi:
 *  • yaroqli   -> foydalanuvchi kiritiladi
 *  • yaroqsiz  -> token tozalanadi, login ekrani ko'rsatiladi
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import * as api from "./api";
import type { JdaUser } from "./api";

type AuthState = {
  user: JdaUser | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signIn: (login: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const JdaAuthContext = createContext<AuthState | null>(null);

export function JdaAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<JdaUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ilova ochilganda saqlangan sessiyani tiklash
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const token = await api.getToken();
        if (!token) return;

        // Tarmoq javobini kutmasdan darhol ko'rsatish uchun keshdagi ma'lumot
        const cached = await api.getCachedUser();
        if (cached && !cancelled) setUser(cached);

        // Token hali yaroqlimi — serverdan tasdiqlaymiz
        const fresh = await api.fetchMe();
        if (!cancelled) setUser(fresh);
      } catch (error) {
        // 401 — token muddati o'tgan yoki hisob bloklangan
        if (error instanceof api.JdaApiError && error.status === 401) {
          await api.logout();
          if (!cancelled) setUser(null);
        }
        // Tarmoq xatosi bo'lsa keshdagi foydalanuvchi qoladi (oflayn rejim)
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (login: string, password: string) => {
    const signedIn = await api.login(login, password);
    setUser(signedIn);
  }, []);

  const signOut = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      setUser(await api.fetchMe());
    } catch (error) {
      if (error instanceof api.JdaApiError && error.status === 401) {
        await api.logout();
        setUser(null);
      }
    }
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, isLoading, isSignedIn: user !== null, signIn, signOut, refresh }),
    [user, isLoading, signIn, signOut, refresh],
  );

  return <JdaAuthContext.Provider value={value}>{children}</JdaAuthContext.Provider>;
}

export function useJdaAuth(): AuthState {
  const context = useContext(JdaAuthContext);
  if (!context) {
    throw new Error("useJdaAuth faqat <JdaAuthProvider> ichida ishlatiladi");
  }
  return context;
}
