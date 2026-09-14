import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, OAuthStrategy, EMPTY_TOKENS } from '@wix/sdk';
import { items } from '@wix/data';
import { WIX_CLIENT_ID, TOKEN_KEY } from '../lib/wixClient';

// ── Token Storage (localStorage) ─────────────────────────────────────────────
function createTokenStorage() {
  return {
    getTokens() {
      if (typeof window === 'undefined') return EMPTY_TOKENS;
      try {
        const raw = localStorage.getItem(TOKEN_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.accessToken?.value && parsed?.refreshToken?.value) {
            return parsed;
          }
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      }
      return EMPTY_TOKENS;
    },
    setTokens(tokens) {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
      } catch (e) {
        console.warn('[Wix] Error persisting tokens:', e);
      }
    },
  };
}

// ── Build Wix Client ─────────────────────────────────────────────────────────
function buildWixClient() {
  return createClient({
    modules: { items },
    auth: OAuthStrategy({
      clientId: WIX_CLIENT_ID,
      tokenStorage: createTokenStorage(),
    }),
  });
}

// ── Context & Provider ───────────────────────────────────────────────────────
export const WixContext = createContext(null);

export const WixContextProvider = ({ children }) => {
  const [wixClient] = useState(() => buildWixClient());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      const existing = localStorage.getItem(TOKEN_KEY);
      if (!existing) {
        try {
          const tokens = await wixClient.auth.generateVisitorTokens();
          await wixClient.auth.setTokens(tokens);
        } catch (err) {
          console.error('[Wix] Failed to generate visitor tokens:', err);
        }
      }
      if (!cancelled) {
        setIsReady(true);
      }
    };
    init();

    return () => {
      cancelled = true;
    };
  }, [wixClient]);

  return (
    <WixContext.Provider value={{ wixClient, isReady }}>
      {children}
    </WixContext.Provider>
  );
};

export const useWixClient = () => {
  const ctx = useContext(WixContext);
  if (!ctx) throw new Error('useWixClient must be used inside WixContextProvider');
  return ctx;
};
