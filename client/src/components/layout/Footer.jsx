import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, ArrowUpRight } from 'lucide-react';
import Logo from '../ui/Logo';
import { company, offices, socials } from '../../content/site';
import { services } from '../../content/services';

const socialIcons = { LinkedIn: Linkedin, Instagram };

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Work', to: '/work' },
      { label: 'Products', to: '/products' },
      { label: 'Insights', to: '/insights' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: services.map((s) => ({ label: s.title, to: `/services/${s.slug}` })),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-line bg-white">
      <div className="container-site pt-20 sm:pt-24">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-6 text-[0.98rem] leading-relaxed text-ink-500">
              Software, AI, robotics and design — built with care for startups, businesses and institutions.
            </p>
            <div className="mt-7 flex gap-2">
              {socials.map(({ label, href }) => {
                const SocialIcon = socialIcons[label];
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Tattva Tech on ${label}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-500 transition hover:border-ink-300 hover:text-ink-900"
                  >
                    {SocialIcon && <SocialIcon className="h-[17px] w-[17px]" />}
                  </a>
                );
              })}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-ink-500">{col.title}</h2>
              <ul className="mt-6 space-y-3">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-[0.95rem] text-ink-600 transition hover:text-ink-900">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-ink-500">Get in touch</h2>
            <ul className="mt-6 space-y-3 text-[0.95rem] text-ink-600">
              <li>
                <a href={`mailto:${company.email}`} className="break-all transition hover:text-ink-900">{company.email}</a>
              </li>
              <li>
                <a href={company.phoneHref} className="transition hover:text-ink-900">{company.phone}</a>
              </li>
              <li className="pt-2 text-ink-500">{offices.map((o) => o.city).join(' · ')}</li>
            </ul>
            <Link to="/contact" className="group mt-7 inline-flex items-center gap-1.5 font-medium text-ink-900">
              Start a project
              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line py-8 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {company.legalName}. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/privacy" className="hover:text-ink-900">Privacy</Link>
            <Link to="/terms" className="hover:text-ink-900">Terms</Link>
            <Link to="/credits" className="hover:text-ink-900">Image credits</Link>
          </div>
        </div>
      </div>
      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[3vw] select-none whitespace-nowrap bg-gradient-to-b from-ink-900/[0.07] to-ink-900/0 bg-clip-text text-center font-display text-[19vw] font-semibold leading-[0.9] tracking-[-0.05em] text-transparent"
      >
        Tattva Tech
      </p>
    </footer>
  );
}
