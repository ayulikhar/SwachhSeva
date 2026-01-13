import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

// Integrations
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // Register AI Routes
  registerChatRoutes(app);
  registerImageRoutes(app);

  app.post(api.analyze.path, async (req, res) => {
    try {
      const { image } = api.analyze.input.parse(req.body);
      const base64Image = image.replace(/^data:image\/\w+;base64,/, "");

      if (!process.env.GEMINI_API_KEY) {
         console.warn("GEMINI_API_KEY not set, using mock response");
         await new Promise(r => setTimeout(r, 2000));
         return res.json({
            category: "Mixed Waste",
            severity: "MEDIUM",
            description: "Simulated analysis: Pile of mixed plastic and organic waste detected."
         });
      }

      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = "Analyze this image of waste. Identify the waste category (Plastic, Organic, Mixed, Construction, etc.), severity (LOW, MEDIUM, HIGH) based on size and type, and a short description. Return ONLY a JSON object with keys: category, severity, description. Do not include markdown formatting.";

      const response = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
            {
                role: "user",
                parts: [
                    { text: prompt },
                    { 
                        inlineData: { 
                            mimeType: "image/jpeg", 
                            data: base64Image 
                        } 
                    }
                ]
            }
        ]
      });
      
      const text = response.text() || "{}";
      
      try {
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);
        
        const validated = z.object({
            category: z.string(),
            severity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
            description: z.string()
        }).parse({
            category: data.category || "Unknown",
            severity: ["LOW", "MEDIUM", "HIGH"].includes(data.severity) ? data.severity : "MEDIUM",
            description: data.description || "No description provided"
        });

        res.json(validated);
      } catch (e) {
        console.error("Failed to parse Gemini response:", text, e);
        res.status(500).json({ message: "Failed to analyze image" });
      }

    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.reports.list.path, async (req, res) => {
    const reports = await storage.getReports();
    res.json(reports);
  });

  app.post(api.reports.create.path, async (req, res) => {
    try {
      const input = api.reports.create.input.parse(req.body);
      // Use authenticated user ID if available
      const userId = (req.user as any)?.claims?.sub; 
      
      const report = await storage.createReport({
        ...input,
        userId: userId || null 
      });
      res.status(201).json(report);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.users.me.path, async (req, res) => {
    if (req.isAuthenticated()) {
        res.json((req.user as any).claims);
    } else {
        res.json(null);
    }
  });

  // Seed data
  if ((await storage.getReports()).length === 0) {
      await storage.createReport({
          imageUrl: "placeholder",
          location: "Thane, Maharashtra",
          latitude: 19.2183,
          longitude: 72.9781,
          category: "Plastic Waste",
          severity: "HIGH",
          description: "Large pile of plastic bottles near the market entrance.",
          status: "pending",
          userId: null
      });
  }

  return httpServer;
}
