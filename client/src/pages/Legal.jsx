import React from 'react';
import PageHero from '../components/sections/PageHero';
import { useSeo } from '../lib/seo';
import { company } from '../content/site';

const UPDATED = '22 November 2026';

const privacy = [
  {
    h: 'Who we are',
    p: [`This website is operated by ${company.name}. If you have any question about this policy or your data, contact us at ${company.email}.`],
  },
  {
    h: 'What we collect',
    p: [
      'Contact form: your name, email address and message, and — if you choose to provide them — your phone number, company, the service you are interested in and your budget range.',
      'Job applications: your name, email, phone number, resume file, optional portfolio or LinkedIn link and optional cover note.',
      'Technical data: like most websites, our hosting providers may process standard request information such as IP address and browser type to deliver and protect the site.',
    ],
  },
  {
    h: 'How we use it',
    p: [
      'We use the information you send only to respond to your enquiry, to assess job applications, and to keep a record of our communication with you. We do not sell your personal data.',
    ],
  },
  {
    h: 'Where it is stored',
    p: [
      'Enquiries and applications are stored in our database. Resume files and images are stored with our file-hosting provider. Notification emails are sent through our email provider. These providers process data on our behalf.',
    ],
  },
  {
    h: 'How long we keep it',
    p: ['We keep enquiries and applications only as long as needed for the purposes above, after which they are deleted.'],
  },
  {
    h: 'Your choices',
    p: [`You can ask us to access, correct or delete the personal data you have shared with us by emailing ${company.email}.`],
  },
  {
    h: 'Changes',
    p: ['We may update this policy from time to time. The date at the top shows when it was last changed.'],
  },
];

const terms = [
  {
    h: 'Using this website',
    p: [`By using this website you agree to these terms. The content is provided for general information about ${company.name} and its services and may change without notice.`],
  },
  {
    h: 'No professional advice or offer',
    p: ['Information on this site is not a binding offer. Project scope, pricing and timelines are agreed separately in a written proposal or contract.'],
  },
  {
    h: 'Intellectual property',
    p: [`The ${company.name} name, logo and website content belong to ${company.name} unless stated otherwise. Third-party names and trademarks belong to their respective owners and are used only to describe technologies we work with.`],
  },
  {
    h: 'External links',
    p: ['This site may link to external websites. We are not responsible for their content or privacy practices.'],
  },
  {
    h: 'Contact',
    p: [`Questions about these terms can be sent to ${company.email}.`],
  },
];

export default function Legal({ kind }) {
  const isPrivacy = kind === 'privacy';
  const title = isPrivacy ? 'Privacy policy' : 'Terms of use';
  useSeo({ title, description: `${title} for the ${company.name} website.` });
  const sections = isPrivacy ? privacy : terms;

  return (
    <>
      <PageHero eyebrow="Legal" title={title} lead={`Last updated: ${UPDATED}`} breadcrumbs={[{ label: title }]} />
      <div className="container-site py-16 sm:py-20">
        <div className="prose-article mx-auto max-w-3xl">
          {sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((t) => <p key={t}>{t}</p>)}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
