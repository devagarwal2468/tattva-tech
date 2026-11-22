import React, { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import Home from './pages/Home';

const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Products = lazy(() => import('./pages/Products'));
const Work = lazy(() => import('./pages/Work'));
const About = lazy(() => import('./pages/About'));
const Insights = lazy(() => import('./pages/Insights'));
const InsightArticle = lazy(() => import('./pages/InsightArticle'));
const Careers = lazy(() => import('./pages/Careers'));
const Contact = lazy(() => import('./pages/Contact'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminApp = lazy(() => import('./pages/admin/AdminApp'));

function PageFallback() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ink-950" role="status" aria-label="Loading">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-brand-400" />
    </div>
  );
}

// The previous site used one long page with #section links (e.g. /#services).
// Redirect those old links to the new dedicated pages.
const legacyHashes = ['services', 'products', 'work', 'about', 'insights', 'careers', 'contact', 'faq', 'admin'];
function LegacyHashRedirect() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const id = hash.replace('#', '');
    if (pathname === '/' && legacyHashes.includes(id)) {
      navigate(id === 'faq' ? '/#faq' : `/${id}`, { replace: true });
    }
  }, [pathname, hash, navigate]);
  return null;
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <LegacyHashRedirect />
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="products" element={<Products />} />
          <Route path="work" element={<Work />} />
          <Route path="about" element={<About />} />
          <Route path="insights" element={<Insights />} />
          <Route path="insights/:id" element={<InsightArticle />} />
          <Route path="careers" element={<Careers />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Legal kind="privacy" />} />
          <Route path="terms" element={<Legal kind="terms" />} />
          <Route path="faq" element={<Navigate to="/#faq" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
