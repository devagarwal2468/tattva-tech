import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight, ArrowUpRight } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
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
      setScrolled(y > 8);
      // Hide while reading downwards, reveal as soon as the user scrolls up.
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 480);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

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

  const openMenu = () => {
    clearTimeout(closeTimer.current);
    setMenuOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMenuOpen(false), 140);
  };

  const linkCls = ({ isActive }) =>
    `relative rounded-full px-4 py-2 text-[0.93rem] transition-colors duration-200 ${isActive ? 'text-ink-900 font-medium' : 'text-ink-500 hover:text-ink-900'}`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${hidden && !mobileOpen && !menuOpen ? '-translate-y-full' : 'translate-y-0'} ${
          scrolled || mobileOpen ? 'border-b border-line/80 bg-canvas/80 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm">
          Skip to content
        </a>
        <div className="container-site flex h-[76px] items-center justify-between gap-6">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
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
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </NavLink>
                  <div
                    className={`absolute left-1/2 top-full w-[min(94vw,820px)] -translate-x-1/2 pt-4 transition-all duration-300 ${
                      menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
                    }`}
                    onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setMenuOpen(false)}
                  >
                    <div className="grid grid-cols-[1fr_250px] overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-[0_40px_80px_-30px_rgba(15,20,38,0.28)]">
                      <ul className="grid grid-cols-2 gap-1 p-3">
                        {services.map((s) => (
                          <li key={s.slug}>
                            <Link to={`/services/${s.slug}`} className="group flex items-center gap-3.5 rounded-2xl p-3 transition-colors hover:bg-canvas">
                              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50/70 transition-transform duration-300 group-hover:scale-105">
                                <img src={s.icon3d} alt="" width="40" height="40" className="h-10 w-10 object-contain" />
                              </span>
                              <span>
                                <span className="block text-[0.92rem] font-medium text-ink-900">{s.title}</span>
                                <span className="mt-0.5 line-clamp-1 block text-xs text-ink-500">{s.short}</span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link to="/contact" className="group relative flex flex-col justify-end overflow-hidden bg-canvas p-6">
                        <img src="/assets/illus/sharing-ideas.svg" alt="" className="absolute inset-x-4 top-5 h-32 w-auto object-contain opacity-90" />
                        <p className="relative font-serif text-2xl italic leading-tight text-ink-900">Not sure where to start?</p>
                        <p className="relative mt-2 text-sm text-ink-500">Tell us the problem — we’ll suggest the right approach.</p>
                        <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600">
                          Free consultation <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                        </span>
                      </Link>
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

          <div className="hidden items-center gap-2 lg:flex">
            <Button to="/contact" size="sm" arrow>
              Let’s talk
            </Button>
          </div>

          <button
            type="button"
            className="-mr-2 rounded-full p-2.5 text-ink-900 transition hover:bg-ink-900/5 lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer — kept outside <header> so the header's blur/transform can't clip it */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-[76px] z-[45] overflow-y-auto bg-canvas transition-all duration-300 lg:hidden ${
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav aria-label="Mobile" className="container-site flex flex-col pb-10 pt-4">
          <p className="eyebrow mb-3">Services</p>
          <div className="grid grid-cols-1 gap-1 pb-5 sm:grid-cols-2">
            {services.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="flex items-center gap-3 rounded-2xl px-2 py-2.5 text-[0.98rem] font-medium text-ink-800 hover:bg-white">
                <img src={s.icon3d} alt="" width="36" height="36" className="h-9 w-9 object-contain" />
                {s.title}
              </Link>
            ))}
          </div>
          <div className="border-t border-line pt-2">
            {navigation.filter((n) => !n.hasMenu).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `flex items-center justify-between border-b border-line px-2 py-4 font-display text-2xl font-medium tracking-tight ${isActive ? 'text-brand-600' : 'text-ink-900'}`}
              >
                {item.label}
                <ArrowRight className="h-5 w-5 text-ink-300" aria-hidden="true" />
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
