import { Link } from "react-router";
import { Instagram, Youtube, Facebook, Twitter } from "lucide-react";

const footerSections = [
  {
    title: "Explore",
    links: [
      { label: "All Collections", href: "/collections" },
      { label: "New Arrivals", href: "/collections" },
      { label: "Hot Trend", href: "/collections" },
      { label: "Limited Edition", href: "/collections" },
    ],
  },
  {
    title: "Experience",
    links: [
      { label: "Try AR On Wrist", href: "/collections" },
      { label: "Creator Studio", href: "/creator-studio" },
      { label: "3D Viewer", href: "/collections" },
      { label: "Size Finder", href: "/collections" },
    ],
  },
  {
    title: "For Business",
    links: [
      { label: "Vendor Portal", href: "/vendor" },
      { label: "B2B Partnership", href: "/vendor" },
      { label: "Embed Integration", href: "/vendor" },
      { label: "Pricing Plans", href: "/vendor" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "My Account", href: "/account" },
      { label: "FAQ", href: "/" },
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="bg-[#0A0A0A] border-t border-white/10 pt-16 pb-8"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
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
            <p className="text-white/50 text-xs leading-relaxed tracking-wide mb-8 max-w-xs">
              The world's first Web-AR platform that lets you try on luxury watches on your wrist — true to size, true to life.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, href: "#" },
                { Icon: Youtube, href: "#" },
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/50 hover:border-[#C4964A] hover:text-[#C4964A] transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4
                className="text-white text-[10px] tracking-[0.25em] uppercase mb-5"
                style={{ fontWeight: 500 }}
              >
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-white/40 hover:text-[#C4964A] text-xs tracking-wide transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs tracking-widest">
            © 2026 TrueWrist. All rights reserved.
          </p>
          <p className="text-white/25 text-xs tracking-wide">
            Powered by Web-AR · Three.js · MindAR
          </p>
        </div>
      </div>
    </footer>
  );
}
