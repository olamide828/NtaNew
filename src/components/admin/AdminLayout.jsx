import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NProgress from 'nprogress'
import { HiViewGrid, HiCalendar, HiUsers, HiPhotograph, HiLogout, HiMenuAlt2, HiChevronRight, HiExternalLink } from 'react-icons/hi'

const nav = [
  { to:'/admin', end:true, icon:HiViewGrid, label:'Dashboard' },
  { to:'/admin/events', icon:HiCalendar, label:'Events' },
  { to:'/admin/registrations', icon:HiUsers, label:'Registrations' },
  { to:'/admin/highlights', icon:HiPhotograph, label:'Highlights' },
]

export default function AdminLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); NProgress.start(); navigate('/admin/login') }

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-navy border-r border-white/5">
      <div className="px-6 py-6 border-b border-white/5">
        <Link to="/" target="_blank">
          <p className="font-sans text-[9px] text-gold font-semibold tracking-[0.25em] uppercase">NTA Worldwide</p>
          <p className="font-serif text-white text-xl">Testimony Parish</p>
        </Link>
        <span className="mt-2 inline-block font-sans text-xs text-white/30 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">Admin Panel</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ to, end, icon:Icon, label }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl font-sans text-sm transition-all group ${
                isActive ? 'bg-gold text-navy font-semibold' : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}>
            <Icon size={16} />{label}
            <HiChevronRight size={13} className="ml-auto opacity-0 group-hover:opacity-30 transition-opacity" />
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
            <span className="font-serif text-gold text-sm">{admin?.name?.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <p className="font-sans text-white text-xs font-medium truncate">{admin?.name}</p>
            <p className="font-sans text-white/30 text-xs truncate">{admin?.role}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/" target="_blank" className="flex-1 flex items-center justify-center gap-1.5 font-sans text-xs text-white/30 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">
            <HiExternalLink size={12} />View Site
          </Link>
          <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-1.5 font-sans text-xs text-white/30 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors">
            <HiLogout size={12} />Sign Out
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      <div className="hidden lg:flex w-60 flex-shrink-0 flex-col h-full"><Sidebar /></div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-64 h-full"><Sidebar /></div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-navy/5 px-6 h-14 flex items-center justify-between flex-shrink-0 shadow-sm">
          <button onClick={() => setOpen(true)} className="lg:hidden text-navy/40 hover:text-navy"><HiMenuAlt2 size={20} /></button>
          <div className="hidden lg:block" />
          <p className="font-sans text-xs text-navy/30">{new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8"><Outlet /></div>
      </div>
    </div>
  )
}