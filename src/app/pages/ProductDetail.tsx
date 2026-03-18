import { useState } from "react";
import { Link, useParams } from "react-router";
import { Heart, Share2, ArrowLeft, Scan, ShoppingBag, RotateCcw, ChevronRight, Star, ZoomIn } from "lucide-react";
import { ARTryOn } from "../components/ARTryOn";

const products: Record<string, {
  id: string; name: string; brand: string; price: string;
  strap: string; size: number; image: string; tag: string;
  images: string[]; description: string;
  specs: { label: string; value: string }[];
}> = {
  "1": {
    id: "1",
    name: "Constellation Chronos",
    brand: "Meridian",
    price: "12,500,000 ₫",
    strap: "Metal",
    size: 42,
    tag: "Hot",
    image: "https://images.unsplash.com/photo-1730757679771-b53e798846cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGdvbGQlMjBkaWFsJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzMwNjYxNzF8MA&ixlib=rb-4.1.0&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1730757679771-b53e798846cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGdvbGQlMjBkaWFsJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzMwNjYxNzF8MA&ixlib=rb-4.1.0&q=80&w=800",
      "https://images.unsplash.com/photo-1772736785235-19d1579acb0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGNsb3NlJTIwdXAlMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzMwNjYxNjl8MA&ixlib=rb-4.1.0&q=80&w=800",
      "https://images.unsplash.com/photo-1767009951357-9d9d455aa903?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRjaCUyMHdyaXN0JTIwbWFuJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzMwNjYxNzB8MA&ixlib=rb-4.1.0&q=80&w=800",
    ],
    description:
      "The Constellation Chronos embodies Meridian's mastery of haute horlogerie. Its 42mm gold-tone case houses a self-winding movement with chronograph function, offering 72 hours of power reserve. The sapphire crystal dial reveals the intricate mechanics beneath.",
    specs: [
      { label: "Case Size", value: "42mm" },
      { label: "Case Material", value: "18K Gold PVD Steel" },
      { label: "Movement", value: "Automatic Cal. M-7750" },
      { label: "Power Reserve", value: "72 hours" },
      { label: "Water Resistance", value: "50m / 5 ATM" },
      { label: "Strap", value: "Stainless Steel Bracelet" },
      { label: "Crystal", value: "Scratch-resistant Sapphire" },
      { label: "Lug Width", value: "22mm" },
    ],
  },
  "2": {
    id: "2",
    name: "Oceanic Pro Diver",
    brand: "Aqua Forge",
    price: "8,900,000 ₫",
    strap: "Rubber",
    size: 44,
    tag: "Bestseller",
    image: "https://images.unsplash.com/photo-1650974970408-c6d0fbee4ec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRjaCUyMHNpbHZlciUyMHN0ZWVsJTIwbWluaW1hbGlzdCUyMHdoaXRlfGVufDF8fHx8MTc3MzA2NjE3M3ww&ixlib=rb-4.1.0&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1650974970408-c6d0fbee4ec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRjaCUyMHNpbHZlciUyMHN0ZWVsJTIwbWluaW1hbGlzdCUyMHdoaXRlfGVufDF8fHx8MTc3MzA2NjE3M3ww&ixlib=rb-4.1.0&q=80&w=800",
      "https://images.unsplash.com/photo-1761558009207-69e7a47b2cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJvbm9ncmFwaCUyMHdhdGNoJTIwc3BvcnQlMjBibGFja3xlbnwxfHx8fDE3NzMwNjYxNzR8MA&ixlib=rb-4.1.0&q=80&w=800",
    ],
    description:
      "Engineered for the deep, the Oceanic Pro Diver is rated to 300m. Its 44mm brushed steel case with helium escape valve is paired with a high-performance rubber strap and luminous markers for ultimate underwater legibility.",
    specs: [
      { label: "Case Size", value: "44mm" },
      { label: "Case Material", value: "316L Stainless Steel" },
      { label: "Movement", value: "Automatic Cal. AF-3135" },
      { label: "Power Reserve", value: "48 hours" },
      { label: "Water Resistance", value: "300m / 30 ATM" },
      { label: "Strap", value: "Vulcanized Rubber" },
      { label: "Crystal", value: "Anti-reflective Sapphire" },
      { label: "Lug Width", value: "24mm" },
    ],
  },
};

// Default for unmapped IDs
const defaultProduct = products["1"];

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = (id && products[id]) ? products[id] : defaultProduct;

  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [arActive, setArActive] = useState(false);
  const [showARCamera, setShowARCamera] = useState(false);
  const [viewMode, setViewMode] = useState<"photo" | "3d">("photo");
  const [rotation, setRotation] = useState(0);

  const handleArClick = () => {
    setShowARCamera(true);
  };

  return (
    <>
      {showARCamera && (
        <ARTryOn
          watchImage={product.image}
          watchName={product.name}
          onClose={() => setShowARCamera(false)}
        />
      )}
      <div style={{ fontFamily: "'Jost', sans-serif" }} className="pt-20 min-h-screen bg-[#0A0A0A]">
        {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-6 flex items-center gap-3 text-[10px] tracking-[0.15em] uppercase text-white/30">
        <Link to="/" className="hover:text-[#C4964A] transition-colors duration-200">Home</Link>
        <ChevronRight size={10} />
        <Link to="/collections" className="hover:text-[#C4964A] transition-colors duration-200">Collections</Link>
        <ChevronRight size={10} />
        <span className="text-white/60">{product.name}</span>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* LEFT: Image/3D Viewer */}
          <div>
            {/* View Mode Toggle */}
            <div className="flex gap-1 mb-4">
              {["photo", "3d"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as "photo" | "3d")}
                  className={`px-4 py-2 text-[9px] tracking-[0.2em] uppercase border transition-all duration-200 ${
                    viewMode === mode
                      ? "border-[#C4964A] text-[#C4964A] bg-[#C4964A]/10"
                      : "border-white/15 text-white/40 hover:border-white/25"
                  }`}
                >
                  {mode === "photo" ? "Photo" : "3D Viewer"}
                </button>
              ))}
            </div>

            {/* Main Viewer */}
            <div className="relative aspect-square bg-[#111111] overflow-hidden mb-4">
              {viewMode === "photo" ? (
                <>
                  <img
                    src={product.images[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute bottom-4 right-4 w-8 h-8 bg-[#0A0A0A]/70 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200">
                    <ZoomIn size={14} />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#0D0D0D]">
                  <div
                    style={{ transform: `rotateY(${rotation}deg)`, transition: "transform 0.3s ease" }}
                    className="relative"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-56 h-56 object-cover rounded-full"
                    />
                  </div>
                  <p className="text-white/30 text-[9px] tracking-[0.2em] uppercase mt-6 mb-3">Drag to rotate</p>
                  <div className="flex gap-3">
                    {[-45, 0, 45, 90, 135].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => setRotation(deg)}
                        className={`w-6 h-1 transition-all duration-200 ${rotation === deg ? "bg-[#C4964A]" : "bg-white/20"}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setRotation((r) => r + 30)}
                    className="mt-4 flex items-center gap-2 text-white/30 hover:text-[#C4964A] text-[9px] tracking-[0.2em] uppercase transition-colors duration-200"
                  >
                    <RotateCcw size={12} /> Rotate
                  </button>
                </div>
              )}

              {/* AR Overlay */}
              {arActive && (
                <div className="absolute inset-0 bg-[#0A0A0A]/90 flex flex-col items-center justify-center gap-4 z-10">
                  <div className="w-24 h-24 border-2 border-[#C4964A] rounded-full flex items-center justify-center animate-pulse">
                    <Scan size={36} className="text-[#C4964A]" />
                  </div>
                  <p className="text-white/60 text-xs tracking-[0.15em] text-center">
                    Initializing camera...<br />
                    <span className="text-white/30 text-[9px]">Point camera at your wrist</span>
                  </p>
                  <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C4964A] animate-progress" />
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={`thumb-${i}-${img}`}
                  onClick={() => {
                    setActiveImage(i);
                    setViewMode("photo");
                  }}
                  className={`w-20 h-20 overflow-hidden border-2 transition-all duration-200 ${
                    activeImage === i && viewMode === "photo" ? "border-[#C4964A]" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div>
            {/* Back */}
            <Link
              to="/collections"
              className="flex items-center gap-2 text-white/30 hover:text-[#C4964A] text-[10px] tracking-[0.15em] uppercase mb-8 transition-colors duration-200"
            >
              <ArrowLeft size={12} /> Back to Collections
            </Link>

            {/* Tag & Brand */}
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#C4964A] text-black text-[8px] tracking-[0.15em] uppercase px-2 py-1">
                {product.tag}
              </span>
              <p className="text-[#C4964A] text-[10px] tracking-[0.25em] uppercase">{product.brand}</p>
            </div>

            <h1
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1 }}
              className="text-white mb-2"
            >
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {Array(5).fill(null).map((_, i) => (
                  <Star key={`star-${i}`} size={12} className={i < 4 ? "fill-[#C4964A] text-[#C4964A]" : "text-white/20"} />
                ))}
              </div>
              <span className="text-white/30 text-[10px] tracking-wide">(127 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <p
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300 }}
                className="text-white"
              >
                {product.price}
              </p>
              <p className="text-white/30 text-xs">incl. VAT</p>
            </div>

            {/* Description */}
            <p className="text-white/50 text-xs leading-relaxed mb-8 border-t border-white/8 pt-8">
              {product.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mb-10">
              <button
                onClick={handleArClick}
                className="w-full flex items-center justify-center gap-3 bg-[#C4964A] text-black py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#d4a85a] transition-all duration-300"
              >
                <Scan size={16} /> Try AR On Wrist
              </button>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 border border-white/20 text-white/80 py-4 text-xs tracking-[0.2em] uppercase hover:border-white hover:text-white transition-all duration-300"
              >
                <ShoppingBag size={14} /> Buy Now (Affiliate)
              </a>
              <div className="flex gap-3">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex-1 flex items-center justify-center gap-2 border py-3 text-[10px] tracking-[0.15em] uppercase transition-all duration-200 ${
                    liked ? "border-[#C4964A] text-[#C4964A]" : "border-white/15 text-white/40 hover:border-white/30"
                  }`}
                >
                  <Heart size={13} className={liked ? "fill-[#C4964A]" : ""} />
                  {liked ? "Saved" : "Save"}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 border border-white/15 text-white/40 py-3 text-[10px] tracking-[0.15em] uppercase hover:border-white/30 transition-all duration-200">
                  <Share2 size={13} /> Share
                </button>
              </div>
            </div>

            {/* Specs */}
            <div className="border-t border-white/8 pt-8">
              <p className="text-white/50 text-[9px] tracking-[0.25em] uppercase mb-5">Specifications</p>
              <div className="grid grid-cols-2 gap-y-4">
                {product.specs.map((s) => (
                  <div key={s.label}>
                    <p className="text-white/25 text-[9px] tracking-wide mb-1">{s.label}</p>
                    <p className="text-white/70 text-xs">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mt-24 border-t border-white/8 pt-16">
          <p className="text-[#C4964A] text-[10px] tracking-[0.3em] uppercase mb-3 text-center">You May Also Like</p>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "2rem", lineHeight: 1.1 }}
            className="text-white text-center mb-10"
          >
            Similar Pieces
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {(() => {
              const others = Object.values(products).filter(p => p.id !== product.id);
              const relatedProducts = others.length >= 4 ? others.slice(0, 4) : [...others, ...Object.values(products).filter(p => p.id !== product.id || others.length === 0)].slice(0, 4);
              return relatedProducts.map((p, idx) => (
                <Link key={`related-${p.id}-${idx}`} to={`/product/${p.id}`} className="group">
                  <div className="aspect-square overflow-hidden bg-[#111111] mb-3">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <p className="text-[#C4964A] text-[8px] tracking-[0.2em] uppercase mb-1">{p.brand}</p>
                  <p
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                    className="text-white text-sm group-hover:text-[#C4964A] transition-colors duration-200"
                  >
                    {p.name}
                  </p>
                  <p className="text-white/40 text-[10px] mt-1">{p.price}</p>
                </Link>
              ));
            })()}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress 3.5s ease-in-out forwards;
        }
      `}</style>
      </div>
    </>
  );
}
