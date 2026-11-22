import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Briefcase, CheckCircle2, ChevronDown, Clock, Loader2, MapPin, Upload, X } from 'lucide-react';
import PageHero from '../components/sections/PageHero';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { Section, SectionHeader } from '../components/ui/Section';
import { CardSkeletons, EmptyState, ErrorState } from '../components/ui/States';
import { useSeo } from '../lib/seo';
import { useAsync } from '../lib/useAsync';
import { fetchPublicJobs, submitJobApplication } from '../services/api';
import { company } from '../content/site';

const perks = [
  { title: 'Real ownership', icon: 'Target', desc: 'Work on real client and product problems from your first week.' },
  { title: 'Learn across domains', icon: 'Sparkles', desc: 'Software, AI, robotics and design under one roof — pick up skills beyond your role.' },
  { title: 'Flexible work', icon: 'Globe', desc: 'Offices in Gurugram, Gwalior and Saharanpur, with remote-friendly roles where possible.' },
  { title: 'Supportive team', icon: 'Users', desc: 'Code reviews, mentorship and an open, ego-free culture.' },
];

const MAX_MB = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function ApplyDialog({ job, onClose }) {
  const dialogRef = useRef(null);
  const [values, setValues] = useState({ applicantName: '', email: '', phone: '', portfolioUrl: '', coverLetter: '' });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
    const onCancel = (e) => {
      e.preventDefault();
      onClose();
    };
    d?.addEventListener('cancel', onCancel);
    return () => d?.removeEventListener('cancel', onCancel);
  }, [onClose]);

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (values.applicantName.trim().length < 2) e.applicantName = 'Please enter your full name.';
    if (!EMAIL_RE.test(values.email.trim())) e.email = 'Please enter a valid email.';
    if (!/^[+()\d\s-]{7,20}$/.test(values.phone.trim())) e.phone = 'Please enter a valid phone number.';
    if (values.portfolioUrl && !/^https?:\/\/\S+\.\S+/.test(values.portfolioUrl.trim())) e.portfolioUrl = 'Link should start with https://';
    if (!file) e.resume = 'Please attach your resume.';
    else if (!/\.(pdf|docx?)$/i.test(file.name)) e.resume = 'Resume must be a PDF, DOC or DOCX file.';
    else if (file.size > MAX_MB * 1024 * 1024) e.resume = `Resume must be smaller than ${MAX_MB} MB.`;
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;
    setStatus('sending');
    setServerError('');
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v.trim()));
    fd.append('jobId', job._id);
    fd.append('jobTitle', job.title);
    fd.append('resume', file);
    try {
      await submitJobApplication(fd);
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setServerError(err instanceof TypeError ? 'We couldn’t reach our server. Please try again shortly.' : err.message);
    }
  };

  const input = (name, label, props = {}) => (
    <div>
      <label htmlFor={`a-${name}`} className="field-label">{label}</label>
      <input id={`a-${name}`} name={name} value={values[name]} onChange={onChange} aria-invalid={Boolean(errors[name])} className={`field ${errors[name] ? 'border-rose-400' : ''}`} {...props} />
      {errors[name] && <p className="field-error">{errors[name]}</p>}
    </div>
  );

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="apply-title"
      className="w-[min(100%-2rem,640px)] max-h-[90vh] overflow-y-auto rounded-2xl p-0 shadow-2xl backdrop:bg-ink-950/70 backdrop:backdrop-blur-sm"
      onClick={(e) => e.target === dialogRef.current && onClose()}
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">Apply</p>
            <h2 id="apply-title" className="mt-1 font-display text-2xl font-semibold">{job.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-ink-400 hover:bg-ink-50 hover:text-ink-900" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {status === 'sent' ? (
          <div className="py-10 text-center" role="status">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" aria-hidden="true" />
            <h3 className="mt-4 font-display text-xl font-semibold">Application received</h3>
            <p className="mt-2 text-ink-500">Thank you for applying. Our team will review your profile and contact you if there is a match.</p>
            <Button onClick={onClose} variant="secondary" className="mt-6">Close</Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
            {input('applicantName', 'Full name', { autoComplete: 'name', maxLength: 100 })}
            {input('email', 'Email', { type: 'email', autoComplete: 'email', maxLength: 120 })}
            {input('phone', 'Phone', { type: 'tel', autoComplete: 'tel', maxLength: 20 })}
            {input('portfolioUrl', 'LinkedIn / portfolio (optional)', { type: 'url', placeholder: 'https://', maxLength: 300 })}
            <div className="sm:col-span-2">
              <span className="field-label">Resume</span>
              <label
                htmlFor="a-resume"
                className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-4 transition hover:border-brand-400 hover:bg-brand-50/40 ${errors.resume ? 'border-rose-400' : 'border-ink-200'}`}
              >
                <Upload className="h-5 w-5 text-brand-600" aria-hidden="true" />
                <span className="text-sm text-ink-600">{file ? file.name : `Upload PDF, DOC or DOCX (max ${MAX_MB} MB)`}</span>
              </label>
              <input
                id="a-resume"
                type="file"
                accept=".pdf,.doc,.docx"
                className="sr-only"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setErrors((er) => ({ ...er, resume: undefined }));
                }}
              />
              {errors.resume && <p className="field-error">{errors.resume}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="a-coverLetter" className="field-label">Why are you a good fit? (optional)</label>
              <textarea id="a-coverLetter" name="coverLetter" rows={4} maxLength={3000} value={values.coverLetter} onChange={onChange} className="field" />
            </div>
            {status === 'error' && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:col-span-2" role="alert">{serverError}</p>}
            <div className="sm:col-span-2">
              <button type="submit" disabled={status === 'sending'} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60">
                {status === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Submitting…</> : 'Submit application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}

function JobItem({ job, onApply }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="card overflow-hidden">
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">{job.department}</p>
          <h3 className="mt-1.5 font-display text-xl font-semibold">{job.title}</h3>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-500">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" aria-hidden="true" /> {job.location}</span>
            <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" aria-hidden="true" /> {job.employmentType}</span>
            {job.deadline && (
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden="true" /> Apply by {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-50">
            Details <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          <Button size="sm" onClick={() => onApply(job)}>Apply now</Button>
        </div>
      </div>
      {open && (
        <div className="grid gap-8 border-t border-ink-100 bg-ink-50/50 p-6 sm:p-7 md:grid-cols-2">
          <div className="md:col-span-2">
            <p className="whitespace-pre-line leading-relaxed text-ink-600">{job.description}</p>
            {job.salary && <p className="mt-3 text-sm text-ink-500"><strong className="text-ink-800">Compensation:</strong> {job.salary}</p>}
          </div>
          {job.responsibilities?.length > 0 && (
            <div>
              <h4 className="font-display font-semibold">Responsibilities</h4>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.95rem] text-ink-600">{job.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
          )}
          {job.requirements?.length > 0 && (
            <div>
              <h4 className="font-display font-semibold">Requirements</h4>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.95rem] text-ink-600">{job.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function Careers() {
  useSeo({
    title: 'Careers',
    description: 'Join Tattva Tech. Open roles in software engineering, AI, robotics, design and growth across Gurugram, Gwalior and Saharanpur.',
  });
  const { data, loading, error, reload } = useAsync(() => fetchPublicJobs(), []);
  const [applyFor, setApplyFor] = useState(null);
  const closeApply = useCallback(() => setApplyFor(null), []);
  const jobs = data || [];

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build the future with us."
        lead="We’re a growing team of engineers, designers and makers working across software, AI and robotics. If you love building things that matter, we’d like to meet you."
        breadcrumbs={[{ label: 'Careers' }]}
      >
        <Button href="#open-roles" size="lg" arrow>See open roles</Button>
      </PageHero>

      <Section>
        <SectionHeader eyebrow="Life at Tattva" title="Why work with us" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="card p-7">
              <Icon name={p.icon} className="h-6 w-6 text-brand-600" />
              <h3 className="mt-5 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-500">{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="open-roles" className="bg-ink-50/60">
        <SectionHeader eyebrow="Open roles" title="Current openings" />
        <div className="space-y-4">
          {loading && <CardSkeletons count={3} className="h-28" />}
          {!loading && error && <ErrorState onRetry={reload} />}
          {!loading && !error && jobs.length === 0 && (
            <EmptyState
              title="No open roles right now."
              desc={`We’re always happy to hear from talented people. Send your resume to ${company.email}.`}
              action={<Button href={`mailto:${company.email}?subject=${encodeURIComponent('Job application')}`} arrow>Send your resume</Button>}
            />
          )}
          {!loading && !error && jobs.map((job) => <JobItem key={job._id} job={job} onApply={setApplyFor} />)}
        </div>
      </Section>

      {applyFor && <ApplyDialog job={applyFor} onClose={closeApply} />}
    </>
  );
}
