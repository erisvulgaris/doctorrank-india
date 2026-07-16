'use client';

import { Users, Shield, Eye, Edit, Trash2, Plus, Key } from 'lucide-react';
import { DataTable, Column } from './ui/data-table';
import { SectionHeader, ChartCard } from './ui/chart-card';

const USERS = [
  { id: 'U1', name: 'Dr. Vikram Desai', email: 'vikram@doctorrank.in', role: 'Doctor', status: 'active', lastActive: '2 min ago', mfa: true },
  { id: 'U2', name: 'Admin User', email: 'admin@doctorrank.in', role: 'Super Admin', status: 'active', lastActive: 'now', mfa: true },
  { id: 'U3', name: 'Priya Sharma', email: 'priya@doctorrank.in', role: 'Content Editor', status: 'active', lastActive: '1 hr ago', mfa: false },
  { id: 'U4', name: 'Rohan Mehta', email: 'rohan@doctorrank.in', role: 'SEO Team', status: 'active', lastActive: '3 hrs ago', mfa: true },
  { id: 'U5', name: 'Anita Kumar', email: 'anita@doctorrank.in', role: 'Verification Team', status: 'active', lastActive: '5 hrs ago', mfa: true },
  { id: 'U6', name: 'Imran Patel', email: 'imran@doctorrank.in', role: 'Sales', status: 'inactive', lastActive: '2 days ago', mfa: false },
  { id: 'U7', name: 'Apollo Hospital', email: 'admin@apollo.com', role: 'Hospital Admin', status: 'active', lastActive: '4 hrs ago', mfa: true },
  { id: 'U8', name: 'Sneha Reddy', email: 'sneha@doctorrank.in', role: 'Support', status: 'active', lastActive: '20 min ago', mfa: true },
];

const ROLE_CFG: Record<string, { color: string; bg: string }> = {
  'Super Admin':       { color: 'text-danger', bg: 'bg-danger-soft' },
  'Doctor':            { color: 'text-brand', bg: 'bg-brand-soft' },
  'Hospital Admin':    { color: 'text-cyan-600', bg: 'bg-cyan-50' },
  'Content Editor':    { color: 'text-emerald', bg: 'bg-emerald-soft' },
  'SEO Team':          { color: 'text-violet-600', bg: 'bg-violet-50' },
  'Verification Team': { color: 'text-amber-700', bg: 'bg-amber-50' },
  'Sales':             { color: 'text-pink-600', bg: 'bg-pink-50' },
  'Support':           { color: 'text-brand', bg: 'bg-brand-soft' },
};

export function AdminUsers() {
  const columns: Column<any>[] = [
    {
      key: 'name', header: 'User', sortable: true,
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand to-emerald text-[12px] font-bold text-white">
            {u.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-foreground">{u.name}</div>
            <div className="text-[11px] text-muted-foreground">{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role', header: 'Role',
      render: (u) => {
        const r = ROLE_CFG[u.role] || { color: 'text-muted-foreground', bg: 'bg-muted' };
        return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${r.bg} ${r.color}`}>{u.role}</span>;
      },
    },
    {
      key: 'mfa', header: 'MFA', align: 'center',
      render: (u) => u.mfa
        ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald"><Shield className="h-3 w-3" /> On</span>
        : <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground"><Shield className="h-3 w-3" /> Off</span>,
    },
    {
      key: 'status', header: 'Status', align: 'center',
      render: (u) => (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
          u.status === 'active' ? 'bg-emerald-soft text-emerald' : 'bg-muted text-muted-foreground'
        }`}>
          {u.status}
        </span>
      ),
    },
    { key: 'lastActive', header: 'Last Active', render: (u) => <span className="text-[11.5px] text-muted-foreground">{u.lastActive}</span> },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Users & Roles"
        subtitle={`${USERS.length} users · ${USERS.filter(u => u.role === 'Doctor').length} doctors · ${USERS.filter(u => u.mfa).length} with MFA`}
        action={
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-[12.5px] font-semibold text-white shadow-card hover:bg-brand/90">
            <Plus className="h-3.5 w-3.5" /> Add User
          </button>
        }
      />

      {/* Role cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Users', value: USERS.length, color: 'text-brand bg-brand-soft', icon: Users },
          { label: 'Active', value: USERS.filter(u => u.status === 'active').length, color: 'text-emerald bg-emerald-soft', icon: Shield },
          { label: 'With MFA', value: USERS.filter(u => u.mfa).length, color: 'text-amber-600 bg-amber-50', icon: Key },
          { label: 'Roles', value: new Set(USERS.map(u => u.role)).size, color: 'text-cyan-600 bg-cyan-50', icon: Shield },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-3 shadow-card sm:p-4">
            <div className={`grid h-8 w-8 place-items-center rounded-lg ${s.color}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">{s.value}</div>
            <div className="text-[11px] text-muted-foreground sm:text-[12px]">{s.label}</div>
          </div>
        ))}
      </div>

      <DataTable
        data={USERS}
        columns={columns}
        searchKeys={['name', 'email', 'role']}
        getRowId={(u) => u.id}
        pageSize={8}
      />

      {/* Permission matrix */}
      <ChartCard title="Permission Matrix" subtitle="Role-based access control (RBAC)" icon={Shield}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[12.5px]">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Permission</th>
                {['Super Admin','Doctor','Hospital Admin','Content Editor','SEO Team','Support'].map((r) => (
                  <th key={r} className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { perm: 'View Dashboard', roles: [true, true, true, true, true, true] },
                { perm: 'Manage Doctors', roles: [true, false, false, false, false, false] },
                { perm: 'Edit Own Profile', roles: [true, true, true, false, false, false] },
                { perm: 'Publish Content', roles: [true, false, false, true, false, false] },
                { perm: 'Manage SEO', roles: [true, false, false, false, true, false] },
                { perm: 'View Reports', roles: [true, true, true, false, true, false] },
                { perm: 'Manage Users', roles: [true, false, false, false, false, false] },
                { perm: 'Access API Keys', roles: [true, false, false, false, false, false] },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/60 last:border-0">
                  <td className="px-3 py-2 font-medium text-foreground">{row.perm}</td>
                  {row.roles.map((allowed, j) => (
                    <td key={j} className="px-3 py-2 text-center">
                      {allowed
                        ? <span className="inline-block h-4 w-4 rounded bg-emerald" />
                        : <span className="inline-block h-4 w-4 rounded bg-muted" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
