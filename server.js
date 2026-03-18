import dotenv from "dotenv";
import express from "express";
import Replicate from "replicate";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local variables from project root
console.log("Current directory:", __dirname);
const envResult = dotenv.config({ path: `${__dirname}/.env.local` });
console.log("Dotenv config result:", envResult.error || "Loaded successfully");
console.log("REPLICATE_API_KEY from process.env:", process.env.REPLICATE_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.REPLICATE_API_KEY || "r8_YzpfLLDc2SKjRbX9KXBJHyFqE0UAKFI3dBX8e";
if (!apiKey) {
  console.error("ERROR: REPLICATE_API_KEY not found!");
  console.error("Env vars:", Object.keys(process.env).filter(k => k.includes("REPLICATE")));
  process.exit(1);
}

console.log("✅ Replicate API Key loaded:", apiKey.substring(0, 10) + "...");

const replicate = new Replicate({
  auth: apiKey,
});

app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("Mock image generation - simulating AI render...");

    // For now, return a placeholder luxury watch image from Unsplash
    // In production, this would call Replicate or another image generation API
    const placeholderUrl = "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1024&h=1024&fit=crop";

    // Simulate processing delay to show "generating" state
    await new Promise(r => setTimeout(r, 3000));

    return res.json({
      success: true,
      imageUrl: placeholderUrl,
    });
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
