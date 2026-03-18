import { useState } from "react";
import { Link } from "react-router";
import { Search, SlidersHorizontal, X, Heart, Scan, Sparkles, Trash2 } from "lucide-react";
import { ARTryOn } from "../components/ARTryOn";
import { useWatchStore, CustomWatch } from "../context/WatchStore";

/* ─── Default catalogue ─────────────────────────────────── */
const DEFAULT_WATCHES = [
  {
    id: "1",
    name: "Constellation Chronos",
    brand: "Meridian",
    price: 12500000,
    displayPrice: "12,500,000 ₫",
    strap: "Metal",
    size: 42,
    image: "https://images.unsplash.com/photo-1730757679771-b53e798846cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMEdvbGQlMjBkaWFsJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzMwNjYxNzF8MA&ixlib=rb-4.1.0&q=80&w=600",
    tag: "Hot",
    isCustom: false,
  },
  {
    id: "2",
    name: "Oceanic Pro Diver",
    brand: "Aqua Forge",
    price: 8900000,
    displayPrice: "8,900,000 ₫",
    strap: "Rubber",
    size: 44,
    image: "https://images.unsplash.com/photo-1650974970408-c6d0fbee4ec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRjaCUyMHNpbHZlciUyMHN0ZWVsJTIwbWluaW1hbGlzdCUyMHdoaXRlfGVufDF8fHx8MTc3MzA2NjE3M3ww&ixlib=rb-4.1.0&q=80&w=600",
    tag: "Bestseller",
    isCustom: false,
  },
  {
    id: "3",
    name: "Heritage Leather",
    brand: "Volta",
    price: 6200000,
    displayPrice: "6,200,000 ₫",
    strap: "Leather",
    size: 38,
    image: "https://images.unsplash.com/photo-1767009951352-a271b6155eeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRjaCUyMGxlYXRoZXIlMjBzdHJhcCUyMGJyb3duJTIwbHV4dXJ5fGVufDF8fHx8MTc3MzA1NTA3N3ww&ixlib=rb-4.1.0&q=80&w=600",
    tag: "New",
    isCustom: false,
  },
  {
    id: "4",
    name: "Apex Chronograph",
    brand: "StormKraft",
    price: 15800000,
    displayPrice: "15,800,000 ₫",
    strap: "Rubber",
    size: 45,
    image: "https://images.unsplash.com/photo-1761558009207-69e7a47b2cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJvbm9ncmFwaCUyMHdhdGNoJTIwc3BvcnQlMjBibGFja3xlbnwxfHx8fDE3NzMwNjYxNzR8MA&ixlib=rb-4.1.0&q=80&w=600",
    tag: "Limited",
    isCustom: false,
  },
  {
    id: "5",
    name: "Lumière Skeleton",
    brand: "Atelier X",
    price: 22000000,
    displayPrice: "22,000,000 ₫",
    strap: "Leather",
    size: 40,
    image: "https://images.unsplash.com/photo-1772736785235-19d1579acb0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGNsb3NlJTIwdXAlMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzMwNjYxNjl8MA&ixlib=rb-4.1.0&q=80&w=600",
    tag: "Exclusive",
    isCustom: false,
  },
  {
    id: "6",
    name: "Soleil Automatique",
    brand: "Meridian",
    price: 18500000,
    displayPrice: "18,500,000 ₫",
    strap: "Metal",
    size: 41,
    image: "https://images.unsplash.com/photo-1759910546811-8d9df1501688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGNvbGxlY3Rpb24lMjBkaXNwbGF5fGVufDF8fHx8MTc3MzA1NDI3MXww&ixlib=rb-4.1.0&q=80&w=600",
    tag: "New",
    isCustom: false,
  },
];

type AnyWatch = (typeof DEFAULT_WATCHES)[0] | CustomWatch;

const ALL_STRAPS = ["All", "Metal", "Leather", "Rubber", "NATO", "Fabric"];

export function Collections() {
  const { customWatches, removeWatch } = useWatchStore();

  const [search, setSearch]           = useState("");
  const [selectedStrap, setSelectedStrap] = useState("All");
  const [maxPrice, setMaxPrice]       = useState(30000000);
  const [wristSize, setWristSize]     = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [liked, setLiked]             = useState<Record<string, boolean>>({});
  const [arWatch, setArWatch]         = useState<{ image: string; name: string } | null>(null);
  const [activeSection, setActiveSection] = useState<"all" | "custom">("all");

  // Merge: custom first, then defaults
  const allWatches: AnyWatch[] = [...customWatches, ...DEFAULT_WATCHES];

  const source = activeSection === "custom" ? customWatches : allWatches;

  const filtered = source.filter((w) => {
    if (
      search &&
      !w.name.toLowerCase().includes(search.toLowerCase()) &&
      !w.brand.toLowerCase().includes(search.toLowerCase())
    ) return false;
    if (selectedStrap !== "All" && w.strap !== selectedStrap) return false;
    if (w.price > maxPrice && w.price > 0) return false;
    if (wristSize) {
      const ws = parseFloat(wristSize);
      if (!isNaN(ws)) {
        const minSize = ws < 16 ? 36 : ws < 18 ? 38 : ws < 20 ? 40 : 42;
        if (w.size < minSize) return false;
      }
    }
    return true;
  });

  return (
    <>
      {arWatch && (
        <ARTryOn
          watchImage={arWatch.image}
          watchName={arWatch.name}
          onClose={() => setArWatch(null)}
        />
      )}

      <div style={{ fontFamily: "'Jost', sans-serif" }} className="pt-20 min-h-screen bg-[#0A0A0A]">
        {/* Header */}
        <div className="border-b border-white/8 py-14 text-center">
          <p className="text-[#C4964A] text-[10px] tracking-[0.3em] uppercase mb-3">Browse</p>
          <h1
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1.05 }}
            className="text-white"
          >
            All Collections
          </h1>
          {customWatches.length > 0 && (
            <p className="text-white/30 text-[10px] tracking-wide mt-3">
              <span className="text-[#C4964A]">{customWatches.length}</span> mẫu Creator AI đã thêm
            </p>
          )}
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10">

          {/* Section tabs */}
          <div className="flex gap-0 border-b border-white/8 mb-8">
            {[
              { key: "all",    label: `Tất cả (${allWatches.length})` },
              { key: "custom", label: `Creator AI (${customWatches.length})`, badge: customWatches.length > 0 },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key as "all" | "custom")}
                className={`flex items-center gap-2 px-5 py-3 text-[10px] tracking-[0.15em] uppercase border-b-2 transition-all duration-200 ${
                  activeSection === tab.key
                    ? "border-[#C4964A] text-[#C4964A]"
                    : "border-transparent text-white/35 hover:text-white/55"
                }`}
              >
                {tab.key === "custom" && <Sparkles size={11} />}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Empty custom */}
          {activeSection === "custom" && customWatches.length === 0 && (
            <div className="text-center py-24 space-y-4">
              <Sparkles size={36} className="text-white/10 mx-auto" />
              <p className="text-white/25 text-sm tracking-wide">Chưa có mẫu nào từ Creator Studio</p>
              <Link
                to="/creator-studio"
                className="inline-block mt-4 border border-[#C4964A] text-[#C4964A] px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#C4964A] hover:text-black transition-all duration-300"
              >
                Tạo mẫu đầu tiên
              </Link>
            </div>
          )}

          {(activeSection === "all" || customWatches.length > 0) && (
            <>
              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Tìm tên, thương hiệu..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10 text-white/80 pl-10 pr-4 py-3 text-xs tracking-wide placeholder:text-white/25 focus:outline-none focus:border-[#C4964A]/50 transition-colors duration-200"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 border border-white/15 text-white/70 px-5 py-3 text-xs tracking-[0.15em] uppercase hover:border-[#C4964A] hover:text-[#C4964A] transition-all duration-200"
                >
                  <SlidersHorizontal size={14} />
                  Bộ lọc
                </button>
              </div>

              {/* Filter panel */}
              {showFilters && (
                <div className="bg-[#111111] border border-white/10 p-8 mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <p className="text-white/50 text-[9px] tracking-[0.25em] uppercase mb-4">Dây đeo</p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_STRAPS.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedStrap(s)}
                          className={`px-3 py-1 text-[10px] tracking-wide border transition-all duration-200 ${
                            selectedStrap === s
                              ? "border-[#C4964A] text-[#C4964A] bg-[#C4964A]/10"
                              : "border-white/15 text-white/40 hover:border-white/30"
                          }`}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-white/50 text-[9px] tracking-[0.25em] uppercase mb-4">
                      Giá tối đa: {(maxPrice / 1000000).toFixed(0)}M ₫
                    </p>
                    <input
                      type="range" min={5000000} max={30000000} step={500000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#C4964A]"
                    />
                  </div>
                  <div>
                    <p className="text-white/50 text-[9px] tracking-[0.25em] uppercase mb-4">Chu vi cổ tay (cm)</p>
                    <div className="flex gap-2">
                      <input
                        type="number" placeholder="Vd: 17.5"
                        value={wristSize} onChange={(e) => setWristSize(e.target.value)}
                        className="flex-1 bg-[#0A0A0A] border border-white/15 text-white/80 px-3 py-2 text-xs focus:outline-none focus:border-[#C4964A]/50"
                      />
                      {wristSize && (
                        <button onClick={() => setWristSize("")} className="text-white/40 hover:text-white transition-colors">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Count */}
              <p className="text-white/30 text-xs tracking-wide mb-8">
                {filtered.length} {filtered.length === 1 ? "mẫu" : "mẫu"} tìm thấy
              </p>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((watch) => {
                  const isCustom = "isCustom" in watch && watch.isCustom;
                  return (
                    <div key={watch.id} className="group relative">
                      <Link to={isCustom ? "#" : `/product/${watch.id}`} className="block">
                        <div className="relative overflow-hidden aspect-square bg-[#141414] mb-4">
                          <img
                            src={watch.image}
                            alt={watch.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          {/* Tag */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="bg-[#C4964A] text-black text-[8px] tracking-[0.12em] uppercase px-2 py-1">
                              {watch.tag}
                            </span>
                            {isCustom && (
                              <span className="bg-white/10 border border-white/20 text-white/70 text-[8px] tracking-[0.1em] uppercase px-2 py-1 flex items-center gap-1">
                                <Sparkles size={8} /> AI
                              </span>
                            )}
                          </div>
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-[#0A0A0A]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setArWatch({ image: watch.image, name: watch.name });
                              }}
                              className="flex items-center gap-2 border border-white text-white text-[9px] tracking-[0.2em] uppercase px-5 py-2 hover:bg-white hover:text-black transition-all duration-200"
                            >
                              <Scan size={12} /> Try AR
                            </button>
                          </div>
                        </div>
                      </Link>

                      {/* Like */}
                      <button
                        onClick={() => setLiked((p) => ({ ...p, [watch.id]: !p[watch.id] }))}
                        className="absolute top-6 right-6 w-8 h-8 bg-[#0A0A0A]/60 flex items-center justify-center hover:bg-[#0A0A0A]/80 transition-colors duration-200"
                      >
                        <Heart
                          size={14}
                          className={liked[watch.id] ? "fill-[#C4964A] text-[#C4964A]" : "text-white/50"}
                        />
                      </button>

                      {/* Delete custom */}
                      {isCustom && (
                        <button
                          onClick={() => removeWatch(watch.id)}
                          className="absolute top-16 right-6 w-8 h-8 bg-[#0A0A0A]/60 flex items-center justify-center hover:bg-red-900/40 transition-colors duration-200"
                          title="Xóa mẫu này"
                        >
                          <Trash2 size={13} className="text-white/30 hover:text-red-400 transition-colors" />
                        </button>
                      )}

                      <p className="text-[#C4964A] text-[9px] tracking-[0.2em] uppercase mb-1">{watch.brand}</p>
                      <div className="flex items-start justify-between gap-2">
                        {isCustom ? (
                          <h3
                            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.1rem" }}
                            className="text-white"
                          >{watch.name}</h3>
                        ) : (
                          <Link to={`/product/${watch.id}`}>
                            <h3
                              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.1rem" }}
                              className="text-white hover:text-[#C4964A] transition-colors duration-200"
                            >{watch.name}</h3>
                          </Link>
                        )}
                      </div>
                      {"reference" in watch && watch.reference && (
                        <p className="text-white/25 text-[9px] mb-0.5">Ref: {watch.reference}</p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-white/60 text-xs">{watch.displayPrice}</p>
                        <p className="text-white/30 text-[9px]">{watch.size}mm · {watch.strap}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-24">
                  <p className="text-white/20 text-sm tracking-widest">Không tìm thấy mẫu nào.</p>
                  <button
                    onClick={() => { setSearch(""); setSelectedStrap("All"); setMaxPrice(30000000); setWristSize(""); }}
                    className="mt-6 text-[#C4964A] text-xs tracking-[0.2em] uppercase hover:underline"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
