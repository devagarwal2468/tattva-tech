import React from 'react';
import Reveal from './Reveal';

export function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`py-24 sm:py-32 ${className}`}>
      <div className="container-site">{children}</div>
    </section>
  );
}

/** Heading block. `title` may contain JSX (e.g. <em className="accent">). */
export function SectionHeader({ eyebrow, title, lead, align = 'left', action, className = '' }) {
  const center = align === 'center';
  return (
    <Reveal className={`mb-14 sm:mb-20 ${center ? 'mx-auto max-w-3xl text-center' : 'flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'} ${className}`}>
      <div className={center ? '' : 'max-w-3xl'}>
        {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
        <h2 className="h-section">{title}</h2>
        {lead && <p className={`lead mt-6 ${center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
