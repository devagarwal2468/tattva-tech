import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Visual from './Visual';

const categoryIcon = { 'Web Apps': 'Globe', 'Mobile Apps': 'Smartphone', 'SaaS Products': 'Layers', 'AI Solutions': 'Sparkles' };

export default function ProjectCard({ project }) {
  const { title, clientName, category, description, technologies = [], coverImage, projectUrl, impactMetric } = project;
  return (
    <article className="card-interactive group flex h-full flex-col overflow-hidden">
      {coverImage ? (
        <img src={coverImage} alt={`${title} screenshot`} loading="lazy" className="aspect-[16/10] w-full object-cover" />
      ) : (
        <Visual icon={categoryIcon[category] || 'Code2'} seed={title} className="aspect-[16/10]" />
      )}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
          <span className="text-brand-600">{category}</span>
          {clientName && <><span aria-hidden="true">•</span><span>{clientName}</span></>}
        </div>
        {impactMetric && impactMetric !== 'High Impact' && (
          <p className="mt-4 font-display text-2xl font-bold tracking-tight text-gradient-dark">{impactMetric}</p>
        )}
        <h3 className="mt-3 font-display text-xl font-semibold text-ink-900">{title}</h3>
        <p className="mt-2 line-clamp-4 leading-relaxed text-ink-500">{description}</p>
        {technologies.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {technologies.slice(0, 5).map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
        )}
        {projectUrl && (
          <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand-600 hover:text-brand-700">
            View project <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}
