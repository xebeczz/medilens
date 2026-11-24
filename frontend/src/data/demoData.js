// Synthetic demonstration data only — clearly labelled in the UI. No real patient data.
export const DEMO_USER = { name: 'Dr. Sarah Lin', role: 'Clinical Researcher', email: 'sarah.lin@stanfordmed.org', initials: 'SL' }
export const DEMO_LOGIN = { email: 'demo@medilens.ai', password: 'demo1234' }

export const REPORTS = [
  { id: '1', name: 'Quest_Diagnostics_CBC_Oct2024.pdf', category: 'Complete Blood Count', tag: 'Complete Blood Count', date: 'Oct 24, 2024', extracted: 14, status: 'Within Range', sha: 'SHA 256: 9f4a...c09e', size: '2.4 MB', pages: 2, patient: 'Evelyn Vance (ID #4491-0)', dob: '04/18/1988 (Age 36) • F', ordering: 'Dr. Sarah Lin, MD', accession: 'QD-88741-B', collected: 'Oct 24, 2024 07:30 AM' },
  { id: '2', name: 'Labcorp_Comprehensive_Metabolic.pdf', category: 'Metabolic', tag: 'General Biochemistry', date: 'Oct 18, 2024', extracted: 22, status: 'Minor Variance', sha: 'SHA 256: 9d2c...7a11', size: '3.1 MB', pages: 3 },
  { id: '3', name: 'StanfordHealth_Thyroid_Screening.pdf', category: 'Thyroid Panel', tag: 'Thyroid Profile', date: 'Oct 02, 2024', extracted: 6, status: 'Within Range', sha: 'SHA 256: 3c11...88ff', size: '1.8 MB', pages: 2 },
  { id: '4', name: 'CityHospital_Lipid_Panel_Scan.png', category: 'Lipid Profile', tag: 'Lipid Profile', date: 'Sep 19, 2024', extracted: 7, status: 'Needs Review', sha: 'Manual Review Required', size: '5.1 MB', pages: 1 },
  { id: '5', name: 'LabCorp_Endocrine_Metabolic_Panel.pdf', category: 'Metabolic', tag: 'General Biochemistry', date: 'Oct 24, 2024', extracted: 18, status: 'Within Range', sha: 'SHA 256: a1b2...44cd', size: '2.8 MB', pages: 3 },
  { id: '6', name: 'Biopsy_Pathology_Slide_Transcription.png', category: 'Metabolic', tag: 'Histology Notes', date: 'Oct 19, 2024', extracted: 9, status: 'Within Range', sha: 'SHA 256: 77aa...19bc', size: '5.1 MB', pages: 1 },
  { id: '7', name: 'Cardio_Lipid_Fractionation_Series.pdf', category: 'Lipid Profile', tag: 'Lipid Profile', date: 'Oct 11, 2024', extracted: 8, status: 'Within Range', sha: 'SHA 256: 12ef...90ab', size: '1.4 MB', pages: 2 },
]

export const CBC_RESULTS = [
  { name: 'Hemoglobin', value: 14.4, unit: 'g/dL', ref: '12.0 - 15.5', min: 12.0, max: 15.5, status: 'Within Range', conf: 99.8, explanation: 'Hemoglobin carries oxygen in red blood cells. A value inside the laboratory reference range is consistent with the range printed on this report. Reference ranges vary by laboratory, age and sex, so always compare against the range on the original report.', factors: 'Hydration, altitude, recent exertion and laboratory method can shift the value slightly.', question: 'Is this value stable compared with my previous results?' },
  { name: 'White Blood Cell (WBC)', value: 6.8, unit: 'x10³/uL', ref: '4.0 - 10.5', min: 4.0, max: 10.5, status: 'Within Range', conf: 99.4, explanation: 'White blood cells are part of the immune system. A value inside the reference range is a routine finding on this report.', factors: 'Recent infection, stress, exercise and some medicines can raise or lower WBC.', question: 'Should this be repeated if I develop new symptoms?' },
  { name: 'Platelet Count', value: 138, unit: 'x10³/uL', ref: '150 - 450', min: 150, max: 450, status: 'Below Range', conf: 99.1, explanation: 'Mild thrombocytopenia. Values between 100–149 x10³/uL are frequently incidental, transient, or associated with recent viral infections, localized platelet clumping in EDTA tubes (pseudothrombocytopenia), or medication effects.', factors: 'EDTA-related clumping, recent viral illness, alcohol use and some medicines can lower the count.', question: 'Would a repeat CBC with sodium citrate tube be advisable to rule out in vitro platelet agglutination?' },
  { name: 'Mean Corpuscular Volume (MCV)', value: 88.5, unit: 'fL', ref: '80.0 - 100.0', min: 80, max: 100, status: 'Within Range', conf: 99.6, explanation: 'MCV is the average size of red blood cells. A value inside the reference range is a routine finding.', factors: 'Iron, B12 and folate status can affect red-cell size over time.', question: 'Does this fit with my hemoglobin and red-cell count?' },
  { name: 'Fasting Glucose', value: 104, unit: 'mg/dL', ref: '70 - 99', min: 70, max: 99, status: 'Above Range', conf: 99.2, explanation: 'This fasting glucose is above the reference range printed on the report. A single above-range value does not by itself establish a diagnosis — fasting status, recent illness, stress and medicines all matter, and laboratories usually repeat the test.', factors: 'Fasting duration, recent food or drink, illness, stress and some medicines.', question: 'Was I fully fasting, and should this be repeated?' },
  { name: 'Red Blood Cell Count', value: 4.72, unit: 'x10⁶/uL', ref: '4.00 - 5.20', min: 4.0, max: 5.2, status: 'Within Range', conf: 99.8, explanation: 'Red blood cell count inside the reference range is a routine finding on this report.', factors: 'Hydration and altitude can shift the count slightly.', question: 'How does this compare with my last CBC?' },
  { name: 'Hematocrit', value: 42.1, unit: '%', ref: '37.0 - 48.0', min: 37, max: 48, status: 'Within Range', conf: 99.5, explanation: 'Hematocrit is the proportion of blood made up of red blood cells. Inside the reference range here.', factors: 'Hydration status is the most common short-term influence.', question: 'Is this consistent with my hemoglobin?' },
  { name: 'MCH', value: 30.5, unit: 'pg', ref: '27.0 - 33.0', min: 27, max: 33, status: 'Within Range', conf: 99.3, explanation: 'MCH is the average amount of hemoglobin per red blood cell. Inside the reference range here.', factors: 'Iron and vitamin status can affect it over time.', question: 'Does this need any follow-up on its own?' },
]
export const statusStyle = (s) => {
  if (s === 'Within Range') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (s === 'Below Range') return 'bg-amber-50 text-amber-700 border border-amber-200'
  if (s === 'Above Range') return 'bg-red-50 text-red-600 border border-red-200'
  if (s === 'Minor Variance') return 'bg-amber-50 text-amber-700 border border-amber-200'
  return 'bg-red-50 text-red-600 border border-red-200'
}
