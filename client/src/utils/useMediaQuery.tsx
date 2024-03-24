import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(true); // Default value when window is not defined

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaMatch = window.matchMedia(query);
      setMatches(mediaMatch.matches);

      const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
      mediaMatch.addEventListener('change', handler);
      return () => mediaMatch.removeEventListener('change', handler);
    }
  }, [query]);

  return matches;
};
