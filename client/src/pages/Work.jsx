import React, { useMemo, useState } from 'react';
import PageHero from '../components/sections/PageHero';
import CtaBand from '../components/sections/CtaBand';
import ProjectCard from '../components/cards/ProjectCard';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import { Section } from '../components/ui/Section';
import { CardSkeletons, EmptyState, ErrorState } from '../components/ui/States';
import { useSeo } from '../lib/seo';
import { useAsync } from '../lib/useAsync';
import { fetchPublicProjects } from '../services/api';

export default function Work() {
  useSeo({
    title: 'Our Work',
    description: 'Case studies and projects delivered by Tattva Tech across web apps, mobile apps, SaaS products and AI solutions.',
  });
  const { data, loading, error, reload } = useAsync(() => fetchPublicProjects(), []);
  const [category, setCategory] = useState('All');
  const projects = data || [];
  const categories = useMemo(() => ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))], [projects]);
  const shown = category === 'All' ? projects : projects.filter((p) => p.category === category);

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title={<>Real solutions. <em className="accent">Real impact.</em></>}
        illus="/assets/illus/landing-page.svg"
        lead="A selection of products and systems we have designed, engineered and launched with our clients."
        breadcrumbs={[{ label: 'Work' }]}
      />
      <Section>
        <h2 className="sr-only">Projects</h2>
        {loading && <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"><CardSkeletons /></div>}
        {!loading && error && <ErrorState onRetry={reload} />}
        {!loading && !error && projects.length === 0 && (
          <EmptyState
            illus="/assets/illus/real-time-collaboration.svg"
            title="Case studies are being published."
            desc="Many of our projects are under NDA. We’re happy to walk you through relevant work and references on a call."
            action={<Button to="/contact" arrow>Ask for references</Button>}
          />
        )}
        {!loading && !error && projects.length > 0 && (
          <>
            {categories.length > 2 && (
              <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
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
              {shown.map((p, i) => (
                <Reveal key={p._id || p.title} delay={(i % 3) * 80}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </Section>
      <CtaBand title={<>Your project could be <em className="accent">next.</em></>} />
    </>
  );
}
