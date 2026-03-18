import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { Package, TrendingUp, MousePointerClick, Code2, Plus, Trash2, Edit, Copy, Check } from "lucide-react";

const arData = [
  { day: "Mon", views: 1240 },
  { day: "Tue", views: 1890 },
  { day: "Wed", views: 1560 },
  { day: "Thu", views: 2200 },
  { day: "Fri", views: 2850 },
  { day: "Sat", views: 3100 },
  { day: "Sun", views: 2640 },
];

const conversionData = [
  { day: "Mon", clicks: 88 },
  { day: "Tue", clicks: 134 },
  { day: "Wed", clicks: 112 },
  { day: "Thu", clicks: 165 },
  { day: "Fri", clicks: 210 },
  { day: "Sat", clicks: 244 },
  { day: "Sun", clicks: 192 },
];

const topProducts = [
  { id: 1, name: "Constellation Chronos", tries: 2840, conversion: "8.2%", status: "live" },
  { id: 2, name: "Oceanic Pro Diver", tries: 2210, conversion: "6.7%", status: "live" },
  { id: 3, name: "Heritage Leather", tries: 1875, conversion: "5.4%", status: "pending" },
  { id: 4, name: "Apex Chronograph", tries: 1420, conversion: "9.1%", status: "live" },
];

const plans = [
  { name: "Starter", price: "990,000 ₫/mo", models: 10, embed: true, analytics: false, support: "Email" },
  { name: "Pro", price: "2,990,000 ₫/mo", models: 50, embed: true, analytics: true, support: "Priority", popular: true },
  { name: "Enterprise", price: "Custom", models: 999, embed: true, analytics: true, support: "Dedicated" },
];

const EMBED_CODE = `<script src="https://cdn.truewrist.io/embed.js" data-vendor="YOUR_VENDOR_ID" async></script>`;

export function VendorDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "embed" | "plans">("dashboard");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(EMBED_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "Products" },
    { key: "embed", label: "Embed Code" },
    { key: "plans", label: "Plans" },
  ] as const;

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }} className="pt-20 min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="border-b border-white/8 py-14 text-center">
        <p className="text-[#C4964A] text-[10px] tracking-[0.3em] uppercase mb-3">B2B Portal</p>
        <h1
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.05 }}
          className="text-white"
        >
          Vendor Dashboard
        </h1>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10">
        {/* Tab Nav */}
        <div className="flex gap-0 border-b border-white/10 mb-10 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-[10px] tracking-[0.2em] uppercase border-b-2 transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-[#C4964A] text-[#C4964A]"
                  : "border-transparent text-white/40 hover:text-white/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <TrendingUp size={18} />, label: "AR Try-Ons (7d)", value: "15,480", change: "+18%" },
                { icon: <MousePointerClick size={18} />, label: "Click to Buy (7d)", value: "1,145", change: "+12%" },
                { icon: <Package size={18} />, label: "Active Products", value: "24", change: "Live" },
                { icon: <TrendingUp size={18} />, label: "Avg Conversion", value: "7.4%", change: "+2.1%" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-[#111111] border border-white/8 p-6">
                  <div className="text-[#C4964A] mb-4">{kpi.icon}</div>
                  <p
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "1.8rem" }}
                    className="text-white mb-1"
                  >
                    {kpi.value}
                  </p>
                  <p className="text-white/30 text-[9px] tracking-wide mb-1">{kpi.label}</p>
                  <span className="text-[#C4964A] text-[9px] tracking-wide">{kpi.change}</span>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#111111] border border-white/8 p-6">
                <p className="text-white/50 text-[9px] tracking-[0.25em] uppercase mb-6">AR Try-On Views (7 Days)</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={arData}>
                    <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#0E0E0E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 0, color: "#fff", fontSize: 11 }}
                      cursor={{ fill: "rgba(196,150,74,0.05)" }}
                    />
                    <Bar dataKey="views" fill="#C4964A" radius={0} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-[#111111] border border-white/8 p-6">
                <p className="text-white/50 text-[9px] tracking-[0.25em] uppercase mb-6">Click-to-Buy Conversions</p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={conversionData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#0E0E0E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 0, color: "#fff", fontSize: 11 }}
                    />
                    <Line type="monotone" dataKey="clicks" stroke="#C4964A" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-[#111111] border border-white/8 p-6">
              <p className="text-white/50 text-[9px] tracking-[0.25em] uppercase mb-6">Top Products by Try-Ons</p>
              <div className="space-y-4">
                {topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-4">
                    <span className="text-white/20 text-xs w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/70 text-xs truncate">{p.name}</p>
                    </div>
                    <div className="w-32 bg-white/5 h-1 rounded-full">
                      <div
                        className="h-full bg-[#C4964A] rounded-full"
                        style={{ width: `${(p.tries / 3000) * 100}%` }}
                      />
                    </div>
                    <p className="text-white/40 text-[10px] w-14 text-right">{p.tries.toLocaleString()}</p>
                    <p className="text-[#C4964A] text-[10px] w-10 text-right">{p.conversion}</p>
                    <span className={`text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 ${
                      p.status === "live" ? "bg-emerald-900/30 text-emerald-400" : "bg-amber-900/30 text-amber-400"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-white/50 text-xs tracking-wide">{topProducts.length} products</p>
              <button className="flex items-center gap-2 bg-[#C4964A] text-black px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4a85a] transition-all duration-300">
                <Plus size={13} /> Add Product
              </button>
            </div>
            <div className="bg-[#111111] border border-white/8">
              {topProducts.map((p, i) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-6 px-6 py-5 ${i !== topProducts.length - 1 ? "border-b border-white/5" : ""}`}
                >
                  <div className="w-12 h-12 bg-[#1A1A1A] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-xs mb-1">{p.name}</p>
                    <p className="text-white/25 text-[9px]">{p.tries.toLocaleString()} tries · {p.conversion} conversion</p>
                  </div>
                  <span className={`text-[8px] tracking-[0.15em] uppercase px-2 py-1 ${
                    p.status === "live" ? "bg-emerald-900/30 text-emerald-400" : "bg-amber-900/30 text-amber-400"
                  }`}>
                    {p.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="w-7 h-7 border border-white/10 flex items-center justify-center text-white/30 hover:border-[#C4964A] hover:text-[#C4964A] transition-all duration-200">
                      <Edit size={11} />
                    </button>
                    <button className="w-7 h-7 border border-white/10 flex items-center justify-center text-white/30 hover:border-red-500 hover:text-red-400 transition-all duration-200">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Guidelines */}
            <div className="mt-8 border border-white/8 p-6 bg-[#111111]">
              <p className="text-white/50 text-[9px] tracking-[0.25em] uppercase mb-4">3D Model Upload Guidelines</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {[
                  { label: "Accepted formats", value: ".glb, .gltf" },
                  { label: "Max file size", value: "5MB per model" },
                  { label: "Compression", value: "Draco recommended" },
                  { label: "Polygon count", value: "< 50,000 polys" },
                  { label: "Textures", value: "PBR (roughness/metallic)" },
                  { label: "Review time", value: "24-48 hours" },
                ].map((g) => (
                  <div key={g.label} className="flex gap-2">
                    <div className="w-1 h-1 bg-[#C4964A] rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/30 text-[9px] tracking-wide">{g.label}</p>
                      <p className="text-white/60 text-xs">{g.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EMBED TAB */}
        {activeTab === "embed" && (
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <Code2 size={20} className="text-[#C4964A]" />
              <h2
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "1.8rem" }}
                className="text-white"
              >
                Integration Hub
              </h2>
            </div>
            <p className="text-white/40 text-xs leading-relaxed mb-8">
              Copy the snippet below and paste it into your website's HTML — works with WordPress, Shopify, Haravan, and any HTML site. The "Try 3D with TrueWrist" button will appear automatically next to your watch listings.
            </p>

            {/* Code block */}
            <div className="bg-[#0E0E0E] border border-white/10 p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/25 text-[9px] tracking-[0.2em] uppercase">JavaScript Embed</p>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-[9px] tracking-[0.15em] uppercase text-white/40 hover:text-[#C4964A] transition-colors duration-200"
                >
                  {copied ? <Check size={11} className="text-[#C4964A]" /> : <Copy size={11} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <code className="text-[#C4964A] text-xs break-all font-mono leading-relaxed">
                {EMBED_CODE}
              </code>
            </div>

            <p className="text-white/25 text-[10px] leading-relaxed mb-12">
              Replace <span className="text-white/50">YOUR_VENDOR_ID</span> with your unique vendor identifier found in Account Settings.
            </p>

            {/* iFrame option */}
            <div className="border-t border-white/8 pt-8">
              <p className="text-white/50 text-[9px] tracking-[0.25em] uppercase mb-4">Or use iFrame embed</p>
              <div className="bg-[#0E0E0E] border border-white/10 p-5 mb-4">
                <code className="text-[#C4964A] text-xs break-all font-mono leading-relaxed">
                  {'<iframe src="https://app.truewrist.io/embed?vendor=YOUR_VENDOR_ID&product=PRODUCT_ID" width="100%" height="600" frameborder="0" allow="camera; microphone"></iframe>'}
                </code>
              </div>
              <p className="text-white/25 text-[10px]">
                Requires camera permission. Best for embedding single product AR viewers.
              </p>
            </div>
          </div>
        )}

        {/* PLANS TAB */}
        {activeTab === "plans" && (
          <div>
            <div className="text-center mb-12">
              <p className="text-[#C4964A] text-[10px] tracking-[0.3em] uppercase mb-3">SaaS Pricing</p>
              <h2
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.1 }}
                className="text-white"
              >
                Choose Your Plan
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`border p-8 relative ${
                    plan.popular ? "border-[#C4964A]" : "border-white/10"
                  } bg-[#111111]`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[#C4964A] text-black text-[8px] tracking-[0.2em] uppercase px-4 py-1">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <p
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.4rem" }}
                    className="text-white mb-2"
                  >
                    {plan.name}
                  </p>
                  <p className="text-[#C4964A] text-lg mb-6">{plan.price}</p>
                  <div className="space-y-3 mb-8">
                    {[
                      { label: "Watch Models", value: plan.models === 999 ? "Unlimited" : `${plan.models} models` },
                      { label: "Embed Code", value: plan.embed ? "✓" : "✗" },
                      { label: "Analytics", value: plan.analytics ? "Full dashboard" : "Basic only" },
                      { label: "Support", value: plan.support },
                    ].map((f) => (
                      <div key={f.label} className="flex justify-between items-center">
                        <p className="text-white/30 text-[10px] tracking-wide">{f.label}</p>
                        <p className="text-white/70 text-xs">{f.value}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    className={`w-full py-3 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
                      plan.popular
                        ? "bg-[#C4964A] text-black hover:bg-[#d4a85a]"
                        : "border border-white/20 text-white/60 hover:border-[#C4964A] hover:text-[#C4964A]"
                    }`}
                  >
                    {plan.name === "Enterprise" ? "Contact Us" : "Get Started"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
