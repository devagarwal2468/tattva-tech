import React from 'react';
import { Linkedin, MapPin } from 'lucide-react';
import PageHero from '../components/sections/PageHero';
import CtaBand from '../components/sections/CtaBand';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import CountUp from '../components/ui/CountUp';
import { Section, SectionHeader } from '../components/ui/Section';
import { useSeo } from '../lib/seo';
import { company, engagementModels, leadership, offices, principles, socials, stats } from '../content/site';

const capabilities = [
  {
    title: 'Software & AI',
    icon: '/assets/3d/computer.webp',
    text: 'Custom software, web and mobile apps, AI and machine learning, AI agents, automation and SaaS product development.',
  },
  {
    title: 'Robotics & IoT',
    icon: '/assets/3d/gear.webp',
    text: 'Custom robots from architecture to prototype — educational and service robots, sensors, embedded systems, computer vision and autonomy.',
  },
  {
    title: 'Design & Growth',
    icon: '/assets/3d/palette.webp',
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
        title={<>Technology built for <em className="accent">real-world impact.</em></>}
        lead={company.summary}
        breadcrumbs={[{ label: 'About' }]}
        illus="/assets/illus/team-up.svg"
      />

      <section className="border-y border-line bg-white">
        <dl className="container-site grid grid-cols-2 py-12 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`px-2 py-4 text-center md:px-6 ${i > 0 ? 'md:border-l md:border-line' : ''}`}>
              <dd className="font-display text-5xl font-semibold tracking-tight text-ink-900 sm:text-6xl"><CountUp value={s.value} /></dd>
              <dt className="mt-2 text-sm text-ink-500">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="overflow-hidden rounded-[2rem] border border-line shadow-float">
            <img src="/assets/photos/design-wireframes.webp" alt="Hands sketching a product on a laptop and paper wireframes" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow mb-5">Our story</p>
            <h2 className="h-section">From an idea to a connected team.</h2>
            <div className="mt-7 space-y-5 text-lg leading-relaxed text-ink-500">
              <p>
                Tattva — “essence” in Sanskrit — reflects how we work: get to the essence of a problem, then build the simplest solution that truly solves it.
              </p>
              <p>
                We help startups, businesses, educational institutions and organisations turn ideas into practical, scalable and cost-effective solutions — one team for strategy, design, development, testing, deployment, marketing and ongoing improvement.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-white">
        <SectionHeader align="center" eyebrow="What we bring" title={<>Three disciplines, one team.</>} />
        <div className="grid gap-6 md:grid-cols-3">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 90} className="card-interactive group p-8">
              <div className="tile-soft flex h-36 items-center justify-center">
                <img src={c.icon} alt="" width="104" height="104" className="h-[104px] w-[104px] object-contain transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-5deg]" loading="lazy" />
              </div>
              <h3 className="mt-7 font-display text-xl font-semibold">{c.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-500">{c.text}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            ['Mission', 'To make reliable, modern technology — software, AI and robotics — practical and affordable for every organisation we work with.'],
            ['Vision', 'To become a trusted, AI-first engineering partner known for craft, speed of execution and long-term relationships.'],
          ].map(([label, text], i) => (
            <Reveal key={label} delay={i * 100} className="card p-9 sm:p-12">
              <p className="eyebrow">{label}</p>
              <p className="mt-6 font-serif text-[1.9rem] leading-snug text-ink-900 sm:text-[2.3rem]">{text}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <SectionHeader eyebrow="Leadership" title={<>The people behind Tattva Tech.</>} />
        <div className="grid gap-6 sm:grid-cols-2 lg:max-w-4xl">
          {leadership.map((p, i) => (
            <Reveal key={p.name} delay={i * 90} className="card flex items-center gap-6 p-7">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-brand-50 to-[#ece9ff] font-serif text-3xl italic text-brand-700">
                {p.initials}
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                <p className="text-sm font-medium text-brand-600">{p.role}</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-500">{p.focus}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="How we work" title={<>Principles we live by.</>} />
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <img src={p.icon3d} alt="" width="64" height="64" className="h-16 w-16 object-contain" loading="lazy" />
              <h3 className="mt-5 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-500">{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <SectionHeader eyebrow="Ways to work with us" title={<>Flexible engagement models.</>} />
        <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {engagementModels.map((m, i) => (
            <Reveal key={m.title} delay={i * 70} className="bg-white p-8">
              <span className="font-display text-sm font-semibold tabular-nums tracking-[0.14em] text-brand-600">0{i + 1}</span>
              <h3 className="mt-4 font-display text-lg font-semibold">{m.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-500">{m.desc}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Offices"
          title={<>Rooted in India, <em className="accent">working worldwide.</em></>}
          action={linkedin && <Button href={linkedin} variant="secondary"><Linkedin className="h-4 w-4" aria-hidden="true" /> Follow us</Button>}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {offices.map((o, i) => (
            <Reveal key={o.city} delay={i * 90} className="group overflow-hidden rounded-[1.75rem] border border-line bg-white">
              <div className="overflow-hidden">
                <img src={o.image} alt={o.imageAlt} loading="lazy" width="600" height="440" className="zoom-img aspect-[4/3] w-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold">{o.city}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
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
