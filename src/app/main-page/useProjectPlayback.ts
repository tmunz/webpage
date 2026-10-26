import { useEffect, useRef } from 'react';

export const PROJECT_DURATION = 9000;

/** Preserve the remaining shot duration while the viewer interacts or leaves the page. */
export function useProjectPlayback(index: number, enabled: boolean, onAdvance: () => void) {
  const remaining = useRef(PROJECT_DURATION);

  useEffect(() => { remaining.current = PROJECT_DURATION; }, [index]);

  useEffect(() => {
    if (!enabled) return;
    const started = performance.now();
    const timer = window.setTimeout(onAdvance, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [index, enabled, onAdvance]);
}
