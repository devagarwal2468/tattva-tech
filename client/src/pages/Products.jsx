import React, { useMemo, useState } from 'react';
import PageHero from '../components/sections/PageHero';
import CtaBand from '../components/sections/CtaBand';
import ProductCard from '../components/cards/ProductCard';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import { Section } from '../components/ui/Section';
import { CardSkeletons, EmptyState, ErrorState } from '../components/ui/States';
import { useSeo } from '../lib/seo';
import { useAsync } from '../lib/useAsync';
import { fetchPublicProducts } from '../services/api';

export default function Products() {
  useSeo({
    title: 'Products',
    description: 'In-house SaaS products from Tattva Tech for marketing, CRM, AI agents and analytics.',
  });
  const { data, loading, error, reload } = useAsync(() => fetchPublicProducts(), []);
  const [category, setCategory] = useState('All');

  const products = data || [];
  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category).filter(Boolean))], [products]);
  const featured = products.find((p) => p.isFeatured);
  const filtered = products.filter((p) => (category === 'All' ? p !== featured : p.category === category));

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Products for a smarter way to work."
        lead="Alongside client work, we build our own SaaS products — tools for outreach, sales, AI automation and analytics."
        breadcrumbs={[{ label: 'Products' }]}
      />

      <Section>
        {loading && <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"><CardSkeletons /></div>}
        {!loading && error && <ErrorState onRetry={reload} />}
        {!loading && !error && products.length === 0 && (
          <EmptyState
            title="New products are on the way."
            desc="We are preparing our product line-up. Want early access or a demo? Get in touch."
            action={<Button to="/contact" arrow>Request early access</Button>}
          />
        )}

        {!loading && !error && products.length > 0 && (
          <>
            {featured && category === 'All' && (
              <Reveal className="mb-12">
                <ProductCard product={featured} featured />
              </Reveal>
            )}
            {categories.length > 2 && (
              <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter products by category">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      category === c ? 'bg-ink-900 text-white' : 'border border-ink-200 bg-white text-ink-600 hover:border-ink-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <Reveal key={p._id || p.name} delay={(i % 3) * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </Section>

      <CtaBand title="Need a custom product built?" lead="We build SaaS products for clients too — from MVP to scale." />
    </>
  );
}
