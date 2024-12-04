import React, { ReactNode, useEffect, useRef } from 'react';
import { Suspense, useState } from 'react';

export interface DelaySuspenseProps {
  children?: ReactNode | undefined;
  fallback?: ReactNode;
  fallbackMinDurationMs?: number;
}

export const DelaySuspense = ({ children, fallback, fallbackMinDurationMs = 0 }: DelaySuspenseProps) => {
  const [isWaitingFallbackMinDurationMs, setIsWaitingFallbackMinDurationMs] = useState(false);

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsWaitingFallbackMinDurationMs(true);
    timeoutIdRef.current && clearInterval(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      setIsWaitingFallbackMinDurationMs(false);
    }, fallbackMinDurationMs);
    return () => {
      timeoutIdRef.current && clearInterval(timeoutIdRef.current);
    };
  }, []);

  return (
    <Suspense fallback={fallback}>
      {isWaitingFallbackMinDurationMs && <PromiseThrower />}
      {children}
    </Suspense>
  );
};

const PromiseThrower = () => {
  throw new Promise(() => { });
};