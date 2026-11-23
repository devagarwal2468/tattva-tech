import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import PageHero from '../components/sections/PageHero';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import { Section } from '../components/ui/Section';
import { useSeo } from '../lib/seo';
import { submitContactEnquiry } from '../services/api';
import { company, offices } from '../content/site';
import { services } from '../content/services';

const budgets = ['Not sure yet', 'Under ₹1 lakh', '₹1–5 lakh', '₹5–15 lakh', '₹15 lakh+'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (v.phone && !/^[+()\d\s-]{7,20}$/.test(v.phone.trim())) e.phone = 'Please enter a valid phone number.';
  if (v.message.trim().length < 10) e.message = 'Please tell us a little more (at least 10 characters).';
  if (v.message.length > 2000) e.message = 'Please keep your message under 2000 characters.';
  return e;
}

function ContactForm() {
  const [params] = useSearchParams();
  const presetService = params.get('service') || '';
  const topic = params.get('topic');
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: services.some((s) => s.title === presetService) ? presetService : '',
    budget: '',
    message: topic ? `I'm interested in ${topic}. ` : '',
    hp_check: '', // honeypot — real users never see or fill this
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [serverError, setServerError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`f-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus('sending');
    setServerError('');
    try {
      await submitContactEnquiry({
        ...Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()])),
        source: `website${window.location.pathname}`,
      });
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setServerError(
        err instanceof TypeError
          ? 'We couldn’t reach our server. Please check your connection, or email/WhatsApp us directly.'
          : err.message || 'Something went wrong. Please try again.',
      );
    }
  };

  if (status === 'sent') {
    return (
      <div className="card flex flex-col items-center p-10 text-center sm:p-14" role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-6 font-display text-2xl font-semibold">Thank you, {values.name.split(' ')[0]}!</h2>
        <p className="mt-3 max-w-md leading-relaxed text-ink-500">
          Your message has reached our team. We’ll get back to you at <strong className="text-ink-800">{values.email}</strong> soon.
        </p>
        <Button to="/" variant="secondary" className="mt-8">Back to home</Button>
      </div>
    );
  }

  const field = (name, label, props = {}, optional = false) => (
    <div>
      <label htmlFor={`f-${name}`} className="field-label">
        {label} {optional && <span className="font-normal text-ink-500">(optional)</span>}
      </label>
      <input
        id={`f-${name}`}
        name={name}
        value={values[name]}
        onChange={onChange}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `f-${name}-err` : undefined}
        className={`field ${errors[name] ? 'border-rose-400' : ''}`}
        {...props}
      />
      {errors[name] && <p id={`f-${name}-err`} className="field-error">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="card p-6 sm:p-10">
      <h2 className="font-display text-2xl font-semibold">Tell us about your project</h2>
      <p className="mt-2 text-ink-500">Fields marked optional can be skipped.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {field('name', 'Full name', { autoComplete: 'name', maxLength: 100 })}
        {field('email', 'Work email', { type: 'email', autoComplete: 'email', maxLength: 120 })}
        {field('phone', 'Phone / WhatsApp', { type: 'tel', autoComplete: 'tel', maxLength: 20 }, true)}
        {field('company', 'Company', { autoComplete: 'organization', maxLength: 120 }, true)}
        <div>
          <label htmlFor="f-service" className="field-label">Service <span className="font-normal text-ink-500">(optional)</span></label>
          <select id="f-service" name="service" value={values.service} onChange={onChange} className="field">
            <option value="">Select a service</option>
            {services.map((s) => <option key={s.slug}>{s.title}</option>)}
            <option>Something else</option>
          </select>
        </div>
        <div>
          <label htmlFor="f-budget" className="field-label">Budget <span className="font-normal text-ink-500">(optional)</span></label>
          <select id="f-budget" name="budget" value={values.budget} onChange={onChange} className="field">
            <option value="">Select a range</option>
            {budgets.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="f-message" className="field-label">Project details</label>
          <textarea
            id="f-message"
            name="message"
            rows={5}
            maxLength={2000}
            value={values.message}
            onChange={onChange}
            placeholder="What are you building, who is it for, and when do you need it?"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'f-message-err' : undefined}
            className={`field resize-y ${errors.message ? 'border-rose-400' : ''}`}
          />
          {errors.message && <p id="f-message-err" className="field-error">{errors.message}</p>}
        </div>
        {/* Honeypot: hidden from people, visible to naive bots */}
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="f-hp">Leave this field empty</label>
          <input id="f-hp" name="hp_check" tabIndex={-1} autoComplete="off" value={values.hp_check} onChange={onChange} />
        </div>
      </div>

      {status === 'error' && (
        <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{serverError}</p>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-500">
          By submitting, you agree to our <Link to="/privacy" className="underline hover:text-ink-700">privacy policy</Link>.
        </p>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 font-semibold text-white shadow-[0_8px_24px_-8px_rgba(31,69,236,0.6)] transition hover:bg-brand-700 disabled:opacity-60"
        >
          {status === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…</> : 'Send message'}
        </button>
      </div>
    </form>
  );
}

export default function Contact() {
  useSeo({
    title: 'Contact',
    description: `Talk to Tattva Tech about your website, app, AI, robotics or SaaS project. Email ${company.email} or call ${company.phone}.`,
  });

  const channels = [
    { icon: Mail, label: 'Email', value: company.email, href: `mailto:${company.email}` },
    { icon: Phone, label: 'Phone', value: company.phone, href: company.phoneHref },
    { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with our team', href: `https://wa.me/${company.whatsappNumber}` },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s build something great together."
        lead="Share a few details about your idea. We’ll review it and get back to you with questions, options and next steps."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          <Reveal>
            <ContactForm />
          </Reveal>
          <Reveal delay={100} className="space-y-4">
            {channels.map(({ icon: ChannelIcon, label, value, href }) => (
              <a
                key={label}
                href={href}
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="card-interactive flex items-center gap-4 p-5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <ChannelIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">{label}</span>
                  <span className="mt-0.5 block break-all font-semibold text-ink-900">{value}</span>
                </span>
              </a>
            ))}
            <div className="dark-surface rounded-2xl bg-ink-950 p-7 text-ink-300">
              <h2 className="font-display text-lg font-semibold text-white">What happens next?</h2>
              <ol className="mt-5 space-y-4 text-[0.95rem]">
                {['We review your message and reach out to clarify goals.', 'A short call to understand scope, timeline and budget.', 'You receive a written proposal with a clear plan and estimate.'].map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-200">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-ink-50/60">
        <h2 className="h-section">Our offices</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {offices.map((o, i) => (
            <Reveal key={o.city} delay={i * 80} className="card overflow-hidden">
              <img src={o.image} alt={o.imageAlt} loading="lazy" width="600" height="360" className="aspect-[5/3] w-full object-cover" />
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold">{o.city}</h3>
                <p className="mt-2 flex items-start gap-2 text-[0.95rem] leading-relaxed text-ink-500">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                  {o.address}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Open in Google Maps
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
