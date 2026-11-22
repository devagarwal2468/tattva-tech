import React, { useId } from 'react';

/** Vector Tattva "T" mark. `dark` lightens the navy end so it reads on dark backgrounds. */
export function LogoMark({ dark = false, className = 'h-8 w-auto' }) {
  const id = useId().replace(/:/g, '');
  const navy = dark ? '#4f6bff' : '#16206a';
  return (
    <svg viewBox="0 0 100 72" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="10" x2="100" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={navy} />
          <stop offset="0.5" stopColor="#1f45ec" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="55" y1="16" x2="34" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={navy} />
          <stop offset="0.45" stopColor="#1935cf" />
          <stop offset="1" stopColor="#2f6bff" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="54" y1="54" x2="92" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1f45ec" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path d="M1 5.5C30 3.5 65 2 99 .5C95 9.5 86 15 72 16L36 21.5C17 23 5.5 16.5 1 5.5Z" fill={`url(#${id}a)`} />
      <path d="M31 22L70 16.5C61 19 54.5 23 51.8 30C50.4 33.6 50 37.5 50 42V62.5C45.6 67.6 39.6 70.6 32 71.5C29.8 55 29.4 38 31 22Z" fill={`url(#${id}b)`} />
      <path d="M55 36C59 25 73 20 94 18C92 31 80 41.5 55 54.5Z" fill={`url(#${id}c)`} />
    </svg>
  );
}

export default function Logo({ dark = false, className = '' }) {
  return (
    <span className={`group flex items-center gap-2.5 ${className}`}>
      <LogoMark dark={dark} className="h-7 w-auto transition-transform duration-300 group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.15rem] font-bold tracking-tight ${dark ? 'text-white' : 'text-ink-900'}`}>Tattva Tech</span>
        <span className={`mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] ${dark ? 'text-brand-300' : 'text-brand-600'}`}>Ideas into Impact</span>
      </span>
    </span>
  );
}
