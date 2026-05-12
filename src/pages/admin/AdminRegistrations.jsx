import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { adminAllRegistrations, adminGetEvents, adminGetRegistrations, adminUpdateRegStatus, adminVerifyCode } from '../../utils/api'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { HiUsers, HiSearch, HiCheckCircle, HiXCircle, HiCalendar, HiClock, HiLocationMarker } from 'react-icons/hi'

const statusCls = {
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled:  'bg-red-50 text-red-600 border-red-200',
  pending:    'bg-yellow-50 text-yellow-700 border-yellow-200',
}

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  // Verify code
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyResult, setVerifyResult] = useState(null)
  const [verifyError, setVerifyError] = useState('')
  const [verifying, setVerifying] = useState(false)

  useEffect(() => { adminGetEvents().then(r => setEvents(r.data.data)).catch(() => {}) }, [])

  useEffect(() => {
    setLoading(true)
    const req = selectedEvent === 'all' ? adminAllRegistrations() : adminGetRegistrations(selectedEvent)
    req.then(r => { setRegistrations(r.data.data); setStats(selectedEvent !== 'all' ? r.data.stats : null) })
      .catch(() => toast.error('Failed to load.')).finally(() => setLoading(false))
  }, [selectedEvent])

  const updateStatus = async (id, status) => {
    try {
      await adminUpdateRegStatus(id, status)
      setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status } : r))
      toast.success(`Updated to ${status}.`)
    } catch { toast.error('Failed to update.') }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!verifyCode.trim()) return
    setVerifying(true); setVerifyResult(null); setVerifyError('')
    try {
      const res = await adminVerifyCode(verifyCode.trim().toUpperCase())
      setVerifyResult(res.data.data)
    } catch (err) {
      setVerifyError(err.response?.data?.message || 'No registration found for this code.')
    } finally { setVerifying(false) }
  }

  const filtered = registrations.filter(r => {
    const q = search.toLowerCase()
    return r.firstName?.toLowerCase().includes(q) || r.lastName?.toLowerCase().includes(q) ||
           r.email?.toLowerCase().includes(q) || r.confirmationCode?.toLowerCase().includes(q)
  })

  const vStatusCls = { confirmed:'bg-green-50 text-green-700 border-green-200', cancelled:'bg-red-50 text-red-600 border-red-200', pending:'bg-yellow-50 text-yellow-700 border-yellow-200' }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* VERIFY CODE PANEL */}
      <div className="bg-white border border-navy/6 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-navy/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <HiCheckCircle size={17} className="text-gold"/>
          </div>
          <div>
            <h2 className="font-serif text-xl text-navy">Verify Registration Code</h2>
            <p className="font-sans text-xs text-navy/35">Look up an attendee by their confirmation code</p>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleVerify} className="flex gap-3 max-w-md mb-5">
            <input value={verifyCode} onChange={e => setVerifyCode(e.target.value.toUpperCase())}
              placeholder="e.g. TP-ABC123-XY12" maxLength={20}
              className="input flex-1 font-mono uppercase tracking-widest"/>
            <button type="submit" disabled={verifying || !verifyCode.trim()} className="btn-gold whitespace-nowrap">
              {verifying ? <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin"/> : 'Verify'}
            </button>
          </form>

          <AnimatePresence mode="wait">
            {verifyError && (
              <motion.div key="err" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
                className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4 max-w-lg">
                <HiXCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5"/>
                <div><p className="font-sans font-medium text-red-700 text-sm">Not Found</p><p className="font-sans text-red-500 text-sm">{verifyError}</p></div>
              </motion.div>
            )}
            {verifyResult && (
              <motion.div key="res" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
                className="bg-green-50 border border-green-100 rounded-xl p-5 max-w-2xl">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-green-100">
                  <HiCheckCircle size={22} className="text-green-500 flex-shrink-0"/>
                  <div className="flex-1">
                    <p className="font-sans font-semibold text-green-800 text-sm">Registration Found</p>
                    <p className="font-mono text-green-600 text-xs tracking-widest">{verifyResult.confirmationCode}</p>
                  </div>
                  <span className={`badge border text-xs capitalize ${vStatusCls[verifyResult.status]||''}`}>{verifyResult.status}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[['Name', verifyResult.name],['Email', verifyResult.email],['Guests', verifyResult.numberOfGuests],['Member', verifyResult.isMember ? 'Yes' : 'No']].map(([l,v]) => (
                    <div key={l}><p className="font-sans text-xs text-green-600/70 uppercase tracking-wide">{l}</p><p className="font-sans text-sm font-medium text-green-900 mt-0.5 truncate">{v}</p></div>
                  ))}
                </div>
                {verifyResult.event && (
                  <div className="bg-white rounded-xl p-4 border border-green-100">
                    <p className="font-serif text-green-900 text-base font-medium mb-2">{verifyResult.event.title}</p>
                    <div className="flex flex-wrap gap-4">
                      {[[HiCalendar, format(new Date(verifyResult.event.date),'MMMM d, yyyy')],[HiClock,verifyResult.event.time],[HiLocationMarker,verifyResult.event.location]].map(([Icon,text],i) => (
                        <div key={i} className="flex items-center gap-1.5 text-green-700 text-xs font-sans"><Icon size={12}/>{text}</div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* REGISTRATIONS TABLE */}
      <div>
        <div className="mb-6"><h1 className="font-serif text-4xl text-navy">All Registrations</h1><p className="font-sans text-sm text-navy/35 mt-0.5">Manage event registrations</p></div>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
            {[['Total',stats.total],['Confirmed',stats.confirmed],['Cancelled',stats.cancelled],['Members',stats.members],['Guests',stats.totalGuests]].map(([l,v]) => (
              <div key={l} className="bg-white border border-navy/6 rounded-xl p-4 text-center shadow-sm">
                <p className="font-serif text-2xl text-navy">{v}</p><p className="font-sans text-xs text-navy/35 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1"><HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/25" size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, email, or code…" className="input pl-10"/></div>
          <select value={selectedEvent} onChange={e=>setSelectedEvent(e.target.value)} className="input sm:w-64">
            <option value="all">All Events</option>
            {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(5)].map((_,i)=><div key={i} className="h-14 bg-white border border-navy/5 rounded-2xl animate-pulse"/>)}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-navy/6 rounded-2xl py-20 text-center shadow-sm">
            <HiUsers size={40} className="text-navy/10 mx-auto mb-4"/><p className="font-serif text-2xl text-navy/20">No registrations found</p>
          </div>
        ) : (
          <div className="bg-white border border-navy/6 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-navy/5">
                  {['Name','Email','Event','Code','Guests','Status','Date'].map(h=><th key={h} className="text-left px-5 py-3.5 font-sans text-xs text-navy/25 tracking-widest uppercase whitespace-nowrap">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-navy/4">
                  {filtered.map(r => (
                    <tr key={r._id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                            <span className="font-serif text-gold text-xs">{r.firstName?.charAt(0)}</span>
                          </div>
                          <div><p className="font-sans text-sm text-navy whitespace-nowrap">{r.firstName} {r.lastName}</p>{r.isMember&&<p className="font-sans text-xs text-gold">Member</p>}</div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-sans text-sm text-navy/50 max-w-[150px] truncate">{r.email}</td>
                      <td className="px-5 py-4 font-sans text-xs text-navy/40 max-w-[140px] truncate">{r.event?.title||'—'}</td>
                      <td className="px-5 py-4 font-mono text-xs text-navy font-medium whitespace-nowrap">{r.confirmationCode}</td>
                      <td className="px-5 py-4 font-sans text-sm text-navy/50 text-center">{r.numberOfGuests}</td>
                      <td className="px-5 py-4">
                        <select value={r.status} onChange={e=>updateStatus(r._id,e.target.value)}
                          className={`font-sans text-xs px-2.5 py-1 rounded-full border cursor-pointer bg-transparent ${statusCls[r.status]||'bg-cream text-navy/40 border-navy/15'}`}>
                          <option value="confirmed">confirmed</option>
                          <option value="pending">pending</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 font-sans text-xs text-navy/30 whitespace-nowrap">{format(new Date(r.createdAt),'MMM d, yyyy')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}