import React from 'react';
import { AlertCircle, Inbox } from 'lucide-react';

export function EmptyState({ title, desc, action, illus }) {
  return (
    <div className="card mx-auto flex max-w-2xl flex-col items-center px-6 py-14 text-center">
      {illus ? (
        <img src={illus} alt="" className="mb-2 h-40 w-auto object-contain" loading="lazy" />
      ) : (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Inbox className="h-6 w-6" aria-hidden="true" />
        </span>
      )}
      <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
      {desc && <p className="mt-2 max-w-md leading-relaxed text-ink-500">{desc}</p>}
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}

export function ErrorState({ onRetry }) {
  return (
    <div className="card mx-auto flex max-w-2xl flex-col items-center px-6 py-14 text-center" role="alert">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-display text-xl font-semibold">We couldn’t load this right now.</h3>
      <p className="mt-2 max-w-md leading-relaxed text-ink-500">Please check your connection and try again in a moment.</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-6 rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-800 hover:bg-ink-50">
          Try again
        </button>
      )}
    </div>
  );
}

export function CardSkeletons({ count = 3, className = 'h-[420px]' }) {
  return Array.from({ length: count }, (_, i) => <div key={i} className={`card animate-pulse bg-ink-50 ${className}`} aria-hidden="true" />);
}
