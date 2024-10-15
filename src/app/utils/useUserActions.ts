import { useEffect, useRef, useState } from 'react';

export function useUserAction(timeout: number = 1000) {
  const [userAction, setUserAction] = useState(false);
  const userActionTimeoutRef = useRef<number | null>(null);

  const handleUserAction = (e: MouseEvent | KeyboardEvent | TouchEvent) => {
    if (userActionTimeoutRef.current) {
      clearTimeout(userActionTimeoutRef.current);
      userActionTimeoutRef.current = null;
    }
    setUserAction(true);

    userActionTimeoutRef.current = window.setTimeout(() => {
      setUserAction(false);
    }, timeout);
  };

  useEffect(() => {
    document.addEventListener('click', handleUserAction);
    document.addEventListener('mousemove', handleUserAction);
    document.addEventListener('keydown', handleUserAction);
    document.addEventListener('touchstart', handleUserAction);

    return () => {
      if (userActionTimeoutRef.current) {
        clearTimeout(userActionTimeoutRef.current);
        userActionTimeoutRef.current = null;
      }
      document.removeEventListener('click', handleUserAction);
      document.removeEventListener('mousemove', handleUserAction);
      document.removeEventListener('keydown', handleUserAction);
      document.removeEventListener('touchstart', handleUserAction);
    };
  });

  return userAction;
}
