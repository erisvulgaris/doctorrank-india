// /api/ai-symptom — AI symptom navigator
// Converts free-text symptom queries into matched specialties, conditions, and doctors.
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { safeJsonParse } from '@/lib/doctorrank';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lightweight rule-based symptom → specialty mapping (offline-first, no API key needed)
// Falls back gracefully; can be upgraded to LLM-backed reasoning via z-ai-web-dev-sdk.
const SYMPTOM_MAP: Array<{ keywords: string[]; specialty: string; condition?: string; reason: string }> = [
  { keywords: ['hair fall','hair loss','hair shedding','bald','thinning hair','receding hairline','alopecia'], specialty: 'Dermatology', condition: 'Hair Fall', reason: 'Hair fall is best evaluated by a dermatologist who can identify the underlying cause (androgenetic, telogen effluvium, nutritional, or autoimmune) and recommend targeted treatment.' },
  { keywords: ['acne','pimple','pimples','blackhead','whitehead','cystic acne','breakout'], specialty: 'Dermatology', condition: 'Acne', reason: 'Acne is treated by dermatologists using topical and oral medications, with consideration for scarring prevention.' },
  { keywords: ['stomach pain','abdominal pain','gallstone','gall bladder','gallbladder','biliary colic'], specialty: 'Gastroenterology', condition: 'Gall Bladder Stone', reason: 'Upper-right abdominal pain after meals may indicate gallstones. A gastroenterologist can order an ultrasound and recommend medical or surgical management.' },
  { keywords: ['kidney stone','renal colic','blood in urine','flank pain','urinary stone'], specialty: 'Urology', condition: 'Kidney Stone', reason: 'Severe flank pain radiating to the groin with blood in urine is classic for kidney stones. A urologist will assess stone size and recommend medical expulsion or surgical removal.' },
  { keywords: ['pcos','irregular periods','missed period','facial hair women','ovarian cyst','infertility women'], specialty: 'Gynecology', condition: 'PCOS', reason: 'Irregular cycles, excess facial hair, and weight gain in women often point to PCOS. A gynecologist can run hormonal panels and design a management plan.' },
  { keywords: ['migraine','one-sided headache','throbbing headache','headache with nausea','aura headache'], specialty: 'Neurology', condition: 'Migraine', reason: 'Recurrent one-sided throbbing headaches with nausea or visual aura are typical of migraine — a neurologist can prescribe preventive therapy.' },
  { keywords: ['diabetes','high blood sugar','frequent urination','excessive thirst','type 2 diabetes'], specialty: 'Endocrinology', condition: 'Diabetes', reason: 'Elevated blood sugar with excessive thirst and urination suggests diabetes. An endocrinologist tailors medication, monitoring, and lifestyle plans.' },
  { keywords: ['thyroid','weight gain fatigue','hypothyroid','hyperthyroid','cold intolerance','heat intolerance'], specialty: 'Endocrinology', condition: 'Thyroid Disorders', reason: 'Unexplained weight changes, fatigue, and temperature sensitivity can signal thyroid imbalance — an endocrinologist confirms with TSH/T3/T4 testing.' },
  { keywords: ['depression','sad all the time','no interest','hopeless','low mood','crying spells'], specialty: 'Psychiatry', condition: 'Depression', reason: 'Persistent low mood, loss of interest, and hopelessness respond well to psychiatric care combining therapy and medication.' },
  { keywords: ['anxiety','panic attack','constant worry','restless','palpitations anxiety'], specialty: 'Psychiatry', reason: 'Excessive worry, panic attacks, and restlessness are treatable with psychiatric evaluation and evidence-based therapy.' },
  { keywords: ['cataract','blurry vision','cloudy vision','glare at night','faded colors'], specialty: 'Ophthalmology', condition: 'Cataract', reason: 'Progressive blurring and glare suggest cataract. An ophthalmologist can confirm with a slit-lamp exam and plan surgery if needed.' },
  { keywords: ['back pain','lower back pain','slipped disc','sciatica','lumbar pain'], specialty: 'Orthopedics', condition: 'Back Pain', reason: 'Back pain radiating to the leg may indicate nerve compression — an orthopedist can guide imaging and physical therapy or intervention.' },
  { keywords: ['knee pain','joint pain','arthritis','swollen knee','stiff joints'], specialty: 'Orthopedics', condition: 'Joint Pain', reason: 'Joint pain with swelling or stiffness is commonly osteoarthritis — an orthopedist assesses severity and recommends conservative or surgical options.' },
  { keywords: ['sinus','sinusitis','blocked nose','facial pressure','postnasal drip'], specialty: 'ENT', condition: 'Sinusitis', reason: 'Facial pressure, nasal blockage, and postnasal drip suggest sinusitis — an ENT specialist evaluates with nasal endoscopy if recurrent.' },
  { keywords: ['high bp','hypertension','blood pressure','chest tightness','palpitations'], specialty: 'Cardiology', condition: 'Hypertension', reason: 'Persistently elevated blood pressure requires cardiac evaluation to rule out target-organ damage and tailor therapy.' },
  { keywords: ['chest pain','heart pain','shortness of breath','coronary'], specialty: 'Cardiology', condition: 'Heart Disease', reason: 'Chest pain or exertional breathlessness warrants prompt cardiac assessment — ECG, echo, and risk stratification.' },
  { keywords: ['tooth pain','toothache','root canal','dental cavity','wisdom tooth'], specialty: 'Dentistry', reason: 'Dental pain is best addressed by a dentist who can identify caries, pulpitis, or impacted teeth and plan restorative care.' },
  { keywords: ['child fever','pediatric','baby not eating','vaccination','infant'], specialty: 'Pediatrics', reason: 'Children require age-appropriate evaluation — a pediatrician handles fevers, growth concerns, and vaccinations.' },
];

interface Match {
  specialty: string;
  condition?: string;
  reason: string;
  confidence: number;
}

function analyzeSymptoms(text: string): Match[] {
  const lower = text.toLowerCase();
  const matches: Match[] = [];
  for (const rule of SYMPTOM_MAP) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) {
        matches.push({
          specialty: rule.specialty,
          condition: rule.condition,
          reason: rule.reason,
          confidence: Math.min(0.6 + (kw.length / 30), 0.95),
        });
        break;
      }
    }
  }
  // Deduplicate by specialty, keeping highest confidence
  const bySpec: Record<string, Match> = {};
  for (const m of matches) {
    if (!bySpec[m.specialty] || m.confidence > bySpec[m.specialty].confidence) {
      bySpec[m.specialty] = m;
    }
  }
  return Object.values(bySpec).sort((a, b) => b.confidence - a.confidence);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: string = (body?.text || '').trim();
    const citySlug: string | undefined = body?.city;

    if (!text) {
      return NextResponse.json({ error: 'Symptom text is required.' }, { status: 400 });
    }

    const matches = analyzeSymptoms(text);

    if (matches.length === 0) {
      return NextResponse.json({
        disclaimer: 'This AI symptom navigator is informational only and not a substitute for professional medical advice. Please consult a qualified doctor for diagnosis.',
        matches: [],
        doctors: [],
        message: 'We could not confidently match your symptoms. Try rephrasing — e.g. "hair fall", "stomach pain", "joint pain", "headache".',
      });
    }

    // Fetch matching doctors
    const topMatches = matches.slice(0, 3);
    const cityWhere = citySlug ? { city: { slug: citySlug } } : {};
    const doctors = await db.doctor.findMany({
      where: {
        ...cityWhere,
        specialty: { name: { in: topMatches.map((m) => m.specialty) } },
      },
      include: { specialty: true, city: true, hospital: true },
      orderBy: [{ isSponsored: 'desc' }, { doctorRank: 'desc' }],
      take: 12,
    });

    return NextResponse.json({
      disclaimer: 'This AI symptom navigator is informational only and not a substitute for professional medical advice. In an emergency, call 112 or visit the nearest emergency department.',
      matches: topMatches,
      doctors: doctors.map((d) => ({
        ...d,
        languages: safeJsonParse(d.languages, []),
        conditionsTreated: safeJsonParse(d.conditionsTreated, []),
        procedures: safeJsonParse(d.procedures, []),
        timings: safeJsonParse(d.timings, []),
        acceptedInsurance: safeJsonParse(d.acceptedInsurance, []),
        affiliations: safeJsonParse(d.affiliations, []),
      })),
    });
  } catch (e) {
    console.error('ai-symptom error', e);
    return NextResponse.json({ error: 'Failed to analyze symptoms.' }, { status: 500 });
  }
}
