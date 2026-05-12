import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa'
import { HiLocationMarker, HiPhone, HiMail } from 'react-icons/hi'

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-2">
         <div className='flex flex-row gap-3'>
           <div>
            <img src="/ntaLogo.png" alt="NTA Logo" className={`w-14 h-14 mb-1 transition-colors`} />
          </div>
          <div className='flex flex-col'>
            <p className="font-sans text-[9px] text-gold font-semibold tracking-[0.25em] uppercase mb-1">NTA Worldwide</p>
          <h3 className="font-serif text-3xl text-white mb-4">Testimony Parish</h3>
          </div>
         </div>
          <p className="font-sans text-white/50 text-sm leading-relaxed max-w-xs mb-6">
            A community of faith, hope, and love in Ogun State, Nigeria — where every life becomes a testimony of God's grace.
          </p>
          <div className="flex gap-3">
            {[[FaFacebookF,'Facebook'],[FaInstagram,'Instagram'],[FaYoutube,'YouTube'],[FaWhatsapp,'WhatsApp']].map(([Icon, label]) => (
              <a key={label} href="#" aria-label={label}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-gold hover:text-gold transition-all">
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-gold/70 mb-6">Quick Links</p>
          <ul className="space-y-3">
            {[['/', 'Home'],['/about','About'],['/events','Events'],['/highlights','Highlights'],['/contact','Contact']].map(([to, label]) => (
              <li key={to}><Link to={to} className="font-sans text-sm text-white/50 hover:text-gold transition-colors flex items-center gap-2 group">
                <span className="w-3 h-px bg-white/20 group-hover:bg-gold group-hover:w-5 transition-all" />{label}
              </Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-gold/70 mb-6">Service Times</p>
          <ul className="space-y-4">
            {[['Sunday Service','8:00 AM – 12:00 PM'],['Bible Study','Wednesdays, 6 PM'],['Prayer Meeting','Fridays, 6 PM'],['Youth Service','Saturdays, 4 PM']].map(([d,t]) => (
              <li key={d} className="border-b border-white/5 pb-3">
                <p className="font-serif text-white text-sm">{d}</p>
                <p className="font-sans text-gold/70 text-xs mt-0.5">{t}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container mx-auto py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-white/25">© {new Date().getFullYear()} Testimony Parish — New Testament Assembly Worldwide, Ogun State</p>
          <Link to="/admin/login" className="font-sans text-xs text-white/20 hover:text-white/40 transition-colors">Admin Portal</Link>
        </div>
      </div>
    </footer>
  )
}