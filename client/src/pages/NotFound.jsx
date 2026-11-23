import React from 'react';
import Button from '../components/ui/Button';
import { useSeo } from '../lib/seo';

export default function NotFound() {
  useSeo({ title: 'Page not found', noindex: true });
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden pt-28">
      <div className="dots-bg mask-radial pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-site relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="font-serif text-8xl italic text-brand-600">404</p>
          <h1 className="h-section mt-4">This page <em className="accent">doesn’t exist.</em></h1>
          <p className="lead mt-5 max-w-md">The link may be broken, or the page may have moved.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button to="/" size="lg" arrow>Back to home</Button>
            <Button to="/contact" size="lg" variant="secondary">Contact us</Button>
          </div>
        </div>
        <img src="/assets/illus/page-eaten.svg" alt="" className="mx-auto h-72 w-auto object-contain lg:h-96" />
      </div>
    </section>
  );
}
