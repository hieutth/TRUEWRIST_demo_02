import { useEffect, useRef, useState } from "react";
import { Hands, Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { X, Camera as CameraIcon, RotateCcw, Download } from "lucide-react";

interface ARTryOnProps {
  watchImage: string;
  watchName: string;
  onClose: () => void;
}

export function ARTryOn({ watchImage, watchName, onClose }: ARTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [handDetected, setHandDetected] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const cameraRef = useRef<Camera | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const watchImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // Preload watch image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = watchImage;
    img.onload = () => {
      watchImgRef.current = img;
    };

    return () => {
      watchImgRef.current = null;
    };
  }, [watchImage]);

  useEffect(() => {
    let mounted = true;

    const initializeAR = async () => {
      try {
        if (!videoRef.current || !canvasRef.current) return;

        // Initialize MediaPipe Hands
        const hands = new Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          },
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: Results) => {
          if (!mounted || !canvasRef.current) return;
          onResults(results);
        });

        handsRef.current = hands;

        // Initialize Camera
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && handsRef.current) {
              await handsRef.current.send({ image: videoRef.current });
            }
          },
          facingMode: facingMode,
          width: 1280,
          height: 720,
        });

        cameraRef.current = camera;
        await camera.start();

        if (mounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("AR initialization error:", err);
        if (mounted) {
          setError("Không thể khởi động camera. Vui lòng cho phép truy cập camera.");
          setIsLoading(false);
        }
      }
    };

    initializeAR();

    return () => {
      mounted = false;
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, [facingMode]);

  const onResults = (results: Results) => {
    if (!canvasRef.current || !videoRef.current || !watchImgRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Draw video frame
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    // Draw hand landmarks and watch
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setHandDetected(true);

      for (let i = 0; i < results.multiHandLandmarks.length; i++) {
        const landmarks = results.multiHandLandmarks[i];
        const handedness = results.multiHandedness?.[i];

        // Get wrist position (landmark 0)
        const wrist = landmarks[0];

        // Get middle finger base (landmark 9) to calculate watch orientation
        const middleFingerBase = landmarks[9];

        // Calculate watch position and size
        const wristX = wrist.x * canvas.width;
        const wristY = wrist.y * canvas.height;

        // Calculate distance between wrist and middle finger base for sizing
        const dx = (middleFingerBase.x - wrist.x) * canvas.width;
        const dy = (middleFingerBase.y - wrist.y) * canvas.height;
        const handSize = Math.sqrt(dx * dx + dy * dy);

        // Watch size based on hand size
        const watchSize = handSize * 1.2;

        // Calculate rotation angle
        const angle = Math.atan2(dy, dx);

        // Draw watch
        ctx.save();
        ctx.translate(wristX, wristY);
        ctx.rotate(angle + Math.PI / 2);

        // Draw watch shadow for depth
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        // Draw watch image
        ctx.drawImage(
          watchImgRef.current,
          -watchSize / 2,
          -watchSize / 2,
          watchSize,
          watchSize
        );

        ctx.restore();

        // Draw wrist landmark for reference (optional - can be removed)
        ctx.fillStyle = handedness?.label === "Left" ? "#C4964A" : "#C4964A";
        ctx.beginPath();
        ctx.arc(wristX, wristY, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    } else {
      setHandDetected(false);
    }

    ctx.restore();
  };

  const handleFlipCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const handleCapture = () => {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.download = `${watchName}-AR-try-on.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-[#0A0A0A]/90 to-transparent p-4">
        <div className="flex items-center justify-between max-w-[1440px] mx-auto">
          <div>
            <p className="text-[#C4964A] text-[9px] tracking-[0.25em] uppercase">AR Try-On</p>
            <p className="text-white text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {watchName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          className="hidden"
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain"
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]/80">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#C4964A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60 text-xs tracking-[0.15em]">Đang khởi động camera...</p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]/90">
            <div className="text-center max-w-md px-6">
              <CameraIcon size={48} className="text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-sm mb-6">{error}</p>
              <button
                onClick={onClose}
                className="bg-[#C4964A] text-black px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#d4a85a] transition-all duration-300"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Hand Detection Status */}
        {!isLoading && !error && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-[#0A0A0A]/70 px-4 py-2 rounded-full">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${handDetected ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
              <p className="text-white/80 text-[10px] tracking-wide">
                {handDetected ? "Đã phát hiện tay" : "Đưa tay vào khung hình"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      {!isLoading && !error && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-[#0A0A0A]/90 to-transparent p-6">
          <div className="flex items-center justify-center gap-4 max-w-[1440px] mx-auto">
            <button
              onClick={handleFlipCamera}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
              title="Đổi camera"
            >
              <RotateCcw size={20} className="text-white" />
            </button>

            <button
              onClick={handleCapture}
              className="bg-[#C4964A] text-black px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#d4a85a] transition-all duration-300 flex items-center gap-2"
            >
              <Download size={14} />
              Chụp ảnh
            </button>
          </div>

          <p className="text-white/40 text-[9px] text-center mt-4 tracking-wide">
            Hướng cổ tay vào camera để thử đồng hồ
          </p>
        </div>
      )}
    </div>
  );
}
