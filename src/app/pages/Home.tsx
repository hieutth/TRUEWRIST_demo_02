import { useState, useRef } from "react";
import { Link } from "react-router";
import { ArrowRight, Play, ChevronLeft, ChevronRight, Scan, RotateCw, Ruler, Share2 } from "lucide-react";

const HERO_IMAGE = "https://images.unsplash.com/photo-1772736785235-19d1579acb0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGNsb3NlJTIwdXAlMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzMwNjYxNjl8MA&ixlib=rb-4.1.0&q=80&w=1080";
const WRIST_IMAGE = "https://images.unsplash.com/photo-1767009951357-9d9d455aa903?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRjaCUyMHdyaXN0JTIwbWFuJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzMwNjYxNzB8MA&ixlib=rb-4.1.0&q=80&w=1080";
const COLLECTION_IMAGE = "https://images.unsplash.com/photo-1759910546811-8d9df1501688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGNvbGxlY3Rpb24lMjBkaXNwbGF5fGVufDF8fHx8MTc3MzA1NDI3MXww&ixlib=rb-4.1.0&q=80&w=1080";

const hotTrend = [
  {
    id: "1",
    name: "Constellation Chronos",
    brand: "Meridian",
    price: "12,500,000 ₫",
    image: "https://images.unsplash.com/photo-1730757679771-b53e798846cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGdvbGQlMjBkaWFsJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzMwNjYxNzF8MA&ixlib=rb-4.1.0&q=80&w=400",
    tries: "18.4K",
    tag: "Hot",
  },
  {
    id: "2",
    name: "Oceanic Pro Diver",
    brand: "Aqua Forge",
    price: "8,900,000 ₫",
    image: "https://images.unsplash.com/photo-1650974970408-c6d0fbee4ec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRjaCUyMHNpbHZlciUyMHN0ZWVsJTIwbWluaW1hbGlzdCUyMHdoaXRlfGVufDF8fHx8MTc3MzA2NjE3M3ww&ixlib=rb-4.1.0&q=80&w=400",
    tries: "15.2K",
    tag: "Bestseller",
  },
  {
    id: "3",
    name: "Heritage Leather",
    brand: "Volta",
    price: "6,200,000 ₫",
    image: "https://images.unsplash.com/photo-1767009951352-a271b6155eeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRjaCUyMGxlYXRoZXIlMjBzdHJhcCUyMGJyb3duJTIwbHV4dXJ5fGVufDF8fHx8MTc3MzA1NTA3N3ww&ixlib=rb-4.1.0&q=80&w=400",
    tries: "11.8K",
    tag: "New",
  },
  {
    id: "4",
    name: "Apex Chronograph",
    brand: "StormKraft",
    price: "15,800,000 ₫",
    image: "https://images.unsplash.com/photo-1761558009207-69e7a47b2cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJvbm9ncmFwaCUyMHdhdGNoJTIwc3BvcnQlMjBibGFja3xlbnwxfHx8fDE3NzMwNjYxNzR8MA&ixlib=rb-4.1.0&q=80&w=400",
    tries: "9.3K",
    tag: "Limited",
  },
  {
    id: "5",
    name: "Lumière Skeleton",
    brand: "Atelier X",
    price: "22,000,000 ₫",
    image: "https://images.unsplash.com/photo-1772736785235-19d1579acb0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGNsb3NlJTIwdXAlMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzMwNjYxNjl8MA&ixlib=rb-4.1.0&q=80&w=400",
    tries: "7.6K",
    tag: "Exclusive",
  },
];

const features = [
  {
    icon: <Scan size={28} />,
    title: "Web-AR Try-On",
    desc: "No app needed. Open your browser, point at your wrist, and see the watch in true-to-life size instantly.",
  },
  {
    icon: <RotateCw size={28} />,
    title: "360° 3D Viewer",
    desc: "Rotate, zoom and inspect every detail of the watch model — crafted with PBR materials for photorealistic rendering.",
  },
  {
    icon: <Ruler size={28} />,
    title: "True-to-Size Fit",
    desc: "Enter your wrist circumference and our algorithm scales the model to a perfect 1:1 ratio on your skin.",
  },
  {
    icon: <Share2 size={28} />,
    title: "Capture & Share",
    desc: "Snap a photo or record a video of your AR try-on and share it directly to your social media feeds.",
  },
];

export function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}>
      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[600px] flex items-end pb-24 md:pb-32">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/70 via-transparent to-transparent" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 w-full">
          <p
            className="text-[#C4964A] text-xs tracking-[0.35em] uppercase mb-4"
          >
            Web-AR Try-On Platform
          </p>
          <h1
            className="text-white mb-6 max-w-2xl"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "clamp(2.8rem, 7vw, 6rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            Feel Every <br />
            <em>Detail</em> Before <br />
            You Buy.
          </h1>
          <p className="text-white/60 text-sm tracking-wide mb-10 max-w-md leading-relaxed">
            Try on thousands of luxury watches directly on your wrist using augmented reality — right from your browser, no app required.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/collections"
              className="flex items-center gap-3 bg-[#C4964A] text-black px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#d4a85a] transition-all duration-300"
            >
              Try AR Now <ArrowRight size={14} />
            </Link>
            <Link
              to="/collections"
              className="flex items-center gap-3 border border-white/30 text-white/80 px-8 py-4 text-xs tracking-[0.2em] uppercase hover:border-white hover:text-white transition-all duration-300"
            >
              <Play size={12} className="fill-current" /> Watch Demo
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-16">
            {[
              { num: "50K+", label: "Try-Ons Daily" },
              { num: "1,200+", label: "Watch Models" },
              { num: "180+", label: "Brands" },
            ].map((s) => (
              <div key={s.label}>
                <p
                  className="text-white mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 300 }}
                >
                  {s.num}
                </p>
                <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="bg-[#C4964A] py-3 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {Array(3)
            .fill(null)
            .flatMap((_, i) =>
              ["Web AR Try-On", "True-to-Size", "360° 3D Viewer", "No App Required", "1,200+ Models", "Free to Try"].map(
                (t, j) => (
                  <span
                    key={`${i}-${j}-${t}`}
                    className="text-black text-[10px] tracking-[0.25em] uppercase"
                  >
                    {t} &nbsp;·&nbsp;
                  </span>
                )
              )
            )}
        </div>
      </div>

      {/* ── HOT TREND ── */}
      <section className="py-20 md:py-28 bg-[#0A0A0A]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#C4964A] text-[10px] tracking-[0.3em] uppercase mb-3">Most Tried</p>
              <h2
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.1 }}
                className="text-white"
              >
                Hot Trend
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={scrollLeft}
                className="w-10 h-10 border border-white/20 text-white/60 flex items-center justify-center hover:border-[#C4964A] hover:text-[#C4964A] transition-all duration-200"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={scrollRight}
                className="w-10 h-10 border border-white/20 text-white/60 flex items-center justify-center hover:border-[#C4964A] hover:text-[#C4964A] transition-all duration-200"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {hotTrend.map((watch) => (
              <WatchCard key={watch.id} watch={watch} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH PROMO ── */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={WRIST_IMAGE}
          alt="AR on wrist"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0A]/90 via-[#0A0A0A]/50 to-transparent" />
        <div className="relative z-10 h-full flex items-center justify-end max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="max-w-md text-right">
            <p className="text-[#C4964A] text-[10px] tracking-[0.3em] uppercase mb-3">AR Try-On Experience</p>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 4.5vw, 3.5rem)", lineHeight: 1.1 }}
              className="text-white mb-5"
            >
              See It On Your Wrist. <em>Right Now.</em>
            </h2>
            <p className="text-white/60 text-xs leading-relaxed mb-8">
              Our Web-AR engine renders your chosen watch in photorealistic quality, scaled perfectly to your wrist — with full occlusion support.
            </p>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 border border-[#C4964A] text-[#C4964A] px-7 py-3 text-[10px] tracking-[0.25em] uppercase hover:bg-[#C4964A] hover:text-black transition-all duration-300"
            >
              Start Try-On <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="py-20 md:py-28 bg-[#0E0E0E]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <p className="text-[#C4964A] text-[10px] tracking-[0.3em] uppercase mb-3">Just Landed</p>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.1 }}
              className="text-white"
            >
              New Arrivals
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotTrend.slice(0, 3).map((watch, i) => (
              <Link
                key={watch.id}
                to={`/product/${watch.id}`}
                className="group relative overflow-hidden block"
              >
                <div className={`aspect-square overflow-hidden ${i === 0 ? "sm:col-span-2" : ""}`}>
                  <img
                    src={watch.image}
                    alt={watch.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[#C4964A] text-[9px] tracking-[0.25em] uppercase mb-1">{watch.brand}</p>
                  <h3
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                    className="text-white text-xl mb-1"
                  >
                    {watch.name}
                  </h3>
                  <p className="text-white/60 text-xs">{watch.price}</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-[#C4964A] text-black text-[9px] tracking-[0.15em] uppercase px-3 py-1">
                    Try AR
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-10 py-4 text-xs tracking-[0.2em] uppercase hover:border-[#C4964A] hover:text-[#C4964A] transition-all duration-300"
            >
              View All Collections <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 md:py-28 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="text-[#C4964A] text-[10px] tracking-[0.3em] uppercase mb-3">The Technology</p>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.1 }}
              className="text-white mb-4"
            >
              Built for Precision
            </h2>
            <p className="text-white/40 text-xs tracking-wide max-w-md mx-auto leading-relaxed">
              Every feature is engineered to bridge the gap between browsing and owning a luxury timepiece.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title} className="group border border-white/8 p-8 hover:border-[#C4964A]/40 transition-all duration-300">
                <div className="text-[#C4964A] mb-6">{f.icon}</div>
                <h3
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.2rem" }}
                  className="text-white mb-3"
                >
                  {f.title}
                </h3>
                <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CREATOR STUDIO PROMO ── */}
      <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <img
          src={COLLECTION_IMAGE}
          alt="Creator Studio"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0A0A0A]/70" />
        <div className="relative z-10 h-full flex items-center justify-center text-center max-w-[1440px] mx-auto px-6 md:px-12">
          <div>
            <p className="text-[#C4964A] text-[10px] tracking-[0.3em] uppercase mb-4">UGC Creator Studio</p>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1.1 }}
              className="text-white mb-6"
            >
              Design Your Own <em>Timepiece</em>
            </h2>
            <p className="text-white/60 text-xs leading-relaxed mb-10 max-w-lg mx-auto">
              Upload your custom watch face, choose a case and strap, and publish your creation for the world to try on.
            </p>
            <Link
              to="/creator-studio"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#C4964A] transition-all duration-300"
            >
              Open Studio <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── B2B CTA ── */}
      <section className="py-20 bg-[#0E0E0E]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="border border-white/10 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-[#C4964A] text-[10px] tracking-[0.3em] uppercase mb-3">For Watch Retailers</p>
              <h2
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", lineHeight: 1.1 }}
                className="text-white"
              >
                Power Your Store <br />
                with AR Try-On
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-center md:text-right">
              <p className="text-white/50 text-xs leading-relaxed max-w-xs">
                Embed TrueWrist AR on your WordPress, Shopify or Haravan store with a single line of code.
              </p>
              <Link
                to="/vendor"
                className="inline-flex items-center justify-center gap-2 bg-[#C4964A] text-black px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#d4a85a] transition-all duration-300"
              >
                Explore B2B Plans <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 18s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function WatchCard({ watch }: { watch: typeof hotTrend[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={`/product/${watch.id}`}
      className="flex-shrink-0 w-64 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden aspect-square bg-[#141414] mb-4">
        <img
          src={watch.image}
          alt={watch.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? "scale-110" : "scale-100"}`}
        />
        {/* Tag */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#C4964A] text-black text-[8px] tracking-[0.15em] uppercase px-2 py-1">
            {watch.tag}
          </span>
        </div>
        {/* AR hover CTA */}
        <div
          className={`absolute inset-0 bg-[#0A0A0A]/60 flex items-center justify-center transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
        >
          <span className="border border-white text-white text-[9px] tracking-[0.2em] uppercase px-5 py-2 hover:bg-white hover:text-black transition-all duration-200">
            Try AR On
          </span>
        </div>
      </div>
      <p className="text-[#C4964A] text-[9px] tracking-[0.2em] uppercase mb-1">{watch.brand}</p>
      <h3
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.05rem" }}
        className="text-white mb-1 group-hover:text-[#C4964A] transition-colors duration-200"
      >
        {watch.name}
      </h3>
      <div className="flex items-center justify-between">
        <p className="text-white/60 text-xs">{watch.price}</p>
        <p className="text-white/30 text-[9px] tracking-wide">{watch.tries} tries</p>
      </div>
    </Link>
  );
}
