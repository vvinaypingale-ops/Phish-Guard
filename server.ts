import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { runHeuristicScan } from "./src/lib/heuristicEngine.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
    model: "gemini-3.6-flash"
  });
});

// Primary Threat Scanning Endpoint
app.post("/api/scan", async (req, res) => {
  try {
    const { text = "", senderEmail = "", companyUrl = "" } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Text content is required for threat scanning." });
    }

    // 1. Run local Heuristic Pattern Engine
    const heuristicResults = runHeuristicScan(text, senderEmail, companyUrl);

    let llmAdjustment = 0;
    let executiveSummary = "";
    let reasoningTrace = "";
    let deltaExplanation = "";
    let aiConfidence: "High" | "Medium" | "Standard" = "Standard";
    let aiPowered = false;

    const apiKey = process.env.GEMINI_API_KEY;
    const isValidKey = Boolean(apiKey && apiKey !== "MY_GEMINI_API_KEY");

    if (isValidKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        const prompt = `You are PhishGuard AI, a Senior Cyber Threat Intelligence Analyst and Digital Forensics Expert.
Analyze the following suspicious communication (which could be an offer letter, phishing email, SMS smishing, or executive impersonation):

--- DOCUMENT CONTENT ---
${text}
--- METADATA ---
Sender Email: ${senderEmail || "Not provided"}
Company URL: ${companyUrl || "Not provided"}
Heuristic Base Risk Score: ${heuristicResults.heuristicScore}/100
Heuristic Flags Triggered: ${heuristicResults.detectedFlags.map((f) => f.label).join(", ") || "None"}

Perform deep contextual reasoning to uncover social engineering tricks, evasion patterns, psychological manipulation, and linguistic anomalies that static regex rules cannot detect.
Calculate an LLM adjustment to the risk score (between -25 and +25 points) to calibrate the final risk score.
If this is a clearly legitimate message (e.g. standard corporate offer without upfront fees or wire requests), set the final risk low.
If it involves advance-fee scams, fake checks, urgent wire transfers, or gift card requests, score it critically high.`;

        const generateAiResponse = async (modelName: string) => {
          return await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: "You are an expert fraud forensics system that outputs rigorous, accurate threat intelligence in JSON format.",
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  llmAdjustment: {
                    type: Type.INTEGER,
                    description: "Adjustment score between -25 and +25 based on contextual nuance.",
                  },
                  confidence: {
                    type: Type.STRING,
                    description: "Confidence level: High or Medium.",
                  },
                  executiveSummary: {
                    type: Type.STRING,
                    description: "2-3 sentences concise executive forensic summary highlighting the primary threat vector.",
                  },
                  reasoningTrace: {
                    type: Type.STRING,
                    description: "Step-by-step forensic reasoning trace detailing contextual threat indicators.",
                  },
                  deltaExplanation: {
                    type: Type.STRING,
                    description: "Explanation of why the AI score differs or affirms the heuristic base score.",
                  },
                  additionalRedFlags: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        category: { type: Type.STRING },
                        severity: { type: Type.STRING },
                        label: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        evidence: { type: Type.STRING },
                      },
                      required: ["category", "severity", "label", "explanation", "evidence"],
                    },
                  },
                },
                required: ["llmAdjustment", "confidence", "executiveSummary", "reasoningTrace", "deltaExplanation"],
              },
            },
          });
        };

        let response;
        try {
          response = await generateAiResponse("gemini-3.6-flash");
        } catch (_err) {
          response = await generateAiResponse("gemini-3.8-flash");
        }

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          llmAdjustment = Math.max(-30, Math.min(30, Number(parsed.llmAdjustment) || 0));
          executiveSummary = parsed.executiveSummary || "";
          reasoningTrace = parsed.reasoningTrace || "";
          deltaExplanation = parsed.deltaExplanation || "";
          aiConfidence = (parsed.confidence as "High" | "Medium") || "High";
          aiPowered = true;

          // Merge additional AI-detected flags if any
          if (Array.isArray(parsed.additionalRedFlags) && parsed.additionalRedFlags.length > 0) {
            parsed.additionalRedFlags.forEach((af: any, i: number) => {
              heuristicResults.detectedFlags.push({
                id: `ai_flag_${Date.now()}_${i}`,
                category: (af.category as any) || "process",
                severity: (af.severity as any) || "high",
                weight: 20,
                label: af.label || "AI Contextual Deception Vector",
                explanation: af.explanation || "",
                evidence: af.evidence || "Contextual analysis",
                matchedSnippet: af.evidence,
              });
            });
          }
        }
      } catch (aiErr) {
        console.warn("Gemini AI analysis warning:", aiErr);
      }
    }

    // Fallback if AI was not invoked or failed
    if (!aiPowered) {
      if (heuristicResults.heuristicScore >= 70) {
        executiveSummary = "Critical threat detected. The document exhibits hallmark signatures of employment advance-fee fraud, check cashing schemes, or credential harvesting with high psychological pressure.";
        reasoningTrace = "Heuristic pattern engine identified high-weight financial diversion indicators, unverified off-platform communication channels, or coercive deadline language.";
        deltaExplanation = "Standard heuristic engine calibration. Full neural reasoning trace available with active AI intelligence.";
      } else if (heuristicResults.heuristicScore >= 35) {
        executiveSummary = "Suspicious communication detected with moderate anomaly indicators. Discrepancies identified in recruiter authentication, domain alignment, or compensation structure.";
        reasoningTrace = "Heuristic engine identified unverified domain attributes or unconventional hiring/security language that deviates from corporate norms.";
        deltaExplanation = "Moderate threat triggers detected across procedural and identity categories.";
      } else {
        executiveSummary = "Document conforms closely to standard corporate communication baselines with no aggressive financial coercion, fake check demands, or anomalous redirect links.";
        reasoningTrace = "Document structure incorporates conventional business terminology, formal timelines, and lacks advance-fee demands.";
        deltaExplanation = "Heuristic scan detected zero critical fraud patterns.";
      }
    }

    // Calculate final calibrated threat score clamped to [0, 100]
    const finalThreatScore = Math.max(0, Math.min(100, heuristicResults.heuristicScore + llmAdjustment));

    let riskLevel: "Legitimate / Safe" | "Low Risk" | "Suspicious" | "High Threat" | "Critical Fraud" = "Suspicious";
    if (finalThreatScore <= 15) {
      riskLevel = "Legitimate / Safe";
    } else if (finalThreatScore <= 35) {
      riskLevel = "Low Risk";
    } else if (finalThreatScore <= 65) {
      riskLevel = "Suspicious";
    } else if (finalThreatScore <= 85) {
      riskLevel = "High Threat";
    } else {
      riskLevel = "Critical Fraud";
    }

    const scanResult = {
      id: `scan_${Date.now()}`,
      timestamp: new Date().toISOString(),
      threatScore: finalThreatScore,
      heuristicScore: heuristicResults.heuristicScore,
      llmAdjustment,
      riskLevel,
      confidence: aiConfidence,
      executiveSummary,
      reasoningTrace,
      deltaExplanation,
      detectedFlags: heuristicResults.detectedFlags,
      missingElements: heuristicResults.missingElements,
      comparisonBaseline: heuristicResults.comparisonBaseline,
      domainVerifications: heuristicResults.domainVerifications,
      recommendedActions: heuristicResults.recommendedActions,
      scannedText: text,
      senderEmail,
      companyUrl,
      aiPowered,
    };

    return res.json(scanResult);
  } catch (error: any) {
    console.error("Scan processing error:", error);
    return res.status(500).json({ error: error?.message || "Internal scanning error" });
  }
});

// Vite middleware and static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PhishGuard AI Server active on port ${PORT}`);
  });
}

startServer();
