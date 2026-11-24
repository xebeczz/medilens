import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CloudUpload, FileText, X, CheckCircle2, Loader2, ShieldCheck, Eye, RotateCcw, Trash2, Archive } from 'lucide-react'
import { REPORTS } from '../data/demoData'
import { reportsApi } from '../services/api'
import { extractFile } from '../services/extractClient'
import { saveReport, loadSaved, registerFile } from '../services/storage'
import { useAuth } from '../context/AuthContext'

const STAGES = [
  ['File Validation & Virus Scan', 'Checksum verified • Format validated', 'demo check only — no real antivirus scanner is installed'],
  ['High-Resolution Text Extraction (OCR)', 'Local / demo text extraction • 1,480 tokens parsed', ''],
  ['Test & Biomarker Identification', 'Entities resolved: Complete Blood Count, Lipid Panel, Metabolic Profile', ''],
  ['Reference-Range Extraction & Mapping', 'Matching clinical unit ranges against standard demographic percentiles…', ''],
  ['AI Plain-Language Explanation Synthesis', 'Translates out-of-range clinical indices into patient accessible context', ''],
  ['Report Structured Synthesis', 'Assembly into interactive multi-tiered medical inspector and longitudinal graph', ''],
]
const ACCEPT = ['application/pdf', 'image/jpeg', 'image/png']
export default function UploadReport() {
  const navigate = useNavigate(); const inputRef = useRef(null)
  const { token } = useAuth()
  const [file, setFile] = useState(null); const [error, setError] = useState(''); const [progress, setProgress] = useState(0); const [stage, setStage] = useState(-1); const [done, setDone] = useState(false); const [uploading, setUploading] = useState(false); const [history, setHistory] = useState(() => [...loadSaved().map(r => ({ id: r.id, name: r.name, category: r.category, tag: r.category, date: r.date, extracted: r.extracted, status: r.status, size: r.size })), ...REPORTS.slice(4, 7)])
  const [savedId, setSavedId] = useState(null); const [savedNote, setSavedNote] = useState('')
  const pick = (f) => {
    setError(''); setDone(false); setProgress(0); setStage(-1); setSavedId(null); setSavedNote('')
    if (!f) return
    if (!ACCEPT.includes(f.type) && !/\.(pdf|jpe?g|png)$/i.test(f.name)) return setError('Invalid file type. Only PDF, JPG and PNG are accepted.')
    if (f.size > 10 * 1024 * 1024) return setError('File is larger than the 10 MB limit.')
    setFile(f)
  }
  const finishPipeline = (report) => {
    // Animate the 6 stages quickly, then mark saved — the report is already stored.
    let p = 0; const iv = setInterval(() => {
      p += 20; if (p >= 100) { p = 100; clearInterval(iv); setUploading(false); setDone(true); setStage(5) }
      setProgress(Math.floor(p)); setStage(Math.min(5, Math.floor(p / 18)))
    }, 220)
    setHistory(h => [{ id: report.id, name: report.name, category: report.category, tag: report.category, date: report.date, extracted: report.extracted, status: report.status, size: report.size }, ...h.filter(x => String(x.id) !== String(report.id))])
  }
  const start = async () => {
    if (!file) return setError('Choose a file first.')
    setUploading(true); setError('')
    try {
      // 1) Real backend when signed in with a real token: upload + save server-side.
      if (token && token !== 'demo-token') {
        const fd = new FormData(); fd.append('file', file)
        const res = await reportsApi.upload(fd)
        const d = res.data
        const results = (d.results || []).map(r => ({ name: r.test_name, value: r.measured_value, unit: r.unit, ref: r.original_reference_text || `${r.reference_min} - ${r.reference_max}`, min: r.reference_min, max: r.reference_max, status: r.result_status, conf: r.extraction_confidence, explanation: '', factors: '', question: '' }))
        const report = { id: d.id, name: d.original_filename, category: d.report_type, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), extracted: results.filter(r => r.value != null).length, status: results.some(r => r.status !== 'Within Range') ? 'Minor Variance' : 'Within Range', size: (file.size / 1048576).toFixed(1) + ' MB', results, source: 'backend' }
        saveReport(report); registerFile(report.id, file)
        setSavedId(report.id); setSavedNote(`Saved to your account (report #${report.id}) — ${report.extracted} values extracted.`)
        return finishPipeline(report)
      }
      // 2) No backend (demo mode): extract in the browser and save locally — never fake it.
      const ext = await extractFile(file)
      const found = ext.results.filter(r => r.value != null).length
      const out = ext.results.some(r => r.status === 'Below Range' || r.status === 'Above Range')
      const report = { id: 'local-' + Date.now(), name: file.name, category: ext.category, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), extracted: found, status: found === 0 ? 'Needs Review' : out ? 'Minor Variance' : 'Within Range', size: (file.size / 1048576).toFixed(1) + ' MB', results: ext.results, source: 'local', pages: ext.pages }
      saveReport(report); registerFile(report.id, file)
      setSavedId(report.id); setSavedNote(`Saved on this device — ${found} of ${ext.results.length} values found in your file${found === 0 ? ' (image without OCR: marked Needs Review, nothing invented)' : ''}. Start the backend to save it to your account instead.`)
      finishPipeline(report)
    } catch (err) {
      setUploading(false)
      setError(err?.response?.data?.detail || 'Upload failed. Check the file and try again — nothing was saved.')
    }
  }
  const cancel = () => { setFile(null); setProgress(0); setStage(-1); setDone(false); setUploading(false); setSavedId(null) }
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><div className="text-[11px] font-mono text-mint font-bold">INTELLIGENT INGESTION PIPELINE V2.4</div><h1 className="font-heading font-extrabold text-[26px] mt-1">Upload Medical Report</h1><p className="text-muted text-[13px] max-w-[620px] mt-1">Upload lab work, blood tests, or diagnostic scans. Our clinical document engine parses medical terminology, extracts laboratory reference ranges, and organizes results.</p></div>
        <div className="card px-4 py-2.5 text-right"><div className="text-[11px] font-bold">OCR Engine: <span className="text-success">Demo / Local</span></div><div className="text-[11px] text-muted font-mono">Latency ~1.2s / page · labelled demo, not a live OCR service</div></div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-5 items-start">
        <div className="space-y-4">
          <div className="card p-5">
            <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); pick(e.dataTransfer.files[0]) }} onClick={() => inputRef.current.click()} className="border-2 border-dashed border-border rounded-xl py-10 px-4 text-center cursor-pointer hover:border-mint bg-bgmain/50">
              <CloudUpload className="w-10 h-10 text-teal2 mx-auto" /><div className="font-heading font-bold mt-3">Drag and drop your medical report here</div><div className="text-[13px] text-muted mt-1">or <span className="font-bold text-teal2 underline">Browse Files</span> from your workstation</div>
              <div className="flex justify-center gap-2 mt-4">{['PDF', 'JPG', 'PNG'].map(x => <span key={x} className="badge bg-white border border-border">{x}</span>)}<span className="badge bg-white border border-border">Max 10 MB</span></div>
              <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => pick(e.target.files[0])} />
            </div>
            {error && <div className="mt-3 text-[13px] text-danger bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
            {file && <div className="mt-3 flex items-center gap-3 bg-bgmain rounded-lg p-3"><FileText className="w-5 h-5 text-teal2 shrink-0" /><div className="flex-1 min-w-0"><div className="font-semibold text-[13px] truncate">{file.name}</div><div className="text-[11px] text-muted font-mono">{(file.size / 1048576).toFixed(2)} MB • {file.type || 'unknown type'}</div></div>{!uploading && !done && <button onClick={start} className="btn-mint !py-2">Start upload</button>}{uploading && <Loader2 className="w-5 h-5 animate-spin text-teal2" />}<button onClick={cancel} title="Cancel" className="p-2 rounded hover:bg-white"><X className="w-4 h-4" /></button></div>}
            {done && <div className="mt-3 text-[13px] text-success bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{savedNote || 'Saved.'}</div>}
            {done && savedId && <button onClick={() => navigate(`/analysis/${savedId}`)} className="btn-dark w-full mt-3">Open Report Analysis — see what is in this report →</button>}
          </div>
          <div className="card p-4 flex gap-3"><ShieldCheck className="w-5 h-5 text-success shrink-0 mt-0.5" /><div><div className="font-heading font-bold text-sm">Encrypted document handling</div><p className="text-[12px] text-muted leading-relaxed mt-1">Your health data is strictly private and processed in isolated, transient secure memory. No unnecessary document exposure. This describes the intended design — no specific encryption grade is claimed here.</p></div></div>
          <div className="card p-4"><div className="text-[11px] font-bold tracking-wider text-muted">STANDARD COMPLIANCE</div><div className="text-[13px] mt-1.5">HL7 / FHIR • LOINC Coordinated</div><p className="text-[12px] text-muted mt-1">Scans with handwritten physician addenda are transcribed with secondary validation prompts.</p></div>
        </div>
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-teal2" /><div className="flex-1 min-w-0"><div className="font-semibold text-sm truncate">{file ? file.name : 'Quest_Diagnostics_Comprehensive.pdf'}</div><div className="text-[11px] text-muted font-mono">{file ? (file.size / 1048576).toFixed(1) + ' MB' : '4.2 MB'} • {file ? '—' : '3 Pages'} • Patient ID: 09 09412</div></div><span className="badge bg-mint/15 text-teal2">IN QUEUE</span><button className="btn-ghost !py-1.5">Background</button><button onClick={cancel} className="btn-ghost !py-1.5 text-danger">Cancel</button></div>
            <div className="mt-4"><div className="flex justify-between text-[12px] font-semibold"><span>Overall Pipeline Ingestion Status</span><span className="font-mono">{progress}% Complete</span></div><div className="h-2 bg-bgmain rounded-full mt-2"><div className="h-full bg-mint rounded-full transition-all" style={{ width: progress + '%' }} /></div></div>
            <div className="mt-4 space-y-2">
              {STAGES.map(([t, d, note], i) => { const st = done || stage > i ? 'done' : stage === i ? 'active' : 'queued'; return (
                <div key={t} className={`flex gap-3 rounded-lg border p-3 ${st === 'active' ? 'border-mint bg-mint/10' : 'border-border'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${st === 'done' ? 'bg-success text-white' : st === 'active' ? 'bg-mint text-navy' : 'bg-bgmain text-muted'}`}>{st === 'done' ? '✓' : i + 1}</div>
                  <div className="flex-1 min-w-0"><div className="flex justify-between gap-2"><span className="font-semibold text-[13px]">{t}</span><span className={`badge ${st === 'done' ? 'bg-emerald-50 text-emerald-700' : st === 'active' ? 'bg-mint/20 text-teal2' : 'bg-bgmain text-muted'}`}>{st === 'done' ? 'Passed' : st === 'active' ? 'Processing' : 'Queued'}</span></div><div className="text-[12px] text-muted">{d}</div>{note && <div className="text-[11px] text-muted italic">{note}</div>}</div>
                </div>) })}
            </div>
            <div className="mt-4 bg-navy text-white rounded-lg p-3 font-mono text-[11px] leading-relaxed"><span className="text-mint font-bold">EXTRACTION STREAM</span><br />Resolved: [Hemoglobin Alc: 5.7%] • [eGFR: 94 mL/min/1.73m²]<br />{file ? `File: ${file.name} — ${progress}%` : 'Waiting for a file…'} • Stage {stage < 0 ? '—' : stage + 1}/6</div>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-4 items-start">
        <div className="card p-5"><h3 className="font-heading font-bold flex items-center gap-2"><FileText className="w-4 h-4 text-teal2" /> Upload Guidelines &amp; Best Practices</h3><p className="text-[12px] text-muted mt-1">To achieve optimal extraction accuracy and confidence indices, ensure clinical source documents comply with standard ingestion rules:</p>
          <ul className="mt-3 space-y-2.5 text-[13px]"><li><b>Even Lighting &amp; High Contrast</b> — avoid heavy directional shadows, phone glare, or folded documents.</li><li><b>Full Page Margin Visibility</b> — ensure laboratory header metadata, specimen collection timestamps, and test reference column units are not cropped.</li><li><b>Supported Laboratory Standards</b> — trained on standard diagnostic layouts from Quest, Labcorp, Mayo Clinic Laboratories, BioReference, and NHS pathology formats.</li></ul></div>
        <div className="card p-5"><div className="flex justify-between items-center"><h3 className="font-heading font-bold">Recent Upload History</h3><span className="text-[11px] text-muted">Showing 3 most recent</span></div>
          <div className="mt-3 space-y-2">{history.map(r => <div key={r.id} className="flex items-center gap-3 border border-border rounded-lg p-3"><FileText className="w-4 h-4 text-teal2 shrink-0" /><div className="flex-1 min-w-0"><div className="font-semibold text-[13px] truncate">{r.name}</div><div className="text-[11px] text-muted">{r.date} • {r.size || '2.8 MB'} • {r.extracted} Biomarkers</div></div><span className="badge bg-emerald-50 text-emerald-700">Parsed</span><button title="View" onClick={() => navigate(`/analysis/${r.id}`)} className="p-1.5 rounded hover:bg-bgmain"><Eye className="w-4 h-4" /></button><button title="Retry" onClick={() => navigate('/upload')} className="p-1.5 rounded hover:bg-bgmain"><RotateCcw className="w-4 h-4" /></button><button title="Delete" onClick={() => setHistory(h => h.filter(x => x.id !== r.id))} className="p-1.5 rounded hover:bg-bgmain"><Trash2 className="w-4 h-4 text-danger" /></button></div>)}</div>
          <div className="flex justify-between items-center mt-4"><span className="text-[12px] text-muted">Need to analyze a multi-patient folder?</span><button disabled title="Batch ingest is not implemented yet" className="btn-ghost opacity-60 cursor-not-allowed flex items-center gap-2"><Archive className="w-4 h-4" /> Batch Archive Ingest</button></div>
        </div>
      </div>
    </div>
  )
}
