import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/lib/agent";

const MODEL = process.env.GAIA_MODEL || "meta-llama/llama-3.1-8b-instruct";

function createClient() {
  const apiKey = process.env.GAIA_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  return new OpenAI({
    baseURL: process.env.GAIA_API_URL || "https://openrouter.ai/api/v1",
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": "https://celoagentpay.vercel.app",
      "X-Title": "CeloAgentPay",
    },
  });
}

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  }

  try {
    const client = createClient();
    if (!client) {
      return NextResponse.json({
        action: "clarify",
        message: "AI key is not configured. Set GAIA_API_KEY or OPENAI_API_KEY.",
      });
    }

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
