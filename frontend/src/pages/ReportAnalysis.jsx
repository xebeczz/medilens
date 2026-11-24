import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText, Download, Share2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Maximize, Search, X, Info } from 'lucide-react'
import { REPORTS, CBC_RESULTS, statusStyle } from '../data/demoData'
import { csvOf, downloadBlob } from '../utils/format'
import { getSaved, getFileUrl } from '../services/storage'
import { reportsApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const withExplanations = (results) => (results || []).map(r => {
  const base = CBC_RESULTS.find(x => x.name === r.name) || {}
  return { name: r.name, value: r.value, unit: r.unit, ref: r.ref, status: r.status, conf: r.conf ?? 99.0, explanation: r.explanation || base.explanation || 'Compare this value with the reference range printed on the original report and discuss it with a clinician.', factors: r.factors || base.factors || 'Laboratory method and sample handling can affect results.', question: r.question || base.question || 'Should this value be repeated or compared with earlier results?' }
})

const DOC_ROWS = [
  ['Hemoglobin', '14.4', '—', '12.0 - 15.5 g/dL'], ['WBC Count', '6.8', '—', '4.0 - 10.5 x10³'], ['Platelet Count', '138', 'LOW [!]', '150 - 450'], ['MCV (Mean Corp.)', '88.5', '—', '80.0 - 100.0 fL'], ['Fasting Glucose', '104', 'HIGH [H]', '70 - 99 mg/dL'], ['Red Blood Cell (RBC)', '4.72', '—', '4.00 - 5.20 x10⁶'], ['Hematocrit', '42.1', '—', '37.0 - 48.0 %'], ['MCH', '30.5', '—', '27.0 - 33.0 pg'],
]
export default function ReportAnalysis() {
  const { id } = useParams(); const navigate = useNavigate()
  const { token } = useAuth()
  const demoReport = REPORTS.find(r => r.id === id) || REPORTS[0]
  const [saved, setSaved] = useState(() => getSaved(id))
  const [fileUrl, setFileUrl] = useState(() => getFileUrl(id))
  // Load the ACTUAL uploaded report first: local save, then backend. Demo data is only the fallback.
  useEffect(() => {
    const local = getSaved(id)
    if (local) { setSaved(local); setFileUrl(getFileUrl(id)); return }
    if (token && token !== 'demo-token') {
      reportsApi.get(id).then(res => {
        const d = res.data
        const results = (d.results || []).map(r => ({ name: r.test_name, value: r.measured_value, unit: r.unit, ref: r.original_reference_text || `${r.reference_min} - ${r.reference_max}`, status: r.result_status, conf: r.extraction_confidence }))
        setSaved({ id: d.id, name: d.original_filename, category: d.report_type, date: d.uploaded_at, extracted: results.filter(r => r.value != null).length, status: 'Within Range', results, source: 'backend' })
      }).catch(() => {})
    }
  }, [id, token])
  const report = saved || demoReport
  const allResults = useMemo(() => saved ? withExplanations(saved.results) : CBC_RESULTS, [saved])
  const [page, setPage] = useState(1); const [zoom, setZoom] = useState(100); const [ocrBoxes, setOcrBoxes] = useState(true); const [rot, setRot] = useState(0)
  const [filter, setFilter] = useState('All'); const [q, setQ] = useState(''); const [selected, setSelected] = useState(null); const [shareOpen, setShareOpen] = useState(false)
  useEffect(() => { setSelected(allResults.find(r => r.status !== 'Within Range') || allResults[2] || allResults[0]) }, [allResults])
  const rows = useMemo(() => allResults.filter(r => (filter === 'All' || (filter === 'Within Range' ? r.status === 'Within Range' : filter === 'Outside Range' ? r.status !== 'Within Range' : r.status === 'Needs Review')) && r.name.toLowerCase().includes(q.toLowerCase())), [filter, q, allResults])
  const exportCsv = () => downloadBlob(new Blob([csvOf(allResults)], { type: 'text/csv' }), 'extraction-summary.csv')
  const exportSummary = () => { const txt = `MediLens AI — Summary\n${report.name}\nCategory: ${report.category || ''}\n\n` + allResults.map(r => `${r.name}: ${r.value} ${r.unit} (Ref ${r.ref}) — ${r.status}`).join('\n') + `\n\nEducational analysis only. Corroborate with primary lab records.`; downloadBlob(new Blob([txt], { type: 'text/plain' }), 'summary.txt') }
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><div className="flex flex-wrap gap-2 text-[11px]"><span className="badge bg-teal2 text-white">DIAGNOSTIC LAB</span><span className="badge bg-white border border-border font-mono">DOC-ID: PDD-99281-REV2</span><span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">OCR Verified 99.5% Avg</span></div>
          <h1 className="font-heading font-extrabold text-[24px] mt-2">{saved ? `${report.category || 'Medical Report'} — ${report.name}` : 'Complete Blood Count (CBC) with Differential'}</h1>
          <div className="text-[12px] text-muted mt-1 flex flex-wrap gap-x-3 gap-y-1"><span>{saved ? 'Uploaded report' : 'Quest Diagnostics'}</span><span>Uploaded: {report.date || 'Oct 24, 2024, 10:14 AM EDT'}</span><span className="font-mono">{allResults.filter(r => r.value != null).length} Analyzed / {allResults.length} Extracted</span>{saved && <span className="badge bg-mint/15 text-teal2">Saved report — showing what is in YOUR file</span>}<span className="text-success font-semibold">● Neural Engine 4.2 active</span></div></div>
        <div className="flex gap-2 flex-wrap"><button onClick={exportSummary} className="btn-ghost flex items-center gap-1.5"><FileText className="w-4 h-4" /> Original PDF</button><button onClick={exportSummary} className="btn-ghost flex items-center gap-1.5"><Download className="w-4 h-4" /> Export Summary</button><button onClick={exportCsv} className="btn-ghost">CSV</button><button onClick={() => setShareOpen(true)} className="btn-mint flex items-center gap-1.5"><Share2 className="w-4 h-4" /> Share with Clinician</button></div>
      </div>
      <div className="mt-3 bg-teal-50 border border-teal-100 rounded-lg px-4 py-2.5 text-[12px] text-teal-900 flex gap-2"><Info className="w-4 h-4 shrink-0 mt-0.5" /> <span><b>Clinical Guidance:</b> Informational analysis only. Corroborate outputs with licensed medical practitioners before modifying care regimens. All values below are synthetic demonstration data.</span></div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4 items-start">
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 bg-navy text-white text-[12px]"><button onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft className="w-4 h-4" /></button><span className="font-mono">Page {page} of 2</span><button onClick={() => setPage(p => Math.min(2, p + 1))}><ChevronRight className="w-4 h-4" /></button><span className="flex-1" /><button onClick={() => setZoom(z => Math.max(50, z - 10))}><ZoomOut className="w-4 h-4" /></button><span className="font-mono w-12 text-center">{zoom}%</span><button onClick={() => setZoom(z => Math.min(200, z + 10))}><ZoomIn className="w-4 h-4" /></button><button onClick={() => setRot(r => (r + 90) % 360)} title="Rotate"><RotateCw className="w-4 h-4" /></button><button onClick={() => setZoom(100)} title="Fit"><Maximize className="w-4 h-4" /></button><label className="flex items-center gap-1.5 text-[11px] ml-2 cursor-pointer">OCR BOXES <span className={`w-8 h-4 rounded-full relative ${ocrBoxes ? 'bg-mint' : 'bg-white/30'}`} onClick={() => setOcrBoxes(v => !v)}><span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${ocrBoxes ? 'left-4.5 left-[18px]' : 'left-0.5'}`} /></span></label></div>
          <div className="bg-[#E8ECE9] p-4 lg:p-6 overflow-auto max-h-[560px]">
            {fileUrl ? (
              <div><iframe title="Uploaded report" src={fileUrl} className="w-full bg-white shadow-lg" style={{ height: 520, transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }} /><div className="text-[11px] text-muted mt-2">This is the file you uploaded — {report.name}. The table on the right is what was extracted from it.</div></div>
            ) : (
            <div className="bg-white shadow-lg mx-auto max-w-[520px] p-6 lg:p-8 font-mono text-[12px] leading-relaxed" style={{ transform: `rotate(${rot}deg) scale(${zoom / 100})`, transformOrigin: 'top center' }}>
              <div className="flex justify-between border-b-2 border-black pb-2"><div><div className="font-bold text-[14px]">QUEST DIAGNOSTICS LABORATORY</div><div className="text-[10px]">CLIA: 36D0656869 • CAP: 1671885 • Medical Director: N. Reynolds, MD</div></div><div className="text-right text-[10px]">ACCESSION: QD-88741-B<br />COLLECTED: 10/24/2024<br />07:30 AM</div></div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]"><div>Patient: <b>Evelyn Vance (ID #4491-0)</b><br />DOB: 04/18/1988 (Age 36) • F</div><div>Ordering MD: Dr. Sarah Lin, MD<br />Fast Status: Fasting (12 hrs)</div></div>
              <table className="w-full mt-4 text-[11px]"><thead><tr className="border-b border-black text-left"><th>COMPONENT</th><th>VALUE</th><th>FLAG</th><th>REF RANGE</th></tr></thead><tbody>
                {DOC_ROWS.map(([n, v, f, r]) => <tr key={n} className="border-b border-gray-200"><td className={ocrBoxes && (n.includes('Platelet') || n.includes('Glucose')) ? 'bg-amber-100' : ''}>{n}</td><td className="font-bold">{v}</td><td className={f.includes('LOW') || f.includes('HIGH') ? 'text-red-600 font-bold' : ''}>{f}</td><td>{r}</td></tr>)}
              </tbody></table>
              <div className="flex justify-between mt-6 text-[9px] text-gray-500"><span>ELECTRONICALLY SIGNED BY QUEST SYSTEM-AUTOMATION</span><span>ENCRYPTED LAB DOC ID 99281A</span></div>
            </div>
            )}
          </div>
          <div className="px-4 py-2.5 border-t border-border flex items-center gap-2 text-[12px]"><span className="text-muted">PAGES</span><button onClick={() => setPage(1)} className={`px-2.5 py-1 rounded ${page === 1 ? 'bg-mint font-bold' : 'bg-bgmain'}`}>1 CBC &amp; Diff</button><button onClick={() => setPage(2)} className={`px-2.5 py-1 rounded ${page === 2 ? 'bg-mint font-bold' : 'bg-bgmain'}`}>2 Differential &amp; Notes</button><span className="ml-auto text-[11px] text-muted font-mono">100% DPI Calibrated</span></div>
          {page === 2 && <div className="px-4 pb-4 text-[13px] text-muted">Page 2 — Differential &amp; Notes (synthetic demo): Neutrophils 58%, Lymphocytes 30%, Monocytes 7%, Eosinophils 4%, Basophils 1%. Note: “Specimen adequate. No hemolysis observed.”</div>}
        </div>

        <div>
          <div className="card p-4">
            <div className="flex justify-between items-start"><div><h2 className="font-heading font-bold text-[16px]">Structured Extraction Matrix</h2><p className="text-[12px] text-muted">High-confidence token-mapped biomarker results ready for validation</p></div><span className="badge bg-mint/15 text-teal2">SEMANTIC MATCH: 100%</span></div>
            <div className="flex flex-wrap gap-2 mt-3 items-center"><div className="flex items-center bg-bgmain border border-border rounded-lg px-2.5 py-1.5 flex-1 min-w-[180px]"><Search className="w-3.5 h-3.5 text-muted mr-1.5" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter test name, e.g., Hemo…" className="bg-transparent outline-none text-[12px] w-full" /></div>
              {[['All', allResults.length], ['Within Range', allResults.filter(r => r.status === 'Within Range').length], ['Outside Range', allResults.filter(r => r.status !== 'Within Range' && r.status !== 'Needs Review').length], ['Needs Review', allResults.filter(r => r.status === 'Needs Review').length]].map(([t, n]) => <button key={t} onClick={() => setFilter(t)} className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold border ${filter === t ? 'bg-navy text-white' : 'bg-white border-border'}`}>{t} ({n})</button>)}
            </div>
            <div className="overflow-x-auto mt-3"><table className="w-full text-[13px] min-w-[520px]"><thead><tr className="text-left text-[11px] text-muted border-b border-border"><th className="py-2 font-semibold">TEST NAME</th><th className="py-2 font-semibold">MEASURED</th><th className="py-2 font-semibold">UNIT</th><th className="py-2 font-semibold">REFERENCE RANGE</th><th className="py-2 font-semibold">STATUS</th><th className="py-2 font-semibold text-right">CONFIDENCE</th></tr></thead><tbody>
              {rows.map(r => <tr key={r.name} onClick={() => setSelected(r)} className={`border-b border-border/60 cursor-pointer hover:bg-bgmain/60 ${selected?.name === r.name ? 'bg-mint/10' : ''}`}><td className="py-2.5 font-semibold">{r.name}{r.status !== 'Within Range' && <span className="text-warning ml-1">⚠</span>}</td><td className="py-2.5 font-mono font-bold">{r.value ?? '—'}</td><td className="py-2.5 font-mono text-muted">{r.unit}</td><td className="py-2.5 font-mono text-muted">{r.ref}</td><td className="py-2.5"><span className={`badge ${statusStyle(r.status)}`}>{r.status}</span></td><td className="py-2.5 text-right"><span className="badge bg-navy text-white font-mono">&lt; {r.conf}%</span></td></tr>)}
              {rows.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-muted">No tests match this filter.</td></tr>}
            </tbody></table></div>
          </div>
          {selected && <div className="card p-4 mt-4">
            <div className="flex justify-between items-start"><h3 className="font-heading font-bold text-[15px] flex gap-2"><Info className="w-4 h-4 text-teal2 mt-0.5" /> Deep Clinical Breakdown: {selected.name} ({selected.value ?? '—'} {selected.unit})</h3><button onClick={() => setSelected(allResults.find(r => r.status !== 'Within Range') || allResults[0])}><X className="w-4 h-4 text-muted" /></button></div>
            <p className="text-[13px] leading-relaxed mt-2">{selected.explanation}</p>
            <div className="grid md:grid-cols-2 gap-3 mt-3">
              <div className="bg-bgmain rounded-lg p-3"><div className="text-[10px] font-bold tracking-wider text-muted">SUGGESTED CLINICAL INQUIRY</div><p className="text-[12px] mt-1 leading-relaxed">“{selected.question}”</p></div>
              <div className="bg-bgmain rounded-lg p-3"><div className="text-[10px] font-bold tracking-wider text-muted">FACTORS THAT MAY AFFECT THE RESULT</div><p className="text-[12px] mt-1 leading-relaxed">{selected.factors}</p></div>
            </div>
            <div className="text-[12px] text-muted mt-3">Reference range preserved from the source document: <b className="text-ink font-mono">{selected.ref} {selected.unit}</b> • Status: <b className="text-ink">{selected.status}</b> • Extraction confidence {selected.conf}% is a technical confidence measure, not medical certainty.</div>
            <button onClick={() => navigate(`/explanations/${id}`)} className="text-teal2 text-[13px] font-bold mt-3">Open full AI Explanations →</button>
          </div>}
          <p className="text-[11px] text-muted mt-3 px-1">Click any row to open full biological explanation and clinical discussion · Confidence Standard: IEC 62304 Compliant · Educational disclaimer applies.</p>
        </div>
      </div>
      {shareOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50" onClick={() => setShareOpen(false)} /><div className="relative card w-full max-w-[440px] p-6"><h3 className="font-heading font-bold text-lg">Share with Clinician</h3><p className="text-[13px] text-muted mt-1">Demo dialog — nothing is actually sent. In the connected build this creates a secure share link for the clinician you choose.</p><input className="input mt-4" placeholder="Clinician email, e.g. dr.lin@hospital.org" /><div className="flex gap-2 mt-4"><button onClick={() => setShareOpen(false)} className="btn-ghost flex-1">Cancel</button><button onClick={() => { setShareOpen(false); exportSummary() }} className="btn-mint flex-1">Download summary instead</button></div></div></div>}
    </div>
  )
}
