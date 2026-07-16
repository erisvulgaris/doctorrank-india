'use client';

import { motion } from 'framer-motion';
import {
  Shield, Lock, Key, AlertCircle, CheckCircle2, Eye, Download,
  Smartphone, Globe, Activity, FileWarning,
} from 'lucide-react';
import { SectionHeader, ChartCard } from './ui/chart-card';
import { KpiCard } from './ui/kpi-card';

const AUDIT_LOGS = [
  { user: 'Admin User', action: 'Approved doctor verification', target: 'Dr. Reena Mathew', ip: '103.21.245.12', time: '2 min ago', severity: 'info' },
  { user: 'Priya Sharma', action: 'Published article', target: 'Hair Fall Treatment Guide', ip: '103.21.245.18', time: '15 min ago', severity: 'info' },
  { user: 'Unknown', action: 'Failed login attempt (3x)', target: 'admin@doctorrank.in', ip: '45.146.165.37', time: '32 min ago', severity: 'warning' },
  { user: 'Rohan Mehta', action: 'Updated SEO canonical', target: '/doctors/dermatology/mumbai', ip: '103.21.245.22', time: '1 hr ago', severity: 'info' },
  { user: 'Admin User', action: 'Revoked API key', target: 'prod-key-9f4a', ip: '103.21.245.12', time: '2 hrs ago', severity: 'warning' },
  { user: 'Anita Kumar', action: 'Flagged review', target: 'Review #R5', ip: '103.21.245.28', time: '3 hrs ago', severity: 'info' },
  { user: 'System', action: 'Auto-blocked suspicious IP', target: '193.27.228.84', ip: '—', time: '4 hrs ago', severity: 'critical' },
];

const SEVERITY_CFG: Record<string, { color: string; bg: string; icon: any }> = {
  info:     { color: 'text-brand', bg: 'bg-brand-soft', icon: Activity },
  warning:  { color: 'text-amber-700', bg: 'bg-amber-50', icon: AlertCircle },
  critical: { color: 'text-danger', bg: 'bg-danger-soft', icon: FileWarning },
};

const SESSIONS = [
  { user: 'Admin User', device: 'MacBook Pro · Chrome', location: 'Mumbai, IN', ip: '103.21.245.12', current: true, lastActive: 'Active now' },
  { user: 'Admin User', device: 'iPhone 15 · Safari', location: 'Mumbai, IN', ip: '103.21.245.45', current: false, lastActive: '2 hrs ago' },
  { user: 'Priya Sharma', device: 'Windows · Firefox', location: 'Bengaluru, IN', ip: '103.21.245.18', current: false, lastActive: '15 min ago' },
];

export function AdminSecurity() {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Security Center"
        subtitle="Audit logs, sessions, API keys, and threat monitoring"
        action={
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-[12.5px] font-semibold text-foreground shadow-card hover:border-brand/40">
            <Download className="h-3.5 w-3.5" /> Export Audit Log
          </button>
        }
      />

      {/* Security status */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald/30 bg-gradient-to-r from-emerald-soft via-card to-brand-soft p-4"
      >
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald text-white">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
              All Systems Secure
              <span className="rounded-full bg-emerald-soft px-2 py-0.5 text-[10px] font-semibold text-emerald">A+ Rating</span>
            </div>
            <div className="text-[12px] text-muted-foreground">No active threats · MFA enforced for all admins · Last security scan: 2 hours ago</div>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="Active Sessions" value={3} icon={Smartphone} color="brand" />
        <KpiCard label="API Keys" value={8} icon={Key} color="emerald" />
        <KpiCard label="Blocked IPs" value={124} delta={12} icon={Lock} color="amber" />
        <KpiCard label="Failed Logins (24h)" value={28} delta={-8} icon={AlertCircle} color="danger" />
      </div>

      {/* Audit log + sessions */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <ChartCard title="Audit Log" subtitle="Real-time platform activity" icon={Eye}>
          <div className="max-h-96 space-y-2 overflow-y-auto scroll-thin pr-1">
            {AUDIT_LOGS.map((log, i) => {
              const s = SEVERITY_CFG[log.severity];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-2.5 rounded-xl border border-border bg-background p-2.5"
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${s.bg} ${s.color}`}>
                    <s.icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] text-foreground">
                      <span className="font-semibold">{log.user}</span> {log.action}
                    </div>
                    <div className="text-[10.5px] text-muted-foreground">
                      {log.target} · {log.ip} · {log.time}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ChartCard>

        <ChartCard title="Active Sessions" subtitle="Currently logged in devices" icon={Smartphone}>
          <div className="space-y-2">
            {SESSIONS.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12.5px] font-medium text-foreground">{s.device}</span>
                    {s.current && <span className="rounded-full bg-emerald-soft px-2 py-0.5 text-[9px] font-semibold text-emerald">CURRENT</span>}
                  </div>
                  <div className="text-[10.5px] text-muted-foreground">{s.location} · {s.ip} · {s.lastActive}</div>
                </div>
                {!s.current && (
                  <button className="text-[11px] font-semibold text-danger hover:underline">Revoke</button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl bg-muted/40 p-3">
            <div className="text-[11.5px] font-semibold text-foreground">IP Whitelist</div>
            <div className="mt-1 text-[10.5px] text-muted-foreground">Only allow admin access from these IPs:</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {['103.21.245.0/24', '49.205.64.12', '157.32.128.4'].map((ip) => (
                <span key={ip} className="rounded-md bg-card px-2 py-1 text-[10.5px] font-mono text-foreground">{ip}</span>
              ))}
              <button className="rounded-md border border-dashed border-border px-2 py-1 text-[10.5px] text-muted-foreground hover:text-foreground">+ Add IP</button>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* API keys */}
      <ChartCard title="API Keys" subtitle="Manage programmatic access tokens" icon={Key}>
        <div className="space-y-2">
          {[
            { name: 'Production Server', key: 'pk_live_9f4a•••••••••••••••3d2c', created: 'Jan 12, 2026', lastUsed: '2 min ago', scope: 'full' },
            { name: 'Mobile App', key: 'pk_live_2b8e•••••••••••••••7a4f', created: 'Feb 03, 2026', lastUsed: '5 min ago', scope: 'read' },
            { name: 'Analytics Webhook', key: 'pk_live_5c1d•••••••••••••••9e8b', created: 'Mar 18, 2026', lastUsed: '1 hr ago', scope: 'analytics' },
            { name: 'CRM Integration', key: 'pk_live_8a3f•••••••••••••••1b6c', created: 'Apr 22, 2026', lastUsed: '4 hrs ago', scope: 'crm' },
          ].map((k, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background p-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-600">
                <Key className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12.5px] font-medium text-foreground">{k.name}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">{k.scope}</span>
                </div>
                <div className="font-mono text-[10.5px] text-muted-foreground">{k.key}</div>
              </div>
              <div className="text-right text-[10.5px] text-muted-foreground">
                <div>Created {k.created}</div>
                <div>Last used {k.lastUsed}</div>
              </div>
              <div className="flex gap-1">
                <button className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground"><Eye className="h-3.5 w-3.5" /></button>
                <button className="rounded-lg border border-border p-1.5 text-danger hover:bg-danger-soft"><Lock className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-[12.5px] font-semibold text-white shadow-card hover:bg-brand/90">
          <Key className="h-3.5 w-3.5" /> Generate New Key
        </button>
      </ChartCard>
    </div>
  );
}
