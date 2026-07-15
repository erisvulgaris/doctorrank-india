// DoctorRank India — Seed Script
// Run: bun run /home/z/my-project/scripts/seed.ts
import { db } from '../src/lib/db';

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ---------- Cities ----------
const cities = [
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
];

// ---------- Specialties ----------
const specialties = [
  { name: 'Dermatology', icon: 'Sparkles', tagline: 'Skin, hair & nail specialists', description: 'Diagnosis and treatment of conditions affecting the skin, hair, and nails — from acne and eczema to hair fall and pigmentation disorders.' },
  { name: 'Cardiology', icon: 'HeartPulse', tagline: 'Heart & vascular care', description: 'Specialists in diagnosing and treating diseases of the heart and blood vessels, including hypertension, arrhythmia, and coronary artery disease.' },
  { name: 'Orthopedics', icon: 'Bone', tagline: 'Bones, joints & muscles', description: 'Surgical and non-surgical treatment of musculoskeletal injuries, joint pain, arthritis, and sports injuries.' },
  { name: 'Neurology', icon: 'Brain', tagline: 'Brain & nervous system', description: 'Care for stroke, epilepsy, migraine, Parkinson\u2019s disease, and other disorders of the brain, spine, and nerves.' },
  { name: 'ENT', icon: 'Ear', tagline: 'Ear, nose & throat', description: 'Treatment of sinusitis, hearing loss, tonsillitis, voice disorders, and head-and-neck conditions.' },
  { name: 'Psychiatry', icon: 'BrainCircuit', tagline: 'Mental health & wellbeing', description: 'Evidence-based care for depression, anxiety, bipolar disorder, OCD, and other mental health conditions.' },
  { name: 'Pediatrics', icon: 'Baby', tagline: 'Child health & immunity', description: 'Medical care for infants, children, and adolescents — including vaccinations, growth monitoring, and pediatric illness.' },
  { name: 'Dentistry', icon: 'Stethoscope', tagline: 'Oral & dental health', description: 'Root canal, implants, orthodontics, scaling, and complete dental care for all ages.' },
  { name: 'Oncology', icon: 'Ribbon', tagline: 'Cancer diagnosis & treatment', description: 'Multidisciplinary cancer care including chemotherapy, radiation, surgical oncology, and palliative support.' },
  { name: 'Urology', icon: 'Droplets', tagline: 'Urinary & male health', description: 'Treatment of kidney stones, prostate enlargement, urinary tract infections, and male infertility.' },
  { name: 'Gynecology', icon: 'Flower2', tagline: 'Women\u2019s health & fertility', description: 'PCOS, infertility, pregnancy care, menopause management, and routine gynecological screening.' },
  { name: 'Gastroenterology', icon: 'Activity', tagline: 'Digestive & liver care', description: 'Diagnosis and treatment of acidity, IBS, liver disease, gall bladder stones, and pancreas disorders.' },
  { name: 'Ophthalmology', icon: 'Eye', tagline: 'Eye & vision care', description: 'Cataract surgery, LASIK, glaucoma, retinal disorders, and routine eye examinations.' },
  { name: 'Endocrinology', icon: 'Thermometer', tagline: 'Hormones & metabolism', description: 'Management of diabetes, thyroid disorders, PCOS, obesity, and other hormonal imbalances.' },
];

// ---------- Conditions ----------
const conditions = [
  { name: 'Hair Fall', specialty: 'Dermatology', overview: 'Hair fall (alopecia) refers to excessive shedding of hair from the scalp or body. Losing 50\u2013100 hairs per day is normal, but persistent thinning, patchy loss, or receding hairlines warrant evaluation by a dermatologist.' },
  { name: 'Acne', specialty: 'Dermatology', overview: 'Acne is a common skin condition occurring when hair follicles become clogged with oil and dead skin cells, causing whiteheads, blackheads, pimples, or cysts. Early treatment prevents scarring.' },
  { name: 'PCOS', specialty: 'Gynecology', overview: 'Polycystic Ovary Syndrome (PCOS) is a hormonal disorder common among women of reproductive age, characterized by irregular periods, excess androgens, and polycystic ovaries.' },
  { name: 'Thyroid Disorders', specialty: 'Endocrinology', overview: 'Thyroid disorders include hypothyroidism (underactive thyroid) and hyperthyroidism (overactive thyroid), both of which affect metabolism, energy, and weight.' },
  { name: 'Diabetes', specialty: 'Endocrinology', overview: 'Diabetes mellitus is a chronic condition characterized by elevated blood sugar levels due to insulin resistance or deficiency. Type 2 diabetes accounts for over 90% of cases in India.' },
  { name: 'Migraine', specialty: 'Neurology', overview: 'Migraine is a neurological condition causing intense, often one-sided headaches, frequently accompanied by nausea, sensitivity to light, and visual auras.' },
  { name: 'Depression', specialty: 'Psychiatry', overview: 'Depression is a mood disorder causing persistent feelings of sadness, loss of interest, and fatigue that interfere with daily life. It is highly treatable with therapy and medication.' },
  { name: 'Cataract', specialty: 'Ophthalmology', overview: 'A cataract is clouding of the eye\u2019s natural lens, leading to blurry vision, glare, and color fading. It is the leading cause of reversible blindness worldwide.' },
  { name: 'Kidney Stone', specialty: 'Urology', overview: 'Kidney stones (renal calculi) are hard deposits of minerals and salts that form inside the kidneys, causing severe pain, blood in urine, and urinary issues.' },
  { name: 'Gall Bladder Stone', specialty: 'Gastroenterology', overview: 'Gallstones are hardened deposits of digestive fluid that form in the gallbladder, often causing pain in the upper-right abdomen, especially after fatty meals.' },
  { name: 'Back Pain', specialty: 'Orthopedics', overview: 'Back pain is one of the most common reasons for doctor visits. It can result from muscle strain, herniated discs, poor posture, or underlying spinal conditions.' },
  { name: 'Joint Pain', specialty: 'Orthopedics', overview: 'Joint pain can affect knees, hips, shoulders, and small joints. Causes include osteoarthritis, rheumatoid arthritis, injuries, and overuse.' },
  { name: 'Knee Replacement', specialty: 'Orthopedics', overview: 'Knee replacement surgery replaces a damaged knee joint with an artificial implant, typically performed for advanced osteoarthritis that no longer responds to conservative treatment.' },
  { name: 'Sinusitis', specialty: 'ENT', overview: 'Sinusitis is inflammation of the sinus cavities, often caused by infection or allergies, leading to facial pressure, nasal congestion, and headache.' },
  { name: 'Hypertension', specialty: 'Cardiology', overview: 'Hypertension (high blood pressure) is a common condition in which the force of blood against artery walls is consistently too high, increasing risk of heart disease and stroke.' },
  { name: 'Heart Disease', specialty: 'Cardiology', overview: 'Coronary artery disease, heart failure, and arrhythmias fall under heart disease. Early detection and lifestyle modification significantly improve outcomes.' },
];

// ---------- Hospitals ----------
const hospitals = [
  { name: 'Apollo Hospital', city: 'Chennai', address: 'Greams Road, Thousand Lights, Chennai', departments: ['Cardiology','Neurology','Oncology','Orthopedics','Gastroenterology'], rating: 4.7, reviewCount: 3120 },
  { name: 'Fortis Hospital', city: 'Bengaluru', address: 'Bannerghatta Road, Bengaluru', departments: ['Cardiology','Orthopedics','Urology','Gynecology','Pediatrics'], rating: 4.6, reviewCount: 2480 },
  { name: 'AIIMS', city: 'Delhi', address: 'Ansari Nagar, New Delhi', departments: ['All Specialties','Trauma','Oncology','Cardiology','Neurology'], rating: 4.8, reviewCount: 5210 },
  { name: 'Tata Memorial Hospital', city: 'Mumbai', address: 'Dr. E Borges Road, Parel, Mumbai', departments: ['Oncology','Radiation','Surgical Oncology','Pediatric Oncology'], rating: 4.9, reviewCount: 4180 },
  { name: 'Manipal Hospital', city: 'Bengaluru', address: 'Old Airport Road, Bengaluru', departments: ['Cardiology','Neurology','Nephrology','Orthopedics'], rating: 4.5, reviewCount: 1980 },
  { name: 'Max Super Speciality Hospital', city: 'Delhi', address: 'Saket, New Delhi', departments: ['Cardiology','Oncology','Neurology','Orthopedics'], rating: 4.6, reviewCount: 2740 },
  { name: 'Kokilaben Dhirubhai Ambani Hospital', city: 'Mumbai', address: 'Andheri West, Mumbai', departments: ['Cardiology','Neurology','Oncology','Orthopedics','Gynecology'], rating: 4.7, reviewCount: 3450 },
  { name: 'Narayana Health', city: 'Bengaluru', address: 'Bommashandra, Bengaluru', departments: ['Cardiology','Cardiac Surgery','Neurology','Orthopedics'], rating: 4.6, reviewCount: 2890 },
  { name: 'Artemis Hospital', city: 'Delhi', address: 'Sector 51, Gurugram', departments: ['Cardiology','Oncology','Neurology','Orthopedics'], rating: 4.5, reviewCount: 1620 },
  { name: 'Ruby Hall Clinic', city: 'Pune', address: '40, Sassoon Road, Pune', departments: ['Cardiology','Neurology','Oncology','Trauma'], rating: 4.5, reviewCount: 1450 },
];

// ---------- Doctor templates ----------
const doctorTemplates: Array<[string, string, string, number, string, number, string[], boolean]> = [
  // [name, specialty, city, exp, qualifications, fee, conditions, isFemale]
  ['Dr. Aarav Sharma', 'Dermatology', 'Mumbai', 14, 'MBBS, MD (Dermatology)', 1200, ['Hair Fall','Acne'], false],
  ['Dr. Priya Iyer', 'Dermatology', 'Bengaluru', 11, 'MBBS, MD (Dermatology)', 900, ['Hair Fall','Acne'], true],
  ['Dr. Rohan Mehta', 'Dermatology', 'Delhi', 18, 'MBBS, MD, Fellowship in Cosmetic Dermatology', 1500, ['Hair Fall','Acne'], false],
  ['Dr. Ananya Reddy', 'Dermatology', 'Hyderabad', 9, 'MBBS, MD (Dermatology)', 800, ['Acne','Hair Fall'], true],
  ['Dr. Vikram Desai', 'Dermatology', 'Pune', 16, 'MBBS, MD, Fellowship Trichology', 1100, ['Hair Fall'], false],
  ['Dr. Kavya Nair', 'Dermatology', 'Chennai', 7, 'MBBS, MD (Dermatology)', 700, ['Acne'], true],

  ['Dr. Rajesh Khanna', 'Cardiology', 'Delhi', 22, 'MBBS, MD, DM (Cardiology)', 2500, ['Hypertension','Heart Disease'], false],
  ['Dr. Sunita Agarwal', 'Cardiology', 'Mumbai', 19, 'MBBS, MD, DM (Cardiology)', 2200, ['Hypertension','Heart Disease'], true],
  ['Dr. Arjun Rao', 'Cardiology', 'Hyderabad', 15, 'MBBS, MD, DM (Cardiology)', 1800, ['Heart Disease'], false],
  ['Dr. Meera Krishnan', 'Cardiology', 'Chennai', 17, 'MBBS, MD, DM (Cardiology)', 2000, ['Hypertension'], true],

  ['Dr. Sanjay Gupta', 'Orthopedics', 'Delhi', 20, 'MBBS, MS (Ortho), Fellowship Joint Replacement', 2000, ['Back Pain','Joint Pain','Knee Replacement'], false],
  ['Dr. Anil Joshi', 'Orthopedics', 'Mumbai', 16, 'MBBS, MS (Ortho)', 1500, ['Back Pain','Joint Pain'], false],
  ['Dr. Pooja Bhat', 'Orthopedics', 'Bengaluru', 12, 'MBBS, MS (Ortho)', 1100, ['Joint Pain'], true],
  ['Dr. Manish Saxena', 'Orthopedics', 'Pune', 18, 'MBBS, MS, Fellowship Arthroscopy', 1700, ['Knee Replacement','Back Pain'], false],

  ['Dr. Anjali Verma', 'Neurology', 'Delhi', 21, 'MBBS, MD, DM (Neurology)', 2300, ['Migraine'], true],
  ['Dr. Karthik Raman', 'Neurology', 'Chennai', 14, 'MBBS, MD, DM (Neurology)', 1600, ['Migraine'], false],
  ['Dr. Sneha Patil', 'Neurology', 'Mumbai', 10, 'MBBS, MD, DM (Neurology)', 1400, ['Migraine'], true],

  ['Dr. Imran Khan', 'ENT', 'Hyderabad', 13, 'MBBS, MS (ENT)', 900, ['Sinusitis'], false],
  ['Dr. Lakshmi Menon', 'ENT', 'Bengaluru', 15, 'MBBS, MS (ENT)', 1000, ['Sinusitis'], true],
  ['Dr. Rakesh Pandey', 'ENT', 'Kolkata', 11, 'MBBS, MS (ENT)', 800, ['Sinusitis'], false],

  ['Dr. Neha Kapoor', 'Psychiatry', 'Mumbai', 12, 'MBBS, MD (Psychiatry)', 1500, ['Depression'], true],
  ['Dr. Aditya Nair', 'Psychiatry', 'Bengaluru', 9, 'MBBS, MD (Psychiatry)', 1200, ['Depression'], false],
  ['Dr. Fatima Sheikh', 'Psychiatry', 'Delhi', 16, 'MBBS, MD (Psychiatry)', 1800, ['Depression'], true],

  ['Dr. Shreya Ghosh', 'Pediatrics', 'Kolkata', 14, 'MBBS, MD (Pediatrics)', 800, [], true],
  ['Dr. Aakash Malhotra', 'Pediatrics', 'Delhi', 18, 'MBBS, MD (Pediatrics), Fellowship Neonatology', 1100, [], false],
  ['Dr. Reshma Pillai', 'Pediatrics', 'Bengaluru', 8, 'MBBS, MD (Pediatrics)', 700, [], true],

  ['Dr. Harish Bendre', 'Dentistry', 'Pune', 19, 'BDS, MDS (Endodontics)', 800, [], false],
  ['Dr. Tanvi Shah', 'Dentistry', 'Mumbai', 11, 'BDS, MDS (Orthodontics)', 900, [], true],
  ['Dr. Nikhil Rao', 'Dentistry', 'Bengaluru', 13, 'BDS, MDS (Prosthodontics)', 850, [], false],

  ['Dr. Reena Mathew', 'Oncology', 'Chennai', 20, 'MBBS, MD, DM (Medical Oncology)', 2500, [], true],
  ['Dr. Suresh Bhalla', 'Oncology', 'Delhi', 17, 'MBBS, MS, MCh (Surgical Oncology)', 2200, [], false],

  ['Dr. Atul Patil', 'Urology', 'Pune', 16, 'MBBS, MS, MCh (Urology)', 1800, ['Kidney Stone'], false],
  ['Dr. Geeta Subramanian', 'Urology', 'Chennai', 13, 'MBBS, MS, MCh (Urology)', 1500, ['Kidney Stone'], true],

  ['Dr. Pankaj Kothari', 'Gynecology', 'Mumbai', 19, 'MBBS, MS (Obs & Gyn), Fellowship IVF', 2000, ['PCOS'], false],
  ['Dr. Deepika Rao', 'Gynecology', 'Bengaluru', 14, 'MBBS, MS (Obs & Gyn)', 1300, ['PCOS'], true],
  ['Dr. Varsha Jain', 'Gynecology', 'Delhi', 17, 'MBBS, MS (Obs & Gyn), Fellowship IVF', 1800, ['PCOS'], true],

  ['Dr. Sandeep Mohan', 'Gastroenterology', 'Hyderabad', 18, 'MBBS, MD, DM (Gastro)', 1900, ['Gall Bladder Stone'], false],
  ['Dr. Asha Hegde', 'Gastroenterology', 'Bengaluru', 12, 'MBBS, MD, DM (Gastro)', 1500, ['Gall Bladder Stone'], true],

  ['Dr. Prakash Naidu', 'Ophthalmology', 'Bengaluru', 20, 'MBBS, MS (Ophth), Fellowship Cornea', 1500, ['Cataract'], false],
  ['Dr. Kavita Ranganath', 'Ophthalmology', 'Chennai', 16, 'MBBS, MS (Ophth)', 1200, ['Cataract'], true],
  ['Dr. Yusuf Poonawala', 'Ophthalmology', 'Mumbai', 14, 'MBBS, MS (Ophth), Fellowship Retina', 1400, ['Cataract'], false],

  ['Dr. Indira Bose', 'Endocrinology', 'Kolkata', 17, 'MBBS, MD, DM (Endo)', 1700, ['Thyroid Disorders','Diabetes'], true],
  ['Dr. Nihar Ranjan', 'Endocrinology', 'Delhi', 19, 'MBBS, MD, DM (Endo)', 2000, ['Diabetes','Thyroid Disorders'], false],
  ['Dr. Swati Kale', 'Endocrinology', 'Pune', 11, 'MBBS, MD, DM (Endo)', 1300, ['Thyroid Disorders'], true],
];

const conditionsBySpecialty: Record<string, Array<{q:string,a:string}>> = {
  Dermatology: [
    { q: 'How long until I see results from hair fall treatment?', a: 'Most medical treatments (minoxidil, finasteride, PRP) show visible results after 3\u20136 months of consistent use. Complete regrowth can take up to 12 months.' },
    { q: 'Is hair fall reversible?', a: 'Depends on the cause. Telogen effluvium and stress-related loss are usually reversible. Androgenetic alopecia can be managed but not fully reversed without transplant.' },
    { q: 'Do I need a biopsy for hair loss?', a: 'Not usually. A dermatologist can diagnose most hair loss through clinical exam and trichoscopy. Biopsy is reserved for scarring alopecias.' },
  ],
  Cardiology: [
    { q: 'When should I see a cardiologist for high BP?', a: 'If your blood pressure consistently reads above 140/90 despite lifestyle changes, or if you experience chest pain, palpitations, or shortness of breath.' },
    { q: 'Can heart disease be reversed?', a: 'Early-stage coronary disease can often be stabilized or partially reversed with aggressive lifestyle changes, statins, and blood pressure control.' },
  ],
  Orthopedics: [
    { q: 'How long is recovery after knee replacement?', a: 'Most patients walk with support within 24 hours of surgery, return to normal household activity in 4\u20136 weeks, and achieve full recovery in 3\u20136 months.' },
    { q: 'When should I consider surgery for back pain?', a: 'Surgery is considered when conservative treatment fails after 6\u201312 weeks, or if there is progressive weakness, numbness, or loss of bladder/bowel control.' },
  ],
  Neurology: [
    { q: 'Are migraines curable?', a: 'Migraines are not curable but are highly manageable with preventive medication, lifestyle modification, and trigger avoidance. Most patients see significant reduction in frequency.' },
  ],
  Gynecology: [
    { q: 'Can PCOS be cured?', a: 'PCOS cannot be cured but can be effectively managed with lifestyle changes, hormonal regulation, and targeted treatment. Many women with PCOS conceive naturally or with assistance.' },
  ],
};

async function main() {
  console.log('🌱 Seeding DoctorRank India...');

  await db.appointment.deleteMany();
  await db.review.deleteMany();
  await db.doctor.deleteMany();
  await db.hospital.deleteMany();
  await db.condition.deleteMany();
  await db.specialty.deleteMany();
  await db.city.deleteMany();

  // Cities
  for (const c of cities) {
    await db.city.create({ data: { ...c, slug: slugify(c.name) } });
  }
  const cityMap = Object.fromEntries((await db.city.findMany()).map(c => [c.name, c]));

  // Specialties
  for (const s of specialties) {
    await db.specialty.create({
      data: {
        name: s.name,
        slug: slugify(s.name),
        tagline: s.tagline,
        description: s.description,
        icon: s.icon,
      },
    });
  }
  const specMap = Object.fromEntries((await db.specialty.findMany()).map(s => [s.name, s]));

  // Conditions
  for (const c of conditions) {
    const spec = specMap[c.specialty];
    if (!spec) continue;
    const faqs = conditionsBySpecialty[c.specialty] ?? [
      { q: `What are common symptoms of ${c.name}?`, a: `Symptoms vary by individual. Consult a verified specialist for proper diagnosis and personalized treatment.` },
      { q: `Is ${c.name} treatable?`, a: `Yes, with timely diagnosis and the right treatment plan, most patients see significant improvement. Early intervention produces better outcomes.` },
      { q: `How much does treatment cost in India?`, a: `Costs vary based on the city, hospital, and complexity. A consultation with a verified specialist typically ranges from \u20b9500 to \u20b92,500.` },
    ];
    await db.condition.create({
      data: {
        name: c.name,
        slug: slugify(c.name),
        tagline: `${c.name} — symptoms, causes & treatment`,
        overview: c.overview,
        symptoms: JSON.stringify(['Persistent symptoms affecting daily life','Visible changes or discomfort','Recurring episodes that worsen over time']),
        causes: JSON.stringify(['Genetic predisposition','Lifestyle factors including diet and stress','Environmental triggers','Underlying medical conditions']),
        treatments: JSON.stringify(['Medical management with prescription therapy','Lifestyle and dietary modifications','Minimally invasive procedures where indicated','Surgical intervention when necessary','Regular follow-up and monitoring']),
        whenToSeeDoc: 'Consult a doctor if symptoms persist beyond 2 weeks, worsen over time, or significantly affect your quality of life. Seek immediate care for severe or sudden-onset symptoms.',
        faqs: JSON.stringify(faqs),
        specialtyId: spec.id,
      },
    });
  }
  const condMap = Object.fromEntries((await db.condition.findMany()).map(c => [c.name, c]));

  // Hospitals
  for (const h of hospitals) {
    const city = cityMap[h.city];
    if (!city) continue;
    await db.hospital.create({
      data: {
        name: h.name,
        slug: slugify(h.name),
        description: `${h.name} is a multi-specialty healthcare institution in ${h.city} equipped with advanced diagnostic, surgical, and critical care facilities. The hospital is staffed by experienced specialists and supported by 24x7 emergency, ICU, and ambulance services.`,
        cityId: city.id,
        address: h.address,
        lat: city.lat + (Math.random() - 0.5) * 0.1,
        lng: city.lng + (Math.random() - 0.5) * 0.1,
        phone: '+91 80' + Math.floor(10000000 + Math.random() * 89999999),
        emergencyPhone: '102',
        departments: JSON.stringify(h.departments),
        facilities: JSON.stringify(['24x7 Emergency','ICU & CCU','Modular Operation Theatres','Pharmacy','Diagnostic Lab','Ambulance Service','Cafeteria','Parking']),
        insurance: JSON.stringify(['Star Health','HDFC Ergo','ICICI Lombard','Bajaj Allianz','CGHS','ESI']),
        roomCategories: JSON.stringify(['General Ward','Semi-Private','Private','Deluxe Suite','ICU']),
        rating: h.rating,
        reviewCount: h.reviewCount,
        photos: JSON.stringify([]),
      },
    });
  }
  const hospMap = Object.fromEntries((await db.hospital.findMany()).map(h => [h.name, h]));

  // Doctors
  const firstNames = ['Aarav','Priya','Rohan','Ananya','Vikram','Kavya','Rajesh','Sunita','Arjun','Meera','Sanjay','Anil','Pooja','Manish','Anjali','Karthik','Sneha','Imran','Lakshmi','Rakesh'];
  const lastNames = ['Sharma','Patel','Reddy','Nair','Iyer','Khan','Joshi','Bose','Verma','Gupta'];
  let doctorCount = 0;

  for (const [name, specName, cityName, exp, qual, fee, conds, isFemale] of doctorTemplates) {
    const spec = specMap[specName];
    const city = cityMap[cityName];
    if (!spec || !city) continue;

    const hospInCity = Object.values(hospMap).find(h => h.cityId === city.id);

    const profileCompleteness = 70 + Math.random() * 30;
    const responseRate = 60 + Math.random() * 40;
    const reviewCount = Math.floor(20 + Math.random() * 280);
    const reviewQuality = 70 + Math.random() * 30;
    const publishedResearch = Math.floor(Math.random() * 25);
    const profileFreshness = 60 + Math.random() * 40;
    const verificationScore = 85 + Math.random() * 15;

    const doctorRank =
      profileCompleteness * 0.12 +
      responseRate * 0.18 +
      reviewQuality * 0.20 +
      profileFreshness * 0.08 +
      verificationScore * 0.22 +
      Math.min(publishedResearch * 4, 100) * 0.10 +
      Math.min((reviewCount / 3), 100) * 0.10;

    const regNo = 'MCI-' + Math.floor(10000 + Math.random() * 89999);
    const slug = slugify(name);
    const lat = city.lat + (Math.random() - 0.5) * 0.08;
    const lng = city.lng + (Math.random() - 0.5) * 0.08;

    const regionalLang = cityName === 'Chennai' ? 'Tamil' :
                         cityName === 'Bengaluru' ? 'Kannada' :
                         cityName === 'Mumbai' || cityName === 'Pune' ? 'Marathi' :
                         cityName === 'Kolkata' ? 'Bengali' :
                         cityName === 'Ahmedabad' ? 'Gujarati' :
                         cityName === 'Hyderabad' ? 'Telugu' :
                         'Regional';

    const photoGender = isFemale ? 'women' : 'men';
    const photoId = Math.floor(1 + Math.random() * 90);

    const doctor = await db.doctor.create({
      data: {
        name,
        slug,
        specialtyId: spec.id,
        hospitalId: hospInCity?.id ?? null,
        cityId: city.id,
        qualifications: qual,
        registrationNumber: regNo,
        experienceYears: exp,
        languages: JSON.stringify(['English','Hindi', regionalLang]),
        consultationFee: fee,
        about: `${name} is a ${specName.toLowerCase()} specialist with ${exp} years of clinical experience. ${name} focuses on evidence-based, patient-first care and has treated thousands of patients across ${cityName}. Consultations include a thorough evaluation, diagnostic plan, and a clear treatment roadmap tailored to each patient.`,
        profileCompleteness,
        responseRate,
        reviewCount,
        reviewQuality,
        publishedResearch,
        profileFreshness,
        verificationScore,
        doctorRank,
        photoUrl: `https://randomuser.me/api/portraits/${photoGender}/${photoId}.jpg`,
        clinicPhotos: JSON.stringify([]),
        conditionsTreated: JSON.stringify(conds.length > 0 ? conds : [spec.name + ' consultations']),
        procedures: JSON.stringify([spec.name + ' consultation','Diagnostic workup','Treatment planning','Follow-up care']),
        timings: JSON.stringify([
          { day: 'Mon - Fri', hours: '9:00 AM - 1:00 PM, 5:00 PM - 9:00 PM' },
          { day: 'Saturday', hours: '9:00 AM - 1:00 PM' },
          { day: 'Sunday', hours: 'Closed' },
        ]),
        acceptedInsurance: JSON.stringify(['Star Health','HDFC Ergo','ICICI Lombard','Bajaj Allianz','CGHS']),
        affiliations: JSON.stringify(hospInCity ? [hospInCity.name] : []),
        address: `${Math.floor(1 + Math.random() * 200)}, ${['MG Road','Brigade Road','JP Nagar','Indiranagar','Anna Nagar','T Nagar','Andheri West','Bandra West','Connaught Place','Saket'][Math.floor(Math.random()*10)]}, ${cityName}`,
        lat,
        lng,
        phone: '+91 9' + Math.floor(100000000 + Math.random() * 899999999),
        whatsapp: '+91 9' + Math.floor(100000000 + Math.random() * 899999999),
        isSponsored: Math.random() < 0.15,
        isVerified: true,
        conditions: { connect: conds.map(c => ({ id: condMap[c]?.id })).filter(Boolean) },
      },
    });
    doctorCount++;

    // 3-6 reviews per doctor
    const reviewCount2 = Math.floor(3 + Math.random() * 4);
    for (let i = 0; i < reviewCount2; i++) {
      const ratings = [4.5, 5, 4, 5, 4.5, 5, 4];
      const comments = [
        'Excellent doctor. Took time to explain everything clearly. Highly recommend.',
        'Very professional and caring. The treatment plan worked well for me.',
        'Good experience overall. The clinic was clean and staff were courteous.',
        'Doctor listened patiently and prescribed effective medication. Feeling much better.',
        'Knowledgeable and humble. Will definitely consult again if needed.',
        'Great diagnosis and follow-up. The whole process was smooth.',
      ];
      await db.review.create({
        data: {
          doctorId: doctor.id,
          patientName: firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' + lastNames[Math.floor(Math.random()*lastNames.length)],
          rating: ratings[Math.floor(Math.random() * ratings.length)],
          procedure: conds.length > 0 ? conds[0] : 'Consultation',
          comment: comments[Math.floor(Math.random() * comments.length)],
          isVerified: Math.random() > 0.2,
          helpfulVotes: Math.floor(Math.random() * 35),
        },
      });
    }
  }

  console.log(`✅ Seeded ${cities.length} cities, ${specialties.length} specialties, ${conditions.length} conditions, ${hospitals.length} hospitals, ${doctorCount} doctors`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
