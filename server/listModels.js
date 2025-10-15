import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

// Initialize the client
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    // Use the official method to list models
    const response = await genAI.models.list(); // <- note: `models.list()` is the correct syntax
    console.log("Available models for this API key:");
    response.models.forEach((m) => {
      console.log(`- ${m.name} | type: ${m.type}`);
    });
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
