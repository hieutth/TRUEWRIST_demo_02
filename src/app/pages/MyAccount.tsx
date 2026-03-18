import { useState } from "react";
import { Heart, Clock, Palette, Ruler, User, Settings, LogOut, Star, Scan } from "lucide-react";
import { Link } from "react-router";

const wardrobe = [
  {
    id: "1",
    name: "Constellation Chronos",
    brand: "Meridian",
    image: "https://images.unsplash.com/photo-1730757679771-b53e798846cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGdvbGQlMjBkaWFsJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzMwNjYxNzF8MA&ixlib=rb-4.1.0&q=80&w=400",
    triedAt: "2 hours ago",
  },
  {
    id: "2",
    name: "Oceanic Pro Diver",
    brand: "Aqua Forge",
    image: "https://images.unsplash.com/photo-1650974970408-c6d0fbee4ec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRjaCUyMHNpbHZlciUyMHN0ZWVsJTIwbWluaW1hbGlzdCUyMHdoaXRlfGVufDF8fHx8MTc3MzA2NjE3M3ww&ixlib=rb-4.1.0&q=80&w=400",
    triedAt: "Yesterday",
  },
  {
    id: "3",
    name: "Heritage Leather",
    brand: "Volta",
    image: "https://images.unsplash.com/photo-1767009951352-a271b6155eeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRjaCUyMGxlYXRoZXIlMjBzdHJhcCUyMGJyb3duJTIwbHV4dXJ5fGVufDF8fHx8MTc3MzA1NTA3N3ww&ixlib=rb-4.1.0&q=80&w=400",
    triedAt: "3 days ago",
  },
];

const favoritesData = [
  {
    id: "1",
    name: "Constellation Chronos",
    brand: "Meridian",
    price: "12,500,000 ₫",
    image: "https://images.unsplash.com/photo-1730757679771-b53e798846cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGdvbGQlMjBkaWFsJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzMwNjYxNzF8MA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: "4",
    name: "Apex Chronograph",
    brand: "StormKraft",
    price: "15,800,000 ₫",
    image: "https://images.unsplash.com/photo-1761558009207-69e7a47b2cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJvbm9ncmFwaCUyMHdhdGNoJTIwc3BvcnQlMjBibGFja3xlbnwxfHx8fDE3NzMwNjYxNzR8MA&ixlib=rb-4.1.0&q=80&w=400",
  },
];

const myCreations = [
  { id: "c1", name: "Midnight Genesis", status: "approved", created: "Mar 5, 2026" },
  { id: "c2", name: "Solar Flare", status: "pending", created: "Mar 8, 2026" },
];

type Tab = "wardrobe" | "favorites" | "wrist" | "creations" | "settings";

export function MyAccount() {
  const [activeTab, setActiveTab] = useState<Tab>("wardrobe");
  const [wristSize, setWristSize] = useState("17.5");

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "wardrobe", label: "My Wardrobe", icon: <Clock size={14} /> },
    { key: "favorites", label: "Favorites", icon: <Heart size={14} /> },
    { key: "wrist", label: "My Wrist", icon: <Ruler size={14} /> },
    { key: "creations", label: "My Creations", icon: <Palette size={14} /> },
    { key: "settings", label: "Settings", icon: <Settings size={14} /> },
  ];

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }} className="pt-20 min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="border-b border-white/8 py-14">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center md:items-end gap-6 justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-[#C4964A]/10 border border-[#C4964A]/30 rounded-full flex items-center justify-center">
              <User size={28} className="text-[#C4964A]" />
            </div>
            <div>
              <p className="text-[#C4964A] text-[10px] tracking-[0.3em] uppercase mb-1">Member</p>
              <h1
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1.1 }}
                className="text-white"
              >
                Nguyen Van Minh
              </h1>
              <p className="text-white/30 text-xs mt-1">minh@truewrist.io · Joined Jan 2026</p>
            </div>
          </div>
          <div className="flex gap-6">
            {[
              { num: wardrobe.length, label: "Tried" },
              { num: favoritesData.length, label: "Saved" },
              { num: myCreations.length, label: "Created" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 300 }}
                  className="text-white"
                >
                  {s.num}
                </p>
                <p className="text-white/30 text-[9px] tracking-[0.15em] uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
        {/* Tabs */}
        <div className="flex gap-0 border-b border-white/8 mb-10 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-[10px] tracking-[0.15em] uppercase border-b-2 whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.key
                  ? "border-[#C4964A] text-[#C4964A]"
                  : "border-transparent text-white/35 hover:text-white/55"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* WARDROBE */}
        {activeTab === "wardrobe" && (
          <div>
            <p className="text-white/30 text-xs tracking-wide mb-8">Watches you've tried on via AR</p>
            {wardrobe.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-white/20 text-sm">Your wardrobe is empty.</p>
                <Link to="/collections" className="mt-4 block text-[#C4964A] text-xs tracking-[0.2em] uppercase hover:underline">
                  Explore Collections
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wardrobe.map((w) => (
                  <Link key={w.id} to={`/product/${w.id}`} className="group">
                    <div className="relative overflow-hidden aspect-square bg-[#111111] mb-3">
                      <img
                        src={w.image}
                        alt={w.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                        <span className="flex items-center gap-2 text-white text-[9px] tracking-[0.2em] uppercase">
                          <Scan size={12} /> Try Again
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 bg-[#0A0A0A]/60 px-2 py-1">
                        <p className="text-white/40 text-[8px] tracking-wide">{w.triedAt}</p>
                      </div>
                    </div>
                    <p className="text-[#C4964A] text-[9px] tracking-[0.2em] uppercase mb-1">{w.brand}</p>
                    <p
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                      className="text-white text-base group-hover:text-[#C4964A] transition-colors duration-200"
                    >
                      {w.name}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAVORITES */}
        {activeTab === "favorites" && (
          <div>
            <p className="text-white/30 text-xs tracking-wide mb-8">Watches you've saved</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {favoritesData.map((w) => (
                <Link key={w.id} to={`/product/${w.id}`} className="group">
                  <div className="relative overflow-hidden aspect-square bg-[#111111] mb-3">
                    <img src={w.image} alt={w.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 right-3">
                      <Heart size={14} className="fill-[#C4964A] text-[#C4964A]" />
                    </div>
                  </div>
                  <p className="text-[#C4964A] text-[9px] tracking-[0.2em] uppercase mb-1">{w.brand}</p>
                  <p
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                    className="text-white text-base group-hover:text-[#C4964A] transition-colors duration-200"
                  >
                    {w.name}
                  </p>
                  <p className="text-white/40 text-xs mt-1">{w.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* WRIST */}
        {activeTab === "wrist" && (
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-3">
              <Ruler size={16} className="text-[#C4964A]" />
              <h2
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "1.8rem" }}
                className="text-white"
              >
                My Wrist Profile
              </h2>
            </div>
            <p className="text-white/40 text-xs leading-relaxed mb-8">
              Save your wrist circumference so TrueWrist can automatically filter watches to your perfect size and scale AR try-ons to 1:1.
            </p>

            <div className="bg-[#111111] border border-white/8 p-8 mb-6">
              <label className="text-white/50 text-[9px] tracking-[0.25em] uppercase block mb-3">
                Wrist Circumference (cm)
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  step="0.5"
                  min="10"
                  max="30"
                  value={wristSize}
                  onChange={(e) => setWristSize(e.target.value)}
                  className="flex-1 bg-[#0A0A0A] border border-white/15 focus:border-[#C4964A]/50 text-white/80 px-4 py-3 text-sm focus:outline-none transition-colors duration-200"
                />
                <button className="bg-[#C4964A] text-black px-6 text-xs tracking-[0.2em] uppercase hover:bg-[#d4a85a] transition-all duration-300">
                  Save
                </button>
              </div>
              <p className="text-white/25 text-[9px] mt-3 leading-relaxed">
                Tip: Wrap a flexible tape measure around your wrist at the widest point.
              </p>
            </div>

            {/* Recommendation */}
            {wristSize && !isNaN(parseFloat(wristSize)) && (
              <div className="border border-[#C4964A]/20 bg-[#C4964A]/5 p-6">
                <p className="text-[#C4964A] text-[9px] tracking-[0.2em] uppercase mb-2">Your Recommended Watch Sizes</p>
                <p className="text-white/70 text-sm">
                  Based on {wristSize}cm wrist: &nbsp;
                  <span className="text-white">
                    {parseFloat(wristSize) < 16 ? "36mm – 38mm"
                      : parseFloat(wristSize) < 18 ? "38mm – 41mm"
                      : parseFloat(wristSize) < 20 ? "40mm – 44mm"
                      : "42mm – 46mm"}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* CREATIONS */}
        {activeTab === "creations" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <p className="text-white/30 text-xs tracking-wide">Your submitted designs</p>
              <Link
                to="/creator-studio"
                className="flex items-center gap-2 border border-[#C4964A] text-[#C4964A] px-5 py-2 text-[9px] tracking-[0.2em] uppercase hover:bg-[#C4964A] hover:text-black transition-all duration-300"
              >
                <Palette size={12} /> New Creation
              </Link>
            </div>
            <div className="space-y-4">
              {myCreations.map((c) => (
                <div key={c.id} className="bg-[#111111] border border-white/8 p-6 flex items-center gap-6">
                  <div className="w-14 h-14 bg-[#1A1A1A] rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 border border-[#C4964A]/40 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                      className="text-white text-base mb-1"
                    >
                      {c.name}
                    </p>
                    <p className="text-white/30 text-[9px]">Created {c.created}</p>
                  </div>
                  <span
                    className={`text-[8px] tracking-[0.15em] uppercase px-3 py-1 ${
                      c.status === "approved"
                        ? "bg-emerald-900/30 text-emerald-400"
                        : "bg-amber-900/30 text-amber-400"
                    }`}
                  >
                    {c.status}
                  </span>
                  {c.status === "approved" && (
                    <div className="flex items-center gap-1">
                      <Star size={10} className="fill-[#C4964A] text-[#C4964A]" />
                      <p className="text-[#C4964A] text-[9px]">Live</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-lg space-y-8">
            <div className="bg-[#111111] border border-white/8 p-8">
              <p className="text-white/50 text-[9px] tracking-[0.25em] uppercase mb-6">Profile Information</p>
              <div className="space-y-4">
                {[
                  { label: "Full Name", value: "Nguyen Van Minh" },
                  { label: "Email", value: "minh@truewrist.io" },
                  { label: "Phone", value: "+84 901 234 567" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-white/30 text-[9px] tracking-wide block mb-1">{f.label}</label>
                    <input
                      type="text"
                      defaultValue={f.value}
                      className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#C4964A]/40 text-white/70 px-4 py-3 text-xs focus:outline-none transition-colors duration-200"
                    />
                  </div>
                ))}
              </div>
              <button className="mt-6 bg-[#C4964A] text-black px-6 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4a85a] transition-all duration-300">
                Save Changes
              </button>
            </div>

            <div className="bg-[#111111] border border-white/8 p-8">
              <p className="text-white/50 text-[9px] tracking-[0.25em] uppercase mb-6">Notifications</p>
              {["New arrivals", "Creator Studio updates", "Vendor promotions"].map((n) => (
                <div key={n} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <p className="text-white/60 text-xs">{n}</p>
                  <div className="w-10 h-5 bg-[#C4964A]/20 border border-[#C4964A]/30 rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-[#C4964A] rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            <button className="flex items-center gap-2 text-white/30 hover:text-red-400 text-xs tracking-[0.15em] uppercase transition-colors duration-200">
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
