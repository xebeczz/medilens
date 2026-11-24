import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ScanEye, CheckCircle2 } from 'lucide-react'
export default function ForgotPassword() {
  const [email, setEmail] = useState(''); const [sent, setSent] = useState(false)
  return <div className="min-h-screen bg-bgmain flex items-center justify-center p-6"><div className="card w-full max-w-[440px] p-8">
    <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-teal2 flex items-center justify-center"><ScanEye className="w-5 h-5 text-mint" /></div><div className="font-heading font-extrabold">MediLens AI</div></div>
    <h1 className="font-heading font-extrabold text-2xl mt-6">Reset password</h1><p className="text-muted text-sm mt-1">Enter your institutional email and we will send reset instructions. In this demo build no email is actually sent.</p>
    {sent ? <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm flex gap-2"><CheckCircle2 className="w-5 h-5 text-success shrink-0" /> If an account exists for <b>{email}</b>, reset instructions would be sent. (Demo — no email sent.)</div>
    : <form onSubmit={e => { e.preventDefault(); if (/^\S+@\S+\.\S+$/.test(email)) setSent(true) }} className="space-y-4 mt-6"><div><label className="text-[13px] font-semibold">Institutional email</label><input className="input mt-1" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@hospital.org" /></div><button className="btn-mint w-full">Send reset link</button></form>}
    <p className="text-center text-[13px] mt-4"><Link to="/login" className="font-bold text-teal2">Back to sign in</Link></p></div></div>
}
