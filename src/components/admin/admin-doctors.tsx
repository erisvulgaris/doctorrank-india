'use client';

import { useState } from 'react';
import {
  Plus, Star, ShieldCheck, MapPin, BadgeCheck, Eye, Edit, Trash2,
  CheckCircle2, XCircle, Mail, Stethoscope,
} from 'lucide-react';
import { DataTable, Column } from './ui/data-table';
import { SectionHeader } from './ui/chart-card';
import { formatINR, rankBand } from '@/lib/doctorrank';
import { RankGauge } from '@/components/doctorrank/ecg-line';
import { motion } from 'framer-motion';

interface AdminDoctorsProps {
  doctors: any[];
  allDoctors?: any[];
}

export function AdminDoctors({ doctors }: AdminDoctorsProps) {
  const [filterCity, setFilterCity] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterVerified, setFilterVerified] = useState('');

  // Use the real doctors from bootstrap, expanded with mock data
  const rows = doctors.length > 0 ? doctors : [];

  const cities = Array.from(new Set(rows.map((d) => d.city?.name).filter(Boolean)));
  const specialties = Array.from(new Set(rows.map((d) => d.specialty?.name).filter(Boolean)));

  const filteredRows = rows.filter((d) => {
    if (filterCity && d.city?.name !== filterCity) return false;
    if (filterSpecialty && d.specialty?.name !== filterSpecialty) return false;
    if (filterVerified === 'verified' && !d.isVerified) return false;
    if (filterVerified === 'pending' && d.isVerified) return false;
    return true;
  });

  const columns: Column<any>[] = [
    {
      key: 'name',
      header: 'Doctor',
      sortable: true,
      render: (d) => (
        <div className="flex items-center gap-2.5">
          <img src={d.photoUrl} alt={d.name} className="h-9 w-9 rounded-lg object-cover" />
          <div className="min-w-0">
            <div className="flex items-center gap-1 truncate text-[13px] font-semibold text-foreground">
              {d.name}
              {d.isVerified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-brand" />}
            </div>
            <div className="truncate text-[11px] text-muted-foreground">{d.specialty?.name}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'City',
      sortable: true,
      render: (d) => (
        <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
          <MapPin className="h-3 w-3" /> {d.city?.name}
        </span>
      ),
    },
    {
      key: 'doctorRank',
      header: 'Rank',
      sortable: true,
      align: 'center',
      render: (d) => <RankGauge rank={d.doctorRank} size={40} stroke={4} showLabel={false} />,
    },
    {
      key: 'reviewCount',
      header: 'Reviews',
      sortable: true,
      align: 'center',
      render: (d) => (
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-[12px] font-semibold text-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {(d.reviewQuality / 20).toFixed(1)}
          </div>
          <div className="text-[10.5px] text-muted-foreground">{d.reviewCount} reviews</div>
        </div>
      ),
    },
    {
      key: 'consultationFee',
      header: 'Fee',
      sortable: true,
      align: 'right',
      render: (d) => <span className="font-semibold tabular-nums text-foreground">{formatINR(d.consultationFee)}</span>,
    },
    {
      key: 'experienceYears',
      header: 'Exp',
      sortable: true,
      align: 'center',
      render: (d) => <span className="tabular-nums text-muted-foreground">{d.experienceYears}y</span>,
    },
    {
      key: 'isVerified',
      header: 'Status',
      align: 'center',
      render: (d) => (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
          d.isVerified ? 'bg-emerald-soft text-emerald' : 'bg-amber-50 text-amber-700'
        }`}>
          {d.isVerified ? <ShieldCheck className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
          {d.isVerified ? 'Verified' : 'Pending'}
        </span>
      ),
    },
    {
      key: 'isSponsored',
      header: 'Type',
      align: 'center',
      render: (d) => (
        d.isSponsored
          ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10.5px] font-semibold text-amber-700">Sponsored</span>
          : <span className="rounded-full bg-muted px-2 py-0.5 text-[10.5px] font-semibold text-muted-foreground">Organic</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Doctor Management"
        subtitle={`${rows.length} doctors · ${rows.filter((d) => d.isVerified).length} verified · ${rows.filter((d) => d.isSponsored).length} sponsored`}
        action={
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-[12.5px] font-semibold text-foreground shadow-card hover:border-brand/40">
              <Mail className="h-3.5 w-3.5" /> Invite
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-[12.5px] font-semibold text-white shadow-card hover:bg-brand/90">
              <Plus className="h-3.5 w-3.5" /> Add Doctor
            </button>
          </div>
        }
      />

      {/* Quick stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Doctors', value: rows.length, color: 'text-brand bg-brand-soft', icon: Stethoscope },
          { label: 'Verified', value: rows.filter((d) => d.isVerified).length, color: 'text-emerald bg-emerald-soft', icon: ShieldCheck },
          { label: 'Sponsored', value: rows.filter((d) => d.isSponsored).length, color: 'text-amber-600 bg-amber-50', icon: Star },
          { label: 'Avg Rank', value: Math.round(rows.reduce((a, d) => a + d.doctorRank, 0) / (rows.length || 1)), color: 'text-cyan-600 bg-cyan-50', icon: BadgeCheck },
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
        data={filteredRows}
        columns={columns}
        searchKeys={['name', 'qualifications']}
        getRowId={(d) => d.id}
        pageSize={8}
        filters={
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">City</label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-[12.5px] outline-none focus:border-brand"
              >
                <option value="">All cities</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Specialty</label>
              <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-[12.5px] outline-none focus:border-brand"
              >
                <option value="">All specialties</option>
                {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
              <select
                value={filterVerified}
                onChange={(e) => setFilterVerified(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-[12.5px] outline-none focus:border-brand"
              >
                <option value="">All</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Min rank</label>
              <select className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-[12.5px] outline-none focus:border-brand">
                <option value="0">Any</option>
                <option value="80">80+</option>
                <option value="90">90+</option>
              </select>
            </div>
          </div>
        }
        bulkActions={
          <>
            <button className="inline-flex items-center gap-1 rounded-lg bg-card px-2.5 py-1 text-[11.5px] font-semibold text-foreground shadow-card hover:bg-muted">
              <ShieldCheck className="h-3 w-3 text-emerald" /> Verify
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg bg-card px-2.5 py-1 text-[11.5px] font-semibold text-foreground shadow-card hover:bg-muted">
              <Mail className="h-3 w-3" /> Email
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg bg-card px-2.5 py-1 text-[11.5px] font-semibold text-danger shadow-card hover:bg-danger-soft">
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </>
        }
      />
    </div>
  );
}
