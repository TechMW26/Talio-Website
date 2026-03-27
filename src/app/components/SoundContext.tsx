import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { preloadSoundEffects } from './SoundPreloader';

interface SoundCtx {
  /** true = user has seen the popup and accepted sounds */
  soundEnabled: boolean;
  /** true = popup has been dismissed (either way) */
  dismissed: boolean;
  /** user chose "Awesome" */
  accept: () => void;
  /** user chose "Continue Without Effects" */
  decline: () => void;
}

const SoundContext = createContext<SoundCtx>({
  soundEnabled: false,
  dismissed: false,
  accept: () => {},
  decline: () => {},
});

const SESSION_KEY = 'talio_sound_pref';

export function SoundProvider({ children }: { children: ReactNode }) {
  const stored = typeof window !== 'undefined' ? sessionStorage.getItem(SESSION_KEY) : null;
  const [soundEnabled, setSoundEnabled] = useState(stored === 'on');
  const [dismissed, setDismissed] = useState(stored !== null);

  // Preload & cache all sound effect files on mount
  useEffect(() => {
    preloadSoundEffects();
  }, []);

  const accept = useCallback(() => {
    setSoundEnabled(true);
    setDismissed(true);
    sessionStorage.setItem(SESSION_KEY, 'on');
  }, []);

  const decline = useCallback(() => {
    setSoundEnabled(false);
    setDismissed(true);
    sessionStorage.setItem(SESSION_KEY, 'off');
  }, []);

  return (
    <SoundContext.Provider value={{ soundEnabled, dismissed, accept, decline }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}

/** Module-level check for non-hook contexts (e.g. audio pools). */
export function isSoundAllowed(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'on';
  } catch {
    return false;
  }
}
