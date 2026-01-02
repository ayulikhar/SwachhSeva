
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Severity } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeWasteImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  const model = 'gemini-3-flash-preview';
  
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
    model: model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Image
          }
        },
        { text: prompt }
      ]
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
            description: "Types of waste identified (plastic, organic, mixed, construction)",
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
