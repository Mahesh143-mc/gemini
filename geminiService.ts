
import { GoogleGenAI } from "@google/genai";

// Standard initialization as per guidelines
// Assuming process.env.API_KEY is handled by the platform environment
export const getSafetyAdvice = async (productName: string) => {
  try {
    if (!process.env.API_KEY) throw new Error("API Key missing");
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 3 concise, bullet-pointed safety tips for using this specific type of firework: "${productName}". Keep it celebratory but safety-focused.`,
    });
    return response.text || "Ensure 10-meter distance, keep water nearby, and supervise children.";
  } catch (error) {
    console.warn("Gemini Safety Advice Error:", error);
    return "Standard safety protocol: Maintain distance, use a long taper, and keep water handy.";
  }
};

export const getCelebrationRecommendation = async (occasion: string) => {
  try {
    if (!process.env.API_KEY) throw new Error("API Key missing");

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Recommend a set of 3 types of crackers for a "${occasion}" celebration. Briefly explain why for each.`,
    });
    return response.text || "We recommend Sparklers for kids, Rockets for the grand finale, and Fountains for a continuous glow.";
  } catch (error) {
    console.warn("Gemini Recommendation Error:", error);
    return "Based on your occasion, we recommend a mix of aerial shells and ground fountains.";
  }
};
