import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Eye, Download, FileText, ChevronLeft, ChevronRight, Search, FileCheck, Activity, AlertTriangle, Clock } from 'lucide-react'
import { REPORTS, statusStyle } from '../data/demoData'
import { loadSaved } from '../services/storage'

const TABS = [['All Reports', 48], ['Complete Blood Count', 18], ['Lipid Profile', 12], ['Thyroid Panel', 8], ['Metabolic', 10]]
const CAT_MAP = { 'All Reports': null, 'Complete Blood Count': 'Complete Blood Count', 'Lipid Profile': 'Lipid Profile', 'Thyroid Panel': 'Thyroid Panel', 'Metabolic': 'Metabolic' }

export default function Dashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('All Reports'); const [q, setQ] = useState(''); const [page, setPage] = useState(1)
  const allReports = useMemo(() => [...loadSaved().map(r => ({ id: r.id, name: r.name, category: r.category || 'Unknown', tag: r.category || 'Uploaded', date: r.date, extracted: r.extracted, status: r.status, sha: 'Saved upload' })), ...REPORTS], [])
  const filtered = useMemo(() => allReports.filter(r => (!CAT_MAP[tab] || r.category === CAT_MAP[tab]) && r.name.toLowerCase().includes(q.toLowerCase())), [tab, q, allReports])
  const shown = filtered.slice((page - 1) * 4, page * 4)
  const downloadCsv = (r) => { const blob = new Blob([`Document,${r.name}\nCategory,${r.category}\nExtracted,${r.extracted} biomarkers\nStatus,${r.status}\nNote,Synthetic demonstration data\n`], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = r.name.replace(/\.(pdf|png)$/i, '') + '-summary.csv'; a.click() }
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <div className="flex-1">
          <div className="text-[11px] font-mono text-muted">WORKSPACE SYNCED • ISO 14971 • ID #ML-48209</div>
          <h1 className="font-heading font-extrabold text-[28px] leading-tight mt-1">Your Health Documents, Simplified.</h1>
          <p className="text-muted text-[13px] leading-relaxed mt-1 max-w-[640px]">Understand your medical reports through intelligent document extraction, structured test metrics, and clear educational explanations calibrated for patient empowerment.</p>
          <div className="flex gap-2 mt-4"><button onClick={() => navigate('/upload')} className="btn-mint flex items-center gap-2"><Upload className="w-4 h-4" /> Upload New Report</button><button onClick={() => navigate('/reports')} className="btn-ghost">View All Reports</button></div>
        </div>
        <div className="card p-4 w-full lg:w-[300px] shrink-0"><div className="flex justify-between items-start"><span className="text-[11px] font-bold tracking-wider text-teal2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> CLINICAL GUIDANCE</span><span className="text-[10px] font-mono text-muted">V2.4 • SEC</span></div><p className="text-[12px] text-muted leading-relaxed mt-2">Extracted data is synthesized for educational document comprehension only. Always consult a licensed healthcare practitioner before interpreting clinical decisions.</p></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'TOTAL REPORTS PROCESSED', value: '48', sub: '+12%', note: 'Monthly volume', icon: FileCheck, bar: 72 },
          { label: 'SUCCESSFULLY EXTRACTED', value: '46', sub: '95.8%', note: 'OCR confidence level', icon: Activity, bar: 96 },
          { label: 'IN ACTIVE PROCESSING', value: '1', sub: 'Queue ID #14', note: 'Comprehensive Metabolic', icon: Clock, bar: 62 },
          { label: 'REQUIRING MANUAL REVIEW', value: '1', sub: 'Low DPI Scan', note: 'Faint faxed lipid panel', icon: AlertTriangle, bar: 18, warn: true },
        ].map(c => (
          <div key={c.label} className="card p-4"><div className="flex justify-between"><span className="text-[10px] font-bold tracking-wider text-muted">{c.label}</span><c.icon className={`w-4 h-4 ${c.warn ? 'text-danger' : 'text-teal2'}`} /></div>
            <div className="flex items-baseline gap-2 mt-2"><span className="font-heading font-extrabold text-[26px]">{c.value}</span><span className={`text-[11px] font-bold ${c.warn ? 'text-danger' : 'text-success'}`}>{c.sub}</span></div>
            <div className="text-[11px] text-muted mt-0.5">{c.note}</div><div className="h-1.5 bg-bgmain rounded-full mt-3 overflow-hidden"><div className={`h-full rounded-full ${c.warn ? 'bg-danger' : 'bg-mint'}`} style={{ width: c.bar + '%' }} /></div></div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-4 mt-4 items-start">
        <div>
          <div className="flex flex-wrap gap-2 items-center">
            {TABS.map(([t, n]) => <button key={t} onClick={() => { setTab(t); setPage(1) }} className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border ${tab === t ? 'bg-navy text-white border-navy' : 'bg-white border-border text-muted hover:text-ink'}`}>{t} <span className="opacity-70">{n}</span></button>)}
            <div className="ml-auto flex items-center bg-white border border-border rounded-lg px-2.5 py-1.5 w-[200px]"><Search className="w-3.5 h-3.5 text-muted mr-1.5" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter reports..." className="outline-none text-[12px] w-full" /></div>
          </div>
          <div className="card mt-3 overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex justify-between items-center"><span className="text-[11px] font-bold tracking-wider text-muted">CLINICAL RECORDS REPOSITORY</span><span className="text-[11px] text-muted">Showing {shown.length} of 48 Documents</span></div>
            <div className="overflow-x-auto"><table className="w-full text-[13px] min-w-[720px]">
              <thead><tr className="text-left text-[11px] text-muted border-b border-border"><th className="px-4 py-2.5 font-semibold">DOCUMENT NAME</th><th className="px-3 py-2.5 font-semibold">CATEGORY TAG</th><th className="px-3 py-2.5 font-semibold">UPLOAD DATE</th><th className="px-3 py-2.5 font-semibold">EXTRACTED</th><th className="px-3 py-2.5 font-semibold">STATUS BADGE</th><th className="px-3 py-2.5 font-semibold text-right">ACTIONS</th></tr></thead>
              <tbody>{shown.map(r => <tr key={r.id} className="border-b border-border/60 hover:bg-bgmain/60">
                <td className="px-4 py-3"><div className="flex gap-2.5 items-start"><FileText className="w-4 h-4 text-teal2 mt-0.5 shrink-0" /><div><div className="font-semibold leading-tight">{r.name}</div><div className="text-[11px] text-muted font-mono">{r.sha}</div></div></div></td>
                <td className="px-3 py-3"><span className="badge bg-bgmain border border-border text-ink">{r.tag}</span></td>
                <td className="px-3 py-3 whitespace-nowrap">{r.date}</td><td className="px-3 py-3 font-mono">{r.extracted} biomarkers</td>
                <td className="px-3 py-3"><span className={`badge ${statusStyle(r.status)}`}>{r.status}</span></td>
                <td className="px-3 py-3"><div className="flex justify-end gap-1"><button title="View" onClick={() => navigate(`/analysis/${r.id}`)} className="p-1.5 rounded hover:bg-white border border-transparent hover:border-border"><Eye className="w-4 h-4" /></button><button title="Download summary" onClick={() => downloadCsv(r)} className="p-1.5 rounded hover:bg-white border border-transparent hover:border-border"><Download className="w-4 h-4" /></button><button onClick={() => navigate(`/analysis/${r.id}`)} className="btn-dark !py-1.5 !px-2.5 !text-[11px]">Breakdown</button></div></td>
              </tr>)}{shown.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No reports match this filter.</td></tr>}</tbody>
            </table></div>
            <div className="px-4 py-2.5 flex justify-between items-center text-[12px] text-muted"><span>Displaying records sorted by newest entry</span><div className="flex gap-1 items-center"><button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded border border-border disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button><span className="px-2 font-semibold text-ink">Page {page}</span><button disabled={page * 4 >= filtered.length} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded border border-border disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button></div></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="card p-4"><div className="text-[10px] font-bold tracking-wider text-muted">LATEST BIOMARKER SPOTLIGHT</div><div className="flex justify-between mt-2"><div><div className="font-semibold text-sm">Hemoglobin (Hb)</div><div className="font-heading font-extrabold text-xl">14.4 <span className="text-xs font-normal text-muted">g/dL</span></div></div><span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 h-fit">Optimal</span></div><div className="text-[11px] text-muted mt-1">Ref: 12.0 – 15.5 · Quest CBC · Oct 24, 2024</div><div className="h-1.5 bg-bgmain rounded-full mt-3"><div className="h-full bg-mint rounded-full" style={{ width: '62%' }} /></div></div>
            <div className="card p-4 border-l-4 !border-l-warning"><div className="text-[10px] font-bold tracking-wider text-warning">VARIANCE ALERT</div><div className="flex justify-between mt-2"><div><div className="font-semibold text-sm">Fasting Glucose</div><div className="font-heading font-extrabold text-xl">104 <span className="text-xs font-normal text-muted">mg/dL</span></div></div><span className="badge bg-amber-50 text-amber-700 border border-amber-200 h-fit">Minor High</span></div><div className="text-[11px] text-muted mt-1">Ref: 70 – 99 · Labcorp Metabolic · Oct 18, 2024 — educational note only, not a diagnosis.</div><div className="h-1.5 bg-bgmain rounded-full mt-3"><div className="h-full bg-warning rounded-full" style={{ width: '78%' }} /></div></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card p-4"><div className="flex justify-between"><span className="text-[11px] font-bold tracking-wider text-muted">DOCUMENT LIBRARY</span></div><h3 className="font-heading font-bold mt-1">Category Distribution</h3>
            {[['Complete Blood Count', 18, '37.5%'], ['Lipid Profile', 12, '25.0%'], ['Metabolic Panels', 10, '20.8%'], ['Thyroid Profile', 8, '16.7%']].map(([n, c, p]) => <div key={n} className="mt-3"><div className="flex justify-between text-[12px]"><span>{n}</span><span className="font-mono text-muted">{c} ({p})</span></div><div className="h-2 bg-bgmain rounded-full mt-1"><div className="h-full bg-teal2 rounded-full" style={{ width: p }} /></div></div>)}
            <div className="border-t border-border mt-4 pt-3 flex justify-between text-[12px]"><span className="text-muted">OCR Accuracy Avg</span><span className="font-mono font-bold">99.1% <span className="text-muted font-normal">(demo)</span></span></div>
          </div>
          <div className="card p-4"><div className="flex justify-between items-center"><h3 className="font-heading font-bold text-sm">Extraction Pipeline</h3><span className="w-2 h-2 rounded-full bg-success animate-pulse" /></div><div className="text-[10px] font-bold tracking-wider text-muted mt-1">LIVE STREAM</div>
            {[
              ['10:42 AM', 'Quest_Diagnostics_CBC.pdf', 'AI explanation synthesis completed with patient-friendly context.', 'SYNTHESIZED'],
              ['09:15 AM', 'Biomarker Extraction (14)', 'Extraction verified with 99.1% optical accuracy score.', 'VERIFIED'],
              ['Yesterday', 'Labcorp_Metabolic.pdf', 'Consolidated summary report exported to patient portal PDF.', 'EXPORT'],
            ].map(([t, n, d, s]) => <div key={n + t} className="border-l-2 border-mint pl-3 py-2 mt-2"><div className="flex justify-between text-[12px]"><span className="font-mono text-muted">{t}</span><span className="badge bg-mint/15 text-teal2">{s}</span></div><div className="font-semibold text-[13px] mt-0.5">{n}</div><div className="text-[12px] text-muted leading-snug">{d}</div></div>)}
          </div>
          <div className="rounded-xl bg-navy text-white p-4"><div className="text-[10px] font-bold tracking-wider text-mint">EDUCATIONAL NOTE</div><h3 className="font-heading font-bold mt-1 text-[15px]">Understanding Reference Ranges &amp; Biological Variability</h3><p className="text-white/70 text-[12px] leading-relaxed mt-1.5">Test reference bounds represent 95% of a healthy population. Mild out-of-range figures often fluctuate due to hydration, timing, or recent exertion.</p><button onClick={() => navigate('/explanations/1')} className="text-mint text-[12px] font-bold mt-2">Read clinical interpretation guide →</button></div>
          <p className="text-[11px] text-muted leading-relaxed px-1">All records on this page are synthetic demonstration data.</p>
        </div>
      </div>
    </div>
  )
}
