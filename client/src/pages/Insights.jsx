import React from 'react';
import PageHero from '../components/sections/PageHero';
import CtaBand from '../components/sections/CtaBand';
import InsightCard from '../components/cards/InsightCard';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import { Section } from '../components/ui/Section';
import { CardSkeletons, EmptyState, ErrorState } from '../components/ui/States';
import { useSeo } from '../lib/seo';
import { useAsync } from '../lib/useAsync';
import { fetchPublicInsights } from '../services/api';

export default function Insights() {
  useSeo({
    title: 'Insights',
    description: 'Articles and perspectives from the Tattva Tech team on AI, software engineering, robotics and product growth.',
  });
  const { data, loading, error, reload } = useAsync(() => fetchPublicInsights(), []);
  const insights = data || [];

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Ideas, lessons and perspectives."
        lead="Notes from our team on AI, software, robotics and building products that people actually use."
        breadcrumbs={[{ label: 'Insights' }]}
      />
      <Section>
        {loading && <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"><CardSkeletons count={3} className="h-[380px]" /></div>}
        {!loading && error && <ErrorState onRetry={reload} />}
        {!loading && !error && insights.length === 0 && (
          <EmptyState
            title="Our first articles are coming soon."
            desc="In the meantime, follow us on LinkedIn for updates from the team."
            action={<Button href="https://www.linkedin.com/company/tattvaa-tech/" arrow>Follow on LinkedIn</Button>}
          />
        )}
        {!loading && !error && insights.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((item, i) => (
              <Reveal key={item._id} delay={(i % 3) * 80}>
                <InsightCard insight={item} />
              </Reveal>
            ))}
          </div>
        )}
      </Section>
      <CtaBand />
    </>
  );
}
