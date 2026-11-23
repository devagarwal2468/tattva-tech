import React from 'react';
import Visual from './Visual';

/*
 * Decorative product-UI mock-ups (Stripe-style) drawn with HTML/CSS, chosen by the
 * product's `previewType`. They contain no figures or claims — only interface shapes.
 */

function Frame({ children, className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-ink-950 via-brand-950 to-brand-800 ${className}`} aria-hidden="true">
      <div className="bg-grid absolute inset-0 opacity-50" />
      <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="absolute inset-x-6 bottom-0 top-7 rounded-t-xl border border-white/10 bg-ink-900/85 p-3.5 shadow-2xl backdrop-blur transition-transform duration-500 group-hover:-translate-y-1.5 sm:inset-x-8">
        <div className="mb-3 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
        {children}
      </div>
    </div>
  );
}

const Bar = ({ w, className = 'bg-white/15' }) => <span className={`block h-2 rounded-full ${className}`} style={{ width: w }} />;

function MailPreview() {
  return (
    <div className="grid grid-cols-[38%_1fr] gap-3">
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`rounded-md p-2 ${i === 0 ? 'bg-brand-500/25 ring-1 ring-brand-400/40' : 'bg-white/[0.04]'}`}>
            <Bar w="70%" className={i === 0 ? 'bg-white/60' : 'bg-white/20'} />
            <span className="mt-1.5 block"><Bar w="90%" className="bg-white/10" /></span>
          </div>
        ))}
      </div>
      <div className="rounded-md bg-white/[0.04] p-3">
        <Bar w="55%" className="bg-white/50" />
        <div className="mt-3 space-y-1.5">
          <Bar w="95%" className="bg-white/10" />
          <Bar w="88%" className="bg-white/10" />
          <Bar w="70%" className="bg-white/10" />
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
        <div key={c} className="rounded-md bg-white/[0.04] p-2">
          <div className="mb-2 flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            <Bar w="55%" className="bg-white/30" />
          </div>
          <div className="space-y-1.5">
            {Array.from({ length: n }, (_, i) => (
              <div key={i} className="rounded border border-white/5 bg-ink-800/80 p-1.5">
                <Bar w="80%" className="bg-white/25" />
                <span className="mt-1 block"><Bar w="45%" className="bg-white/10" /></span>
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
      <div className="ml-auto w-[70%] rounded-lg rounded-br-sm bg-brand-500/40 p-2">
        <Bar w="85%" className="bg-white/50" />
      </div>
      <div className="flex gap-2">
        <span className="h-5 w-5 shrink-0 rounded-md bg-gradient-to-br from-brand-400 to-cyan-300" />
        <div className="w-[78%] rounded-lg rounded-tl-sm bg-white/[0.06] p-2">
          <Bar w="92%" className="bg-white/25" />
          <span className="mt-1.5 block"><Bar w="70%" className="bg-white/15" /></span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 pl-7">
        {['search', 'summarise', 'draft'].map((t) => (
          <span key={t} className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2 py-0.5 text-[8px] font-medium text-cyan-200">{t}</span>
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
          <div key={i} className="rounded-md bg-white/[0.04] p-2">
            <Bar w="50%" className="bg-white/15" />
            <span className="mt-1.5 block"><Bar w="70%" className="bg-white/40" /></span>
          </div>
        ))}
      </div>
      <div className="flex h-16 items-end gap-1.5 rounded-md bg-white/[0.03] p-2">
        {bars.map((h, i) => (
          <span key={i} className="flex-1 rounded-sm bg-gradient-to-t from-brand-600 to-cyan-300 opacity-90" style={{ height: `${h}%` }} />
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
