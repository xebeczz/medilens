import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ScanEye, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
export default function Register() {
  const { register, loading } = useAuth(); const navigate = useNavigate()
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('')
  const submit = async (e) => { e.preventDefault(); if (!name.trim()) return setError('Enter your full name.'); if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email.'); if (password.length < 6) return setError('Password must be at least 6 characters.'); const r = await register(name, email, password); if (r.ok) navigate('/dashboard'); else setError('Could not create the account. Try again.') }
  return <div className="min-h-screen bg-bgmain flex items-center justify-center p-6"><div className="card w-full max-w-[440px] p-8">
    <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-teal2 flex items-center justify-center"><ScanEye className="w-5 h-5 text-mint" /></div><div><div className="font-heading font-extrabold">MediLens AI</div><div className="text-[10px] tracking-widest text-muted font-bold">CLINICAL INTELLIGENCE V2.4</div></div></div>
    <h1 className="font-heading font-extrabold text-2xl mt-6">Create an account</h1><p className="text-muted text-sm mt-1">Demo / local account. The backend stores it in SQLite when it is running.</p>
    <form onSubmit={submit} className="space-y-4 mt-6"><div><label className="text-[13px] font-semibold">Full name</label><input className="input mt-1" value={name} onChange={e => setName(e.target.value)} placeholder="Dr. Sarah Lin" /></div><div><label className="text-[13px] font-semibold">Institutional email</label><input className="input mt-1" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@hospital.org" /></div><div><label className="text-[13px] font-semibold">Password</label><input className="input mt-1" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" /></div>{error && <div className="text-[13px] text-danger bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}<button disabled={loading} className="btn-mint w-full flex justify-center gap-2">{loading && <Loader2 className="w-4 h-4 animate-spin" />} Create account</button></form>
    <p className="text-center text-[13px] mt-4 text-muted">Already have an account? <Link to="/login" className="font-bold text-teal2">Sign in</Link></p></div></div>
}
