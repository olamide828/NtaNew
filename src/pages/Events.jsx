import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getEvents } from '../utils/api'
import { format } from 'date-fns'
import NProgress from 'nprogress'
import PublicLayout from '../components/layout/PublicLayout'
import { HiCalendar, HiClock, HiLocationMarker, HiSearch } from 'react-icons/hi'

const CATS = ['All','Sunday Service','Prayer Meeting','Bible Study','Youth Program','Special Event','Conference','Outreach','Other']

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('All')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const go = (to) => { NProgress.start(); navigate(to) }

  useEffect(() => {
    setLoading(true)
    getEvents(cat !== 'All' ? { category: cat } : {})
      .then(r => setEvents(r.data.data)).catch(() => {}).finally(() => setLoading(false))
  }, [cat])

  const filtered = events.filter(ev =>
    ev.title.toLowerCase().includes(search.toLowerCase()) ||
    ev.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PublicLayout>
      <section className="relative bg-navy pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #c9a84c 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/10 blur-[120px]" />
        <div className="container mx-auto relative z-10">
          <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.7 }}>
            <div className="flex items-center gap-3 mb-5"><span className="w-8 h-px bg-gold" /><p className="font-sans text-xs text-gold font-semibold tracking-[0.2em] uppercase">Programmes & Gatherings</p></div>
            <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight">Upcoming<br /><em className="text-gold not-italic">Events</em></h1>
            <p className="font-sans text-white/50 mt-4 max-w-md">Register for events, programmes, and gatherings at Testimony Parish, Ogun State.</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent" />
      </section>

      <div className="container mx-auto py-12">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" size={15} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…" className="input pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`font-sans text-xs px-4 py-2 rounded-full border transition-all ${cat===c ? 'bg-navy text-white border-navy' : 'border-navy/15 text-navy/60 hover:border-navy/40 bg-white'}`}>{c}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_,i) => <div key={i} className="h-72 bg-navy/5 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-navy/5">
            <HiCalendar size={40} className="text-navy/10 mx-auto mb-4" />
            <p className="font-serif text-2xl text-navy/25">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ev, i) => (
              <motion.button key={ev._id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
                onClick={() => go(`/events/${ev._id}`)}
                className="text-left group w-full bg-white border border-navy/6 rounded-2xl overflow-hidden hover:border-gold/50 hover:shadow-lg transition-all duration-300">
                <div className="h-48 bg-navy/5 relative overflow-hidden">
                  {ev.imageUrl
                    ? <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center bg-cream"><HiCalendar size={36} className="text-navy/15" /></div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
                  <span className="absolute top-3 left-3 bg-gold text-navy font-sans text-xs font-semibold px-3 py-1 rounded-full">{ev.category}</span>
                  {ev.isFeatured && <span className="absolute top-3 right-3 bg-navy text-gold font-sans text-xs font-semibold px-3 py-1 rounded-full">★ Featured</span>}
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-navy text-xl leading-snug mb-3 line-clamp-2 group-hover:text-gold transition-colors">{ev.title}</h3>
                  <div className="space-y-1.5 mb-4">
                    {[[HiCalendar, format(new Date(ev.date),'EEEE, MMMM d, yyyy')],[HiClock,ev.time],[HiLocationMarker,ev.location]].map(([Icon,text],j) => (
                      <div key={j} className="flex items-center gap-2 text-navy/40 text-xs font-sans">
                        <Icon size={12} className="text-gold flex-shrink-0" /><span className="truncate">{text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-navy/5 flex justify-between items-center">
                    <span className="font-sans text-xs text-navy/35">{ev.capacity ? `${ev.registrationCount||0}/${ev.capacity} spots` : 'Open registration'}</span>
                    <span className="font-sans text-xs font-semibold text-gold">Register →</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}