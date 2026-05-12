import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboard } from '../../utils/api'
import { format } from 'date-fns'
import NProgress from 'nprogress'
import { useAuth } from '../../context/AuthContext'
import { HiCalendar, HiUsers, HiClock, HiPhotograph, HiArrowRight, HiPlus } from 'react-icons/hi'

function Stat({ icon:Icon, label, value, to }) {
  const navigate = useNavigate()
  return (
    <button onClick={() => { NProgress.start(); navigate(to) }}
      className="bg-white border border-navy/6 rounded-2xl p-6 text-left hover:shadow-md hover:border-gold/30 transition-all group w-full">
      <div className="flex items-start justify-between mb-5">
        <div className="w-10 h-10 rounded-xl bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center transition-colors">
          <Icon size={18} className="text-navy/40 group-hover:text-gold transition-colors" />
        </div>
        <HiArrowRight size={14} className="text-navy/15 group-hover:text-gold transition-colors mt-1" />
      </div>
      <p className="font-serif text-4xl text-navy mb-1">{value ?? '—'}</p>
      <p className="font-sans text-sm text-navy/40">{label}</p>
    </button>
  )
}

export default function AdminDashboard() {
  const { admin } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const go = (to) => { NProgress.start(); navigate(to) }

  useEffect(() => { getDashboard().then(r=>setData(r.data.data)).catch(()=>{}).finally(()=>setLoading(false)) }, [])

  const hour = new Date().getHours()
  const greeting = hour<12?'Good morning':hour<17?'Good afternoon':'Good evening'
  const statusCls = { confirmed:'bg-green-50 text-green-700', cancelled:'bg-red-50 text-red-600', pending:'bg-yellow-50 text-yellow-700' }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="font-sans text-sm text-navy/40">{greeting},</p>
        <h1 className="font-serif text-4xl text-navy">{admin?.name}</h1>
        <p className="font-sans text-xs text-navy/30 mt-1">{format(new Date(),'EEEE, MMMM d, yyyy')}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{[...Array(4)].map((_,i)=><div key={i} className="h-36 bg-white border border-navy/5 rounded-2xl animate-pulse"/>)}</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Stat icon={HiCalendar} label="Total Events" value={data?.totalEvents} to="/admin/events" />
          <Stat icon={HiClock} label="Upcoming" value={data?.upcomingEvents} to="/admin/events" />
          <Stat icon={HiUsers} label="Registrations" value={data?.totalRegistrations} to="/admin/registrations" />
          <Stat icon={HiPhotograph} label="Highlights" value="—" to="/admin/highlights" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-navy/6 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-navy/5">
            <h2 className="font-serif text-xl text-navy">Recent Registrations</h2>
            <button onClick={()=>go('/admin/registrations')} className="font-sans text-xs text-gold hover:text-gold-dark transition-colors">View all →</button>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{[...Array(4)].map((_,i)=><div key={i} className="h-12 bg-cream rounded-xl animate-pulse"/>)}</div>
          ) : !data?.recentRegistrations?.length ? (
            <div className="py-16 text-center font-sans text-sm text-navy/20 italic">No registrations yet.</div>
          ) : (
            <div className="divide-y divide-navy/4">
              {data.recentRegistrations.map(r => (
                <div key={r._id} className="flex items-center gap-4 px-6 py-3.5">
                  <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-serif text-gold text-sm">{r.firstName?.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm text-navy font-medium truncate">{r.firstName} {r.lastName}</p>
                    <p className="font-sans text-xs text-navy/35 truncate">{r.event?.title}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`font-sans text-xs px-2.5 py-0.5 rounded-full ${statusCls[r.status]||'bg-navy/5 text-navy/40'}`}>{r.status}</span>
                    <p className="font-sans text-xs text-navy/25 mt-1">{format(new Date(r.createdAt),'MMM d')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-navy px-1">Quick Actions</h2>
          {[{icon:HiCalendar,title:'Create Event',sub:'Publish a new programme',to:'/admin/events/new'},{icon:HiPhotograph,title:'Add Highlight',sub:'Upload photos or videos',to:'/admin/highlights'},{icon:HiUsers,title:'Registrations',sub:'Manage attendees',to:'/admin/registrations'}].map(item => (
            <button key={item.to} onClick={()=>go(item.to)}
              className="w-full flex items-center gap-4 bg-white border border-navy/6 rounded-2xl p-5 hover:shadow-md hover:border-gold/30 transition-all group text-left">
              <div className="w-10 h-10 rounded-xl bg-cream border border-navy/6 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/10 group-hover:border-gold/20 transition-colors">
                <item.icon size={17} className="text-navy/40 group-hover:text-gold transition-colors" />
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-navy">{item.title}</p>
                <p className="font-sans text-xs text-navy/35">{item.sub}</p>
              </div>
              <HiArrowRight size={14} className="ml-auto text-navy/15 group-hover:text-gold transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}