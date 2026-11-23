import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import PageHero from '../components/sections/PageHero';
import CtaBand from '../components/sections/CtaBand';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import { Section, SectionHeader } from '../components/ui/Section';
import { useSeo } from '../lib/seo';
import { services } from '../content/services';
import { processSteps } from '../content/site';

function ServiceRow({ s, index }) {
  const flip = index % 2 === 1;
  return (
    <Reveal>
      <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <Link to={`/services/${s.slug}`} className={`group block ${flip ? 'lg:order-2' : ''}`} aria-label={`${s.title} — details`}>
          {s.photo ? (
            <div className="overflow-hidden rounded-[2rem] border border-line shadow-card">
              <img src={s.photo} alt="Robotic arm in an automation lab" loading="lazy" className="zoom-img aspect-[4/3] w-full object-cover" />
            </div>
          ) : (
            <div className="tile-soft relative flex aspect-[4/3] items-center justify-center border border-line p-10 sm:p-14">
              <img src={s.illus} alt="" loading="lazy" className="zoom-img h-full w-full object-contain" />
              <img src={s.icon3d} alt="" loading="lazy" className="float-slow absolute -top-6 right-6 h-20 w-20 drop-shadow-[0_18px_22px_rgba(23,40,150,0.3)] sm:h-24 sm:w-24" />
            </div>
          )}
        </Link>
        <div>
          <p className="font-display text-sm font-semibold tabular-nums tracking-[0.14em] text-brand-600">{String(index + 1).padStart(2, '0')}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-[2.4rem]">{s.title}</h2>
          <p className="lead mt-5">{s.overview[0]}</p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {s.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2.5 text-[0.95rem] text-ink-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" /> {d}
              </li>
            ))}
          </ul>
          <Link to={`/services/${s.slug}`} className="group mt-8 inline-flex items-center gap-1.5 font-medium text-ink-900">
            Explore {s.title}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

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
        title={<>End-to-end technology, <em className="accent">thoughtfully built.</em></>}
        lead="We combine design, engineering and intelligent technology to build solutions that create real business impact — from the first idea to growth after launch."
        breadcrumbs={[{ label: 'Services' }]}
        illus="/assets/illus/idea-process.svg"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button to="/contact" size="lg" arrow>Get a proposal</Button>
          <Button href="#all-services" size="lg" variant="secondary">Browse services</Button>
        </div>
      </PageHero>

      <section id="all-services" className="border-t border-line bg-white py-24 sm:py-32">
        <div className="container-site space-y-28 sm:space-y-36">
          {services.map((s, i) => <ServiceRow key={s.slug} s={s} index={i} />)}
        </div>
      </section>

      <Section>
        <SectionHeader align="center" eyebrow="Our process" title={<>How we turn ideas into impact.</>} />
        <ol className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 90} className="border-t border-ink-900/80 pt-7">
              <span className="font-display text-sm font-semibold tabular-nums tracking-[0.14em] text-brand-600">STEP 0{i + 1}</span>
              <h3 className="mt-5 font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-500">{p.desc}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <CtaBand />
    </>
  );
}
