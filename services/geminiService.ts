import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Severity } from "../types";

// Gemini instance (lazy-initialized)
let ai: GoogleGenAI | null = null;

export const analyzeWasteImage = async (
  base64Image: string,
  mimeType: string
): Promise<AnalysisResult> => {

  // 🔒 Lazy + safe initialization
  if (!ai) {
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("Gemini API key missing. Using fallback classification.");

      // ✅ Fallback result (prevents app crash)
      return {
        severity: Severity.MEDIUM,
        confidence: 0.5,
        waste_type: ["mixed"],
        reason: "AI analysis unavailable. Default severity applied."
      };
    }

    ai = new GoogleGenAI({ apiKey });
  }

  const model = "gemini-3-flash-preview";

  const prompt = `Analyze this uploaded image of roadside waste and assess the severity of garbage accumulation.
Classify the garbage into one of the following categories:
- LOW (small, scattered waste, low urgency)
- MEDIUM (visible accumulation, moderate urgency)
- HIGH (large pile, open dumping, high health risk)

Consider:
- Size of the garbage pile
- Density and spread
- Type of waste (plastic, organic, mixed, construction debris)
- Visual indicators of hygiene risk`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data: base64Image,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          severity: {
            type: Type.STRING,
            description: "The assessed severity: LOW, MEDIUM, or HIGH",
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence level between 0.0 and 1.0",
          },
          waste_type: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description:
              "Types of waste identified (plastic, organic, mixed, construction)",
          },
          reason: {
            type: Type.STRING,
            description: "A short, one-sentence explanation of the findings.",
          },
        },
        required: ["severity", "confidence", "waste_type", "reason"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  return JSON.parse(text) as AnalysisResult;
};
