import React from 'react';
import Button from '../ui/Button';
import Reveal from '../ui/Reveal';
import { company } from '../../content/site';

export default function CtaBand({
  title = 'Have an idea? Let’s turn it into impact.',
  lead = 'Tell us what you are building. We’ll get back to you with clear next steps — no obligation.',
}) {
  return (
    <section className="px-5 pb-20 sm:px-6 sm:pb-28 lg:px-8">
      <Reveal className="dark-surface relative mx-auto max-w-site overflow-hidden rounded-[2rem] bg-ink-950 px-6 py-16 text-center sm:px-12 sm:py-20">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-brand-600/40 blur-[110px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="h-section text-white">{title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-300">{lead}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/contact" size="lg" arrow>Start a project</Button>
            <Button href={`https://wa.me/${company.whatsappNumber}`} size="lg" variant="ghostDark">Chat on WhatsApp</Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
