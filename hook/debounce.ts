import { useEffect, useState } from "react";

export default function useDebounce(value: string, delay: number) {
  const [debouncedState, setDebouncedState] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedState(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedState;
}
