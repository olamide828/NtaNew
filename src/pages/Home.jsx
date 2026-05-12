import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getEvents } from "../utils/api";
import { format } from "date-fns";
import NProgress from "nprogress";
import PublicLayout from "../components/layout/PublicLayout";
import {
  HiArrowRight,
  HiCalendar,
  HiClock,
  HiLocationMarker,
} from "react-icons/hi";
import { GiOpenBook } from "react-icons/gi";
import { FiHeart, FiUsers, FiGlobe } from "react-icons/fi";

const pillars = [
  {
    icon: GiOpenBook,
    title: "Word-Centred",
    desc: "Every sermon rooted in the truth of Scripture. God's Word is living, active and powerful.",
  },
  {
    icon: FiHeart,
    title: "Spirit-Led Worship",
    desc: "An atmosphere where the Holy Spirit moves freely and transforms hearts through genuine praise.",
  },
  {
    icon: FiUsers,
    title: "Family & Community",
    desc: "More than a church — a family. We do life together through every season and circumstance.",
  },
  {
    icon: FiGlobe,
    title: "Kingdom Impact",
    desc: "From Ogun State to the nations. Carrying the Gospel of Jesus Christ to every corner of the earth.",
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

export default function Home() {
  const [events, setEvents] = useState([]);
  const [evLoading, setEvLoading] = useState(true);
  const navigate = useNavigate();
  const go = (to) => {
    NProgress.start();
    navigate(to);
  };

  useEffect(() => {
    getEvents({ featured: true })
      .then((r) => {
        const data = r.data.data.slice(0, 3);
        if (data.length === 0) {
          getEvents()
            .then((r2) => setEvents(r2.data.data.slice(0, 3)))
            .finally(() => setEvLoading(false));
        } else {
          setEvents(data);
          setEvLoading(false);
        }
      })
      .catch(() => setEvLoading(false));
  }, []);

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-800 to-navy-600" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #c9a84c 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-gold/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-navy-600/50 blur-[80px]" />

        <div className="relative z-10 container mx-auto pb-24 pt-40">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-gold" />
              <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-gold">
                New Testament Assembly Worldwide
              </p>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-6xl md:text-8xl text-white leading-[1.0] mb-6 max-w-3xl"
          >
            Welcome to
            <br />
            <em className="text-gold not-italic">
              Testimony
              <br />
              Parish
            </em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-sans text-white/60 text-lg max-w-md leading-relaxed mb-10"
          >
            A community of faith, hope, and love in Ogun State — where every
            life becomes a testimony of God's grace.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <button onClick={() => go("/events")} className="btn-gold gap-2">
              Upcoming Events <HiArrowRight />
            </button>
            <button onClick={() => go("/about")} className="btn-outline-light">
              Our Story
            </button>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent" />
      </section>
      {/* SCRIPTURE */}
      <section className="bg-cream border-y border-navy/5 py-12">
        <motion.div
          {...fade()}
          className="container mx-auto text-center max-w-2xl"
        >
          <span className="section-tag mb-5 justify-center">
            This Week&apos;s Verse
          </span>
          <blockquote className="font-serif text-2xl md:text-3xl text-navy leading-relaxed italic">
            "And they overcame him by the blood of the Lamb and by the word of
            their testimony."
          </blockquote>
          <p className="font-sans text-sm text-gold font-semibold mt-4 tracking-widest uppercase">
            Revelation 12:11
          </p>
        </motion.div>
      </section>
      {/* PILLARS */}
      <section className="page-section bg-white">
        <div className="container mx-auto">
          <motion.div {...fade()} className="max-w-xl mb-14">
            <span className="section-tag mb-4">Our Foundation</span>
            <h2 className="font-serif text-4xl md:text-5xl text-navy leading-tight">
              What We Stand For
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                {...fade(i * 0.1)}
                className="p-7 rounded-2xl border border-navy/6 bg-cream hover:border-gold/40 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center mb-5 transition-colors">
                  <p.icon
                    size={20}
                    className="text-navy/50 group-hover:text-gold transition-colors"
                  />
                </div>
                <h3 className="font-serif text-navy text-lg mb-2">{p.title}</h3>
                <p className="font-sans text-navy/50 text-sm leading-relaxed">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* EVENTS */}
      <section className="page-section bg-navy">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <motion.div {...fade()}>
              <span className="section-tag mb-4" style={{ color: "#c9a84c" }}>
                <span className="block w-6 h-px bg-gold" />
                What&apos;s Coming
              </span>
              <h2 className="font-serif text-4xl text-white">
                Upcoming Events
              </h2>
            </motion.div>
            <button
              onClick={() => go("/events")}
              className="flex items-center gap-2 font-sans text-sm text-gold hover:text-gold-light transition-colors group"
            >
              View all{" "}
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {evLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-72 bg-navy-800 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-white/5">
              <HiCalendar size={36} className="text-white/10 mx-auto mb-4" />
              <p className="font-serif text-2xl text-white/20">
                No featured events here.
              </p>
              <p className="font-sans text-sm text-white/20 mt-2">
                Check back soon or refresh.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((ev, i) => (
                <motion.button
                  key={ev._id}
                  {...fade(i * 0.1)}
                  onClick={() => go(`/events/${ev._id}`)}
                  className="text-left group w-full bg-navy-800 border border-white/5 rounded-2xl overflow-hidden hover:border-gold/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-44 bg-navy-700 relative overflow-hidden">
                    {ev.imageUrl ? (
                      <img
                        src={ev.imageUrl}
                        alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HiCalendar size={32} className="text-white/10" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-gold text-navy font-sans text-xs font-semibold px-3 py-1 rounded-full">
                      {ev.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-white text-lg leading-snug mb-3 line-clamp-2 group-hover:text-gold transition-colors">
                      {ev.title}
                    </h3>
                    <div className="space-y-1.5">
                      {[
                        [
                          HiCalendar,
                          format(new Date(ev.date), "EEE, MMM d, yyyy"),
                        ],
                        [HiClock, ev.time],
                        [HiLocationMarker, ev.location],
                      ].map(([Icon, text], j) => (
                        <div
                          key={j}
                          className="flex items-center gap-2 text-white/40 text-xs font-sans"
                        >
                          <Icon size={12} className="text-gold flex-shrink-0" />
                          <span className="truncate">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
      pariatur error rerum consectetur iure libero ratione sit qui a ullam. */}
      {/* CTA */}
      <section className="page-section bg-cream">
        <motion.div
          {...fade()}
          className="container mx-auto max-w-2xl text-center"
        >
          <span className="section-tag mb-5 justify-center">
            You Belong Here
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-navy mb-5 leading-tight">
            Ready to join our family?
          </h2>
          <p className="font-sans text-navy/50 text-base mb-10 leading-relaxed max-w-lg mx-auto">
            Whether you're exploring faith for the first time or looking for a
            spiritual home — we welcome you with open arms.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => go("/contact")} className="btn-gold">
              Get in Touch
            </button>
            <button onClick={() => go("/highlights")} className="btn-outline">
              View Highlights
            </button>
          </div>
        </motion.div>
      </section>
    </PublicLayout>
  );
}
