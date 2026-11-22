import React from 'react';
import { Link } from 'react-router-dom';
import Visual from './Visual';

const visualIcon = { robot: 'Bot', laptop: 'Code2', code: 'Code2' };

export default function InsightCard({ insight }) {
  const { _id, title, tag, readTime, date, summary, coverImage, previewVisual, createdAt } = insight;
  const shownDate = date || (createdAt ? new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
  return (
    <article className="card-interactive group relative flex h-full flex-col overflow-hidden">
      {coverImage ? (
        <img src={coverImage} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
      ) : (
        <Visual icon={visualIcon[previewVisual] || 'Sparkles'} seed={title} className="aspect-[16/9]" />
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-ink-500">
          <span className="font-semibold uppercase tracking-[0.12em] text-brand-600">{tag}</span>
          {readTime && <><span aria-hidden="true">•</span><span>{readTime}</span></>}
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
          <Link to={`/insights/${_id}`} className="after:absolute after:inset-0">{title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed text-ink-500">{summary}</p>
        {shownDate && <p className="mt-auto pt-5 text-sm text-ink-500">{shownDate}</p>}
      </div>
    </article>
  );
}
