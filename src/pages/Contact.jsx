import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import PublicLayout from '../components/layout/PublicLayout'
import { HiLocationMarker, HiPhone, HiMail, HiClock } from 'react-icons/hi'
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa'

const fade = (d=0) => ({ initial:{opacity:0,y:24}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{duration:0.6,delay:d} })

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name||!form.email||!form.message) { toast.error('Please fill in all required fields.'); return }
    setSending(true)
    await new Promise(r => setTimeout(r, 1500))
    toast.success('Message sent! We\'ll get back to you soon.')
    setForm({ name:'', email:'', subject:'', message:'' })
    setSending(false)
  }

  return (
    <PublicLayout>
      <section className="relative bg-navy pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #c9a84c 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/10 blur-[120px]" />
        <div className="container mx-auto relative z-10">
          <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.7 }}>
            <div className="flex items-center gap-3 mb-5"><span className="w-8 h-px bg-gold" /><p className="font-sans text-xs text-gold font-semibold tracking-[0.2em] uppercase">Reach Out</p></div>
            <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight"><em className="text-gold not-italic">Contact</em> Us</h1>
            <p className="font-sans text-white/50 mt-4 max-w-md">We'd love to hear from you — questions, prayer requests, or just wanting to connect.</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent" />
      </section>

      <div className="container mx-auto py-16 grid grid-cols-1 lg:grid-cols-5 gap-14">
        <div className="lg:col-span-2 space-y-10">
          <motion.div {...fade()}>
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-6">Find Us</p>
            <div className="space-y-5">
              {[[HiLocationMarker,'Address','New Testament Assembly Worldwide,\nTestimony Parish, Ogun State, Nigeria'],[HiPhone,'Phone','+234 000 000 0000'],[HiMail,'Email','info@testimonyparish.org']].map(([Icon,label,value]) => (
                <div key={label} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-navy/6 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-sans text-xs text-navy/35 uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="font-sans text-sm text-navy whitespace-pre-line">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fade(0.1)}>
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-5">Service Times</p>
            <div className="space-y-3">
              {[['Sunday Service','8:00 AM – 12:00 PM'],['Bible Study','Wednesdays, 6:00 PM'],['Prayer Meeting','Fridays, 6:00 PM'],['Youth Service','Saturdays, 4:00 PM']].map(([d,t]) => (
                <div key={d} className="flex items-center gap-3 py-3 border-b border-navy/5">
                  <HiClock size={13} className="text-gold flex-shrink-0" />
                  <span className="font-sans text-sm text-navy flex-1">{d}</span>
                  <span className="font-sans text-sm text-gold font-medium">{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fade(0.2)}>
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-4">Social Media</p>
            <div className="flex gap-3">
              {[[FaFacebookF,'Facebook'],[FaInstagram,'Instagram'],[FaYoutube,'YouTube'],[FaWhatsapp,'WhatsApp']].map(([Icon,label]) => (
                <a key={label} href="#" aria-label={label} className="w-10 h-10 rounded-full border border-navy/10 bg-white flex items-center justify-center text-navy/40 hover:border-gold hover:text-gold transition-all shadow-sm">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div {...fade(0.1)} className="lg:col-span-3">
          <div className="bg-white border border-navy/6 rounded-2xl shadow-sm p-8">
            <h2 className="font-serif text-3xl text-navy mb-1">Send a Message</h2>
            <p className="font-sans text-sm text-navy/40 mb-8">We typically respond within 24 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="label">Full Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input" placeholder="John Doe" /></div>
                <div><label className="label">Email *</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input" placeholder="john@example.com" /></div>
              </div>
              <div><label className="label">Subject</label><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className="input" placeholder="How can we help?" /></div>
              <div><label className="label">Message *</label><textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={6} className="input resize-none" placeholder="Your message, prayer request, or question…" /></div>
              <button type="submit" disabled={sending} className="btn-gold">
                {sending ? <><div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin"/>Sending…</> : 'Send Message'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </PublicLayout>
  )
}