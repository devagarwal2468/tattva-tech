import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { navigation } from '../../content/site';
import { services } from '../../content/services';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef(null);
  const location = useLocation();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      // Hide while reading downwards, reveal as soon as the user scrolls up.
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 400);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile drawer is open; close on Escape.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  const solid = scrolled || mobileOpen;
  const openMenu = () => {
    clearTimeout(closeTimer.current);
    setMenuOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMenuOpen(false), 120);
  };

  const linkCls = ({ isActive }) =>
    `relative rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition-colors ${
      solid
        ? isActive ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900'
        : isActive ? 'text-white' : 'text-ink-300 hover:text-white'
    }`;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${hidden && !mobileOpen && !menuOpen ? '-translate-y-full' : 'translate-y-0'} ${
        solid ? 'border-b border-ink-100 bg-white/85 shadow-[0_1px_12px_rgba(15,20,38,0.05)] backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm">
        Skip to content
      </a>
      <div className="container-site flex h-[72px] items-center justify-between gap-6">
        <Link to="/" className="shrink-0">
          <Logo dark={!solid} />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) =>
            item.hasMenu ? (
              <div key={item.to} className="relative" onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
                <NavLink
                  to={item.to}
                  className={(s) => `${linkCls(s)} inline-flex items-center gap-1`}
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                  onFocus={openMenu}
                >
                  {item.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${menuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </NavLink>
                <div
                  className={`absolute left-1/2 top-full w-[min(92vw,760px)] -translate-x-1/2 pt-3 transition-all duration-200 ${
                    menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
                  }`}
                  onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setMenuOpen(false)}
                >
                  <div className="grid grid-cols-[1fr_220px] overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-[0_24px_60px_-20px_rgba(15,20,38,0.25)]">
                    <ul className="grid grid-cols-2 gap-1 p-3">
                      {services.map((s) => (
                        <li key={s.slug}>
                          <Link to={`/services/${s.slug}`} className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-ink-50">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                              <Icon name={s.icon} className="h-[18px] w-[18px]" />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-ink-900">{s.title}</span>
                              <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-ink-500">{s.short}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col justify-between bg-ink-950 p-5 text-ink-300">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">Not sure where to start?</p>
                        <p className="mt-3 text-sm leading-relaxed">Tell us about your idea — we’ll recommend the right approach, team and budget.</p>
                      </div>
                      <Link to="/contact" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-brand-200">
                        Book a free consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={item.to} to={item.to} className={linkCls}>
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button to="/contact" size="sm" arrow variant={solid ? 'primary' : 'light'}>
            Let’s talk
          </Button>
        </div>

        <button
          type="button"
          className={`-mr-2 rounded-lg p-2 lg:hidden ${solid ? 'text-ink-900' : 'text-white'}`}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

    </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-[72px] z-[45] overflow-y-auto bg-white transition-all duration-300 lg:hidden ${
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav aria-label="Mobile" className="container-site flex flex-col py-6">
          <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Services</p>
          <div className="grid grid-cols-1 gap-1 pb-4 sm:grid-cols-2">
            {services.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="flex items-center gap-3 rounded-xl px-1 py-2.5 text-[0.95rem] font-medium text-ink-800 hover:bg-ink-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon name={s.icon} className="h-4 w-4" />
                </span>
                {s.title}
              </Link>
            ))}
          </div>
          <div className="border-t border-ink-100 pt-3">
            {navigation.filter((n) => !n.hasMenu).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `flex items-center justify-between border-b border-ink-100 px-1 py-4 text-lg font-semibold ${isActive ? 'text-brand-600' : 'text-ink-900'}`}
              >
                {item.label}
                <ArrowRight className="h-4 w-4 text-ink-300" aria-hidden="true" />
              </NavLink>
            ))}
          </div>
          <Button to="/contact" size="lg" arrow className="mt-8 w-full">
            Start a project
          </Button>
        </nav>
      </div>
    </>
  );
}
