import React from 'react';
import { Linkedin, MapPin } from 'lucide-react';
import PageHero from '../components/sections/PageHero';
import CtaBand from '../components/sections/CtaBand';
import Reveal from '../components/ui/Reveal';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import CountUp from '../components/ui/CountUp';
import { Section, SectionHeader } from '../components/ui/Section';
import { useSeo } from '../lib/seo';
import { company, leadership, offices, principles, socials, stats } from '../content/site';

const capabilities = [
  {
    title: 'Software & AI',
    icon: 'Code2',
    text: 'Custom software, web and mobile apps, AI and machine learning, AI agents, automation and SaaS product development.',
  },
  {
    title: 'Robotics & IoT',
    icon: 'Bot',
    text: 'Custom robots from architecture to prototype — educational and service robots, sensors, embedded systems, computer vision and autonomy.',
  },
  {
    title: 'Design & Growth',
    icon: 'PenTool',
    text: 'UI/UX and website design, branding, graphic design, video, social content, SEO, AEO, GEO and digital marketing.',
  },
];

export default function About() {
  useSeo({
    title: 'About Us',
    description:
      'Tattva Tech is a technology and innovation company building software, AI, robotics and digital solutions. Meet our leadership and offices in Gurugram, Gwalior and Saharanpur.',
  });
  const linkedin = socials.find((s) => s.label === 'LinkedIn')?.href;

  return (
    <>
      <PageHero
        eyebrow="About Tattva Tech"
        title="Technology, AI and robotics — built for real-world impact."
        lead={company.summary}
        breadcrumbs={[{ label: 'About' }]}
      />

      <section className="border-b border-ink-100 bg-white">
        <dl className="container-site grid grid-cols-2 divide-ink-100 py-10 md:grid-cols-4 md:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="px-2 py-4 text-center md:px-6">
              <dd className="font-display text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl"><CountUp value={s.value} /></dd>
              <dt className="mt-2 text-sm text-ink-500">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <Section>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">Our story</p>
            <h2 className="h-section">From an idea to a connected technology team.</h2>
          </Reveal>
          <Reveal delay={100} className="space-y-5 text-lg leading-relaxed text-ink-500">
            <p>
              Tattva — “essence” in Sanskrit — reflects how we work: get to the essence of a problem, then build the simplest solution that truly solves it.
            </p>
            <p>
              We help startups, businesses, educational institutions and organisations turn ideas into practical, scalable and cost-effective solutions. Whether you need a website, a mobile app, an AI system, a custom robot, a SaaS product or a brand, one team supports the complete journey — strategy, design, development, testing, deployment, marketing and ongoing improvement.
            </p>
            <p>
              We collaborate with clients in India and internationally through project-based and white-label development, dedicated teams and long-term technology partnerships.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-ink-50/60">
        <SectionHeader eyebrow="What we bring" title="Three disciplines, one team." />
        <div className="grid gap-6 md:grid-cols-3">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 80} className="card p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon name={c.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold">{c.title}</h3>
              <p className="mt-2.5 leading-relaxed text-ink-500">{c.text}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section dark>
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
            <p className="eyebrow eyebrow-dark">Mission</p>
            <p className="mt-5 font-display text-2xl font-semibold leading-snug text-white sm:text-3xl">
              To make reliable, modern technology — software, AI and robotics — practical and affordable for every organisation we work with.
            </p>
          </Reveal>
          <Reveal delay={100} className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
            <p className="eyebrow eyebrow-dark">Vision</p>
            <p className="mt-5 font-display text-2xl font-semibold leading-snug text-white sm:text-3xl">
              To become a trusted, AI-first engineering partner known for craft, speed of execution and long-term relationships.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Leadership" title="The people behind Tattva Tech." />
        <div className="grid gap-6 sm:grid-cols-2 lg:max-w-4xl">
          {leadership.map((p, i) => (
            <Reveal key={p.name} delay={i * 80} className="card flex items-center gap-6 p-7">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-cyan-500 font-display text-2xl font-bold text-white">
                {p.initials}
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                <p className="text-sm font-semibold text-brand-600">{p.role}</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-500">{p.focus}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-ink-50/60">
        <SectionHeader eyebrow="How we work" title="Principles we hold ourselves to." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="card p-7">
              <Icon name={p.icon} className="h-6 w-6 text-brand-600" />
              <h3 className="mt-5 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-500">{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Offices"
          title="Rooted in India, working worldwide."
          action={linkedin && <Button href={linkedin} variant="secondary"><Linkedin className="h-4 w-4" aria-hidden="true" /> Follow us</Button>}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {offices.map((o, i) => (
            <Reveal key={o.city} delay={i * 80} className="group relative overflow-hidden rounded-2xl">
              <img src={o.image} alt={o.imageAlt} loading="lazy" width="600" height="440" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl font-semibold text-white">{o.city}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-200">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {o.region}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
