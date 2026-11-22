import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import PageHero from '../components/sections/PageHero';
import CtaBand from '../components/sections/CtaBand';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import Icon from '../components/ui/Icon';
import { Section } from '../components/ui/Section';
import NotFound from './NotFound';
import { useSeo } from '../lib/seo';
import { getService, services } from '../content/services';
import { processSteps } from '../content/site';

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getService(slug);
  useSeo({
    title: service?.title || 'Service not found',
    description: service ? `${service.title} by Tattva Tech — ${service.short}` : undefined,
    noindex: !service,
  });
  if (!service) return <NotFound />;

  const others = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={service.title}
        title={service.hero}
        lead={service.short}
        breadcrumbs={[{ label: 'Services', to: '/services' }, { label: service.title }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button to={`/contact?service=${encodeURIComponent(service.title)}`} size="lg" arrow>Discuss your project</Button>
          <Button to="/work" size="lg" variant="ghostDark">See our work</Button>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">Overview</p>
            <h2 className="h-section">What we do</h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-500">
              {service.overview.map((p) => <p key={p}>{p}</p>)}
            </div>
          </Reveal>
          <Reveal delay={100} className="card p-8">
            <h3 className="font-display text-lg font-semibold">What you get</h3>
            <ul className="mt-5 space-y-3.5">
              {service.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-ink-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section dark>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <p className="eyebrow eyebrow-dark mb-4">Technology</p>
            <h2 className="h-section text-white">Tools we use</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-300">We choose proven, well-supported technologies so your product is easy to maintain and hire for.</p>
          </Reveal>
          <Reveal delay={100} className="flex flex-wrap content-start gap-3">
            {service.stack.map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-ink-100">{t}</span>
            ))}
          </Reveal>
        </div>
      </Section>

      <Section>
        <h2 className="h-section mb-12">How an engagement runs</h2>
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 80} className="border-t-2 border-brand-500 pt-6">
              <span className="font-display text-sm font-bold text-brand-600">0{i + 1}</span>
              <h3 className="mt-2 font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-2.5 leading-relaxed text-ink-500">{p.desc}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section className="border-t border-ink-100 bg-ink-50/60">
        <h2 className="font-display text-2xl font-semibold">Related services</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {others.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`} className="card-interactive group flex flex-col p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-500">{s.short}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-600">
                Learn more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <div className="bg-ink-50/60">
        <CtaBand title={`Let’s talk about your ${service.title} project.`} />
      </div>
    </>
  );
}
