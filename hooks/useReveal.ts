'use client';

import { useEffect } from 'react';

export function useReveal(deps: readonly unknown[] = []): void {
  useEffect(() => {
    document.documentElement.classList.add('js');

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    if ((nav.connection && nav.connection.saveData) || (nav.deviceMemory && nav.deviceMemory <= 2)) {
      document.documentElement.classList.add('lite');
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.in)'));

    if (!('IntersectionObserver' in window) || reduce.matches) {
      targets.forEach((el) => el.classList.add('in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
