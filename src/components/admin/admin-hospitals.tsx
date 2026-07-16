'use client';

import { Plus, Building2, MapPin, Phone, Star, Bed, Activity } from 'lucide-react';
import { DataTable, Column } from './ui/data-table';
import { SectionHeader } from './ui/chart-card';

export function AdminHospitals({ hospitals }: { hospitals: any[] }) {
  const columns: Column<any>[] = [
    {
      key: 'name', header: 'Hospital', sortable: true,
      render: (h) => (
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-foreground">{h.name}</div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3" /> {h.city?.name}</div>
          </div>
        </div>
      ),
    },
    { key: 'rating', header: 'Rating', sortable: true, align: 'center', render: (h) => (
      <div className="flex items-center justify-center gap-1 text-[12px] font-semibold text-foreground">
        <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {h.rating}
      </div>
    )},
    { key: 'reviewCount', header: 'Reviews', sortable: true, align: 'center', render: (h) => (
      <span className="tabular-nums text-muted-foreground">{h.reviewCount}</span>
    )},
    { key: 'doctors', header: 'Doctors', align: 'center', render: (h) => (
      <span className="tabular-nums text-foreground">{h.doctors?.length || 0}</span>
    )},
    { key: 'phone', header: 'Phone', render: (h) => (
      <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground"><Phone className="h-3 w-3" /> {h.phone}</span>
    )},
    { key: 'emergencyPhone', header: 'Emergency', align: 'center', render: (h) => (
      <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10.5px] font-semibold text-red-600">{h.emergencyPhone}</span>
    )},
  ];

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Hospital Management"
        subtitle={`${hospitals.length} hospitals across India`}
        action={
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-[12.5px] font-semibold text-white shadow-card hover:bg-brand/90">
            <Plus className="h-3.5 w-3.5" /> Add Hospital
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Hospitals', value: hospitals.length, color: 'text-red-600 bg-red-50', icon: Building2 },
          { label: 'Avg Rating', value: (hospitals.reduce((a, h) => a + h.rating, 0) / (hospitals.length || 1)).toFixed(1), color: 'text-amber-600 bg-amber-50', icon: Star },
          { label: 'Total Reviews', value: hospitals.reduce((a, h) => a + h.reviewCount, 0).toLocaleString('en-IN'), color: 'text-brand bg-brand-soft', icon: Activity },
          { label: 'Cities', value: new Set(hospitals.map((h) => h.city?.name)).size, color: 'text-emerald bg-emerald-soft', icon: MapPin },
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
        data={hospitals}
        columns={columns}
        searchKeys={['name', 'address']}
        getRowId={(h) => h.id}
        pageSize={8}
      />
    </div>
  );
}
