import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getEvent, registerForEvent } from '../utils/api'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import NProgress from 'nprogress'
import { HiCalendar, HiLocationMarker, HiClock, HiArrowLeft, HiCheckCircle, HiUsers } from 'react-icons/hi'
import PublicLayout from '../components/layout/PublicLayout'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registered, setRegistered] = useState(false)
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  useEffect(() => {
    getEvent(id).then(r => setEvent(r.data.data)).catch(() => toast.error('Event not found.')).finally(() => setLoading(false))
  }, [id])

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const res = await registerForEvent(id, data)
      setCode(res.data.data.confirmationCode)
      setRegistered(true)
      reset()
      toast.success('Registered successfully! God bless you.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.')
    } finally { setSubmitting(false) }
  }

  if (loading) return (
    <PublicLayout><div className="min-h-screen flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div></PublicLayout>
  )
  if (!event) return (
    <PublicLayout><div className="min-h-screen flex items-center justify-center font-sans text-navy/40">Event not found.</div></PublicLayout>
  )

  return (
    <PublicLayout>
      {event.imageUrl && (
        <div className="w-full h-72 md:h-96 overflow-hidden">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className={event.imageUrl ? 'pt-8 pb-16' : 'pt-28 pb-16'}>
        <div className="container mx-auto">
          <button onClick={() => { NProgress.start(); navigate('/events') }}
            className="flex items-center gap-2 text-sm text-navy/40 hover:text-gold transition-colors mb-8 group font-sans">
            <HiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" /> Back to Events
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge bg-gold/10 text-gold-dark border border-gold/20 text-xs">{event.category}</span>
                {event.isFeatured && <span className="badge bg-navy text-gold text-xs">★ Featured</span>}
              </div>
              <h1 className="font-serif text-4xl md:text-5xl text-navy leading-tight mb-8">{event.title}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-cream rounded-2xl border border-navy/5 mb-8">
                {[[HiCalendar,'Date',format(new Date(event.date),'EEEE, MMMM d, yyyy')],[HiClock,'Time',event.time],[HiLocationMarker,'Location',event.location],...(event.capacity?[[HiUsers,'Capacity',`${event.registrationCount||0} / ${event.capacity} registered`]]:[])].map(([Icon,label,val]) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-navy/6 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-gold" />
                    </div>
                    <div>
                      <p className="font-sans text-xs text-navy/35 uppercase tracking-wide">{label}</p>
                      <p className="font-sans text-sm text-navy font-medium mt-0.5">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <h2 className="font-serif text-2xl text-navy mb-4">About this Event</h2>
              <p className="font-sans text-navy/60 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-24 bg-white border border-navy/8 rounded-2xl shadow-sm overflow-hidden">
                {registered ? (
                  <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-5">
                      <HiCheckCircle size={30} className="text-green-500" />
                    </div>
                    <h3 className="font-serif text-2xl text-navy mb-2">You&apos;re Registered!</h3>
                    <p className="font-sans text-sm text-navy/50 mb-6">We look forward to seeing you. God bless you!</p>
                    <div className="bg-cream rounded-xl border border-navy/8 p-5 mb-6">
                      <p className="font-sans text-xs text-navy/40 mb-2 tracking-widest uppercase">Confirmation Code</p>
                      <p className="font-serif text-3xl text-navy tracking-widest">{code}</p>
                      <p className="font-sans text-xs text-navy/40 mt-2">Keep this code — present it at the event.</p>
                    </div>
                    <button onClick={() => setRegistered(false)} className="btn-outline w-full justify-center text-sm">Register Another Person</button>
                  </motion.div>
                ) : (
                  <>
                    <div className="p-6 border-b border-navy/5">
                      <h2 className="font-serif text-2xl text-navy">Register</h2>
                      <p className="font-sans text-sm text-navy/40 mt-1">Secure your spot below.</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                      {event.isFull && <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-sans p-3 rounded-xl text-center">This event is fully booked.</div>}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="label">First Name *</label>
                          <input {...register('firstName',{required:true})} className="input" placeholder="John" />
                          {errors.firstName && <p className="text-red-500 text-xs mt-1">Required</p>}
                        </div>
                        <div>
                          <label className="label">Last Name *</label>
                          <input {...register('lastName',{required:true})} className="input" placeholder="Doe" />
                          {errors.lastName && <p className="text-red-500 text-xs mt-1">Required</p>}
                        </div>
                      </div>
                      <div>
                        <label className="label">Email *</label>
                        <input {...register('email',{required:true,pattern:/^\S+@\S+\.\S+$/})} type="email" className="input" placeholder="john@example.com" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">Valid email required</p>}
                      </div>
                      <div>
                        <label className="label">Phone</label>
                        <input {...register('phone')} type="tel" className="input" placeholder="+234 xxx xxx xxxx" />
                      </div>
                      <div>
                        <label className="label">Number of Guests</label>
                        <select {...register('numberOfGuests')} className="input">
                          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n===1?'person':'people'}</option>)}
                        </select>
                      </div>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input {...register('isMember')} type="checkbox" className="w-4 h-4 accent-navy rounded" />
                        <span className="font-sans text-sm text-navy/60">I am a church member</span>
                      </label>
                      <div>
                        <label className="label">Notes (optional)</label>
                        <textarea {...register('notes')} rows={2} className="input resize-none" placeholder="Any special requirements…" />
                      </div>
                      <button type="submit" disabled={submitting||event.isFull} className="btn-gold w-full justify-center">
                        {submitting ? <><div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin"/>Registering…</> : 'Register Now'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}