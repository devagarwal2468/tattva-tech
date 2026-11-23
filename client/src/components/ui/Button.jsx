import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const base =
  'group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap';

const variants = {
  primary: 'bg-ink-900 text-white shadow-[0_10px_30px_-12px_rgba(15,20,38,0.6)] hover:bg-brand-700 hover:shadow-[0_14px_34px_-12px_rgba(31,69,236,0.55)]',
  brand: 'bg-brand-600 text-white shadow-[0_10px_30px_-12px_rgba(31,69,236,0.7)] hover:bg-brand-700',
  secondary: 'border border-line bg-white text-ink-800 hover:border-ink-200 hover:bg-white hover:shadow-card',
  ghost: 'text-ink-700 hover:text-ink-900 hover:bg-ink-900/[0.04]',
  light: 'bg-white text-ink-900 hover:bg-ink-50',
  link: 'text-brand-600 hover:text-brand-700 px-0 py-0',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-[0.95rem]',
  lg: 'px-7 py-3.5 text-[1rem]',
};

/** Button that renders as <Link> (to), <a> (href) or <button>. */
export default function Button({ to, href, variant = 'primary', size = 'md', arrow = false, className = '', children, ...rest }) {
  const cls = `${base} ${variants[variant]} ${variant === 'link' ? '' : sizes[size]} ${className}`;
  const content = (
    <>
      {children}
      {arrow && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />}
    </>
  );
  if (to) return <Link to={to} className={cls} {...rest}>{content}</Link>;
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {content}
      </a>
    );
  }
  return <button type="button" className={cls} {...rest}>{content}</button>;
}
