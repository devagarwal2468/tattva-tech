import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import PageHero from '../components/sections/PageHero';
import CtaBand from '../components/sections/CtaBand';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
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
  const [first, ...restWords] = service.hero.split(' ');
  const lastTwo = restWords.slice(-2).join(' ');
  const middle = restWords.slice(0, -2).join(' ');

  return (
    <>
      <PageHero
        eyebrow={service.title}
        title={<>{first} {middle} <em className="accent">{lastTwo}</em></>}
        lead={service.short}
        breadcrumbs={[{ label: 'Services', to: '/services' }, { label: service.title }]}
        illus={service.illus}
        photo={service.photo}
        photoAlt="Robotic arm in an automation lab"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button to={`/contact?service=${encodeURIComponent(service.title)}`} size="lg" arrow>Discuss your project</Button>
          <Button to="/work" size="lg" variant="secondary">See our work</Button>
        </div>
      </PageHero>

      <section className="border-t border-line bg-white py-24 sm:py-32">
        <div className="container-site grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <Reveal>
            <img src={service.icon3d} alt="" width="80" height="80" className="h-20 w-20 object-contain" />
            <h2 className="h-section mt-6">What we do</h2>
            <div className="mt-7 space-y-5 text-lg leading-relaxed text-ink-500">
              {service.overview.map((p) => <p key={p}>{p}</p>)}
            </div>
          </Reveal>
          <Reveal delay={100} className="card p-8 sm:p-10">
            <h3 className="font-display text-xl font-semibold">What you get</h3>
            <ul className="mt-6 space-y-4">
              {service.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-ink-700">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <p className="eyebrow mb-5">Technology</p>
            <h2 className="h-section">Tools we trust.</h2>
            <p className="lead mt-6">Proven, well-supported technologies — so your product is easy to maintain and hire for.</p>
          </Reveal>
          <Reveal delay={100} className="flex flex-wrap content-start gap-3">
            {service.stack.map((t) => (
              <span key={t} className="rounded-full border border-line bg-white px-5 py-2.5 text-[0.95rem] font-medium text-ink-800 shadow-card">{t}</span>
            ))}
          </Reveal>
        </div>
      </Section>

      <Section className="bg-white">
        <h2 className="h-section mb-14">How an engagement runs</h2>
        <ol className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 80} className="border-t border-ink-900/80 pt-7">
              <span className="font-display text-sm font-semibold tabular-nums tracking-[0.14em] text-brand-600">STEP 0{i + 1}</span>
              <h3 className="mt-5 font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-500">{p.desc}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section>
        <h2 className="font-display text-2xl font-semibold">Related services</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {others.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`} className="card-interactive group flex items-center gap-5 p-6">
              <img src={s.icon3d} alt="" width="64" height="64" className="h-16 w-16 shrink-0 object-contain transition-transform duration-500 group-hover:-rotate-6" />
              <div>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-ink-500 group-hover:text-ink-900">
                  Learn more <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand title={<>Let’s talk about your <em className="accent">{service.title}</em> project.</>} />
    </>
  );
}
