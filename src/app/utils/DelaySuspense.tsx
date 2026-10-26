import React, { ReactNode, useEffect, useRef } from 'react';
import { Suspense, useState } from 'react';
import './DelaySuspense.css';

export interface DelaySuspenseProps {
  children?: ReactNode | undefined;
  fallback?: ReactNode;
  renderDelay?: number;
  /** Fade-in duration in milliseconds after the delayed content is ready. */
  fadeIn?: number;
  minVisibilityDelay?: number;
}

enum LoadingState {
  INIT = 0,
  PRE_RENDER = 1,
  RENDER = 2,
  DELAY_AWAITED = 3,
}

export const DelaySuspense = ({ children, fallback, renderDelay = 0, minVisibilityDelay = 0, fadeIn = 0 }: DelaySuspenseProps) => {
  const [loadingState, setLoadingState] = useState(LoadingState.INIT);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLoadingState(LoadingState.PRE_RENDER);
    timeoutIdRef.current && clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      setLoadingState(LoadingState.RENDER);
      timeoutIdRef.current = setTimeout(() => {
        setLoadingState(LoadingState.DELAY_AWAITED);
      }, Math.max(0, minVisibilityDelay - renderDelay));
    }, renderDelay);
    return () => {
      timeoutIdRef.current && clearTimeout(timeoutIdRef.current);
    };
  }, []);

  return (
    <Suspense fallback={fallback}>
      {loadingState >= LoadingState.RENDER && (fadeIn > 0 ? (
        <div className="delay-suspense-fade-in" style={{ animationDuration: `${fadeIn}ms` }}>
          {children}
        </div>
      ) : children)}
      {loadingState < LoadingState.DELAY_AWAITED && <PromiseThrower />}
    </Suspense>
  );
};

const PromiseThrower = () => {
  throw new Promise(() => { });
};
