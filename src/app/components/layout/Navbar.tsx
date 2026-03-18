import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Search, User, Heart, Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  {
    label: "Collections",
    href: "/collections",
    sub: ["All Watches", "New Arrivals", "Hot Trend", "Limited Edition"],
  },
  {
    label: "Try AR",
    href: "/collections",
    sub: [],
  },
  {
    label: "Creator Studio",
    href: "/creator-studio",
    sub: [],
  },
  {
    label: "B2B / Vendors",
    href: "/vendor",
    sub: [],
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <header
        style={{ fontFamily: "'Jost', sans-serif" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isTransparent
            ? "bg-transparent"
            : "bg-[#0A0A0A] border-b border-white/10"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border border-[#C4964A] rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-[#C4964A] rounded-full" />
              </div>
              <span
                style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.2em" }}
                className="text-white text-xl font-light tracking-widest uppercase"
              >
                TrueWrist
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative group"
                onMouseEnter={() => setActiveMenu(link.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to={link.href}
                  className="flex items-center gap-1 text-white/80 hover:text-[#C4964A] transition-colors duration-200 text-xs tracking-[0.15em] uppercase py-6"
                >
                  {link.label}
                  {link.sub.length > 0 && <ChevronDown size={12} className="opacity-60" />}
                </Link>
                {link.sub.length > 0 && (
                  <div
                    className={`absolute top-full left-0 w-48 bg-[#0A0A0A] border border-white/10 py-4 transition-all duration-200 ${
                      activeMenu === link.label
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    {link.sub.map((s) => (
                      <Link
                        key={s}
                        to="/collections"
                        className="block px-6 py-2 text-xs tracking-[0.12em] uppercase text-white/60 hover:text-[#C4964A] hover:bg-white/5 transition-colors duration-150"
                      >
                        {s}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-5">
            <button className="text-white/70 hover:text-[#C4964A] transition-colors duration-200 hidden md:flex">
              <Search size={18} />
            </button>
            <button className="text-white/70 hover:text-[#C4964A] transition-colors duration-200 hidden md:flex">
              <Heart size={18} />
            </button>
            <Link
              to="/account"
              className="text-white/70 hover:text-[#C4964A] transition-colors duration-200 hidden md:flex"
            >
              <User size={18} />
            </Link>
            <Link
              to="/collections"
              className="hidden md:flex items-center gap-2 border border-[#C4964A] text-[#C4964A] px-5 py-2 text-[10px] tracking-[0.2em] uppercase hover:bg-[#C4964A] hover:text-black transition-all duration-300"
            >
              Try AR Now
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white/80 hover:text-[#C4964A] transition-colors duration-200"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#0A0A0A] transition-all duration-500 flex flex-col pt-20 px-8 pb-8 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        <div className="flex flex-col gap-1 mt-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-white/80 hover:text-[#C4964A] text-2xl py-3 border-b border-white/10 tracking-[0.1em] uppercase transition-colors duration-200"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-8 flex gap-6">
          <button className="text-white/60 hover:text-[#C4964A] transition-colors duration-200">
            <Search size={20} />
          </button>
          <button className="text-white/60 hover:text-[#C4964A] transition-colors duration-200">
            <Heart size={20} />
          </button>
          <Link to="/account" className="text-white/60 hover:text-[#C4964A] transition-colors duration-200">
            <User size={20} />
          </Link>
        </div>
      </div>
    </>
  );
}
