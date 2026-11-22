import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, CircleDot } from 'lucide-react';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import Icon from '../components/ui/Icon';
import CountUp from '../components/ui/CountUp';
import WordReveal from '../components/ui/WordReveal';
import { Section, SectionHeader } from '../components/ui/Section';
import CtaBand from '../components/sections/CtaBand';
import FaqList from '../components/sections/FaqList';
import ProductCard from '../components/cards/ProductCard';
import ProjectCard from '../components/cards/ProjectCard';
import { useSeo } from '../lib/seo';
import { useAsync } from '../lib/useAsync';
import { fetchPublicProducts, fetchPublicProjects } from '../services/api';
import { services } from '../content/services';
import { stats, technologies, processSteps, principles, faqs, engagementModels } from '../content/site';

function HeroVisual() {
  const stages = [
    { name: 'Discovery', state: 'done' },
    { name: 'UX & design', state: 'done' },
    { name: 'Engineering', state: 'active', pct: 72 },
    { name: 'Launch', state: 'next' },
  ];
  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:mx-0" aria-hidden="true">
      <div className="absolute -inset-10 rounded-full bg-brand-600/25 blur-[90px]" />
      {/* Main window */}
      <div className="relative rounded-2xl border border-white/10 bg-ink-900/80 p-1.5 shadow-glow backdrop-blur-xl">
        <div className="flex items-center gap-1.5 px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-3 text-[11px] font-medium text-ink-400">project-roadmap</span>
        </div>
        <div className="rounded-xl border border-white/5 bg-ink-950/70 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">Delivery</p>
              <p className="mt-1 font-display text-lg font-semibold text-white">Your product, week by week</p>
            </div>
            <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">On track</span>
          </div>
          <ul className="mt-6 space-y-3.5">
            {stages.map((s) => (
              <li key={s.name} className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    s.state === 'done' ? 'bg-brand-500 text-white' : s.state === 'active' ? 'border border-brand-400 text-brand-300' : 'border border-white/15 text-ink-500'
                  }`}
                >
                  {s.state === 'done' ? <Check className="h-3.5 w-3.5" /> : <CircleDot className="h-3.5 w-3.5" />}
                </span>
                <span className={`w-28 text-sm ${s.state === 'next' ? 'text-ink-500' : 'text-ink-200'}`}>{s.name}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-400"
                    style={{ width: s.state === 'done' ? '100%' : s.state === 'active' ? `${s.pct}%` : '0%' }}
                  />
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              ['Web', 'Globe'],
              ['AI', 'Sparkles'],
              ['Robotics', 'Bot'],
            ].map(([label, icon]) => (
              <div key={label} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                <Icon name={icon} className="h-4 w-4 text-brand-300" />
                <p className="mt-2 text-xs font-medium text-ink-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating: AI assistant */}
      <div className="absolute -right-3 -top-8 hidden w-56 animate-float rounded-xl border border-white/10 bg-ink-900/90 p-3.5 shadow-2xl backdrop-blur-xl sm:block lg:-right-8">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-cyan-400 text-white">
            <Icon name="Sparkles" className="h-3.5 w-3.5" />
          </span>
          <p className="text-xs font-semibold text-white">AI assistant</p>
        </div>
        <p className="mt-2.5 text-[11px] leading-relaxed text-ink-300">New enquiry qualified and routed to the sales team.</p>
      </div>

      {/* Floating: device telemetry */}
      <div className="absolute -bottom-16 -left-4 hidden w-60 rounded-xl border border-white/10 bg-ink-900/90 p-3.5 shadow-2xl backdrop-blur-xl [animation-delay:1.5s] sm:block lg:-left-10 animate-float">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-white">Robot telemetry</p>
          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
          </span>
        </div>
        <svg viewBox="0 0 200 40" className="mt-2 h-9 w-full">
          <defs>
            <linearGradient id="spark" x1="0" x2="1">
              <stop offset="0" stopColor="#5b86ff" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <path d="M0 30 L20 26 L40 28 L60 18 L80 22 L100 12 L120 16 L140 8 L160 14 L180 6 L200 10" fill="none" stroke="url(#spark)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="dark-surface relative overflow-hidden bg-ink-950 pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="aurora aurora-1 -top-56 left-[8%] h-[520px] w-[620px] bg-brand-600/35" />
        <div className="aurora aurora-2 -top-24 right-[4%] h-[460px] w-[520px] bg-cyan-500/20" />
        <div className="aurora aurora-3 bottom-[-220px] left-[35%] h-[420px] w-[680px] bg-indigo-600/25" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden="true" />
      <div className="container-site relative grid items-center gap-16 lg:grid-cols-[1.08fr_1fr] lg:gap-12">
        <div className="animate-fade-up">
          <Link
            to="/services/robotics-iot"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 text-sm text-ink-300 backdrop-blur transition hover:border-white/25"
          >
            <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-white">New</span>
            Custom robotics &amp; IoT for education and industry
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <h1 className="h-display mt-7 text-white" aria-label="We turn ambitious ideas into products that matter.">
            <span aria-hidden="true">
              <WordReveal text="We turn ambitious ideas into" />{' '}
              <WordReveal text="products that matter." startIndex={5} wordClassName="text-gradient pb-1" />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300 sm:text-xl">
            Tattva Tech designs, builds and scales web platforms, mobile apps, AI automation, SaaS products and custom robotics — for startups, businesses and institutions.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button to="/contact" size="lg" arrow>Start a project</Button>
            <Button to="/services" size="lg" variant="ghostDark">Explore services</Button>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-400">
            {['Free initial consultation', 'Weekly demos', 'Support after launch'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-400" aria-hidden="true" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="animate-fade-up [animation-delay:150ms]">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function TechStrip() {
  const row = [...technologies, ...technologies];
  return (
    <section className="border-b border-ink-100 bg-white py-10" aria-label="Technologies we work with">
      <div className="container-site">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">Technologies we build with</p>
        <div className="mask-fade-x mt-7 overflow-hidden">
          <ul className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
            {row.map((t, i) => (
              <li key={`${t}-${i}`} aria-hidden={i >= technologies.length ? 'true' : undefined} className="whitespace-nowrap font-display text-lg font-semibold text-ink-600">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ServicesExplorer() {
  const [active, setActive] = useState(0);
  const s = services[active];
  return (
    <Section>
      <SectionHeader
        eyebrow="What we do"
        title="One partner for software, AI, robotics and growth."
        lead="Engineering, design and marketing under one roof — so your product moves from idea to impact without hand-offs between agencies."
        action={<Button to="/services" variant="secondary" arrow>All services</Button>}
      />

      {/* Desktop: tabbed explorer */}
      <Reveal className="hidden overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card lg:grid lg:grid-cols-[340px_1fr]">
        <div role="tablist" aria-label="Services" aria-orientation="vertical" className="border-r border-ink-100 bg-ink-50/60 p-3">
          {services.map((item, i) => (
            <button
              key={item.slug}
              role="tab"
              id={`svc-tab-${i}`}
              aria-selected={active === i}
              aria-controls="svc-panel"
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  const next = (i + (e.key === 'ArrowDown' ? 1 : -1) + services.length) % services.length;
                  setActive(next);
                  document.getElementById(`svc-tab-${next}`)?.focus();
                }
              }}
              className={`group relative flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-left transition-all duration-300 ${
                active === i ? 'bg-white shadow-card' : 'hover:bg-white/60'
              }`}
            >
              <span className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-brand-600 transition-all duration-300 ${active === i ? 'opacity-100' : 'opacity-0'}`} />
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${active === i ? 'bg-brand-600 text-white' : 'bg-white text-ink-500 group-hover:text-brand-600'}`}>
                <Icon name={item.icon} className="h-[18px] w-[18px]" />
              </span>
              <span className={`font-medium transition-colors ${active === i ? 'text-ink-900' : 'text-ink-500 group-hover:text-ink-800'}`}>{item.title}</span>
              <ArrowRight className={`ml-auto h-4 w-4 text-brand-600 transition-all duration-300 ${active === i ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} aria-hidden="true" />
            </button>
          ))}
        </div>
        <div id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${active}`} className="relative overflow-hidden p-10 xl:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-100/70 blur-3xl" aria-hidden="true" />
          <div key={s.slug} className="panel-in relative">
            <p className="eyebrow">{String(active + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}</p>
            <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight xl:text-4xl">{s.hero}</h3>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-500">{s.overview[0]}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {s.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-ink-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-2">
              {s.stack.slice(0, 7).map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button to={`/services/${s.slug}`} arrow>Explore {s.title}</Button>
              <Button to={`/contact?service=${encodeURIComponent(s.title)}`} variant="secondary">Get a quote</Button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Mobile / tablet: cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {services.map((item, i) => (
          <Reveal key={item.slug} delay={(i % 2) * 70}>
            <Link to={`/services/${item.slug}`} className="card-interactive group flex h-full flex-col p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-500">{item.short}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-600">
                Learn more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function WhyUs() {
  return (
    <Section dark className="relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-[480px] w-[480px] rounded-full bg-brand-600/15 blur-[120px]" aria-hidden="true" />
      <div className="relative grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow eyebrow-dark mb-4">Why Tattva Tech</p>
          <h2 className="h-section text-white">A long-term technology partner, not just a vendor.</h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-300">
            We collaborate with startups, businesses, agencies and institutions through project-based work, white-label delivery, dedicated teams and long-term partnerships.
          </p>
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10">
            {stats.map((s) => (
              <div key={s.label} className="border-l border-white/10 pl-5">
                <dt className="text-sm text-ink-400">{s.label}</dt>
                <dd className="mt-1 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl"><CountUp value={s.value} /></dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="spotlight spotlight-dark rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20 hover:bg-white/[0.05]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                <Icon name={p.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-400">{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

const audiences = [
  { title: 'Startups', desc: 'From idea validation and MVPs to scaling a product after product–market fit.', icon: 'Rocket' },
  { title: 'Businesses', desc: 'Websites, internal tools, automation and AI that cut costs and win customers.', icon: 'BarChart3' },
  { title: 'Schools & colleges', desc: 'Robotics labs, educational robots and digital platforms for institutions.', icon: 'Cpu' },
  { title: 'Agencies & tech companies', desc: 'White-label delivery and dedicated teams when you need extra capacity.', icon: 'Layers' },
];

function Audiences() {
  return (
    <Section className="border-b border-ink-100">
      <SectionHeader align="center" eyebrow="Who we work with" title="Built for teams of every size." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {audiences.map((a, i) => (
          <Reveal key={a.title} delay={i * 80} className="card-interactive p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-cyan-500 text-white shadow-[0_8px_20px_-8px_rgba(31,69,236,0.7)]">
              <Icon name={a.icon} className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold">{a.title}</h3>
            <p className="mt-2 leading-relaxed text-ink-500">{a.desc}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function CircuitVisual() {
  const nodes = [[60, 60], [200, 40], [320, 110], [120, 190], [260, 230], [360, 300], [80, 320], [200, 330]];
  const paths = [
    'M60 60 H140 V40 H200', 'M200 40 V110 H320', 'M60 60 V190 H120', 'M120 190 H200 V230 H260',
    'M320 110 V230 H260', 'M260 230 V300 H360', 'M120 190 V320 H80', 'M80 320 H200 V330',
  ];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]" aria-hidden="true">
      <div className="absolute inset-8 rounded-full bg-brand-600/25 blur-[80px]" />
      <svg viewBox="0 0 420 380" className="relative h-full w-full">
        <defs>
          <linearGradient id="trace-g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#5b86ff" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        {paths.map((d) => <path key={d} d={d} stroke="rgba(143,177,255,0.18)" strokeWidth="2" fill="none" />)}
        {paths.map((d, i) => <path key={`t-${d}`} d={d} className="trace" style={{ animationDelay: `${i * -0.4}s` }} stroke="url(#trace-g)" strokeWidth="2.5" strokeLinecap="round" fill="none" />)}
        {nodes.map(([x, y], i) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="11" fill="#0f1426" stroke="rgba(143,177,255,0.35)" />
            <circle cx={x} cy={y} r="4.5" fill="#5b86ff" className="pulse-node" style={{ animationDelay: `${i * 0.3}s` }} />
          </g>
        ))}
        <rect x="150" y="120" width="120" height="90" rx="16" fill="#0f1426" stroke="url(#trace-g)" strokeWidth="2" />
        <text x="210" y="160" textAnchor="middle" fill="#ffffff" fontFamily="Inter Tight, sans-serif" fontSize="15" fontWeight="700">CONTROL</text>
        <text x="210" y="182" textAnchor="middle" fill="#8fb1ff" fontFamily="Inter, sans-serif" fontSize="11">sensors · vision · AI</text>
      </svg>
    </div>
  );
}

function RoboticsBand() {
  const points = ['Robot design, architecture and prototyping', 'Embedded firmware and sensor integration', 'Computer vision and autonomous navigation', 'Educational robots and robotics labs'];
  return (
    <Section dark className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_70%_50%,#000_20%,transparent_70%)]" aria-hidden="true" />
      <div className="relative grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow eyebrow-dark mb-4">Robotics &amp; IoT</p>
          <h2 className="h-section text-white">Software that moves in the real world.</h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-300">
            Beyond software, we design custom robots and connected devices end to end — and make robotics practical and affordable for schools, colleges, research teams and small businesses.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {points.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-ink-200">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" /> {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button to="/services/robotics-iot" arrow>Explore robotics</Button>
            <Button to="/contact?service=Robotics%20%26%20IoT" variant="ghostDark">Plan a robotics project</Button>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <CircuitVisual />
        </Reveal>
      </div>
    </Section>
  );
}

function Process() {
  return (
    <Section>
      <SectionHeader
        align="center"
        eyebrow="How we work"
        title="A clear process from first call to launch."
        lead="Short feedback loops, visible progress and no surprises — whether it is a website, an AI system or a robot."
      />
      <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent lg:block" aria-hidden="true" />
        {processSteps.map((step, i) => (
          <Reveal as="li" key={step.title} delay={i * 90} className="relative">
            <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-100 bg-white font-display text-lg font-bold text-brand-600 shadow-card">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-6 font-display text-xl font-semibold">{step.title}</h3>
            <p className="mt-2.5 leading-relaxed text-ink-500">{step.desc}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function ProductsPreview() {
  const { data: products, loading } = useAsync(() => fetchPublicProducts(), [], []);
  if (!loading && (!products || products.length === 0)) return null;
  const list = (products || []).slice(0, 3);
  return (
    <Section className="bg-ink-50/60">
      <SectionHeader
        eyebrow="Our products"
        title="Building our own products, too."
        lead="In-house SaaS products built with the same engineering standards we bring to client work."
        action={<Button to="/products" variant="secondary" arrow>All products</Button>}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [0, 1, 2].map((k) => <div key={k} className="card h-[420px] animate-pulse bg-ink-50" />)
          : list.map((p, i) => (
              <Reveal key={p._id || p.name} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
      </div>
    </Section>
  );
}

function WorkPreview() {
  const { data: projects, loading } = useAsync(() => fetchPublicProjects(), [], []);
  if (loading || !projects || projects.length === 0) return null;
  return (
    <Section>
      <SectionHeader
        eyebrow="Selected work"
        title="Real solutions, shipped."
        action={<Button to="/work" variant="secondary" arrow>View all work</Button>}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.slice(0, 3).map((p, i) => (
          <Reveal key={p._id || p.title} delay={i * 80}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Engagement() {
  return (
    <Section className="border-t border-ink-100">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <p className="eyebrow mb-4">Ways to work with us</p>
          <h2 className="h-section">Flexible engagement models.</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">
            Choose what fits your stage and budget. We work with clients across India and internationally, on-site or remote.
          </p>
          <Button to="/contact" className="mt-8" arrow>Discuss your project</Button>
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 sm:grid-cols-2">
          {engagementModels.map((m, i) => (
            <Reveal key={m.title} delay={i * 70} className="bg-white p-7">
              <h3 className="font-display text-lg font-semibold">{m.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-500">{m.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Faq() {
  return (
    <Section id="faq" className="bg-ink-50/60">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <p className="eyebrow mb-4">FAQ</p>
          <h2 className="h-section">Questions, answered.</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">Can’t find what you are looking for?</p>
          <Link to="/contact" className="mt-3 inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700">
            Talk to our team <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
        <Reveal delay={100}>
          <FaqList items={faqs} />
        </Reveal>
      </div>
    </Section>
  );
}

export default function Home() {
  useSeo({
    description:
      'Tattva Tech designs and builds web platforms, mobile apps, AI automation, SaaS products and custom robotics for startups, businesses and institutions. Offices in Gurugram, Gwalior and Saharanpur.',
    path: '/',
  });
  return (
    <>
      <Hero />
      <TechStrip />
      <ServicesExplorer />
      <WhyUs />
      <Process />
      <RoboticsBand />
      <Audiences />
      <ProductsPreview />
      <WorkPreview />
      <Engagement />
      <Faq />
      <div className="pt-20 sm:pt-28">
        <CtaBand />
      </div>
    </>
  );
}
