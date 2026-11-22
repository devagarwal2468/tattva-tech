import React from 'react';
import Icon from '../ui/Icon';

const palettes = [
  'from-brand-600 via-brand-500 to-cyan-400',
  'from-ink-900 via-brand-900 to-brand-600',
  'from-indigo-600 via-brand-600 to-sky-400',
  'from-sky-600 via-cyan-500 to-teal-400',
];

/** Abstract branded artwork used when a CMS item has no cover image. */
export default function Visual({ icon = 'Box', seed = '', className = '', label }) {
  const idx = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % palettes.length;
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${palettes[idx]} ${className}`} aria-hidden={label ? undefined : 'true'} role={label ? 'img' : undefined} aria-label={label}>
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-white shadow-lg backdrop-blur">
          <Icon name={icon} className="h-8 w-8" />
        </span>
      </div>
    </div>
  );
}
