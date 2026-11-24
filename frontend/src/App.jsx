import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import UploadReport from './pages/UploadReport.jsx'
import ReportAnalysis from './pages/ReportAnalysis.jsx'
import { MyReports, Explanations, Analytics, Profile, SettingsPage } from './pages/ExtraPages.jsx'
import { useAuth } from './context/AuthContext.jsx'

function Protected({ children }) { const { isAuthed } = useAuth(); return isAuthed ? children : <Navigate to="/login" replace /> }
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<Protected><AppLayout /></Protected>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadReport />} />
        <Route path="/reports" element={<MyReports />} />
        <Route path="/analysis/:id" element={<ReportAnalysis />} />
        <Route path="/explanations/:id" element={<Explanations />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
