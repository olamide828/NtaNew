import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import NProgress from 'nprogress'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/events', label: 'Events' },
  { to: '/highlights', label: 'Highlights' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => { setOpen(false) }, [location])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = (to) => { NProgress.start(); navigate(to) }

  const navBg = scrolled || !isHome
    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-navy/5'
    : 'bg-transparent'

  const textColor = scrolled || !isHome ? 'text-navy' : 'text-white'
  const logoSub = scrolled || !isHome ? 'text-gold' : 'text-gold-light'

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${navBg}`}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 md:h-18">

            {/* Logo */}
            <Link to="/" className="flex leading-none items-center gap-3 group">
            <div>
              <img src="/ntaLogo.png" alt="NTA Logo" className={`w-10 h-10 mb-1 transition-colors ${logoSub}`} />
            </div>
             <div className='flex flex-col'>
               <span className={`font-sans text-[9px] font-semibold tracking-[0.25em] uppercase transition-colors ${logoSub}`}>
                NTA Worldwide
              </span>
              <span className={`font-serif text-xl font-medium transition-colors ${textColor}`}>
                Testimony Parish
              </span>
             </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map(l => (
                <NavLink key={l.to} to={l.to} end={l.to === '/'}
                  className={({ isActive }) =>
                    `relative font-sans text-sm px-4 py-2 rounded-full transition-all duration-200 ${
                      isActive
                        ? (scrolled || !isHome ? 'text-navy bg-navy/5' : 'text-white bg-white/15')
                        : (scrolled || !isHome ? 'text-navy/60 hover:text-navy hover:bg-navy/5' : 'text-white/70 hover:text-white hover:bg-white/10')
                    }`
                  }
                >{l.label}</NavLink>
              ))}
            </nav>

            <div className="hidden md:block">
              <button onClick={() => go('/events')}
                className="font-sans text-sm font-semibold bg-gold text-navy px-5 py-2.5 rounded-full hover:bg-gold-light transition-colors">
                Join an Event
              </button>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setOpen(!open)}
              className={`md:hidden p-2 rounded-full transition-colors ${scrolled || !isHome ? 'text-navy hover:bg-navy/5' : 'text-white hover:bg-white/10'}`}>
              {open ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl md:hidden flex flex-col">
              <div className="flex items-center justify-between px-6 h-16 border-b border-navy/5">
                <div>
                  <p className="font-sans text-[9px] text-gold font-semibold tracking-[0.25em] uppercase">NTA Worldwide</p>
                  <p className="font-serif text-navy text-lg">Testimony Parish</p>
                </div>
                <button onClick={() => setOpen(false)} className="text-navy/50 hover:text-navy p-1">
                  <HiX size={20} />
                </button>
              </div>
              <nav className="flex flex-col p-4 gap-1 flex-1">
                {links.map(l => (
                  <NavLink key={l.to} to={l.to} end={l.to === '/'}
                    className={({ isActive }) =>
                      `font-sans text-sm px-4 py-3 rounded-xl transition-colors ${
                        isActive ? 'bg-navy text-white' : 'text-navy/70 hover:bg-navy/5 hover:text-navy'
                      }`
                    }>{l.label}</NavLink>
                ))}
              </nav>
              <div className="p-4 border-t border-navy/5">
                <button onClick={() => go('/events')} className="btn-gold w-full justify-center">Join an Event</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}