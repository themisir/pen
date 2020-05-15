import { useEffect, useRef } from "react";

export function useThottle(callback: Function, delay: number) {
  const changedRef = useRef(false);

  useEffect(() => {
    let handle = setInterval(() => {
      if (changedRef.current) {
        changedRef.current = false;
        callback();
      }
    }, delay);

    return () => {
      clearInterval(handle);
    };
  }, [changedRef, callback, delay]);

  return () => (changedRef.current = true);
}
