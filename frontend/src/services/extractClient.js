// Client-side extraction — same rules as the backend (app/services/extraction.py),
// so an upload is read and explained even when the backend is not running.
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
import { CBC_RESULTS } from '../data/demoData'

const KNOWN = [
  ['Hemoglobin', [/hemoglobin[^0-9]{0,20}([0-9]+(?:\.[0-9]+)?)/i], 'g/dL', 12.0, 15.5, '12.0 - 15.5'],
  ['White Blood Cell (WBC)', [/white blood cell[^0-9]{0,20}([0-9]+(?:\.[0-9]+)?)/i, /\bWBC\b[^0-9]{0,20}([0-9]+(?:\.[0-9]+)?)/], 'x10³/uL', 4.0, 10.5, '4.0 - 10.5'],
  ['Platelet Count', [/platelet[^0-9]{0,20}([0-9]+(?:\.[0-9]+)?)/i], 'x10³/uL', 150, 450, '150 - 450'],
  ['Mean Corpuscular Volume (MCV)', [/\bMCV\b[^0-9]{0,20}([0-9]+(?:\.[0-9]+)?)/], 'fL', 80.0, 100.0, '80.0 - 100.0'],
  ['Fasting Glucose', [/fasting glucose[^0-9]{0,20}([0-9]+(?:\.[0-9]+)?)/i, /glucose[^0-9]{0,20}([0-9]+(?:\.[0-9]+)?)/i], 'mg/dL', 70, 99, '70 - 99'],
  ['Red Blood Cell Count', [/red blood cell[^0-9]{0,20}([0-9]+(?:\.[0-9]+)?)/i, /\bRBC\b[^0-9]{0,20}([0-9]+(?:\.[0-9]+)?)/], 'x10⁶/uL', 4.0, 5.2, '4.00 - 5.20'],
  ['Hematocrit', [/hematocrit[^0-9]{0,20}([0-9]+(?:\.[0-9]+)?)/i], '%', 37.0, 48.0, '37.0 - 48.0'],
]
const classify = (v, lo, hi) => v == null ? 'Needs Review' : v < lo ? 'Below Range' : v > hi ? 'Above Range' : 'Within Range'
export function classifyDocument(text) {
  const t = (text || '').toLowerCase()
  if (t.includes('complete blood count') || t.includes('hemoglobin')) return 'Complete Blood Count'
  if (t.includes('lipid') || t.includes('cholesterol')) return 'Lipid Profile'
  if (t.includes('thyroid') || t.includes('tsh')) return 'Thyroid Panel'
  if (t.includes('metabolic') || t.includes('glucose')) return 'Metabolic'
  return 'Unknown'
}
export function extractResults(text) {
  return KNOWN.map(([name, patterns, unit, lo, hi, ref]) => {
    let value = null
    for (const pat of patterns) { const m = text.match(pat); if (m) { value = parseFloat(m[1]); break } }
    const base = CBC_RESULTS.find(r => r.name === name) || {}
    return { name, value, unit, ref, min: lo, max: hi, status: classify(value, lo, hi), conf: value != null ? 99.0 : 0, explanation: base.explanation || 'Compare this value with the reference range printed on the original report and discuss it with a clinician.', factors: base.factors || 'Laboratory method and sample handling can affect results.', question: base.question || 'Should this value be repeated or compared with earlier results?' }
  })
}
export async function extractPdfText(file) {
  const buf = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: buf }).promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map(it => it.str).join(' ') + '\n'
  }
  return { text, pages: pdf.numPages }
}
export async function extractFile(file) {
  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
    const { text, pages } = await extractPdfText(file)
    return { text, pages, category: classifyDocument(text), results: extractResults(text) }
  }
  // Image without OCR: no invented values — everything Needs Review.
  return { text: '', pages: 1, category: 'Unknown', results: extractResults('') }
}
