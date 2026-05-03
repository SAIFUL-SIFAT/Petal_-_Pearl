import { useCallback, useRef } from 'react';

/**
 * Custom hook to throttle a function.
 * Useful for limiting the rate at which a function can be called.
 * 
 * @param callback The function to throttle
 * @param limit The limit in milliseconds
 * @returns A throttled version of the callback
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): (...args: Parameters<T>) => void {
  const lastRun = useRef<number>(Date.now());
  const inThrottle = useRef<boolean>(false);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (!inThrottle.current || now - lastRun.current >= limit) {
        callback(...args);
        lastRun.current = now;
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    },
    [callback, limit]
  );
}
