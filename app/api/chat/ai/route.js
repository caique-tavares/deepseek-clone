export const maxDuration = 60;
import connectDB from "@/config/db";
import Chat from "@/models/chat";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// const openai = new OpenAI({
//   baseURL: "https://api.deepseek.com",
//   apiKey: process.env.DEEPSEEK_API_KEY,
// });

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { chatId, prompt } = await req.json();

    await connectDB();
    const data = await Chat.findOne({ userId, _id: chatId });

    const userPrompt = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    data.messages.push(userPrompt);

    // const completion = await openai.chat.completions.create({
    //   messages: [{ role: "user", content: prompt }],
    //   model: "deepseek-chat",
    //   store: true,
    // });
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash", // ou "gemini-1.5-pro" se quiser
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    // const message = result.response.candidates[0].content.parts[0].text;
    // const message = result.candidates[0].content.text;
    const message = result.candidates[0].content.parts[0].text;

    const aiMessage = {
      role: "assistant",
      content: message,
      timestamp: Date.now(),
    };

    data.messages.push(aiMessage);

    data.save();

    return NextResponse.json({ success: true, data: aiMessage });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
