import React from 'react';
import PageHero from '../components/sections/PageHero';
import { useSeo } from '../lib/seo';
import { credits } from '../content/credits';

export default function Credits() {
  useSeo({ title: 'Image credits', description: 'Sources and licences of the illustrations, 3D icons and photos used on the Tattva Tech website.' });
  return (
    <>
      <PageHero
        eyebrow="Credits"
        title={<>Image <em className="accent">credits</em></>}
        lead="We only use visuals that are free for commercial use. Thank you to the creators below."
        breadcrumbs={[{ label: 'Image credits' }]}
      />
      <div className="container-site pb-28">
        <div className="overflow-hidden rounded-[1.75rem] border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-canvas text-xs uppercase tracking-[0.14em] text-ink-500">
              <tr>
                <th className="px-5 py-4 font-medium">Source</th>
                <th className="px-5 py-4 font-medium">Creator</th>
                <th className="px-5 py-4 font-medium">Licence</th>
                <th className="hidden px-5 py-4 font-medium md:table-cell">Used for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {credits.map((c) => (
                <tr key={`${c.source}-${c.url}`} className="align-top">
                  <td className="px-5 py-4">
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-medium text-ink-900 underline decoration-line underline-offset-4 hover:decoration-ink-900">{c.source}</a>
                  </td>
                  <td className="px-5 py-4 text-ink-600">{c.by || '—'}</td>
                  <td className="px-5 py-4 text-ink-600">{c.license}</td>
                  <td className="hidden px-5 py-4 text-ink-500 md:table-cell">{c.files.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-ink-500">Logos and names of technologies belong to their respective owners and are used only to describe tools we work with.</p>
      </div>
    </>
  );
}
