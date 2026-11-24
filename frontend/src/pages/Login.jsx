import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ScanEye, Shield, Lock, FileText, Mail, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { DEMO_LOGIN } from '../data/demoData'

export default function Login() {
  const { login, loading } = useAuth(); const navigate = useNavigate()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [show, setShow] = useState(false); const [error, setError] = useState(''); const [trust, setTrust] = useState(true)
  const submit = async (e) => {
    e.preventDefault(); setError('')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid institutional email address.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    const r = await login(email, password)
    if (r.ok) navigate('/dashboard'); else setError(r.error)
  }
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-[58%] bg-teal2 text-white p-8 lg:p-12 flex flex-col relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-mint/10" /><div className="absolute right-40 bottom-10 w-40 h-40 rounded-full bg-mint/5" />
        <div className="relative flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center"><ScanEye className="w-5 h-5 text-mint" /></div><div><div className="font-heading font-extrabold text-lg leading-none">MediLens AI</div><div className="text-[10px] tracking-[0.2em] text-white/60 font-semibold mt-1">CLINICAL INTELLIGENCE ENGINE</div></div></div>
        <div className="relative mt-10"><span className="badge bg-white/10 text-mint border border-white/15">ENGINE V3.4 ACTIVE • OCR CONFIDENCE 99.4%</span></div>
        <h1 className="relative font-heading font-extrabold text-[42px] lg:text-[52px] leading-[1.05] mt-6 max-w-[520px]">Understand Your Health Reports Better.</h1>
        <p className="relative text-white/70 text-[15px] leading-relaxed mt-4 max-w-[520px]">AI-assisted medical document extraction, laboratory reference range mapping, and clear educational insights tailored for clinicians and patients.</p>
        <div className="relative mt-8 bg-white/[0.07] border border-white/10 rounded-2xl p-5 max-w-[560px]">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2 font-heading font-bold text-sm"><FileText className="w-4 h-4 text-mint" /> Live Extraction Matrix</div><span className="badge bg-mint/20 text-mint">99.4% OCR Confidence</span></div>
          <div className="grid grid-cols-3 gap-3 mt-4 text-[12px]"><div className="bg-black/20 rounded-lg p-3"><div className="text-white/50 text-[10px] tracking-wider">PANEL SOURCE</div><div className="font-semibold mt-1">Complete Blood Count (CBC)</div></div><div className="bg-black/20 rounded-lg p-3"><div className="text-white/50 text-[10px] tracking-wider">SPECIMEN</div><div className="font-semibold mt-1">Whole Blood (EDTA)</div></div><div className="bg-black/20 rounded-lg p-3"><div className="text-white/50 text-[10px] tracking-wider">VALIDATION STATUS</div><div className="font-semibold mt-1 text-mint">Standardized</div></div></div>
          <div className="mt-3 space-y-2 text-[13px]">
            <div className="flex justify-between bg-black/20 rounded-lg px-3 py-2.5"><span>Hemoglobin (Hb) <span className="text-white/50 text-[11px]">Ref: 12.0 – 15.5 g/dL</span></span><span className="font-mono font-bold">14.2 g/dL <span className="badge bg-emerald-500/20 text-emerald-300 ml-1">IN-RANGE</span></span></div>
            <div className="flex justify-between bg-black/20 rounded-lg px-3 py-2.5"><span>Platelets Count <span className="text-white/50 text-[11px]">Ref: 150 – 450 K/µL</span></span><span className="font-mono font-bold">260 K/µL <span className="badge bg-emerald-500/20 text-emerald-300 ml-1">IN-RANGE</span></span></div>
          </div>
          <div className="text-[11px] text-white/40 mt-3 font-mono">Synthetic demonstration data — not a real patient record.</div>
        </div>
        <div className="relative grid grid-cols-3 gap-3 mt-auto pt-10 max-w-[560px]">
          {[['HIPAA Compliant Cloud Vault', Shield], ['256-Bit AES Storage Grade', Lock], ['Strict Educational Disclaimers', FileText]].map(([t, I]) => (
            <div key={t} className="bg-white/[0.06] border border-white/10 rounded-xl p-3"><I className="w-4 h-4 text-mint mb-2" /><div className="text-[11px] font-semibold leading-snug">{t}</div></div>
          ))}
        </div>
        <div className="relative text-[11px] text-white/40 mt-6">Demo values shown on this page are illustrative only. Security labels describe product design, not a certified compliance assessment.</div>
      </div>
      <div className="lg:w-[42%] bg-white p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-[420px] w-full mx-auto">
          <div className="flex items-center gap-2 text-[11px] tracking-[0.18em] font-bold text-teal2"><Lock className="w-3.5 h-3.5" /> CLINICIAN &amp; RESEARCHER PORTAL</div>
          <h2 className="font-heading font-extrabold text-[32px] mt-4">Welcome Back</h2>
          <p className="text-muted text-sm mt-1">Sign in to access your clinical report repository and extracted insights.</p>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button disabled title="Demo only — not integrated" className="btn-ghost opacity-60 cursor-not-allowed">Institutional ID</button>
            <button disabled title="Demo only — not integrated" className="btn-ghost opacity-60 cursor-not-allowed">Google Health</button>
          </div>
          <div className="flex items-center gap-3 my-5 text-[11px] text-muted font-semibold"><span className="flex-1 h-px bg-border" /> OR SIGN IN WITH EMAIL <span className="flex-1 h-px bg-border" /></div>
          <form onSubmit={submit} className="space-y-4">
            <div><label className="text-[13px] font-semibold">Institutional Email Address</label><div className="relative mt-1.5"><Mail className="w-4 h-4 text-muted absolute left-3 top-3" /><input className="input pl-9" type="email" placeholder="sarah.lin@stanfordmed.org" value={email} onChange={e => setEmail(e.target.value)} /></div></div>
            <div><label className="text-[13px] font-semibold">Password</label><div className="relative mt-1.5"><Lock className="w-4 h-4 text-muted absolute left-3 top-3" /><input className="input pl-9 pr-10" type={show ? 'text' : 'password'} placeholder="••••••••••" value={password} onChange={e => setPassword(e.target.value)} /><button type="button" onClick={() => setShow(v => !v)} className="absolute right-3 top-2.5 text-muted">{show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div><div className="flex justify-end mt-1"><Link to="/forgot-password" className="text-[12px] font-semibold text-teal2">Forgot password?</Link></div></div>
            {error && <div className="text-[13px] text-danger bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
            <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={trust} onChange={e => setTrust(e.target.checked)} className="accent-teal-600" /> Trust this diagnostic workstation <span className="ml-auto text-muted text-xs">12h session</span></label>
            <button disabled={loading} className="btn-mint w-full flex items-center justify-center gap-2 disabled:opacity-60">{loading && <Loader2 className="w-4 h-4 animate-spin" />} Sign In to Workspace →</button>
          </form>
          <button onClick={() => { setEmail(DEMO_LOGIN.email); setPassword(DEMO_LOGIN.password) }} className="w-full mt-3 text-[13px] font-semibold text-teal2 border border-mint/60 bg-mint/10 rounded-lg py-2.5">Fill demo login — demo@medilens.ai / demo1234</button>
          <p className="text-center text-[13px] mt-5 text-muted">New to MediLens AI? <Link to="/register" className="font-bold text-teal2">Create an account</Link></p>
          <div className="mt-6 bg-bgmain border border-border rounded-xl p-4 text-[12px] leading-relaxed text-muted"><b className="text-ink">Educational Guidance:</b> MediLens AI provides document intelligence and educational explanations. Not for emergency medical diagnosis. Validate findings against primary patient pathology records.</div>
        </div>
      </div>
    </div>
  )
}
