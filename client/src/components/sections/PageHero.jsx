import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * Light hero for inner pages. Optional `illus` (SVG illustration) or `photo` shown on the right.
 * `title` may contain JSX such as <em className="accent">…</em>.
 */
export default function PageHero({ eyebrow, title, lead, breadcrumbs = [], illus, photo, photoAlt = '', children }) {
  const hasVisual = Boolean(illus || photo);
  return (
    <section className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
      <div className="dots-bg mask-radial pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="wash -right-40 -top-40 h-[480px] w-[620px] bg-brand-200/40" aria-hidden="true" />
      <div className={`container-site relative grid items-center gap-14 ${hasVisual ? 'lg:grid-cols-[1.15fr_1fr]' : ''}`}>
        <div className="animate-rise">
          {breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
                <li><Link to="/" className="hover:text-ink-900">Home</Link></li>
                {breadcrumbs.map((b) => (
                  <li key={b.label} className="flex items-center gap-1.5">
                    <ChevronRight className="h-3.5 w-3.5 text-ink-300" aria-hidden="true" />
                    {b.to ? <Link to={b.to} className="hover:text-ink-900">{b.label}</Link> : <span className="text-ink-800" aria-current="page">{b.label}</span>}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}
          <h1 className="h-display max-w-4xl">{title}</h1>
          {lead && <p className="lead mt-7 max-w-2xl">{lead}</p>}
          {children && <div className="mt-10">{children}</div>}
        </div>
        {hasVisual && (
          <div className="relative animate-fade-up [animation-delay:120ms]">
            {illus ? (
              <div className="tile-soft relative flex aspect-[5/4] items-center justify-center border border-line p-8 sm:p-12">
                <img src={illus} alt="" className="h-full w-full object-contain" />
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-[2rem] border border-line shadow-float">
                <img src={photo} alt={photoAlt} className="aspect-[5/4] w-full object-cover" />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
