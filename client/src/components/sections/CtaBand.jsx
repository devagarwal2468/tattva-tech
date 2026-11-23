import React from 'react';
import Button from '../ui/Button';
import Reveal from '../ui/Reveal';
import { company } from '../../content/site';

export default function CtaBand({
  title = (
    <>
      Have an idea? Let’s turn it into <em className="accent">impact.</em>
    </>
  ),
  lead = 'Tell us what you are building. We’ll get back to you with clear next steps — no obligation.',
}) {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
      <Reveal className="relative mx-auto grid max-w-site items-center gap-10 overflow-hidden rounded-[2.25rem] border border-line bg-gradient-to-br from-brand-50 via-white to-[#f1efff] px-7 py-14 sm:px-14 sm:py-16 lg:grid-cols-[1.3fr_1fr]">
        <div className="dots-bg pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_80%_50%,#000_10%,transparent_60%)]" aria-hidden="true" />
        <div className="relative">
          <h2 className="h-section max-w-xl">{title}</h2>
          <p className="lead mt-5 max-w-lg">{lead}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button to="/contact" size="lg" arrow>Start a project</Button>
            <Button href={`https://wa.me/${company.whatsappNumber}`} size="lg" variant="secondary">Chat on WhatsApp</Button>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <img src="/assets/illus/online-meetings.svg" alt="" className="mx-auto h-64 w-auto object-contain" loading="lazy" />
          <img src="/assets/3d/chat.webp" alt="" className="float-mid absolute -left-2 top-0 h-20 w-20 drop-shadow-xl" loading="lazy" />
          <img src="/assets/3d/rocket.webp" alt="" className="float-slow absolute -right-2 bottom-2 h-20 w-20 drop-shadow-xl" loading="lazy" />
        </div>
      </Reveal>
    </section>
  );
}
