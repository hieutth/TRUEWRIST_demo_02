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

    console.log("Creating prediction with prompt:", prompt.substring(0, 100));

    const prediction = await replicate.predictions.create({
      // Using version ID format instead of model name
      version: "25c1d31f-663c-4b59-b692-f303d466cb27",
      input: {
        prompt: prompt,
        negative_prompt: "blurry, low quality",
        num_inference_steps: 50,
        guidance_scale: 7.5,
        height: 768,
        width: 768,
      },
    });

    console.log("Prediction created:", prediction.id);

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 120;

    while (attempts < maxAttempts) {
      const completedPrediction = await replicate.predictions.get(prediction.id);

      if (completedPrediction.status === "succeeded") {
        console.log("Image generated successfully");
        return res.json({
          success: true,
          imageUrl: completedPrediction.output?.[0],
        });
      }

      if (completedPrediction.status === "failed") {
        console.error("Prediction failed:", completedPrediction.error);
        return res.status(500).json({
          error: "Image generation failed",
          details: completedPrediction.error,
        });
      }

      console.log(`Status [${attempts}]:`, completedPrediction.status);
      await new Promise((r) => setTimeout(r, 2000));
      attempts++;
    }

    return res.status(500).json({
      error: "Image generation timeout",
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
