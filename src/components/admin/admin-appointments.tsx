'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Phone,
  Mail, MessageCircle, User, Stethoscope, MapPin,
} from 'lucide-react';
import { SectionHeader, ChartCard } from './ui/chart-card';
import { DataTable, Column } from './ui/data-table';

interface Appt {
  id: string;
  patient: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  city: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  channel: 'whatsapp' | 'sms' | 'email';
}

const APPTS: Appt[] = [
  { id: 'A1', patient: 'Rohit Sharma', doctor: 'Dr. Vikram Desai', specialty: 'Dermatology', date: 'Today', time: '10:00 AM', city: 'Pune', status: 'confirmed', channel: 'whatsapp' },
  { id: 'A2', patient: 'Anita Kumar', doctor: 'Dr. Asha Hegde', specialty: 'Gastroenterology', date: 'Today', time: '11:30 AM', city: 'Bengaluru', status: 'pending', channel: 'sms' },
  { id: 'A3', patient: 'Imran Patel', doctor: 'Dr. Nihar Ranjan', specialty: 'Endocrinology', date: 'Today', time: '12:00 PM', city: 'Delhi', status: 'confirmed', channel: 'email' },
  { id: 'A4', patient: 'Sneha Reddy', doctor: 'Dr. Ananya Reddy', specialty: 'Dermatology', date: 'Today', time: '2:00 PM', city: 'Hyderabad', status: 'completed', channel: 'whatsapp' },
  { id: 'A5', patient: 'Karthik Iyer', doctor: 'Dr. Karthik Raman', specialty: 'Neurology', date: 'Today', time: '3:30 PM', city: 'Chennai', status: 'confirmed', channel: 'sms' },
  { id: 'A6', patient: 'Meera Joshi', doctor: 'Dr. Deepika Rao', specialty: 'Gynecology', date: 'Today', time: '4:00 PM', city: 'Bengaluru', status: 'cancelled', channel: 'email' },
  { id: 'A7', patient: 'Arjun Singh', doctor: 'Dr. Sanjay Gupta', specialty: 'Orthopedics', date: 'Today', time: '5:30 PM', city: 'Delhi', status: 'pending', channel: 'whatsapp' },
  { id: 'A8', patient: 'Pooja Bhat', doctor: 'Dr. Pooja Bhat', specialty: 'Orthopedics', date: 'Tomorrow', time: '9:00 AM', city: 'Bengaluru', status: 'confirmed', channel: 'sms' },
];

export function AdminAppointments() {
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = APPTS.filter((a) => !statusFilter || a.status === statusFilter);

  const statusCfg = {
    confirmed: { color: 'bg-emerald-soft text-emerald', icon: CheckCircle2 },
    pending:   { color: 'bg-amber-50 text-amber-700',    icon: AlertCircle },
    cancelled: { color: 'bg-danger-soft text-danger',    icon: XCircle },
    completed: { color: 'bg-brand-soft text-brand',      icon: CheckCircle2 },
  };

  const channelCfg = {
    whatsapp: { color: 'text-emerald', icon: MessageCircle },
    sms:      { color: 'text-brand',   icon: Phone },
    email:    { color: 'text-violet-600', icon: Mail },
  };

  const columns: Column<Appt>[] = [
    { key: 'id', header: 'ID', sortable: true, render: (a) => <span className="font-mono text-[11px] text-muted-foreground">#{a.id}</span> },
    {
      key: 'patient', header: 'Patient', sortable: true,
      render: (a) => (
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-[11px] font-semibold text-brand">{a.patient[0]}</div>
          <span className="text-[12.5px] font-medium text-foreground">{a.patient}</span>
        </div>
      ),
    },
    {
      key: 'doctor', header: 'Doctor',
      render: (a) => (
        <div className="flex items-center gap-1.5">
          <Stethoscope className="h-3 w-3 text-muted-foreground" />
          <div>
            <div className="text-[12.5px] font-medium text-foreground">{a.doctor}</div>
            <div className="text-[10.5px] text-muted-foreground">{a.specialty}</div>
          </div>
        </div>
      ),
    },
    { key: 'date', header: 'Date', sortable: true, render: (a) => (
      <div className="text-[12px]">
        <div className="font-medium text-foreground">{a.date}</div>
        <div className="flex items-center gap-1 text-[10.5px] text-muted-foreground"><Clock className="h-2.5 w-2.5" /> {a.time}</div>
      </div>
    )},
    { key: 'city', header: 'City', render: (a) => (
      <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground"><MapPin className="h-3 w-3" /> {a.city}</span>
    )},
    { key: 'channel', header: 'Channel', align: 'center', render: (a) => {
      const c = channelCfg[a.channel];
      return <c.icon className={`mx-auto h-4 w-4 ${c.color}`} />;
    }},
    { key: 'status', header: 'Status', align: 'center', render: (a) => {
      const s = statusCfg[a.status];
      return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${s.color}`}>
          <s.icon className="h-2.5 w-2.5" />
          {a.status}
        </span>
      );
    }},
  ];

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Appointment Management"
        subtitle={`${APPTS.length} appointments scheduled · ${APPTS.filter((a) => a.status === 'confirmed').length} confirmed today`}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Today's Total", value: APPTS.filter(a => a.date === 'Today').length, color: 'text-brand bg-brand-soft', icon: Calendar },
          { label: 'Confirmed', value: APPTS.filter(a => a.status === 'confirmed').length, color: 'text-emerald bg-emerald-soft', icon: CheckCircle2 },
          { label: 'Pending', value: APPTS.filter(a => a.status === 'pending').length, color: 'text-amber-600 bg-amber-50', icon: AlertCircle },
          { label: 'Cancelled', value: APPTS.filter(a => a.status === 'cancelled').length, color: 'text-danger bg-danger-soft', icon: XCircle },
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
        data={filtered}
        columns={columns}
        searchKeys={['patient', 'doctor', 'city']}
        getRowId={(a) => a.id}
        pageSize={8}
        filters={
          <div className="flex flex-wrap gap-2">
            {['', 'confirmed', 'pending', 'cancelled', 'completed'].map((s) => (
              <button
                key={s || 'all'}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg border px-2.5 py-1 text-[12px] font-medium capitalize transition-colors ${
                  statusFilter === s ? 'border-brand bg-brand-soft text-brand' : 'border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                {s || 'All statuses'}
              </button>
            ))}
          </div>
        }
      />
    </div>
  );
}
