import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FileText, Eye, Download, Trash2, MessageSquareText, BarChart3, User, Settings as SettingsIcon, Search } from 'lucide-react'
import { REPORTS, CBC_RESULTS, statusStyle } from '../data/demoData'
import { useAuth } from '../context/AuthContext'
import { loadSaved, deleteSaved, getSaved } from '../services/storage'

export function MyReports() {
  const navigate = useNavigate(); const [q, setQ] = useState('')
  const savedRows = () => loadSaved().map(r => ({ id: r.id, name: r.name, category: r.category || 'Unknown', date: r.date, extracted: r.extracted, status: r.status }))
  const [rows, setRows] = useState(() => [...savedRows(), ...REPORTS])
  const list = rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase()))
  return <div><h1 className="font-heading font-extrabold text-2xl">My Reports</h1><p className="text-muted text-[13px] mt-1">All documents in your repository. Synthetic demonstration data.</p>
    <div className="flex gap-2 mt-4"><div className="flex items-center bg-white border border-border rounded-lg px-3 py-2 flex-1 max-w-[320px]"><Search className="w-4 h-4 text-muted mr-2" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search reports..." className="outline-none text-[13px] w-full" /></div><button onClick={() => navigate('/upload')} className="btn-mint">Upload New Report</button></div>
    <div className="card mt-4 overflow-hidden"><table className="w-full text-[13px] min-w-[680px]"><thead><tr className="text-left text-[11px] text-muted border-b border-border"><th className="px-4 py-2.5">DOCUMENT</th><th className="px-3 py-2.5">CATEGORY</th><th className="px-3 py-2.5">UPLOADED</th><th className="px-3 py-2.5">EXTRACTED</th><th className="px-3 py-2.5">STATUS</th><th className="px-3 py-2.5 text-right">ACTIONS</th></tr></thead><tbody>
      {list.map(r => <tr key={r.id} className="border-b border-border/60 hover:bg-bgmain/60"><td className="px-4 py-3 font-semibold flex gap-2 items-center"><FileText className="w-4 h-4 text-teal2" />{r.name}</td><td className="px-3 py-3">{r.category}</td><td className="px-3 py-3">{r.date}</td><td className="px-3 py-3 font-mono">{r.extracted}</td><td className="px-3 py-3"><span className={`badge ${statusStyle(r.status)}`}>{r.status}</span></td><td className="px-3 py-3 text-right"><button onClick={() => navigate(`/analysis/${r.id}`)} className="p-1.5 hover:bg-white rounded"><Eye className="w-4 h-4" /></button><button onClick={() => { const b = new Blob([`Summary for ${r.name}\nStatus: ${r.status}\nSynthetic demo data.`], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'summary.txt'; a.click() }} className="p-1.5 hover:bg-white rounded"><Download className="w-4 h-4" /></button><button onClick={() => { deleteSaved(r.id); setRows(rows.filter(x => String(x.id) !== String(r.id))) }} className="p-1.5 hover:bg-white rounded"><Trash2 className="w-4 h-4 text-danger" /></button></td></tr>)}
    </tbody></table>{list.length === 0 && <div className="p-8 text-center text-muted">No reports match.</div>}</div></div>
}

export function Explanations() {
  const { id } = useParams(); const saved = getSaved(id)
  const items = saved ? saved.results.map(r => { const base = CBC_RESULTS.find(x => x.name === r.name) || {}; return { name: r.name, value: r.value, unit: r.unit, ref: r.ref, status: r.status, explanation: r.explanation || base.explanation || 'Compare this value with the reference range printed on the original report and discuss it with a clinician.', factors: r.factors || base.factors || '', question: r.question || base.question || '' } }) : CBC_RESULTS
  const [open, setOpen] = useState(items.find(r => r.status !== 'Within Range')?.name || CBC_RESULTS[2].name)
  return <div><h1 className="font-heading font-extrabold text-2xl">AI Explanations</h1><p className="text-muted text-[13px] mt-1">Plain-language educational explanations for {saved ? `your uploaded report — ${saved.name}` : `report ${id}`}. Educational only — not a diagnosis, prescription or treatment recommendation.</p>
    <div className="space-y-3 mt-5">{items.map(r => <div key={r.name} className="card p-4"><button onClick={() => setOpen(open === r.name ? null : r.name)} className="w-full flex justify-between items-center text-left"><span className="font-heading font-bold">{r.name} — {r.value ?? '—'} {r.unit} <span className="text-muted font-normal text-[12px]">(Ref {r.ref})</span></span><span className={`badge ${statusStyle(r.status)}`}>{r.status}</span></button>{open === r.name && <div className="mt-3 text-[13px] leading-relaxed border-t border-border pt-3"><p>{r.explanation}</p><p className="mt-2 text-muted"><b className="text-ink">Why reference ranges matter:</b> ranges are set from a healthy population and vary by lab, age and sex — always use the range printed on your own report.</p><p className="mt-2 text-muted"><b className="text-ink">Ask your clinician:</b> “{r.question}”</p></div>}</div>)}</div></div>
}

export function Analytics() {
  return <div><h1 className="font-heading font-extrabold text-2xl">Insights &amp; Analytics</h1><p className="text-muted text-[13px] mt-1">Demo analytics from synthetic data — 48 reports, 46 extracted, OCR confidence 99.1% (demo).</p>
    <div className="grid md:grid-cols-3 gap-4 mt-5">{[['Reports by month', 'Oct 2024: 21 · Sep 2024: 16 · Aug 2024: 11'], ['Out-of-range rate', '2 of 14 biomarkers in the latest CBC (14.3%)'], ['Most common panel', 'Complete Blood Count — 18 reports (37.5%)']].map(([t, d]) => <div key={t} className="card p-4"><div className="flex gap-2 items-center font-heading font-bold text-sm"><BarChart3 className="w-4 h-4 text-teal2" />{t}</div><p className="text-[13px] text-muted mt-2">{d}</p><div className="h-2 bg-bgmain rounded-full mt-3"><div className="h-full bg-mint rounded-full" style={{ width: '64%' }} /></div></div>)}</div>
    <div className="card p-5 mt-4"><h3 className="font-heading font-bold">Trend (demo)</h3><p className="text-[13px] text-muted mt-1">Extraction volume rose from 11 reports in August to 21 in October. No real patient trend is implied — these are synthetic demo counts.</p></div></div>
}

export function Profile() {
  const { user, logout } = useAuth(); const navigate = useNavigate()
  return <div><h1 className="font-heading font-extrabold text-2xl">Profile</h1><div className="card p-6 mt-4 max-w-[560px]"><div className="flex items-center gap-4"><div className="w-16 h-16 rounded-full bg-teal2 text-mint flex items-center justify-center text-xl font-bold">{user?.initials || 'SL'}</div><div><div className="font-heading font-bold text-lg">{user?.name}</div><div className="text-muted text-sm">{user?.role} · {user?.email}</div></div></div>
    <div className="grid grid-cols-2 gap-3 mt-5 text-[13px]"><div className="bg-bgmain rounded-lg p-3"><div className="text-muted text-[11px] font-bold">INSTITUTION</div>Stanford Medicine (demo)</div><div className="bg-bgmain rounded-lg p-3"><div className="text-muted text-[11px] font-bold">WORKSPACE</div>Clinical Workspace · V2.4</div><div className="bg-bgmain rounded-lg p-3"><div className="text-muted text-[11px] font-bold">REPORTS</div>48 processed</div><div className="bg-bgmain rounded-lg p-3"><div className="text-muted text-[11px] font-bold">SESSION</div>12h trusted workstation</div></div>
    <button onClick={() => { logout(); navigate('/login') }} className="btn-dark mt-5">Sign out</button></div></div>
}

export function SettingsPage() {
  const [ocr, setOcr] = useState(true); const [notif, setNotif] = useState(true); const [saved, setSaved] = useState(false)
  return <div><h1 className="font-heading font-extrabold text-2xl">Settings</h1><div className="card p-6 mt-4 max-w-[560px] space-y-4">
    <label className="flex justify-between items-center text-[14px] font-semibold">OCR boxes on document viewer <input type="checkbox" checked={ocr} onChange={e => setOcr(e.target.checked)} className="accent-teal-600 w-4 h-4" /></label>
    <label className="flex justify-between items-center text-[14px] font-semibold">Extraction notifications <input type="checkbox" checked={notif} onChange={e => setNotif(e.target.checked)} className="accent-teal-600 w-4 h-4" /></label>
    <div><label className="text-[13px] font-semibold">API base URL</label><input className="input mt-1" defaultValue="http://localhost:8000/api" readOnly /></div>
    <div className="text-[12px] text-muted">Demo account: demo@medilens.ai / demo1234. Backend runs on port 8000, frontend on 5173.</div>
    <button onClick={() => setSaved(true)} className="btn-mint">{saved ? 'Saved ✓' : 'Save settings'}</button></div></div>
}
export { User as _UserIcon, SettingsIcon as _SettingsIcon, MessageSquareText as _MsgIcon }
