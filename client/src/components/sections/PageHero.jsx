import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/** Dark hero used at the top of every inner page. */
export default function PageHero({ eyebrow, title, lead, breadcrumbs = [], children }) {
  return (
    <section className="dark-surface relative overflow-hidden bg-ink-950 pb-20 pt-36 sm:pb-24 sm:pt-44">
      <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="aurora aurora-1 -top-52 left-[15%] h-[460px] w-[640px] bg-brand-600/30" />
        <div className="aurora aurora-2 -right-24 top-10 h-[360px] w-[420px] bg-cyan-500/15" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden="true" />
      <div className="container-site relative">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-400">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              {breadcrumbs.map((b) => (
                <li key={b.label} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  {b.to ? <Link to={b.to} className="hover:text-white">{b.label}</Link> : <span className="text-ink-200" aria-current="page">{b.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="max-w-4xl animate-fade-up">
          {eyebrow && <p className="eyebrow eyebrow-dark mb-5">{eyebrow}</p>}
          <h1 className="h-display text-white">{title}</h1>
          {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-300 sm:text-xl">{lead}</p>}
          {children && <div className="mt-10">{children}</div>}
        </div>
      </div>
    </section>
  );
}
