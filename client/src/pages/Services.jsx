import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import PageHero from '../components/sections/PageHero';
import CtaBand from '../components/sections/CtaBand';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import Icon from '../components/ui/Icon';
import { Section, SectionHeader } from '../components/ui/Section';
import { useSeo } from '../lib/seo';
import { services } from '../content/services';
import { processSteps } from '../content/site';

export default function Services() {
  useSeo({
    title: 'Services',
    description:
      'Web development, mobile apps, AI & automation, robotics & IoT, UI/UX and brand design, SaaS product development and digital growth — end-to-end from Tattva Tech.',
  });

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="End-to-end technology solutions for modern businesses."
        lead="We combine design, engineering and intelligent technology to build solutions that create real business impact — from the first idea to growth after launch."
        breadcrumbs={[{ label: 'Services' }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button to="/contact" size="lg" arrow>Get a proposal</Button>
          <Button href="#all-services" size="lg" variant="ghostDark">Browse services</Button>
        </div>
      </PageHero>

      <Section id="all-services">
        <div className="space-y-6">
          {services.map((s, i) => (
            <Reveal key={s.slug}>
              <article className="card group grid gap-8 overflow-hidden p-7 transition hover:border-brand-200 hover:shadow-card-hover sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
                <div>
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon name={s.icon} className="h-6 w-6" />
                    </span>
                    <span className="font-display text-sm font-semibold text-ink-500">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h2 className="mt-6 font-display text-2xl font-semibold sm:text-3xl">{s.title}</h2>
                  <p className="mt-3 text-lg leading-relaxed text-ink-500">{s.overview[0]}</p>
                  <Link to={`/services/${s.slug}`} className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700">
                    Explore {s.title} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
                <div className="rounded-2xl bg-ink-50/70 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">What we deliver</p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-[0.95rem] text-ink-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" /> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-ink-50/60">
        <SectionHeader align="center" eyebrow="Our process" title="How we turn ideas into impact." />
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 80} className="card p-7">
              <span className="font-display text-sm font-bold text-brand-600">Step {i + 1}</span>
              <h3 className="mt-3 font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-2.5 leading-relaxed text-ink-500">{p.desc}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <div className="pt-20 sm:pt-28">
        <CtaBand />
      </div>
    </>
  );
}
