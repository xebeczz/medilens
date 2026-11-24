import React, { createContext, useContext, useEffect, useState } from 'react'
import { DEMO_USER, DEMO_LOGIN } from '../data/demoData'
import api from '../services/api'
const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('medilens_user')) } catch { return null } })
  const [token, setToken] = useState(() => localStorage.getItem('medilens_token') || null)
  const [loading, setLoading] = useState(false)
  useEffect(() => { if (user) localStorage.setItem('medilens_user', JSON.stringify(user)); else localStorage.removeItem('medilens_user') }, [user])
  useEffect(() => { if (token) localStorage.setItem('medilens_token', token); else localStorage.removeItem('medilens_token') }, [token])
  async function login(email, password) {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', new URLSearchParams({ username: email, password }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      const t = res.data.access_token
      setToken(t)
      const me = await api.get('/auth/me', { headers: { Authorization: `Bearer ${t}` } })
      setUser({ name: me.data.full_name || me.data.email, email: me.data.email, role: 'Clinical Researcher', initials: (me.data.full_name || 'U').split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase() })
      return { ok: true }
    } catch (e) {
      // Backend reachable but credentials unknown (e.g. demo user not registered yet)?
      // Try creating the demo account once, then log in for real — so uploads save.
      if (e.response && email.trim().toLowerCase() === DEMO_LOGIN.email && password === DEMO_LOGIN.password) {
        try {
          await api.post('/auth/register', { full_name: 'Dr. Sarah Lin', email: DEMO_LOGIN.email, password: DEMO_LOGIN.password })
          return await login(email, password)
        } catch { /* fall through to demo fallback below */ }
      }
      // Backend unreachable (no response): local demo mode only.
      if (!e.response && email.trim().toLowerCase() === DEMO_LOGIN.email && password === DEMO_LOGIN.password) {
        setToken('demo-token'); setUser(DEMO_USER); return { ok: true, demo: true }
      }
      return { ok: false, error: 'Invalid credentials. Demo login: demo@medilens.ai / demo1234' }
    } finally { setLoading(false) }
  }
  async function register(name, email, password) {
    try { await api.post('/auth/register', { full_name: name, email, password }); return await login(email, password) }
    catch { // demo fallback: allow local demo registration
      setToken('demo-token'); setUser({ name, email, role: 'Clinical Researcher', initials: name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase() }); return { ok: true, demo: true }
    }
  }
  function logout() { setUser(null); setToken(null) }
  return <Ctx.Provider value={{ user, token, loading, login, logout, register, isAuthed: !!user }}>{children}</Ctx.Provider>
}
