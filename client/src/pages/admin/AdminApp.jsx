import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAuthModal from '../../components/admin/AdminAuthModal';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminContacts from './AdminContacts';
import AdminProducts from './AdminProducts';
import AdminProjects from './AdminProjects';
import AdminInsights from './AdminInsights';
import AdminJobs from './AdminJobs';
import AdminApplications from './AdminApplications';
import { getAdminMe } from '../../services/api';
import { useSeo } from '../../lib/seo';

const TOKEN_KEY = 'tattva_admin_token';
const USER_KEY = 'tattva_admin_user';

const readSession = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    return token && user ? { token, user } : null;
  } catch {
    return null;
  }
};

export default function AdminApp() {
  useSeo({ title: 'Admin', noindex: true });
  const navigate = useNavigate();
  const [session, setSession] = useState(readSession);
  const [tab, setTab] = useState('overview');

  const logout = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      /* storage unavailable */
    }
    setSession(null);
  };

  // Validate a stored token with the server; drop it if it has expired or been revoked.
  useEffect(() => {
    if (!session?.token) return;
    getAdminMe(session.token).catch((err) => {
      if (/authori|token|expired|exist/i.test(err.message)) logout();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token]);

  if (!session) {
    return (
      <div className="min-h-screen bg-ink-950">
        <AdminAuthModal
          isOpen
          onClose={() => navigate('/')}
          onAuthSuccess={(user, token) => setSession({ user, token })}
        />
      </div>
    );
  }

  const { token, user } = session;
  const views = {
    overview: <AdminDashboard token={token} setActiveTab={setTab} />,
    contacts: <AdminContacts token={token} />,
    products: <AdminProducts token={token} />,
    projects: <AdminProjects token={token} />,
    insights: <AdminInsights token={token} />,
    jobs: <AdminJobs token={token} />,
    applications: <AdminApplications token={token} />,
  };

  return (
    <AdminLayout
      activeTab={tab}
      setActiveTab={setTab}
      adminUser={user}
      token={token}
      onLogout={logout}
      onBackToPublicSite={() => navigate('/')}
    >
      {views[tab] || views.overview}
    </AdminLayout>
  );
}
