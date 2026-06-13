import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/lib/agent";

const client = new OpenAI({
  baseURL: process.env.GAIA_API_URL || "https://openrouter.ai/api/v1",
  apiKey: process.env.GAIA_API_KEY || "",
  defaultHeaders: {
    "HTTP-Referer": "https://celoagentpay.vercel.app",
    "X-Title": "CeloAgentPay",
  },
});

const MODEL = process.env.GAIA_MODEL || "meta-llama/llama-3.1-8b-instruct";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  }

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.1,
      max_tokens: 512,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch {
      console.error("Failed to parse LLM output:", raw);
      return NextResponse.json({
        action: "clarify",
        message: "Coba ulangi dengan lebih spesifik. Contoh: 'kirim 5 cUSD ke 0x123...'",
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("AI error:", msg);
    return NextResponse.json({
      action: "clarify",
      message: `AI error: ${msg}`,
    });
  }
}
