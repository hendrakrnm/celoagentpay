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

function normalizeQueryCasing(query: string): string {
  const letters = query.replace(/[^a-zA-Z]/g, "");
  if (!letters) return query;

  const uppers = (letters.match(/[A-Z]/g) || []).length;
  if (uppers / letters.length > 0.6) {
    // Query is mostly uppercase. Lowercase it, keeping 0x hex addresses unchanged.
    return query
      .split(/\s+/)
      .map((word) => {
        if (word.toLowerCase().startsWith("0x")) {
          return word;
        }
        return word.toLowerCase();
      })
      .join(" ");
  }
  return query;
}

function looseJSONParse(text: string): any {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch (err) {
    // Loose JSON repair: replace single quotes and double quote unquoted keys
    const repaired = trimmed
      .replace(/'/g, '"')
      .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
    return JSON.parse(repaired);
  }
}

function normalizeAgentAction(parsed: any): any {
  if (!parsed || typeof parsed !== "object") return parsed;

  const normalized: any = {};
  for (const key of Object.keys(parsed)) {
    normalized[key.toLowerCase()] = parsed[key];
  }

  const actionValue = normalized.action || normalized.intent;
  const paramsValue = normalized.params || normalized.parameters || {};

  const result: any = {
    action: typeof actionValue === "string" ? actionValue : "clarify",
    params: {},
  };

  const actionLower = result.action.toLowerCase();
  if (actionLower === "sendpayment") result.action = "sendPayment";
  else if (actionLower === "batchsend") result.action = "batchSend";
  else if (actionLower === "creategroup") result.action = "createGroup";
  else if (actionLower === "contribute") result.action = "contribute";
  else if (actionLower === "createschedule") result.action = "createSchedule";
  else if (actionLower === "getbalance") result.action = "getBalance";
  else if (actionLower === "gethistory") result.action = "getHistory";
  else if (actionLower === "swap") result.action = "swap";
  else if (actionLower === "clarify") result.action = "clarify";

  if (paramsValue && typeof paramsValue === "object") {
    const paramsLower: any = {};
    for (const k of Object.keys(paramsValue)) {
      paramsLower[k.toLowerCase()] = paramsValue[k];
    }

    if (result.action === "sendPayment") {
      result.params = {
        to: paramsLower.to || paramsLower.recipient || "",
        amount: Number(paramsLower.amount || 0),
        memo: paramsLower.memo || "",
        token: paramsLower.token || "cUSD",
      };
    } else if (result.action === "batchSend") {
      const payments = Array.isArray(paramsLower.payments)
        ? paramsLower.payments.map((p: any) => {
            const pLower: any = {};
            for (const pk of Object.keys(p)) {
              pLower[pk.toLowerCase()] = p[pk];
            }
            return {
              to: pLower.to || pLower.recipient || "",
              amount: Number(pLower.amount || 0),
            };
          })
        : [];
      result.params = {
        payments,
        token: paramsLower.token || "cUSD",
      };
    } else if (result.action === "createGroup") {
      result.params = {
        recipient: paramsLower.recipient || paramsLower.to || "",
        targetAmount: Number(paramsLower.targetamount || paramsLower.amount || 0),
        description: paramsLower.description || paramsLower.memo || "",
        deadlineHours: Number(paramsLower.deadlinehours || paramsLower.deadline || 168),
        token: paramsLower.token || "cUSD",
      };
    } else if (result.action === "contribute") {
      result.params = {
        groupId: Number(paramsLower.groupid || 0),
        amount: Number(paramsLower.amount || 0),
        token: paramsLower.token || "cUSD",
      };
    } else if (result.action === "createSchedule") {
      result.params = {
        recipient: paramsLower.recipient || paramsLower.to || "",
        amount: Number(paramsLower.amount || 0),
        intervalDays: Number(paramsLower.intervaldays || paramsLower.interval || 1),
        memo: paramsLower.memo || "",
        token: paramsLower.token || "cUSD",
      };
    } else if (result.action === "getBalance") {
      result.params = {
        token: paramsLower.token,
      };
    } else if (result.action === "swap") {
      result.params = {
        fromToken: paramsLower.fromtoken || paramsLower.from || "",
        toToken: paramsLower.totoken || paramsLower.to || "",
        amount: Number(paramsLower.amount || 0),
      };
    }
  }

  if (result.params) {
    if (typeof result.params.token === "string") {
      const t = result.params.token.toUpperCase();
      if (t === "CELO") result.params.token = "CELO";
      else if (t === "CUSD") result.params.token = "cUSD";
      else if (t === "CEUR") result.params.token = "cEUR";
      else if (t === "CREAL") result.params.token = "cREAL";
    }
    if (typeof result.params.fromToken === "string") {
      const t = result.params.fromToken.toUpperCase();
      if (t === "CELO") result.params.fromToken = "CELO";
      else if (t === "CUSD") result.params.fromToken = "cUSD";
      else if (t === "CEUR") result.params.fromToken = "cEUR";
      else if (t === "CREAL") result.params.fromToken = "cREAL";
    }
    if (typeof result.params.toToken === "string") {
      const t = result.params.toToken.toUpperCase();
      if (t === "CELO") result.params.toToken = "CELO";
      else if (t === "CUSD") result.params.toToken = "cUSD";
      else if (t === "CEUR") result.params.toToken = "cEUR";
      else if (t === "CREAL") result.params.toToken = "cREAL";
    }
  }

  if (result.action === "clarify") {
    result.message = normalized.message || normalized.msg || "Coba ulangi dengan lebih spesifik.";
  }

  return result;
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

    // Pre-process uppercase commands while preserving hex addresses
    const normalizedMessage = normalizeQueryCasing(message);

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: normalizedMessage },
      ],
      temperature: 0.1,
      max_tokens: 512,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    
    // Robust JSON extraction from the LLM output
    let cleaned = raw.trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      cleaned = cleaned.substring(start, end + 1);
    } else {
      // Fallback: strip standard markdown blocks
      cleaned = cleaned.replace(/```json/gi, "").replace(/```/g, "").trim();
    }

    try {
      const parsed = looseJSONParse(cleaned);
      const normalizedAction = normalizeAgentAction(parsed);
      return NextResponse.json(normalizedAction);
    } catch (err) {
      console.error("Failed to parse LLM output:", raw, err);
      
      const isEnglish = /\b(send|pay|check|balance|history|split|schedule|hi|hello|hey|welcome)\b/i.test(message);
      const fallbackMsg = isEnglish
        ? "Please try again with more details. Example: 'send 5 cUSD to 0x123...'"
        : "Coba ulangi dengan lebih spesifik. Contoh: 'kirim 5 cUSD ke 0x123...'";

      return NextResponse.json({
        action: "clarify",
        message: fallbackMsg,
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
