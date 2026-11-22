import React from 'react';
import Reveal from './Reveal';

export function Section({ id, className = '', dark = false, children }) {
  return (
    <section id={id} className={`${dark ? 'dark-surface bg-ink-950 text-ink-300' : ''} py-20 sm:py-28 ${className}`}>
      <div className="container-site">{children}</div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, lead, align = 'left', dark = false, action, className = '' }) {
  const center = align === 'center';
  return (
    <Reveal className={`mb-12 sm:mb-16 ${center ? 'mx-auto max-w-3xl text-center' : 'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'} ${className}`}>
      <div className={center ? '' : 'max-w-3xl'}>
        {eyebrow && <p className={`eyebrow mb-4 ${dark ? 'eyebrow-dark' : ''}`}>{eyebrow}</p>}
        <h2 className={`h-section ${dark ? 'text-white' : ''}`}>{title}</h2>
        {lead && <p className={`mt-5 text-lg leading-relaxed ${dark ? 'text-ink-300' : 'text-ink-500'}`}>{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
