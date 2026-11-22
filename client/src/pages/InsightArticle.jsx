import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHero from '../components/sections/PageHero';
import CtaBand from '../components/sections/CtaBand';
import { ErrorState } from '../components/ui/States';
import NotFound from './NotFound';
import { useSeo } from '../lib/seo';
import { useAsync } from '../lib/useAsync';
import { renderArticle } from '../lib/markdown';
import { fetchPublicInsights } from '../services/api';

export default function InsightArticle() {
  const { id } = useParams();
  const { data, loading, error, reload } = useAsync(() => fetchPublicInsights(), [id]);
  const article = (data || []).find((a) => a._id === id);
  useSeo({ title: article?.title || 'Insights', description: article?.summary, noindex: !loading && !article });

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-ink-950" role="status" aria-label="Loading article">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-brand-400" />
      </div>
    );
  }
  if (error) return <div className="pb-24 pt-40"><ErrorState onRetry={reload} /></div>;
  if (!article) return <NotFound />;

  const date = article.date || (article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

  return (
    <>
      <PageHero
        eyebrow={article.tag}
        title={article.title}
        lead={article.summary}
        breadcrumbs={[{ label: 'Insights', to: '/insights' }, { label: article.tag || 'Article' }]}
      >
        <p className="text-sm text-ink-400">
          {[article.author, date, article.readTime].filter(Boolean).join(' · ')}
        </p>
      </PageHero>
      <article className="container-site py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          {article.coverImage && <img src={article.coverImage} alt="" className="mb-12 w-full rounded-2xl object-cover" />}
          <div className="prose-article">{renderArticle(article.content)}</div>
          <Link to="/insights" className="mt-12 inline-flex items-center gap-2 font-semibold text-brand-600 hover:text-brand-700">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All insights
          </Link>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
