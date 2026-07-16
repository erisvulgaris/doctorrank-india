'use client';

import { useState } from 'react';
import {
  Settings, Building2, Globe, CreditCard, Bell, Lock, Database,
  Mail, MessageCircle, Smartphone, Map, Zap, Save,
} from 'lucide-react';
import { SectionHeader, ChartCard } from './ui/chart-card';

const SECTIONS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'branding', label: 'Branding', icon: Building2 },
  { id: 'localization', label: 'Localization', icon: Globe },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'storage', label: 'Storage & CDN', icon: Database },
  { id: 'providers', label: 'Service Providers', icon: Mail },
  { id: 'maps', label: 'Maps & Geolocation', icon: Map },
  { id: 'features', label: 'Feature Flags', icon: Zap },
];

export function AdminSettings() {
  const [active, setActive] = useState('general');

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Platform Settings"
        subtitle="Configure branding, payments, providers, and feature flags"
        action={
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-[12.5px] font-semibold text-white shadow-card hover:bg-brand/90">
            <Save className="h-3.5 w-3.5" /> Save Changes
          </button>
        }
      />

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[220px_1fr]">
        {/* Settings nav */}
        <div className="rounded-2xl border border-border bg-card p-2 shadow-card">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px] font-medium transition-colors ${
                active === s.id ? 'bg-brand-soft text-brand' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </div>

        {/* Settings content */}
        <div className="space-y-4">
          {active === 'general' && (
            <ChartCard title="General Settings" subtitle="Platform name, description, and contact" icon={Settings}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Platform Name" value="DoctorRank India" />
                <Field label="Support Email" value="support@doctorrank.in" />
                <Field label="Support Phone" value="+91 80 4567 8900" />
                <Field label="Default Timezone" value="Asia/Kolkata (IST)" />
                <Field label="Default Currency" value="INR (₹)" />
                <Field label="Tax ID / GSTIN" value="29ABCDE1234F1Z5" />
              </div>
              <div className="mt-3">
                <Field label="Platform Description" value="AI-powered doctor discovery platform helping millions of patients across India find the right specialist for their condition." textarea />
              </div>
            </ChartCard>
          )}

          {active === 'branding' && (
            <ChartCard title="Branding" subtitle="Logo, colors, and visual identity" icon={Building2}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Primary Color</label>
                  <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-background p-2">
                    <div className="h-7 w-7 rounded-md" style={{ background: '#0B5FFF' }} />
                    <input className="flex-1 bg-transparent text-[13px] outline-none" defaultValue="#0B5FFF" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Accent Color</label>
                  <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-background p-2">
                    <div className="h-7 w-7 rounded-md" style={{ background: '#00B884' }} />
                    <input className="flex-1 bg-transparent text-[13px] outline-none" defaultValue="#00B884" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Logo</label>
                <div className="mt-1 flex items-center gap-3 rounded-lg border border-dashed border-border bg-background p-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-white">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[12.5px] font-medium text-foreground">logo.svg</div>
                    <div className="text-[11px] text-muted-foreground">SVG · 2.4 KB</div>
                  </div>
                  <button className="ml-auto rounded-lg border border-border px-2.5 py-1 text-[11.5px] font-semibold text-foreground hover:bg-muted">Replace</button>
                </div>
              </div>
            </ChartCard>
          )}

          {active === 'localization' && (
            <ChartCard title="Localization" subtitle="Languages, countries, and currencies" icon={Globe}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Default Language" value="English (India)" />
                <Field label="Supported Languages" value="English, हिन्दी, தமிழ், ಕನ್ನಡ, मराठी, తెలుగు" />
                <Field label="Default Country" value="India" />
                <Field label="Default Currency" value="INR (₹)" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {['English','हिन्दी','தமிழ்','ಕನ್ನಡ','मराठी','తెలుగు','বাংলা','ગુજરાતી'].map((l) => (
                  <span key={l} className="rounded-lg border border-border bg-background px-2 py-1.5 text-center text-[11.5px] font-medium text-foreground">{l}</span>
                ))}
              </div>
            </ChartCard>
          )}

          {active === 'payments' && (
            <ChartCard title="Payment Configuration" subtitle="Razorpay and billing settings" icon={CreditCard}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Razorpay Key ID" value="rzp_live_abc123XYZ" />
                <Field label="Razorpay Secret" value="••••••••••••••••" type="password" />
                <Field label="Default Currency" value="INR" />
                <Field label="GST Rate" value="18%" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {['UPI','Credit Card','Debit Card','Net Banking','Wallet','EMI'].map((m) => (
                  <span key={m} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald/30 bg-emerald-soft px-2 py-1.5 text-[11.5px] font-medium text-emerald">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald" /> {m}
                  </span>
                ))}
              </div>
            </ChartCard>
          )}

          {active === 'notifications' && (
            <ChartCard title="Notification Channels" subtitle="Email, SMS, and WhatsApp providers" icon={Bell}>
              <div className="space-y-2">
                {[
                  { icon: Mail, name: 'Email (SES)', status: 'connected', color: 'text-emerald' },
                  { icon: Smartphone, name: 'SMS (MSG91)', status: 'connected', color: 'text-emerald' },
                  { icon: MessageCircle, name: 'WhatsApp (Twilio)', status: 'connected', color: 'text-emerald' },
                  { icon: Bell, name: 'Push (FCM)', status: 'disconnected', color: 'text-muted-foreground' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                    <p.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 text-[12.5px] font-medium text-foreground">{p.name}</div>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${p.color}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${p.status === 'connected' ? 'bg-emerald' : 'bg-muted-foreground'}`} />
                      {p.status}
                    </span>
                    <button className="text-[11px] font-semibold text-brand hover:underline">Configure</button>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}

          {active === 'security' && (
            <ChartCard title="Security Settings" subtitle="Authentication, MFA, and access control" icon={Lock}>
              <div className="space-y-3">
                <Toggle label="Require MFA for all admin users" desc="Force two-factor authentication for admin accounts" enabled />
                <Toggle label="IP Whitelist" desc="Only allow admin access from whitelisted IPs" enabled />
                <Toggle label="Session timeout (30 min)" desc="Auto-logout after 30 minutes of inactivity" enabled />
                <Toggle label="Login attempt lockout" desc="Block IP after 5 failed attempts" enabled />
                <Toggle label="Audit log retention (1 year)" desc="Keep detailed audit logs for 365 days" enabled />
              </div>
            </ChartCard>
          )}

          {active === 'storage' && (
            <ChartCard title="Storage & CDN" subtitle="Cloudflare R2 and CDN configuration" icon={Database}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Storage Provider" value="Cloudflare R2" />
                <Field label="Bucket Name" value="doctorrank-prod" />
                <Field label="CDN" value="Cloudflare CDN" />
                <Field label="Region" value="APAC (Mumbai edge)" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: 'Storage Used', value: '428 GB' },
                  { label: 'Bandwidth (30d)', value: '8.4 TB' },
                  { label: 'Cache Hit Rate', value: '94.2%' },
                ].map((s, i) => (
                  <div key={i} className="rounded-lg bg-muted/40 p-3 text-center">
                    <div className="text-lg font-bold text-foreground">{s.value}</div>
                    <div className="text-[10.5px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}

          {active === 'providers' && (
            <ChartCard title="Service Providers" subtitle="Third-party integrations" icon={Mail}>
              <div className="space-y-2">
                {[
                  { name: 'Google Maps API', status: 'connected', usage: '84%' },
                  { name: 'Clerk Authentication', status: 'connected', usage: '32%' },
                  { name: 'Razorpay Payments', status: 'connected', usage: '48%' },
                  { name: 'Cloudflare R2', status: 'connected', usage: '62%' },
                  { name: 'Google Search Console', status: 'connected', usage: '12%' },
                  { name: 'Bing Webmaster', status: 'pending', usage: '—' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[12.5px] font-medium text-foreground">{p.name}</div>
                      <div className="text-[10.5px] text-muted-foreground">Usage: {p.usage}</div>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                      p.status === 'connected' ? 'bg-emerald-soft text-emerald' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}

          {active === 'maps' && (
            <ChartCard title="Maps & Geolocation" subtitle="Google Maps and location services" icon={Map}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Google Maps API Key" value="AIza•••••••••••••••••••••••" type="password" />
                <Field label="Default Map Center" value="India (20.5937, 78.9629)" />
                <Field label="Default Zoom" value="5" />
                <Field label="Clustering Threshold" value="50 markers" />
              </div>
            </ChartCard>
          )}

          {active === 'features' && (
            <ChartCard title="Feature Flags" subtitle="Toggle platform features on/off" icon={Zap}>
              <div className="space-y-3">
                <Toggle label="AI Symptom Navigator" desc="AI-powered symptom to specialty matching" enabled />
                <Toggle label="Voice Search" desc="Allow voice input on search bar" enabled />
                <Toggle label="WhatsApp Booking" desc="Send booking confirmations via WhatsApp" enabled />
                <Toggle label="Multilingual Content" desc="Auto-translate content to 8 languages" enabled />
                <Toggle label="Doctor Dashboard" desc="Self-serve dashboard for doctors" enabled={false} />
                <Toggle label="Hospital ERP Integration" desc="Real-time sync with hospital ERPs" enabled={false} />
                <Toggle label="Video Consultations" desc="Telemedicine via integrated video" enabled={false} />
                <Toggle label="Lab Test Booking" desc="Allow diagnostic lab bookings" enabled />
              </div>
            </ChartCard>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, type, textarea }: { label: string; value: string; type?: string; textarea?: boolean }) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea
          defaultValue={value}
          rows={3}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-brand"
        />
      ) : (
        <input
          type={type || 'text'}
          defaultValue={value}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-brand"
        />
      )}
    </div>
  );
}

function Toggle({ label, desc, enabled }: { label: string; desc: string; enabled: boolean }) {
  const [on, setOn] = useState(enabled);
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
      <div>
        <div className="text-[12.5px] font-medium text-foreground">{label}</div>
        <div className="text-[10.5px] text-muted-foreground">{desc}</div>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-brand' : 'bg-muted'}`}
        aria-label={label}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
