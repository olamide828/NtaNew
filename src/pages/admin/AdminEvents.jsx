import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminGetEvents, adminDeleteEvent } from '../../utils/api'
import { format } from 'date-fns'
import { toast } from 'sonner'
import NProgress from 'nprogress'
import { HiPlus, HiPencil, HiTrash, HiCalendar, HiEye, HiEyeOff } from 'react-icons/hi'

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()
  const go = (to) => { NProgress.start(); navigate(to) }

  useEffect(() => {
    setLoading(true)
    adminGetEvents(filter !== 'all' ? { status: filter } : {})
      .then(r => setEvents(r.data.data)).catch(() => toast.error('Failed to load.')).finally(() => setLoading(false))
  }, [filter])

  const handleDelete = async (ev) => {
    if (!confirm(`Delete "${ev.title}" and all its registrations?`)) return
    setDeleting(ev._id)
    try {
      await adminDeleteEvent(ev._id)
      toast.success('Event deleted.')
      setEvents(prev => prev.filter(e => e._id !== ev._id))
    } catch { toast.error('Failed to delete.') }
    finally { setDeleting(null) }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-serif text-4xl text-navy">Events</h1><p className="font-sans text-sm text-navy/35 mt-0.5">{events.length} total</p></div>
        <button onClick={() => go('/admin/events/new')} className="btn-gold gap-1.5 text-xs"><HiPlus size={16}/>New Event</button>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {[['all','All'],['upcoming','Upcoming'],['past','Past'],['published','Published'],['unpublished','Drafts']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`font-sans text-xs px-4 py-2 rounded-full border transition-all ${filter===v ? 'bg-navy text-white border-navy' : 'border-navy/15 text-navy/50 hover:border-navy/40 bg-white'}`}>{l}</button>
        ))}
      </div>
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="h-16 bg-white border border-navy/5 rounded-2xl animate-pulse"/>)}</div>
      ) : events.length === 0 ? (
        <div className="bg-white border border-navy/6 rounded-2xl py-20 text-center">
          <HiCalendar size={40} className="text-navy/10 mx-auto mb-4"/>
          <p className="font-serif text-2xl text-navy/20 mb-6">No events found</p>
          <button onClick={() => go('/admin/events/new')} className="btn-gold text-xs gap-1.5"><HiPlus size={14}/>Create First Event</button>
        </div>
      ) : (
        <div className="bg-white border border-navy/6 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-navy/5">
                {['Event','Date','Category','Registered','Status',''].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-sans text-xs text-navy/30 tracking-widest uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-navy/4">
                {events.map(ev => (
                  <tr key={ev._id} className="hover:bg-cream/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {ev.imageUrl ? <img src={ev.imageUrl} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0"/> : <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center flex-shrink-0"><HiCalendar size={16} className="text-navy/25"/></div>}
                        <p className="font-sans text-sm text-navy font-medium">{ev.title}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-sans text-sm text-navy/50 whitespace-nowrap">{format(new Date(ev.date),'MMM d, yyyy')}</td>
                    <td className="px-5 py-4"><span className="badge bg-gold/10 text-gold-dark text-xs border border-gold/15">{ev.category}</span></td>
                    <td className="px-5 py-4 font-sans text-sm text-navy/50">{ev.registrationCount??0}{ev.capacity?`/${ev.capacity}`:''}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {ev.isPublished ? <span className="flex items-center gap-1.5 font-sans text-xs text-green-600"><HiEye size={12}/>Live</span> : <span className="flex items-center gap-1.5 font-sans text-xs text-navy/30"><HiEyeOff size={12}/>Draft</span>}
                        {ev.isFeatured && <span className="badge bg-gold text-navy text-[10px]">★</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => go(`/admin/events/edit/${ev._id}`)} className="w-8 h-8 rounded-xl bg-cream hover:bg-navy/10 flex items-center justify-center text-navy/40 hover:text-navy transition-colors"><HiPencil size={14}/></button>
                        <button onClick={() => handleDelete(ev)} disabled={deleting===ev._id} className="w-8 h-8 rounded-xl bg-cream hover:bg-red-50 flex items-center justify-center text-navy/40 hover:text-red-500 transition-colors disabled:opacity-40"><HiTrash size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}