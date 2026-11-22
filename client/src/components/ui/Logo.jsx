import React from 'react';

export default function Logo({ dark = false, className = '' }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <img src="/logo-mark.png" alt="" width="36" height="36" className="h-9 w-9 object-contain" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.15rem] font-bold tracking-tight ${dark ? 'text-white' : 'text-ink-900'}`}>Tattva Tech</span>
        <span className={`mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] ${dark ? 'text-brand-300' : 'text-brand-600'}`}>Ideas into Impact</span>
      </span>
    </span>
  );
}
