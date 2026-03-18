import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Upload, X, RotateCcw, CheckCircle2, RefreshCw,
  Sparkles, Download, AlertTriangle, AlertCircle,
  ChevronRight, Save, Eye,
} from "lucide-react";
import { useWatchStore, CustomWatch } from "../context/WatchStore";
import { ARTryOn } from "../components/ARTryOn";

/* ─── API config ──────────────────────────────────────────── */
const GEMINI_API_KEY  = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_MODEL    = "gemini-2.0-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const OPENAI_API_KEY  = import.meta.env.VITE_OPENAI_API_KEY || "";
const DALLE3_ENDPOINT = "https://api.openai.com/v1/images/generations";

/* ─── Angle slots ───────────────────────────────────────── */
const ANGLE_SLOTS = [
  { key: "front",   label: "Mặt trước",    hint: "Góc nhìn thẳng",    required: true  },
  { key: "left34",  label: "3/4 Trái",     hint: "Nghiêng ~45°",      required: false },
  { key: "left",    label: "Mặt bên trái", hint: "Góc 90°",           required: false },
  { key: "right34", label: "3/4 Phải",     hint: "Nghiêng ~45°",      required: false },
  { key: "right",   label: "Mặt bên phải", hint: "Góc 90°",           required: false },
  { key: "back",    label: "Mặt sau",      hint: "Phía sau đồng hồ",  required: false },
] as const;
type SlotKey = (typeof ANGLE_SLOTS)[number]["key"];

const AI_STEPS = [
  "Gửi ảnh đến Gemini AI...",
  "Phân tích cấu trúc & vật liệu...",
  "Tái tạo hình khối 3D...",
  "Áp dụng studio lighting...",
  "Render bề mặt kim loại...",
  "Hoàn thiện ảnh 3D...",
];

const STRAP_OPTIONS = ["Leather", "Metal", "Rubber", "NATO", "Fabric"];
const TAG_OPTIONS   = ["New", "Hot", "Limited", "Exclusive", "Bestseller", "Custom"];

/* ─── Gemini helpers ────────────────────────────────────── */
async function blobUrlToBase64(url: string): Promise<{ data: string; mimeType: string }> {
  const res  = await fetch(url);
  const blob = await res.blob();
  const mime = blob.type || "image/jpeg";
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const r = reader.result as string;
      resolve({ data: r.split(",")[1], mimeType: mime });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/* Analyze watch images with Gemini to create a detailed prompt */
async function analyzeWatchWithGemini(slots: Partial<Record<SlotKey, string>>): Promise<string> {
  const analysisPrompt = `Analyze these luxury watch reference photos and describe the watch characteristics:
- Material & finish (brushed steel, polished, PVD, etc.)
- Case diameter and shape
- Bezel type
- Dial color and markings
- Brand visible on dial
- Strap/bracelet type and color
- Any distinctive features

Provide a concise 1-2 sentence description suitable for image generation.`;

  const parts: object[] = [{ text: analysisPrompt }];
  for (const key of Object.keys(slots) as SlotKey[]) {
    const url = slots[key];
    if (!url) continue;
    const { data, mimeType } = await blobUrlToBase64(url);
    parts.push({ inline_data: { mime_type: mimeType, data } });
  }

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts }] }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { error?: { message?: string } })?.error?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const json = await res.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const textPart = json.candidates?.[0]?.content?.parts?.find((p) => p.text);
  return textPart?.text || "luxury watch with professional styling";
}

/* Generate image with DALL-E 3 */
async function generateImageWithDALLE3(watchDescription: string): Promise<string> {
  const prompt = `Create a photorealistic 3D product render of a ${watchDescription} with:
- Pure deep black background
- Dramatic directional studio lighting from upper-left
- Subtle warm golden rim light on the right edge
- Watch positioned at a heroic 35° angle, slightly elevated
- Ultra-realistic metal reflections and textures
- Crystal-clear watch glass with realistic reflections
- Professional floating appearance with soft drop shadow
- Style similar to Omega, Rolex or IWC official product photography
- High resolution, sharp details, professional product photography`;

  const res = await fetch(DALLE3_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { error?: { message?: string } })?.error?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const json = await res.json() as { data?: Array<{ url?: string }> };
  const imageUrl = json.data?.[0]?.url;
  if (!imageUrl) throw new Error("DALL-E 3 không trả về URL ảnh. Hãy thử lại.");
  return imageUrl;
}

/* Main function to generate watch image */
async function callGemini(slots: Partial<Record<SlotKey, string>>): Promise<string> {
  const watchDescription = await analyzeWatchWithGemini(slots);
  return generateImageWithDALLE3(watchDescription);
}

/* ─── Step indicator ────────────────────────────────────── */
const STUDIO_STEPS = ["Upload ảnh 2D", "AI Render 3D", "Thông tin mẫu", "Hoàn thành"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12 overflow-x-auto">
      {STUDIO_STEPS.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex items-center gap-2 px-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] flex-shrink-0 transition-all duration-300 ${
              i < current  ? "bg-[#C4964A] text-black" :
              i === current? "border-2 border-[#C4964A] text-[#C4964A]" :
              "border border-white/20 text-white/25"
            }`}>
              {i < current ? <CheckCircle2 size={11} /> : i + 1}
            </div>
            <span className={`text-[9px] tracking-[0.12em] uppercase whitespace-nowrap ${
              i === current ? "text-[#C4964A]" : i < current ? "text-white/50" : "text-white/20"
            }`}>{s}</span>
          </div>
          {i < STUDIO_STEPS.length - 1 && <ChevronRight size={12} className="text-white/12 mx-2 flex-shrink-0" />}
        </div>
      ))}
    </div>
  );
}

/* ─── Step 1: Upload ────────────────────────────────────── */
function UploadStep({
  images, onFile, onRemove, onNext,
}: {
  images: Partial<Record<SlotKey, string>>;
  onFile: (key: SlotKey) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (key: SlotKey) => void;
  onNext: () => void;
}) {
  const fileRefs = useRef<Partial<Record<SlotKey, HTMLInputElement | null>>>({});
  const count    = Object.keys(images).length;
  const hasFront = !!images["front"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      <div className="lg:col-span-3 space-y-6">
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.6rem" }}
            className="text-white mb-2">Upload ảnh đồng hồ</h2>
          <p className="text-white/40 text-xs leading-relaxed">
            Upload ảnh chụp thật từ nhiều góc độ. Gemini AI sẽ phân tích và render ra ảnh 3D
            chất lượng studio. Tối thiểu cần ảnh <span className="text-white/70">mặt trước</span>.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {ANGLE_SLOTS.map((slot) => {
            const img = images[slot.key];
            return (
              <div key={slot.key} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <p className="text-white/55 text-[10px] tracking-[0.1em] uppercase">{slot.label}</p>
                  {slot.required && <span className="text-[#C4964A] text-[8px]">*</span>}
                </div>
                <div className="relative aspect-square bg-[#111111] border border-white/8 group overflow-hidden">
                  {img ? (
                    <>
                      <img src={img} alt={slot.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                        <button
                          onClick={() => fileRefs.current[slot.key]?.click()}
                          className="flex items-center gap-1 text-white/80 text-[9px] hover:text-[#C4964A] transition-colors"
                        ><RefreshCw size={11} /> Thay</button>
                        <button
                          onClick={() => onRemove(slot.key)}
                          className="flex items-center gap-1 text-white/50 text-[9px] hover:text-red-400 transition-colors"
                        ><X size={11} /> Xóa</button>
                      </div>
                      <div className="absolute top-1.5 right-1.5 bg-[#C4964A]/90 rounded-full p-0.5">
                        <CheckCircle2 size={10} className="text-black" />
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => fileRefs.current[slot.key]?.click()}
                      className="w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-white/3 transition-colors duration-200 group/btn"
                    >
                      <div className="w-9 h-9 border border-dashed border-white/15 group-hover/btn:border-[#C4964A]/40 flex items-center justify-center transition-colors duration-200">
                        <Upload size={13} className="text-white/18 group-hover/btn:text-[#C4964A]/60 transition-colors duration-200" />
                      </div>
                      <p className="text-white/18 text-[9px]">{slot.hint}</p>
                    </button>
                  )}
                  <input
                    type="file" accept="image/*" className="hidden"
                    ref={(el) => { fileRefs.current[slot.key] = el; }}
                    onChange={onFile(slot.key)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Coverage */}
        <div>
          <div className="flex justify-between mb-1.5">
            <p className="text-white/30 text-[9px] tracking-[0.15em] uppercase">Độ phủ góc</p>
            <p className="text-[#C4964A] text-[9px]">{count}/{ANGLE_SLOTS.length}</p>
          </div>
          <div className="h-0.5 bg-white/8">
            <div className="h-full bg-[#C4964A] transition-all duration-500" style={{ width: `${(count / ANGLE_SLOTS.length) * 100}%` }} />
          </div>
          <p className="text-white/18 text-[9px] mt-1.5">Càng nhiều góc → AI render càng chính xác</p>
        </div>

        <button
          onClick={onNext}
          disabled={!hasFront}
          className="w-full py-4 flex items-center justify-center gap-2 bg-[#C4964A] text-black text-xs tracking-[0.2em] uppercase hover:bg-[#d4a85a] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Sparkles size={14} /> Render 3D với Gemini AI
        </button>
        {!hasFront && (
          <div className="flex items-center gap-2 text-white/25 text-[10px]">
            <AlertCircle size={11} className="flex-shrink-0" />
            Cần upload ít nhất ảnh mặt trước
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="lg:col-span-2 space-y-5">
        <div className="bg-[#111111] border border-white/8 p-5 space-y-4">
          <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase">Mẹo chụp ảnh</p>
          {[
            "Dùng nền trắng hoặc xám đồng nhất",
            "Ánh sáng tự nhiên hoặc đèn studio, tránh bóng cứng",
            "Giữ khoảng cách 20–30cm từ đồng hồ",
            "Đồng hồ chiếm 70–80% khung hình",
            "Mỗi góc xoay ~45° so với góc kề",
            "Ảnh rõ nét, không bị mờ hay rung",
          ].map((t) => (
            <div key={t} className="flex gap-2.5 items-start">
              <div className="w-1 h-1 bg-[#C4964A] rounded-full mt-1.5 flex-shrink-0" />
              <p className="text-white/38 text-[10px] leading-relaxed">{t}</p>
            </div>
          ))}
        </div>

        <div className="border border-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-white/40 text-[9px] font-mono">{GEMINI_MODEL}</p>
          </div>
          <p className="text-white/18 text-[9px]">Google DeepMind · Image Generation · Nhúng API sẵn có</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: AI Render ─────────────────────────────────── */
function RenderStep({
  images, onDone, onBack,
}: {
  images: Partial<Record<SlotKey, string>>;
  onDone: (img: string) => void;
  onBack: () => void;
}) {
  const [status, setStatus]   = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx]  = useState(0);
  const [stepLabel, setStepLabel] = useState("");
  const [result, setResult]    = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [arOpen, setArOpen]    = useState(false);
  const processing = useRef(false);

  const run = useCallback(async () => {
    if (processing.current) return;
    processing.current = true;
    setStatus("processing");
    setProgress(0);
    setErrorMsg(null);
    setResult(null);

    let cur = 0;
    setStepLabel(AI_STEPS[0]);
    setStepIdx(0);

    const interval = setInterval(() => {
      cur = Math.min(cur + 1, AI_STEPS.length - 2);
      setStepLabel(AI_STEPS[cur]);
      setStepIdx(cur);
      setProgress(Math.round((cur / (AI_STEPS.length - 1)) * 80));
    }, 2600);

    try {
      const img = await callGemini(images);
      clearInterval(interval);
      setStepLabel(AI_STEPS[AI_STEPS.length - 1]);
      setStepIdx(AI_STEPS.length - 1);
      setProgress(100);
      setResult(img);
      setStatus("done");
    } catch (e: unknown) {
      clearInterval(interval);
      setErrorMsg(e instanceof Error ? e.message : "Lỗi không xác định.");
      setStatus("error");
    } finally {
      processing.current = false;
    }
  }, [images]);

  // auto-start
  useState(() => { run(); });

  if (arOpen && result) {
    return <ARTryOn watchImage={result} watchName="Preview 3D" onClose={() => setArOpen(false)} />;
  }

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.download = "truewrist-3d-render.png";
    a.href = result;
    a.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      <div className="lg:col-span-3 space-y-6">
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.6rem" }}
            className="text-white mb-2">Gemini AI Render</h2>
          <p className="text-white/40 text-xs leading-relaxed">
            AI đang phân tích {Object.keys(images).length} ảnh tham chiếu và tái tạo mô hình 3D studio.
          </p>
        </div>

        {/* Processing */}
        {status === "processing" && (
          <div className="border border-white/8 bg-[#111111] p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#C4964A] border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <p className="text-white/60 text-xs">{stepLabel}</p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-white/25 text-[9px]">Đang xử lý...</p>
                <p className="text-[#C4964A] text-[9px]">{progress}%</p>
              </div>
              <div className="h-1 bg-white/8 w-full rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C4964A] to-[#e8c27a] transition-all duration-700 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AI_STEPS.map((s, i) => {
                const done   = i < stepIdx;
                const active = i === stepIdx;
                return (
                  <div key={s} className="flex items-center gap-1.5">
                    {done ? <CheckCircle2 size={10} className="text-[#C4964A] flex-shrink-0" />
                      : active ? <div className="w-2.5 h-2.5 border border-[#C4964A] rounded-full animate-pulse flex-shrink-0" />
                      : <div className="w-2.5 h-2.5 border border-white/10 rounded-full flex-shrink-0" />}
                    <p className={`text-[8px] truncate ${done ? "text-white/50" : active ? "text-[#C4964A]" : "text-white/15"}`}>
                      {s.replace("...", "")}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="text-white/15 text-[9px] text-center">Quá trình có thể mất 15–60 giây</p>
          </div>
        )}

        {/* Done */}
        {status === "done" && result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#C4964A]" />
              <p className="text-white/70 text-xs tracking-wide">Render hoàn tất · {Object.keys(images).length} ảnh tham chiếu</p>
            </div>

            <div className="relative border border-white/10 overflow-hidden bg-black">
              <img src={result} alt="AI 3D Render" className="w-full object-contain max-h-80" />
              <div className="absolute top-2 right-2 bg-[#C4964A] text-black text-[8px] tracking-[0.15em] uppercase px-2 py-0.5">
                AI · 3D
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onDone(result)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#C4964A] text-black text-xs tracking-[0.2em] uppercase hover:bg-[#d4a85a] transition-all duration-300"
              >
                <ChevronRight size={14} /> Tiếp tục điền thông tin
              </button>
              <button
                onClick={() => setArOpen(true)}
                title="Thử AR trước"
                className="px-4 py-3 border border-white/15 text-white/50 hover:border-[#C4964A] hover:text-[#C4964A] transition-all duration-200 flex items-center gap-1.5 text-[9px] tracking-wide uppercase"
              >
                <Eye size={13} /> Try AR
              </button>
              <button
                onClick={handleDownload}
                title="Tải ảnh"
                className="px-4 py-3 border border-white/15 text-white/50 hover:border-white/30 transition-all duration-200"
              >
                <Download size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="border border-red-800/40 bg-red-900/10 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 text-xs mb-1">Lỗi từ Gemini API</p>
                <p className="text-red-400/60 text-[10px] leading-relaxed">{errorMsg}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={run}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#C4964A] text-black text-[9px] tracking-[0.15em] uppercase hover:bg-[#d4a85a] transition-all"
              >
                <RotateCcw size={11} /> Thử lại
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2.5 border border-white/15 text-white/40 text-[9px] tracking-wide hover:border-white/30 transition-all"
              >
                Quay lại
              </button>
            </div>
          </div>
        )}

        {status !== "error" && (
          <button
            onClick={onBack}
            className="text-white/25 text-[10px] hover:text-white/50 transition-colors flex items-center gap-1"
          >
            ← Quay lại upload ảnh
          </button>
        )}
      </div>

      {/* Right: references */}
      <div className="lg:col-span-2 space-y-4">
        <p className="text-white/30 text-[9px] tracking-[0.2em] uppercase">Ảnh tham chiếu</p>
        <div className="grid grid-cols-3 gap-2">
          {ANGLE_SLOTS.map((slot) => {
            const img = images[slot.key];
            if (!img) return null;
            return (
              <div key={slot.key} className="flex flex-col gap-1">
                <div className="aspect-square bg-[#111] border border-white/8 overflow-hidden">
                  <img src={img} alt={slot.label} className="w-full h-full object-cover" />
                </div>
                <p className="text-white/25 text-[8px] text-center">{slot.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 3: Watch Info Form ───────────────────────────── */
function InfoStep({
  renderedImage,
  onSave,
  onBack,
}: {
  renderedImage: string;
  onSave: (watch: Omit<CustomWatch, "id" | "isCustom" | "createdAt">) => void;
  onBack: () => void;
}) {
  const [name, setName]         = useState("");
  const [brand, setBrand]       = useState("");
  const [reference, setReference] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [strap, setStrap]       = useState("Leather");
  const [sizeStr, setSizeStr]   = useState("40");
  const [tag, setTag]           = useState("Custom");
  const [desc, setDesc]         = useState("");
  const [arOpen, setArOpen]     = useState(false);

  const canSave = name.trim() && brand.trim();

  if (arOpen) {
    return <ARTryOn watchImage={renderedImage} watchName={name || "Preview"} onClose={() => setArOpen(false)} />;
  }

  const handleSave = () => {
    if (!canSave) return;
    const price = parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
    const size  = parseFloat(sizeStr) || 40;
    onSave({
      name: name.trim(),
      brand: brand.trim(),
      reference: reference.trim(),
      price,
      displayPrice: price > 0 ? `${price.toLocaleString("vi-VN")} ₫` : "Liên hệ",
      strap,
      size,
      image: renderedImage,
      originalImages: [],
      tag,
      description: desc.trim(),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      {/* Left: Form */}
      <div className="lg:col-span-3 space-y-6">
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.6rem" }}
            className="text-white mb-2">Thông tin mẫu đồng hồ</h2>
          <p className="text-white/40 text-xs leading-relaxed">
            Điền thông tin chi tiết. Mẫu đồng hồ sẽ xuất hiện trong trang{" "}
            <span className="text-[#C4964A]">Collections</span> khi lưu.
          </p>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-white/50 text-[9px] tracking-[0.2em] uppercase block mb-2">Tên đồng hồ *</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Vd: Midnight Chronos"
              className="w-full bg-[#111111] border border-white/10 focus:border-[#C4964A]/50 text-white/80 px-4 py-3 text-xs placeholder:text-white/20 focus:outline-none transition-colors"
            />
          </div>

          {/* Brand + Reference */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-[9px] tracking-[0.2em] uppercase block mb-2">Thương hiệu *</label>
              <input
                type="text" value={brand} onChange={(e) => setBrand(e.target.value)}
                placeholder="Vd: TrueWrist"
                className="w-full bg-[#111111] border border-white/10 focus:border-[#C4964A]/50 text-white/80 px-4 py-3 text-xs placeholder:text-white/20 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-white/50 text-[9px] tracking-[0.2em] uppercase block mb-2">Mã tham chiếu</label>
              <input
                type="text" value={reference} onChange={(e) => setReference(e.target.value)}
                placeholder="Vd: TW-001-A"
                className="w-full bg-[#111111] border border-white/10 focus:border-[#C4964A]/50 text-white/80 px-4 py-3 text-xs placeholder:text-white/20 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Price + Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-[9px] tracking-[0.2em] uppercase block mb-2">Giá (₫)</label>
              <input
                type="text" value={priceStr} onChange={(e) => setPriceStr(e.target.value)}
                placeholder="Vd: 12500000"
                className="w-full bg-[#111111] border border-white/10 focus:border-[#C4964A]/50 text-white/80 px-4 py-3 text-xs placeholder:text-white/20 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-white/50 text-[9px] tracking-[0.2em] uppercase block mb-2">Kích thước (mm)</label>
              <input
                type="number" value={sizeStr} onChange={(e) => setSizeStr(e.target.value)}
                min={28} max={50}
                className="w-full bg-[#111111] border border-white/10 focus:border-[#C4964A]/50 text-white/80 px-4 py-3 text-xs focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Strap + Tag */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-[9px] tracking-[0.2em] uppercase block mb-2">Dây đeo</label>
              <div className="flex flex-wrap gap-2">
                {STRAP_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStrap(s)}
                    className={`px-3 py-1.5 text-[9px] border transition-all duration-150 ${
                      strap === s ? "border-[#C4964A] text-[#C4964A] bg-[#C4964A]/10" : "border-white/12 text-white/35 hover:border-white/25"
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-white/50 text-[9px] tracking-[0.2em] uppercase block mb-2">Tag</label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className={`px-3 py-1.5 text-[9px] border transition-all duration-150 ${
                      tag === t ? "border-[#C4964A] text-[#C4964A] bg-[#C4964A]/10" : "border-white/12 text-white/35 hover:border-white/25"
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-white/50 text-[9px] tracking-[0.2em] uppercase block mb-2">Mô tả</label>
            <textarea
              value={desc} onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Mô tả chi tiết về mẫu đồng hồ..."
              className="w-full bg-[#111111] border border-white/10 focus:border-[#C4964A]/50 text-white/80 px-4 py-3 text-xs placeholder:text-white/20 focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#C4964A] text-black text-xs tracking-[0.2em] uppercase hover:bg-[#d4a85a] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Save size={14} /> Lưu vào Collections
          </button>
          <button
            onClick={() => setArOpen(true)}
            className="px-5 py-4 border border-white/15 text-white/50 hover:border-[#C4964A] hover:text-[#C4964A] transition-all duration-200 text-[9px] tracking-wide uppercase flex items-center gap-1.5"
          >
            <Eye size={13} /> Try AR
          </button>
        </div>

        <button onClick={onBack} className="text-white/25 text-[10px] hover:text-white/50 transition-colors flex items-center gap-1">
          ← Quay lại render
        </button>
      </div>

      {/* Right: Preview card */}
      <div className="lg:col-span-2 space-y-5">
        <p className="text-white/30 text-[9px] tracking-[0.2em] uppercase">Xem trước thẻ Collections</p>
        <div className="bg-[#111111] border border-white/8 overflow-hidden">
          {/* Image */}
          <div className="relative aspect-square bg-black overflow-hidden">
            <img src={renderedImage} alt="3D Render" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3">
              <span className="bg-[#C4964A] text-black text-[8px] tracking-[0.12em] uppercase px-2 py-1">
                {tag}
              </span>
            </div>
            <div className="absolute top-3 right-3 text-[8px] bg-black/60 text-[#C4964A] px-2 py-1 tracking-wide uppercase">
              AI 3D
            </div>
          </div>
          {/* Info */}
          <div className="p-4 space-y-1">
            <p className="text-[#C4964A] text-[9px] tracking-[0.2em] uppercase">{brand || "Thương hiệu"}</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.05rem" }}
              className="text-white">{name || "Tên đồng hồ"}</p>
            {reference && <p className="text-white/30 text-[9px]">Ref: {reference}</p>}
            <div className="flex items-center justify-between pt-1">
              <p className="text-white/60 text-xs">
                {priceStr ? `${parseFloat(priceStr.replace(/[^0-9.]/g, "")).toLocaleString("vi-VN")} ₫` : "Liên hệ"}
              </p>
              <p className="text-white/30 text-[9px]">{sizeStr}mm · {strap}</p>
            </div>
          </div>
        </div>

        <div className="border border-[#C4964A]/15 bg-[#C4964A]/5 p-4">
          <p className="text-[#C4964A]/80 text-[9px] leading-relaxed">
            Sau khi lưu, mẫu đồng hồ này sẽ xuất hiện ngay trong trang{" "}
            <span className="text-[#C4964A]">Collections</span> với đầy đủ tính năng
            Try AR và xem chi tiết.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 4: Success ───────────────────────────────────── */
function SuccessStep({ watchName, onReset }: { watchName: string; onReset: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 border border-[#C4964A] flex items-center justify-center mb-6">
        <CheckCircle2 size={36} className="text-[#C4964A]" />
      </div>
      <h2
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "2.2rem" }}
        className="text-white mb-3"
      >
        Đã lưu thành công!
      </h2>
      <p className="text-white/40 text-xs leading-relaxed max-w-sm mb-10">
        <span className="text-white/70">"{watchName}"</span> đã được thêm vào Collections.
        Bạn có thể tìm thấy và thử AR ngay trong trang Collections.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => navigate("/collections")}
          className="bg-[#C4964A] text-black px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#d4a85a] transition-all duration-300"
        >
          Xem Collections
        </button>
        <button
          onClick={onReset}
          className="border border-white/20 text-white/60 px-8 py-3 text-xs tracking-[0.2em] uppercase hover:border-[#C4964A] hover:text-[#C4964A] transition-all duration-300"
        >
          Tạo mẫu khác
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export function CreatorStudio() {
  const { addWatch } = useWatchStore();

  const [step, setStep]           = useState(0);
  const [images, setImages]       = useState<Partial<Record<SlotKey, string>>>({});
  const [rendered, setRendered]   = useState<string | null>(null);
  const [savedName, setSavedName] = useState("");

  const handleFile = useCallback(
    (key: SlotKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImages((p) => ({ ...p, [key]: URL.createObjectURL(file) }));
    },
    []
  );

  const handleRemove = (key: SlotKey) =>
    setImages((p) => { const n = { ...p }; delete n[key]; return n; });

  const handleRenderDone = (img: string) => {
    setRendered(img);
    setStep(2);
  };

  const handleSave = (data: Omit<CustomWatch, "id" | "isCustom" | "createdAt">) => {
    const watch: CustomWatch = {
      ...data,
      id: `custom-${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    addWatch(watch);
    setSavedName(data.name);
    setStep(3);
  };

  const handleReset = () => {
    setStep(0);
    setImages({});
    setRendered(null);
    setSavedName("");
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }} className="pt-20 min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="border-b border-white/8 py-14 text-center">
        <p className="text-[#C4964A] text-[10px] tracking-[0.3em] uppercase mb-3">AI · Creator</p>
        <h1
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1.05 }}
          className="text-white"
        >
          Creator Studio
        </h1>
        <p className="text-white/40 text-xs tracking-wide mt-4 max-w-md mx-auto leading-relaxed">
          Upload ảnh thật → Gemini AI render 3D → Thêm vào Collections → Try AR trên cổ tay.
        </p>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-12">
        {/* Step bar — hide on success */}
        {step < 3 && <StepBar current={step} />}

        {step === 0 && (
          <UploadStep
            images={images}
            onFile={handleFile}
            onRemove={handleRemove}
            onNext={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <RenderStep
            images={images}
            onDone={handleRenderDone}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && rendered && (
          <InfoStep
            renderedImage={rendered}
            onSave={handleSave}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <SuccessStep watchName={savedName} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
