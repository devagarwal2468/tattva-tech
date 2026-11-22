import React from 'react';
import Button from '../components/ui/Button';
import { useSeo } from '../lib/seo';

export default function NotFound() {
  useSeo({ title: 'Page not found', noindex: true });
  return (
    <section className="dark-surface relative flex min-h-[80vh] items-center overflow-hidden bg-ink-950 pt-24">
      <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-site relative text-center">
        <p className="font-display text-7xl font-bold text-gradient sm:text-8xl">404</p>
        <h1 className="mt-6 font-display text-3xl font-bold text-white sm:text-4xl">This page doesn’t exist.</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink-300">The link may be broken or the page may have moved.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/" size="lg" arrow>Back to home</Button>
          <Button to="/contact" size="lg" variant="ghostDark">Contact us</Button>
        </div>
      </div>
    </section>
  );
}
