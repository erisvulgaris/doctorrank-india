'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from './admin-sidebar';
import { AdminTopbar } from './admin-topbar';
import { CommandPalette } from './command-palette';
import { AdminDashboard } from './admin-dashboard';
import { AdminDoctors } from './admin-doctors';
import { AdminHospitals } from './admin-hospitals';
import { AdminAppointments } from './admin-appointments';
import { AdminVerification } from './admin-verification';
import { AdminReviews } from './admin-reviews';
import { AdminSeo } from './admin-seo';
import { AdminAi } from './admin-ai';
import { AdminRevenue } from './admin-revenue';
import { AdminAnalytics } from './admin-analytics';
import { AdminUsers } from './admin-users';
import { AdminSecurity } from './admin-security';
import { AdminSettings } from './admin-settings';
import { AdminDevelopers } from './admin-developers';
import { AdminPlaceholder } from './admin-placeholder';

interface AdminShellProps {
  section: string;
  onNavigate: (view: string, payload?: any) => void;
  bootstrap: any;
}

export function AdminShell({ section, onNavigate, bootstrap }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  // Open command palette on Ctrl+K / Cmd+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSectionNav = (s: string) => {
    // If it's a valid admin section, navigate within admin
    const adminSections = [
      'dashboard','analytics','doctors','hospitals','appointments','verification','reviews',
      'diseases','procedures','specialties','seo','content','ai','maps','revenue','crm',
      'support','marketing','users','security','developers','settings',
    ];
    if (adminSections.includes(s)) {
      onNavigate('admin', { section: s });
    } else {
      // Action commands — for now treat as navigation
      onNavigate('admin', { section: 'doctors' });
    }
  };

  const renderSection = () => {
    switch (section) {
      case 'dashboard':    return <AdminDashboard bootstrap={bootstrap} onNavigate={handleSectionNav} />;
      case 'analytics':    return <AdminAnalytics />;
      case 'doctors':      return <AdminDoctors doctors={bootstrap.topDoctors} allDoctors={bootstrap.specialties} />;
      case 'hospitals':    return <AdminHospitals hospitals={bootstrap.hospitals} />;
      case 'appointments': return <AdminAppointments />;
      case 'verification': return <AdminVerification />;
      case 'reviews':      return <AdminReviews />;
      case 'seo':          return <AdminSeo />;
      case 'ai':           return <AdminAi />;
      case 'revenue':      return <AdminRevenue />;
      case 'users':        return <AdminUsers />;
      case 'security':     return <AdminSecurity />;
      case 'settings':     return <AdminSettings />;
      case 'developers':   return <AdminDevelopers />;
      case 'diseases':     return <AdminPlaceholder title="Disease Library" description="Manage disease content hubs, symptoms, causes, treatments, and SEO content." />;
      case 'procedures':   return <AdminPlaceholder title="Procedure Library" description="Create procedures with descriptions, recovery, risks, and pricing." />;
      case 'specialties':  return <AdminPlaceholder title="Specialty Management" description="Manage medical specialties, subspecialties, and SEO landing pages." />;
      case 'content':      return <AdminPlaceholder title="Content Management" description="Articles, blogs, videos, FAQs, and publishing workflow." />;
      case 'maps':         return <AdminPlaceholder title="Maps Management" description="Cities, states, districts, areas, coordinates, and map pins." />;
      case 'crm':          return <AdminPlaceholder title="CRM & Sales" description="Lead pipeline, sales funnel, outreach, and commission tracking." />;
      case 'support':      return <AdminPlaceholder title="Customer Support" description="Tickets, live chat, escalations, and SLA tracking." />;
      case 'marketing':    return <AdminPlaceholder title="Marketing" description="Campaigns, banners, referral program, and A/B testing." />;
      default:             return <AdminDashboard bootstrap={bootstrap} onNavigate={handleSectionNav} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar
        section={section}
        onNavigate={handleSectionNav}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          section={section}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenCommand={() => setCmdOpen(true)}
          onExitAdmin={() => onNavigate('home')}
        />

        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-[1600px] p-3 sm:p-4 lg:p-6">
            {renderSection()}
          </div>
        </main>
      </div>

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={handleSectionNav}
      />
    </div>
  );
}
