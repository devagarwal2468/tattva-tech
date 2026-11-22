import React, { useEffect, useRef, useState } from 'react';

/** Animates the numeric part of a value like "50+" when it scrolls into view. */
export default function CountUp({ value, duration = 1400 }) {
  const match = String(value).match(/^(\D*)(\d+)(.*)$/);
  const ref = useRef(null);
  const [n, setN] = useState(match ? 0 : null);

  useEffect(() => {
    if (!match) return undefined;
    const target = Number(match[2]);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      setN(target);
      return undefined;
    }
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - start) / duration);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!match) return <span>{value}</span>;
  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{match[1]}{n}{match[3]}</span>
    </span>
  );
}
