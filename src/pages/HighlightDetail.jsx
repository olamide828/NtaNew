import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getHighlight } from "../utils/api";
import { format } from "date-fns";
import NProgress from "nprogress";
import PublicLayout from "../components/layout/PublicLayout";
import {
  HiArrowLeft,
  HiArrowRight,
  HiPhotograph,
  HiPlay,
  HiCalendar,
} from "react-icons/hi";

export default function HighlightDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [highlight, setHighlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    getHighlight(id)
      .then((r) => setHighlight(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const total = highlight?.media?.length || 0;

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [prev, next]);

  if (loading)
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </PublicLayout>
    );

  if (!highlight)
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center font-sans text-navy/40">
          Highlight not found.
        </div>
      </PublicLayout>
    );

  const media = highlight.media || [];
  const currentMedia = media[current];

  return (
    <PublicLayout>
      <div className="pt-24 pb-16 min-h-screen bg-cream">
        <div className="container mx-auto">
          <button
            onClick={() => {
              NProgress.start();
              navigate("/highlights");
            }}
            className="flex items-center gap-2 text-sm text-navy/40 hover:text-gold transition-colors mb-8 group font-sans"
          >
            <HiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Highlights
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ── Media Viewer ── */}
            <div className="lg:col-span-2">
              {/* Main display */}
              <div
                className="relative bg-white rounded-2xl overflow-hidden mb-4 group"
                style={{ minHeight: "360px" }}
              >
                {media.length === 0 ? (
                  <div className="flex items-center justify-center h-80">
                    <HiPhotograph size={48} className="text-white/10" />
                  </div>
                ) : (
                  <>
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={current}
                        custom={direction}
                        variants={{
                          enter: (d) => ({
                            x: d > 0 ? "100%" : "-100%",
                            opacity: 0,
                          }),
                          center: { x: 0, opacity: 1 },
                          exit: (d) => ({
                            x: d > 0 ? "-100%" : "100%",
                            opacity: 0,
                          }),
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="w-full flex items-center justify-center bg-white"
                        style={{ minHeight: "360px" }}
                      >
                        {currentMedia?.resourceType === "video" ? (
                          <video
                            src={currentMedia.url}
                            controls
                            className="w-full max-h-[70vh] object-contain"
                          />
                        ) : (
                          <img
                            src={currentMedia?.url}
                            alt={`${highlight.title} — ${current + 1}`}
                            className="w-full max-h-[70vh] object-contain"
                            style={{ display: "block" }}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Left arrow */}
                    {total > 1 && (
                      <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                      >
                        <HiArrowLeft size={20} />
                      </button>
                    )}

                    {/* Right arrow */}
                    {total > 1 && (
                      <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                      >
                        <HiArrowRight size={20} />
                      </button>
                    )}

                    {/* Counter */}
                    {total > 1 && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white font-sans text-xs px-3 py-1 rounded-full backdrop-blur-sm z-10">
                        {current + 1} / {total}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {total > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-2 mt-2">
                  {media.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > current ? 1 : -1);
                        setCurrent(i);
                      }}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        i === current
                          ? "border-gold scale-105 shadow-md"
                          : "border-transparent opacity-50 hover:opacity-80 hover:border-navy/20"
                      }`}
                    >
                      <img
                        src={m.thumbnailUrl || m.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {m.resourceType === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <HiPlay size={14} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Details Panel ── */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-navy/6 rounded-2xl p-6 sticky top-24">
                <h1 className="font-serif text-3xl text-navy mb-3 leading-tight">
                  {highlight.title}
                </h1>
                {highlight.description && (
                  <p className="font-sans text-navy/55 text-sm leading-relaxed mb-6">
                    {highlight.description}
                  </p>
                )}

                <div className="space-y-4 border-t border-navy/5 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cream border border-navy/6 flex items-center justify-center flex-shrink-0">
                      <HiCalendar size={15} className="text-gold" />
                    </div>
                    <div>
                      <p className="font-sans text-xs text-navy/35 uppercase tracking-wide">
                        Published
                      </p>
                      <p className="font-sans text-sm text-navy font-medium">
                        {format(new Date(highlight.createdAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cream border border-navy/6 flex items-center justify-center flex-shrink-0">
                      <HiPhotograph size={15} className="text-gold" />
                    </div>
                    <div>
                      <p className="font-sans text-xs text-navy/35 uppercase tracking-wide">
                        Media
                      </p>
                      <p className="font-sans text-sm text-navy font-medium">
                        {total} {total === 1 ? "file" : "files"}
                      </p>
                    </div>
                  </div>

                  {highlight.relatedEvent && (
                    <div className="border-t border-navy/5 pt-4">
                      <p className="font-sans text-xs text-navy/35 uppercase tracking-wide mb-2">
                        Related Event
                      </p>
                      <span className="badge bg-gold/10 text-gold-dark border border-gold/20 text-xs">
                        {highlight.relatedEvent.title}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-3 bg-cream rounded-xl border border-navy/5 text-center">
                  <p className="font-sans text-xs text-navy/30">
                    Hover over image, then use
                  </p>
                  <p className="font-sans text-xs text-navy/50 font-medium mt-0.5">
                    ← → arrow keys or buttons to navigate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
