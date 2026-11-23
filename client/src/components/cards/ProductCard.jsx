import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import Icon from '../ui/Icon';
import ProductPreview from './ProductPreview';

export default function ProductCard({ product, featured = false }) {
  const { name, tagline, description, category, badge, icon, coverImage, productUrl, previewType, features = [] } = product;
  return (
    <article className={`card-interactive group flex h-full flex-col overflow-hidden ${featured ? 'lg:flex-row' : ''}`}>
      <div className={`relative ${featured ? 'lg:w-1/2' : ''}`}>
        {coverImage ? (
          <img src={coverImage} alt={`${name} preview`} loading="lazy" className={`w-full object-cover ${featured ? 'h-64 lg:h-full' : 'aspect-[16/10]'}`} />
        ) : (
          <ProductPreview type={previewType} icon={icon} seed={name} className={featured ? 'h-64 lg:h-full lg:min-h-[340px]' : 'aspect-[16/10]'} />
        )}
        {badge && (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-800 shadow-sm backdrop-blur">{badge}</span>
        )}
      </div>
      <div className={`flex flex-1 flex-col p-6 sm:p-7 ${featured ? 'lg:p-10' : ''}`}>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">
          <Icon name={icon} className="h-4 w-4" />
          {category}
        </div>
        <h3 className={`mt-3 font-display font-semibold text-ink-900 ${featured ? 'text-3xl' : 'text-xl'}`}>{name}</h3>
        <p className="mt-2 leading-relaxed text-ink-500">{tagline}</p>
        {featured && description && <p className="mt-4 leading-relaxed text-ink-500">{description}</p>}
        {features.length > 0 && (
          <ul className={`mt-5 grid gap-2.5 ${featured ? 'sm:grid-cols-2' : ''}`}>
            {features.slice(0, featured ? 6 : 3).map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-ink-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-6">
          {productUrl ? (
            <a href={productUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
              Visit {name} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : (
            <Link to={`/contact?topic=${encodeURIComponent(name)}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
              Request early access <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
