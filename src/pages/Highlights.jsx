import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getHighlights } from "../utils/api";
import { format } from "date-fns";
import NProgress from "nprogress";
import PublicLayout from "../components/layout/PublicLayout";
import { HiPhotograph, HiPlay, HiArrowRight } from "react-icons/hi";

export default function Highlights() {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const go = (to) => {
    NProgress.start();
    navigate(to);
  };

  useEffect(() => {
    getHighlights()
      .then((r) => setHighlights(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      <section className="relative bg-navy pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #c9a84c 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/10 blur-[120px]" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-gold" />
              <p className="font-sans text-xs text-gold font-semibold tracking-[0.2em] uppercase">
                Gallery & Moments
              </p>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight">
              <em className="text-gold not-italic">Highlights</em>
            </h1>
            <p className="font-sans text-white/50 mt-4 max-w-md">
              A glimpse into the moments of worship, fellowship, and community
              at Testimony Parish.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent" />
      </section>

      <div className="container mx-auto py-14">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] bg-navy/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : highlights.length === 0 ? (
          <div className="text-center py-24">
            <HiPhotograph size={48} className="text-navy/10 mx-auto mb-4" />
            <p className="font-serif text-2xl text-navy/25">
              No highlights yet
            </p>
            <p className="font-serif text-2xl text-navy/25">
              Check your internet and Try again
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <motion.div
                key={h._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => go(`/highlights/${h._id}`)}
                className="group cursor-pointer bg-white border border-navy/6 rounded-2xl overflow-hidden hover:border-gold/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-cream relative overflow-hidden">
                  {h.media?.[0] ? (
                    <img
                      src={h.media[0].thumbnailUrl || h.media[0].url}
                      alt={h.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HiPhotograph size={40} className="text-navy/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {h.media?.[0]?.resourceType === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <HiPlay size={20} className="text-navy ml-0.5" />
                      </div>
                    </div>
                  )}
                  {h.media?.length > 1 && (
                    <span className="absolute top-3 right-3 bg-navy/70 text-white font-sans text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                      +{h.media.length} photos
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="flex items-center gap-1.5 font-sans text-xs text-white font-medium">
                      View Gallery <HiArrowRight size={12} />
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-navy text-xl mb-1 line-clamp-1 group-hover:text-gold transition-colors">
                    {h.title}
                  </h3>
                  {h.description && (
                    <p className="font-sans text-navy/45 text-sm leading-relaxed line-clamp-2 mb-3">
                      {h.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-navy/30">
                      {format(new Date(h.createdAt), "MMM d, yyyy")}
                    </span>
                    {h.relatedEvent && (
                      <span className="badge bg-gold/10 text-gold-dark text-xs">
                        {h.relatedEvent.title}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
