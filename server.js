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

const apiKey = process.env.REPLICATE_API_KEY || "r8_IU2hPYIJhI8nnhbj2fcCRu5vyIV6mmX1ZwPRU";
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

    console.log("Simulating AI image generation...");

    // Return a placeholder luxury watch image (FREE, no API calls needed)
    const placeholderUrl = "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1024&h=1024&fit=crop";

    // Simulate 3-5 second processing
    await new Promise(r => setTimeout(r, Math.random() * 2000 + 3000));

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
