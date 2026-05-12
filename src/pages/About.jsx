import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import NProgress from 'nprogress'
import PublicLayout from '../components/layout/PublicLayout'
import { HiCheckCircle } from 'react-icons/hi'

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } })

export default function About() {
  const navigate = useNavigate()
  const go = (to) => { NProgress.start(); navigate(to) }
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative bg-navy pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #c9a84c 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/10 blur-[120px]" />
        <div className="container mx-auto relative z-10">
          <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.7 }}>
            <div className="flex items-center gap-3 mb-5"><span className="w-8 h-px bg-gold" /><p className="font-sans text-xs text-gold font-semibold tracking-[0.2em] uppercase">Who We Are</p></div>
            <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight max-w-2xl">Our Story,<br /><em className="text-gold not-italic">Our Mission,</em><br />Our Faith</h1>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent" />
      </section>

      {/* Mission */}
      <section className="page-section bg-cream">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fade()}>
            <span className="section-tag mb-4">Our Purpose</span>
            <h2 className="font-serif text-4xl text-navy mb-5 leading-tight">More Than a Church</h2>
            <p className="font-sans text-navy/60 leading-relaxed mb-4">Testimony Parish is a vibrant assembly under the New Testament Assembly Worldwide family of churches. We exist to glorify God, preach the undiluted Word, and build a community where every believer grows in faith, character, and purpose.</p>
            <p className="font-sans text-navy/60 leading-relaxed mb-8">Our name is our declaration — every life touched by God's grace is a testimony. We celebrate salvation, healing, restoration, and breakthrough as the normal Christian experience.</p>
            <ul className="space-y-3">
              {['Evangelism & Soul Winning','Discipleship & Spiritual Growth','Community Service & Outreach','Family & Youth Empowerment'].map(item => (
                <li key={item} className="flex items-center gap-3 font-sans text-sm text-navy/70">
                  <HiCheckCircle size={16} className="text-gold flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fade(0.15)} className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-navy overflow-hidden flex items-center justify-center p-10">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #c9a84c 1px, transparent 0)', backgroundSize: '30px 30px' }} />
              <div className="relative text-center">
                <p className="font-serif text-8xl text-gold/20 leading-none mb-4">"</p>
                <p className="font-serif text-white text-xl italic leading-relaxed">And they overcame him by the blood of the Lamb and by the word of their testimony.</p>
                <div className="w-12 h-px bg-gold mx-auto my-4" />
                <p className="font-sans text-gold text-xs tracking-widest uppercase">Revelation 12:11</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-16 h-16 border-t-2 border-r-2 border-gold/30 rounded-tr-2xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 border-b-2 border-l-2 border-gold/30 rounded-bl-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Vision/Mission/Values */}
      <section className="page-section bg-white">
        <div className="container mx-auto">
          <motion.div {...fade()} className="text-center mb-14">
            <span className="section-tag mb-4 justify-center">Our Convictions</span>
            <h2 className="font-serif text-4xl text-navy">What drives us forward</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label:'Our Vision', text:"To be a city set on a hill — a glorious expression of Christ's church in Ogun State and beyond, impacting every sphere of society with Kingdom values." },
              { label:'Our Mission', text:'To win souls, make disciples, build godly families, and transform communities through the power of the Holy Spirit and the Word of God.' },
              { label:'Our Values', text:'Integrity. Excellence. Love. Faith. Prayer. Community. We pursue these not as programs but as the fabric of who we are.' },
            ].map((item, i) => (
              <motion.div key={item.label} {...fade(i * 0.1)} className="p-8 rounded-2xl border border-navy/6 bg-cream hover:border-gold/30 hover:shadow-md transition-all group">
                <div className="w-10 h-px bg-gold mb-5" />
                <p className="font-sans text-xs text-gold font-semibold tracking-[0.15em] uppercase mb-3">{item.label}</p>
                <p className="font-sans text-navy/60 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="page-section bg-navy">
        <div className="container mx-auto">
          <motion.div {...fade()} className="text-center mb-14">
            <span className="section-tag mb-4 justify-center" style={{color:'#c9a84c'}}><span className="block w-6 h-px bg-gold"/>Join Us</span>
            <h2 className="font-serif text-4xl text-white">Service Times</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[['Sunday Service','8:00 AM – 12:00 PM'],['Bible Study','Wednesdays\n6:00 PM'],['Prayer Meeting','Fridays\n6:00 PM'],['Youth Service','Saturdays\n4:00 PM']].map(([name, time], i) => (
              <motion.div key={name} {...fade(i*0.1)} className="bg-navy-800 border border-white/5 rounded-2xl p-6 text-center hover:border-gold/30 transition-all">
                <p className="font-serif text-white text-base mb-2">{name}</p>
                <p className="font-sans text-gold text-sm whitespace-pre-line">{time}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fade(0.3)} className="text-center mt-12">
            <button onClick={() => go('/contact')} className="btn-gold">Get in Touch</button>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  )
}