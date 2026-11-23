import React from 'react';

// Blue-clay 3D icons (CC0, see design-assets/credits.json) used as fallback artwork.
const art = {
  Globe: 'computer', Smartphone: 'mobile', Layers: 'cube', Sparkles: 'chat', Code2: 'computer', Bot: 'gear',
  Send: 'chat', Users: 'puzzle', BarChart3: 'chart', Cpu: 'gear', Box: 'cube', Rocket: 'rocket', Mail: 'chat',
};

/** Soft branded artwork used when a CMS item has no cover image. */
export default function Visual({ icon = 'Box', className = '' }) {
  const src = `/assets/3d/${art[icon] || 'cube'}.webp`;
  return (
    <div className={`tile-soft relative flex items-center justify-center overflow-hidden ${className}`} aria-hidden="true">
      <div className="dots-bg absolute inset-0 opacity-40" />
      <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-violet-200/60 blur-3xl" />
      <div className="absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-brand-200/60 blur-3xl" />
      <img src={src} alt="" loading="lazy" className="relative h-28 w-28 object-contain drop-shadow-[0_20px_24px_rgba(23,40,150,0.3)] transition-transform duration-700 group-hover:-translate-y-1.5 group-hover:rotate-[-4deg]" />
    </div>
  );
}
