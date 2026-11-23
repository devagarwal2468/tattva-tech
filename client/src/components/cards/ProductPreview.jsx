import React from 'react';
import Visual from './Visual';

/*
 * Decorative product-UI mock-ups (Stripe-style) drawn with HTML/CSS, chosen by the
 * product's `previewType`. They contain no figures or claims — only interface shapes.
 */

function Frame({ children, className = '' }) {
  return (
    <div className={`tile-soft relative overflow-hidden ${className}`} aria-hidden="true">
      <div className="dots-bg absolute inset-0 opacity-40" />
      <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-violet-200/60 blur-3xl" />
      <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-brand-200/60 blur-3xl" />
      <div className="absolute inset-x-6 bottom-0 top-7 rounded-t-2xl border border-line bg-white p-3.5 shadow-[0_20px_40px_-20px_rgba(23,40,150,0.35)] transition-transform duration-700 group-hover:-translate-y-1.5 sm:inset-x-8">
        <div className="mb-3 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink-200" />
          <span className="h-2 w-2 rounded-full bg-ink-200" />
          <span className="h-2 w-2 rounded-full bg-ink-200" />
        </div>
        {children}
      </div>
    </div>
  );
}

const Bar = ({ w, className = 'bg-ink-100' }) => <span className={`block h-2 rounded-full ${className}`} style={{ width: w }} />;

function MailPreview() {
  return (
    <div className="grid grid-cols-[38%_1fr] gap-3">
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`rounded-md p-2 ${i === 0 ? 'bg-brand-50 ring-1 ring-brand-200' : 'bg-ink-50'}`}>
            <Bar w="70%" className={i === 0 ? 'bg-ink-700' : 'bg-ink-200'} />
            <span className="mt-1.5 block"><Bar w="90%" className="bg-ink-100" /></span>
          </div>
        ))}
      </div>
      <div className="rounded-md bg-ink-50 p-3">
        <Bar w="55%" className="bg-ink-700" />
        <div className="mt-3 space-y-1.5">
          <Bar w="95%" className="bg-ink-100" />
          <Bar w="88%" className="bg-ink-100" />
          <Bar w="70%" className="bg-ink-100" />
        </div>
        <span className="mt-4 inline-block rounded-md bg-gradient-to-r from-brand-500 to-cyan-400 px-3 py-1.5 text-[9px] font-semibold text-white">Send campaign</span>
      </div>
    </div>
  );
}

function CrmPreview() {
  const cols = [['bg-sky-400', 3], ['bg-brand-400', 2], ['bg-emerald-400', 2]];
  return (
    <div className="grid grid-cols-3 gap-2">
      {cols.map(([dot, n], c) => (
        <div key={c} className="rounded-md bg-ink-50 p-2">
          <div className="mb-2 flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            <Bar w="55%" className="bg-ink-300" />
          </div>
          <div className="space-y-1.5">
            {Array.from({ length: n }, (_, i) => (
              <div key={i} className="rounded border border-line bg-white p-1.5">
                <Bar w="80%" className="bg-ink-200" />
                <span className="mt-1 block"><Bar w="45%" className="bg-ink-100" /></span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AgentPreview() {
  return (
    <div className="space-y-2.5">
      <div className="ml-auto w-[70%] rounded-lg rounded-br-sm bg-brand-600 p-2">
        <Bar w="85%" className="bg-ink-700" />
      </div>
      <div className="flex gap-2">
        <span className="h-5 w-5 shrink-0 rounded-md bg-gradient-to-br from-brand-400 to-cyan-300" />
        <div className="w-[78%] rounded-lg rounded-tl-sm bg-ink-50 p-2">
          <Bar w="92%" className="bg-ink-200" />
          <span className="mt-1.5 block"><Bar w="70%" className="bg-ink-100" /></span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 pl-7">
        {['search', 'summarise', 'draft'].map((t) => (
          <span key={t} className="rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-[8px] font-medium text-brand-700">{t}</span>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPreview() {
  const bars = [35, 55, 42, 70, 60, 85, 72];
  return (
    <div>
      <div className="mb-3 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-md bg-ink-50 p-2">
            <Bar w="50%" className="bg-ink-100" />
            <span className="mt-1.5 block"><Bar w="70%" className="bg-ink-300" /></span>
          </div>
        ))}
      </div>
      <div className="flex h-16 items-end gap-1.5 rounded-md bg-ink-50 p-2">
        {bars.map((h, i) => (
          <span key={i} className="flex-1 rounded-sm bg-gradient-to-t from-brand-600 to-brand-300 opacity-90" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

const previews = { mail: MailPreview, crm: CrmPreview, agent: AgentPreview, analytics: AnalyticsPreview };

export default function ProductPreview({ type, icon, seed, className = '' }) {
  const Preview = previews[type];
  if (!Preview) return <Visual icon={icon} seed={seed} className={className} />;
  return (
    <Frame className={className}>
      <Preview />
    </Frame>
  );
}
