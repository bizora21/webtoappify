import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePrivacyPolicy = async (appName: string, url: string): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `
      You are a legal compliance expert for mobile applications.
      Write a concise, standard Privacy Policy markdown text for an Android application named "${appName}" 
      that wraps the website "${url}" using Trusted Web Activity technology.
      
      Include sections for:
      1. Introduction
      2. Data Collection (mentioning standard web logs)
      3. Cookies
      4. Contact Information
      
      Keep it professional but concise (under 300 words).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate policy.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate privacy policy via AI.");
  }
};