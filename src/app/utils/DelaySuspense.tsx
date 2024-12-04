import React, { ReactNode, useEffect, useRef } from 'react';
import { Suspense, useState } from 'react';

export interface DelaySuspenseProps {
  children?: ReactNode | undefined;
  fallback?: ReactNode;
  renderDelay?: number;
  minVisibilityDelay?: number;
}

enum LoadingState {
  PRE_RENDER = 1,
  RENDER = 2,
  DELAY_AWAITED = 3,
  INIT = 4,
}

export const DelaySuspense = ({ children, fallback, renderDelay = 0, minVisibilityDelay = 0 }: DelaySuspenseProps) => {
  const [loadingState, setLoadingState] = useState(LoadingState.INIT);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLoadingState(LoadingState.PRE_RENDER);
    timeoutIdRef.current && clearInterval(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      setLoadingState(LoadingState.RENDER);
      timeoutIdRef.current = setTimeout(() => {
        setLoadingState(LoadingState.DELAY_AWAITED);
      }, minVisibilityDelay - renderDelay);
    }, renderDelay);
    return () => {
      timeoutIdRef.current && clearInterval(timeoutIdRef.current);
    };
  }, []);

  return (
    <Suspense fallback={fallback}>
      {loadingState < LoadingState.PRE_RENDER ? null : children}
      {loadingState < LoadingState.DELAY_AWAITED && <PromiseThrower />}
    </Suspense>
  );
};

const PromiseThrower = () => {
  throw new Promise(() => { });
};