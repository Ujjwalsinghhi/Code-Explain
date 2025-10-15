// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { GoogleGenAI } from "@google/genai";

const app = express();

// --- Security Middleware ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// --- Gemini Client Setup ---
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Code Explanation Endpoint ---
app.post("/api/explain-code", async (req, res) => {
  try {
    const { code, language } = req.body;
    console.log("📩 Received request:", { code, language });

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const prompt = `
Explain this ${language || "code"} simply for a beginner.
Focus on what each part does and why it's written that way.

\`\`\`${language || "text"}
${code}
\`\`\`
    `;

    console.log("🧠 Sending prompt to Gemini...");

    // --- Correct usage: contents is a string, not an array of objects ---
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // --- Extract explanation ---
    const explanation = result?.response?.[0]?.content?.[0]?.text || result?.text;

    if (!explanation) {
      return res.status(500).json({ error: "No explanation returned from Gemini" });
    }

    console.log("✅ Explanation generated successfully.");
    res.json({ explanation, language: language || "unknown" });
  } catch (err) {
    console.error("❌ Error in /api/explain-code:", err);
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

// --- Health Check Endpoint ---
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    hasApiKey: !!API_KEY,
    uptime: process.uptime(),
  });
});

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// --- Start Server ---
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Gemini API server running on http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 API Key configured: ${!!API_KEY}`);
}); 