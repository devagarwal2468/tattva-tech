import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
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
import { getService } from '../content/services';
import { stats, technologies, processSteps, principles, faqs } from '../content/site';

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */

function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[580px]" aria-hidden="true">
      <div className="wash left-[8%] top-[6%] h-[70%] w-[70%] bg-brand-200/60" />
      <div className="wash bottom-[4%] right-[2%] h-[55%] w-[60%] bg-violet-200/50 [animation-delay:-6s]" />

      {/* Main tile */}
      <div className="absolute inset-[7%] overflow-hidden rounded-[2.5rem] border border-white/80 bg-gradient-to-br from-white via-brand-50/80 to-[#eeeaff] shadow-float">
        <img src="/assets/illus/pair-programming.svg" alt="" className="absolute inset-x-[7%] bottom-[8%] h-[74%] w-[86%] object-contain" />
        <div className="absolute left-7 top-7 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        </div>
      </div>

      {/* Floating 3D objects */}
      <img src="/assets/3d/rocket.webp" alt="" className="float-slow absolute right-[-2%] top-[2%] w-[24%] drop-shadow-[0_24px_30px_rgba(23,40,150,0.35)]" />
      <img src="/assets/3d/chat.webp" alt="" className="float-mid absolute left-[-4%] top-[30%] w-[19%] drop-shadow-[0_20px_26px_rgba(23,40,150,0.3)]" />
      <img src="/assets/3d/gear.webp" alt="" className="float-fast absolute bottom-[4%] right-[6%] w-[17%] drop-shadow-[0_20px_26px_rgba(23,40,150,0.3)]" />

      {/* Glass chips */}
      <div className="float-slow absolute bottom-[14%] left-2 flex sm:left-[-6%] items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-card backdrop-blur-md [animation-delay:-3s]">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Check className="h-4 w-4" /></span>
        <span>
          <span className="block text-[0.8rem] font-medium text-ink-900">Weekly demos</span>
          <span className="block text-[0.72rem] text-ink-500">See progress, not promises</span>
        </span>
      </div>
      <div className="float-mid absolute right-2 top-[46%] rounded-2xl sm:right-[-3%] border border-white/70 bg-white/80 px-4 py-3 shadow-card backdrop-blur-md">
        <span className="block text-[0.72rem] text-ink-500">From idea</span>
        <span className="block font-serif text-lg italic leading-tight text-ink-900">to impact</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      <div className="dots-bg mask-radial pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="container-site relative grid items-center gap-16 lg:grid-cols-[1.08fr_1fr] lg:gap-10">
        <div>
          <p className="eyebrow animate-rise">Software · AI · Robotics · Design</p>
          <h1 className="h-display mt-7" aria-label="We turn ambitious ideas into products that matter.">
            <span aria-hidden="true">
              <WordReveal text="We turn ambitious ideas into" />{' '}
              <WordReveal text="products that matter." startIndex={5} wordClassName="accent pr-[0.08em]" />
            </span>
          </h1>
          <p className="lead mt-7 max-w-xl animate-rise">
            Tattva Tech designs, builds and scales web platforms, mobile apps, AI automation, SaaS products and custom robotics — for startups, businesses and institutions.
          </p>
          <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:280ms] sm:flex-row">
            <Button to="/contact" size="lg" arrow>Start a project</Button>
            <Button to="/services" size="lg" variant="secondary">Explore services</Button>
          </div>
          <dl className="mt-14 grid max-w-lg animate-fade-up grid-cols-3 gap-6 border-t border-line pt-8 [animation-delay:360ms]">
            {stats.slice(0, 3).map((s) => (
              <div key={s.label}>
                <dd className="font-display text-[2.2rem] font-semibold leading-none tracking-tight text-ink-900"><CountUp value={s.value} /></dd>
                <dt className="mt-2 text-sm text-ink-500">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <div className="animate-fade-up [animation-delay:200ms]">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function TechStrip() {
  const row = [...technologies, ...technologies];
  return (
    <section className="border-y border-line bg-white/60 py-9" aria-label="Technologies we work with">
      <div className="container-site flex flex-col items-center gap-6 md:flex-row">
        <p className="shrink-0 text-sm text-ink-500 md:w-48">Technologies we build with</p>
        <div className="mask-fade-x w-full overflow-hidden">
          <ul className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
            {row.map((t, i) => (
              <li
                key={`${t.name}-${i}`}
                aria-hidden={i >= technologies.length ? 'true' : undefined}
                className="flex items-center gap-2.5 whitespace-nowrap font-display text-[1.05rem] font-medium text-ink-600 transition hover:text-ink-900"
              >
                <img src={`/assets/logos/${t.logo}.svg`} alt="" width="22" height="22" className="h-[22px] w-[22px] opacity-75" loading="lazy" />
                {t.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Services                                                             */
/* ------------------------------------------------------------------ */

function ServiceCard({ s, wide = false }) {
  return (
    <Link to={`/services/${s.slug}`} className={`card-interactive group flex h-full flex-col overflow-hidden ${wide ? 'lg:flex-row' : ''}`}>
      <div className={`relative overflow-hidden ${wide ? 'lg:w-[55%]' : ''} ${s.photo ? '' : 'tile-soft m-2 rounded-[1.4rem]'}`}>
        {s.photo ? (
          <img src="/assets/photos/electronics-lab.webp" alt="Engineer assembling an electronics board" loading="lazy" className="zoom-img h-60 w-full object-cover lg:h-full" />
        ) : (
          <div className="flex h-40 items-center justify-center p-5 sm:h-52 sm:p-6">
            <img src={s.illus} alt="" loading="lazy" className="zoom-img h-full w-full object-contain" />
          </div>
        )}
      </div>
      <div className={`flex flex-1 flex-col p-7 ${wide ? 'lg:justify-center lg:p-10' : 'pt-5'}`}>
        <h3 className={`font-display font-semibold tracking-tight ${wide ? 'text-2xl' : 'text-xl'}`}>{s.title}</h3>
        <p className="mt-3 leading-relaxed text-ink-500">{wide ? s.overview[1] : s.short}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-ink-900">
          Learn more <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function Services() {
  const order = ['web-development', 'mobile-app-development', 'ai-automation', 'robotics-iot', 'ui-ux-design', 'saas-development', 'digital-growth'];
  const list = order.map(getService);
  return (
    <Section>
      <SectionHeader
        eyebrow="What we do"
        title={<>One partner for software, AI, robotics and growth.</>}
        lead="Engineering, design and marketing under one roof — so your product moves from idea to impact without hand-offs between agencies."
        action={<Button to="/services" variant="secondary" arrow>All services</Button>}
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 90} className={s.slug === 'robotics-iot' ? 'md:col-span-2' : ''}>
            <ServiceCard s={s} wide={s.slug === 'robotics-iot'} />
          </Reveal>
        ))}
        <Reveal delay={180}>
          <Link to="/contact" className="group flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-[#f1efff] p-8 text-ink-900 transition duration-500 hover:-translate-y-1 hover:shadow-card-hover">
            <div>
              <p className="font-serif text-[2rem] italic leading-tight">Not sure what you need?</p>
              <p className="mt-3 text-ink-500">Tell us the problem. We’ll recommend the right mix of technology, team and budget.</p>
            </div>
            <div className="flex items-end justify-between">
              <span className="inline-flex items-center gap-1.5 font-medium">
                Free consultation <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
              <img src="/assets/3d/bulb.webp" alt="" className="float-slow h-24 w-24 object-contain" loading="lazy" />
            </div>
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Why Tattva                                                           */
/* ------------------------------------------------------------------ */

function WhyUs() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-site grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal className="relative">
          <div className="overflow-hidden rounded-[2rem] border border-line shadow-float">
            <img src="/assets/photos/design-wireframes.webp" alt="Designer sketching wireframes next to a laptop" loading="lazy" className="aspect-[4/5] w-full object-cover sm:aspect-square" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow mb-5">Why Tattva Tech</p>
            <h2 className="h-section">A long-term partner, not just a vendor.</h2>
            <p className="lead mt-6">
              We collaborate with startups, businesses, agencies and institutions through project-based work, white-label delivery, dedicated teams and long-term partnerships.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <img src={p.icon3d} alt="" width="56" height="56" className="h-14 w-14 object-contain" loading="lazy" />
                <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-500">{p.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Robotics showcase                                                    */
/* ------------------------------------------------------------------ */

function Robotics() {
  const points = ['Robot design & prototyping', 'Embedded firmware & sensors', 'Computer vision & autonomy', 'Educational robots & labs'];
  return (
    <Section className="bg-white">
      <SectionHeader
        eyebrow="Robotics & IoT"
        title={<>Software that moves in the real world.</>}
        lead="Beyond software, we design custom robots and connected devices end to end — and make robotics practical and affordable for schools, colleges, research teams and small businesses."
        action={<Button to="/services/robotics-iot" arrow>Explore robotics</Button>}
      />
      <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        <Reveal className="group relative">
          <div className="overflow-hidden rounded-[2rem] sm:h-full">
            <img src="/assets/photos/robot-cleanroom.webp" alt="Industrial robot arm in a clean-room automation lab" loading="lazy" className="zoom-img h-full min-h-[260px] w-full object-cover sm:min-h-[460px]" />
          </div>
          <div className="mt-3 rounded-3xl border border-line bg-white p-6 sm:absolute sm:bottom-6 sm:left-6 sm:mt-0 sm:max-w-md sm:border-white/60 sm:bg-white/85 sm:backdrop-blur-md">
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {points.map((t) => (
                <li key={t} className="flex items-start gap-2 text-[0.9rem] text-ink-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <Reveal delay={100} className="group relative overflow-hidden rounded-[2rem]">
            <img src="/assets/photos/robot-nao.webp" alt="Humanoid educational robot" loading="lazy" className="zoom-img h-72 w-full object-cover object-top lg:h-[270px]" />
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-ink-800 backdrop-blur">Educational robotics</span>
          </Reveal>
          <Reveal delay={180} className="group relative overflow-hidden rounded-[2rem]">
            <img src="/assets/photos/drone.webp" alt="Camera drone in flight" loading="lazy" className="zoom-img h-72 w-full object-cover lg:h-[270px]" />
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-ink-800 backdrop-blur">Drones & IoT</span>
          </Reveal>
        </div>
      </div>
      <p className="mt-4 text-xs text-ink-500">Photos: Wikimedia Commons (CC0) — illustrative of the field, not client projects.</p>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Process                                                              */
/* ------------------------------------------------------------------ */

function Process() {
  return (
    <Section>
      <SectionHeader
        align="center"
        eyebrow="How we work"
        title={<>A clear path from first call to launch.</>}
        lead="Short feedback loops, visible progress and no surprises — whether it is a website, an AI system or a robot."
      />
      <ol className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, i) => (
          <Reveal as="li" key={step.title} delay={i * 100} className="border-t border-ink-900/80 pt-7">
            <span className="font-display text-sm font-semibold tabular-nums tracking-[0.14em] text-brand-600">STEP 0{i + 1}</span>
            <h3 className="mt-5 font-display text-xl font-semibold">{step.title}</h3>
            <p className="mt-3 leading-relaxed text-ink-500">{step.desc}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Products / audiences / work                                          */
/* ------------------------------------------------------------------ */

function ProductsPreview() {
  const { data: products, loading } = useAsync(() => fetchPublicProducts(), [], []);
  if (!loading && (!products || products.length === 0)) return null;
  return (
    <Section className="bg-white">
      <SectionHeader
        eyebrow="Our products"
        title={<>Building our own products, too.</>}
        lead="SaaS products we are building in-house, with the same engineering standards we bring to client work."
        action={<Button to="/products" variant="secondary" arrow>All products</Button>}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [0, 1, 2].map((k) => <div key={k} className="card h-[440px] animate-pulse bg-ink-50" />)
          : products.slice(0, 3).map((p, i) => (
              <Reveal key={p._id || p.name} delay={i * 90}>
                <ProductCard product={p} />
              </Reveal>
            ))}
      </div>
    </Section>
  );
}

const audiences = [
  { title: 'Startups', desc: 'From idea validation and MVPs to scaling after product–market fit.', icon: '/assets/3d/rocket.webp' },
  { title: 'Businesses', desc: 'Websites, internal tools, automation and AI that cut costs and win customers.', icon: '/assets/3d/chart.webp' },
  { title: 'Schools & colleges', desc: 'Robotics labs, educational robots and digital platforms for institutions.', icon: '/assets/3d/lab.webp' },
  { title: 'Agencies & tech firms', desc: 'White-label delivery and dedicated teams when you need extra capacity.', icon: '/assets/3d/puzzle.webp' },
];

function Audiences() {
  return (
    <Section>
      <SectionHeader align="center" eyebrow="Who we work with" title={<>Built for teams of every size.</>} />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {audiences.map((a, i) => (
          <Reveal key={a.title} delay={i * 90} className="card-interactive group p-4 sm:p-7">
            <div className="tile-soft flex h-20 items-center justify-center sm:h-28">
              <img src={a.icon} alt="" width="88" height="88" className="h-14 w-14 sm:h-[88px] sm:w-[88px] object-contain transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-4deg]" loading="lazy" />
            </div>
            <h3 className="mt-4 font-display text-base font-semibold sm:mt-6 sm:text-lg">{a.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500 sm:mt-2 sm:text-base">{a.desc}</p>
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
    <Section className="bg-white">
      <SectionHeader
        eyebrow="Selected work"
        title={<>Real solutions, shipped.</>}
        action={<Button to="/work" variant="secondary" arrow>View all work</Button>}
      />
      <div className={`grid gap-6 md:grid-cols-2 ${projects.length >= 3 ? 'lg:grid-cols-3' : ''} ${projects.length === 1 ? 'md:max-w-xl' : ''}`}>
        {projects.slice(0, 3).map((p, i) => (
          <Reveal key={p._id || p.title} delay={i * 90}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Faq() {
  return (
    <Section id="faq">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <p className="eyebrow mb-5">FAQ</p>
          <h2 className="h-section">Questions, answered.</h2>
          <p className="lead mt-6">Can’t find what you are looking for?</p>
          <Link to="/contact" className="group mt-3 inline-flex items-center gap-1.5 font-medium text-ink-900">
            Talk to our team <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <img src="/assets/illus/problem-solving.svg" alt="" className="mt-12 hidden h-56 w-auto lg:block" loading="lazy" />
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
      <Services />
      <WhyUs />
      <Robotics />
      <Process />
      <ProductsPreview />
      <Audiences />
      <WorkPreview />
      <Faq />
      <CtaBand />
    </>
  );
}
