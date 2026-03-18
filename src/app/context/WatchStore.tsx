import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CustomWatch {
  id: string;
  name: string;
  brand: string;
  reference: string;
  price: number;
  displayPrice: string;
  strap: string;
  size: number;
  image: string;          // AI-rendered 3D image (base64 or URL)
  originalImages: string[]; // original uploaded 2D photos
  tag: string;
  description: string;
  isCustom: true;
  createdAt: string;
}

interface WatchStoreCtx {
  customWatches: CustomWatch[];
  addWatch: (w: CustomWatch) => void;
  removeWatch: (id: string) => void;
}

const Ctx = createContext<WatchStoreCtx>({
  customWatches: [],
  addWatch: () => {},
  removeWatch: () => {},
});

const LS_KEY = "truewrist_custom_watches";

export function WatchStoreProvider({ children }: { children: ReactNode }) {
  const [customWatches, setCustomWatches] = useState<CustomWatch[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      // Store only essential data — strip large base64 images if > 4MB total
      const serialized = JSON.stringify(customWatches);
      if (serialized.length < 4_000_000) {
        localStorage.setItem(LS_KEY, serialized);
      }
    } catch {
      // ignore storage quota errors
    }
  }, [customWatches]);

  const addWatch = (w: CustomWatch) => {
    setCustomWatches((prev) => [w, ...prev]);
  };

  const removeWatch = (id: string) => {
    setCustomWatches((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <Ctx.Provider value={{ customWatches, addWatch, removeWatch }}>
      {children}
    </Ctx.Provider>
  );
}

export function useWatchStore() {
  return useContext(Ctx);
}
