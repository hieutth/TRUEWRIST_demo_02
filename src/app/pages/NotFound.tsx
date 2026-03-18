import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div
      style={{ fontFamily: "'Jost', sans-serif" }}
      className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-center px-6"
    >
      <div>
        <p
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "8rem", lineHeight: 1 }}
          className="text-white/5 mb-6"
        >
          404
        </p>
        <p className="text-[#C4964A] text-[10px] tracking-[0.3em] uppercase mb-4">Page Not Found</p>
        <h1
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.1 }}
          className="text-white mb-6"
        >
          This page doesn't exist.
        </h1>
        <p className="text-white/30 text-xs leading-relaxed mb-10 max-w-xs mx-auto">
          The watch you're looking for may have moved or been removed. Return to our collections.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 border border-[#C4964A] text-[#C4964A] px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#C4964A] hover:text-black transition-all duration-300"
        >
          <ArrowLeft size={12} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
