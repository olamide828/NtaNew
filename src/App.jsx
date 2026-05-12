import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './context/AuthContext'

import Home           from './pages/Home'
import About          from './pages/About'
import Events         from './pages/Events'
import EventDetail    from './pages/EventDetail'
import Highlights     from './pages/Highlights'
import HighlightDetail from './pages/HighlightDetail'
import Contact        from './pages/Contact'

import AdminLogin         from './pages/admin/AdminLogin'
import AdminLayout        from './components/admin/AdminLayout'
import AdminDashboard     from './pages/admin/AdminDashboard'
import AdminEvents        from './pages/admin/AdminEvents'
import AdminEventForm     from './pages/admin/AdminEventForm'
import AdminRegistrations from './pages/admin/AdminRegistrations'
import AdminHighlights    from './pages/admin/AdminHighlights'

NProgress.configure({ showSpinner: false, trickleSpeed: 150 })

function RouteWatcher() {
  const location = useLocation()
  useEffect(() => {
    NProgress.start()
    window.scrollTo({ top: 0, behavior: 'instant' })
    const t = setTimeout(() => NProgress.done(), 400)
    return () => clearTimeout(t)
  }, [location.pathname])
  return null
}

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return admin ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouteWatcher />
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#fff', border: '1px solid rgba(13,27,42,0.08)',
            color: '#0d1b2a', fontFamily: '"Inter", sans-serif',
            fontSize: '14px', borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(13,27,42,0.12)',
          },
        }} />
        <Routes>
          <Route path="/"                   element={<Home />} />
          <Route path="/about"              element={<About />} />
          <Route path="/events"             element={<Events />} />
          <Route path="/events/:id"         element={<EventDetail />} />
          <Route path="/highlights"         element={<Highlights />} />
          <Route path="/highlights/:id"     element={<HighlightDetail />} />
          <Route path="/contact"            element={<Contact />} />
          <Route path="/admin/login"        element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index                    element={<AdminDashboard />} />
            <Route path="events"            element={<AdminEvents />} />
            <Route path="events/new"        element={<AdminEventForm />} />
            <Route path="events/edit/:id"   element={<AdminEventForm />} />
            <Route path="registrations"     element={<AdminRegistrations />} />
            <Route path="highlights"        element={<AdminHighlights />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}