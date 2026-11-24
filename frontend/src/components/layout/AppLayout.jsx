import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Upload, FolderOpen, FileText, MessageSquareText, BarChart3, User, Settings, LogOut, Search, Bell, HelpCircle, Sun, Moon, Menu, X, ScanEye, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { section: 'WORKSPACE' },
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload Report', icon: Upload },
  { to: '/reports', label: 'My Reports', icon: FolderOpen },
  { section: 'INTELLIGENCE' },
  { to: '/analysis/1', label: 'Report Analysis', icon: FileText },
  { to: '/explanations/1', label: 'AI Explanations', icon: MessageSquareText },
  { to: '/analytics', label: 'Insights & Analytics', icon: BarChart3 },
  { section: 'ACCOUNT' },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth(); const navigate = useNavigate()
  return (
    <div className="flex flex-col h-full bg-navy text-white">
      <div className="px-5 pt-5 pb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-teal2 border border-white/10 flex items-center justify-center"><ScanEye className="w-5 h-5 text-mint" /></div>
        <div><div className="font-heading font-800 font-extrabold text-[15px] leading-tight">MediLens AI</div><div className="text-[9px] tracking-[0.18em] text-white/50 font-semibold">CLINICAL INTELLIGENCE V2.4</div></div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {NAV.map((item, i) => item.section ? <div key={i} className="px-3 pt-4 pb-1.5 text-[10px] tracking-[0.16em] text-white/40 font-bold">{item.section}</div> : (
          <NavLink key={item.to + item.label} to={item.to} onClick={onNavigate} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium ${isActive ? 'bg-mint text-navy font-bold' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}>
            <item.icon className="w-4 h-4" />{item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-full bg-mint text-navy flex items-center justify-center text-xs font-bold">{user?.initials || 'SL'}</div>
          <div className="flex-1 min-w-0"><div className="text-[13px] font-semibold truncate">{user?.name || 'Dr. Sarah Lin'}</div><div className="text-[11px] text-white/50 truncate">{user?.role || 'Clinical Researcher'}</div></div>
          <button title="Sign out" onClick={() => { logout(); navigate('/login') }} className="p-1.5 rounded hover:bg-white/10"><LogOut className="w-4 h-4 text-white/70" /></button>
        </div>
      </div>
    </div>
  )
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [query, setQuery] = useState('')
  const location = useLocation(); const navigate = useNavigate()
  const crumbs = { '/dashboard': ['Clinical Workspace', 'Overview'], '/upload': ['Clinical Workspace', 'Upload Report'], '/reports': ['Clinical Workspace', 'My Reports'], '/analytics': ['Clinical Workspace', 'Insights & Analytics'], '/profile': ['Account', 'Profile'], '/settings': ['Account', 'Settings'] }
  const isAnalysis = location.pathname.startsWith('/analysis')
  const isExpl = location.pathname.startsWith('/explanations')
  const crumb = crumbs[location.pathname] || (isAnalysis ? ['Clinical Workspace', 'Report Analysis'] : isExpl ? ['Clinical Workspace', 'AI Explanations'] : ['Clinical Workspace', 'MediLens AI'])
  return (
    <div className={dark ? 'dark' : ''}>
    <div className="flex min-h-screen bg-bgmain">
      <aside className="hidden lg:block w-[228px] shrink-0 fixed inset-y-0 left-0 z-30"><SidebarContent /></aside>
      {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} /><aside className="absolute inset-y-0 left-0 w-[260px]"><SidebarContent onNavigate={() => setMobileOpen(false)} /><button onClick={() => setMobileOpen(false)} className="absolute top-4 right-[-44px] bg-white rounded-lg p-2 shadow"><X className="w-5 h-5" /></button></aside></div>}
      <div className="flex-1 lg:ml-[228px] min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-border">
          <div className="flex items-center gap-3 px-4 lg:px-6 h-[52px]">
            <button className="lg:hidden p-2 -ml-2" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
            <div className="flex items-center gap-1.5 text-[12px] text-muted min-w-0"><span className="font-semibold text-ink">MediLens Intelligence</span><ChevronRight className="w-3.5 h-3.5" /><span className="truncate">{crumb[1]}</span><span className="hidden md:inline-flex ml-2 badge bg-mint/20 text-teal2 border border-mint/40">HIPAA Compliant Session</span></div>
            <div className="flex-1" />
            <div className="hidden md:flex items-center bg-bgmain border border-border rounded-lg px-3 py-1.5 w-[240px]"><Search className="w-4 h-4 text-muted mr-2" /><input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') navigate('/reports') }} placeholder="Search reports, metrics..." className="bg-transparent outline-none text-[13px] w-full" /></div>
            <button className="p-2 rounded-lg hover:bg-bgmain" title="Help" onClick={() => navigate('/settings')}><HelpCircle className="w-[18px] h-[18px] text-muted" /></button>
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-bgmain relative" onClick={() => setNotifOpen(v => !v)}><Bell className="w-[18px] h-[18px] text-muted" /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" /></button>
              {notifOpen && <div className="absolute right-0 mt-2 w-[300px] card p-3 z-50 shadow-lg"><div className="font-heading font-bold text-sm mb-2">Notifications</div>
                <div className="text-[13px] py-2 border-b border-border">Extraction complete — Quest_Diagnostics_CBC_Oct2024.pdf · 14 biomarkers</div>
                <div className="text-[13px] py-2 border-b border-border">Manual review needed — CityHospital_Lipid_Panel_Scan.png (faint scan)</div>
                <div className="text-[13px] py-2">Weekly summary is ready in Insights &amp; Analytics</div></div>}
            </div>
            <button className="p-2 rounded-lg hover:bg-bgmain" onClick={() => setDark(v => !v)} title="Toggle theme">{dark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px] text-muted" />}</button>
            <div className="w-8 h-8 rounded-full bg-teal2 text-mint flex items-center justify-center text-xs font-bold cursor-pointer" onClick={() => navigate('/profile')}>SL</div>
          </div>
          <div className="px-4 lg:px-6 py-1.5 border-t border-border/60 flex items-center gap-2 text-[11px] text-muted">
            <span className="w-2 h-2 rounded-full bg-success inline-block" />
            <span><b className="text-ink font-semibold">Clinical Safety Disclaimer:</b> Educational document intelligence platform — not a certified diagnostic medical device. Corroborate outputs with primary lab records.</span>
            <span className="ml-auto hidden md:inline font-mono text-[10px]">IEC-62304 / ISO-14971 GUIDANCE</span>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 max-w-[1400px] w-full mx-auto"><Outlet /></main>
      </div>
    </div>
    </div>
  )
}
