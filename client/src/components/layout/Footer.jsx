import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '../ui/Logo';
import { company, offices, socials } from '../../content/site';
import { services } from '../../content/services';

const socialIcons = { LinkedIn: Linkedin, Instagram };

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Our work', to: '/work' },
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
    <footer className="dark-surface relative overflow-hidden bg-ink-950 text-ink-400">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
      <div className="container-site py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm">
            <Logo dark />
            <p className="mt-5 text-[0.95rem] leading-relaxed">
              Software, AI, robotics and digital solutions for startups, businesses and institutions — built to create real impact.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map(({ label, href }) => {
                const SocialIcon = socialIcons[label];
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Tattva Tech on ${label}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-300 transition hover:border-white/30 hover:text-white"
                  >
                    {SocialIcon && <SocialIcon className="h-[18px] w-[18px]" />}
                  </a>
                );
              })}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.12em] text-white">{col.title}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-[0.95rem] transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.12em] text-white">Get in touch</h2>
            <ul className="mt-5 space-y-4 text-[0.95rem]">
              <li>
                <a href={`mailto:${company.email}`} className="flex items-start gap-3 transition hover:text-white">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                  <span className="break-all">{company.email}</span>
                </a>
              </li>
              <li>
                <a href={company.phoneHref} className="flex items-start gap-3 transition hover:text-white">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                  {company.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                <span>{offices.map((o) => o.city).join(' · ')}, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {company.legalName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white">Privacy policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
