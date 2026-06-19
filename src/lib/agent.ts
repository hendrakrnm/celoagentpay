export type AgentAction =
  | { action: "sendPayment"; params: { to: string; amount: number; memo: string; token: string } }
  | { action: "batchSend"; params: { payments: { to: string; amount: number }[]; token: string } }
  | { action: "createGroup"; params: { recipient: string; targetAmount: number; description: string; deadlineHours: number; token: string } }
  | { action: "contribute"; params: { groupId: number; amount: number; token: string } }
  | { action: "createSchedule"; params: { recipient: string; amount: number; intervalDays: number; memo: string; token: string } }
  | { action: "getBalance"; params: { token?: string } }
  | { action: "getHistory"; params: Record<string, never> }
  | { action: "receive"; params?: Record<string, never> }
  | { action: "clarify"; message: string };

const SYSTEM_PROMPT = `You are a crypto payment assistant for Celo blockchain. Parse the user's message and return ONLY a valid JSON object — no explanation, no markdown, no code blocks.

Supported tokens: CELO, cUSD, cEUR, cREAL. Default to cUSD if not specified.

Supported actions:
- sendPayment: send tokens to one address
- batchSend: send tokens to multiple addresses (split bill)
- createGroup: create a collaborative payment pool
- contribute: join/contribute to an existing group by groupId
- createSchedule: set up a recurring payment
- getBalance: check wallet balance (optionally for a specific token)
- getHistory: show recent transactions
- receive: request payment, receive tokens, or display user's wallet address and QR code

JSON schema to return:
{
  "action": "<one of the above>",
  "params": {
    // sendPayment:
    "to": "0x...",
    "amount": <number>,
    "memo": "<string>",
    "token": "<CELO|cUSD|cEUR|cREAL>",

    // batchSend:
    "payments": [{ "to": "0x...", "amount": <number> }],
    "token": "<CELO|cUSD|cEUR|cREAL>",

    // createGroup:
    "recipient": "0x...",
    "targetAmount": <number>,
    "description": "<string>",
    "deadlineHours": <number, default 168>,
    "token": "<CELO|cUSD|cEUR|cREAL>",

    // contribute:
    "groupId": <number>,
    "amount": <number>,
    "token": "<CELO|cUSD|cEUR|cREAL>",

    // createSchedule:
    "recipient": "0x...",
    "amount": <number>,
    "intervalDays": <number>,
    "memo": "<string>",
    "token": "<CELO|cUSD|cEUR|cREAL>",

    // getBalance (optional):
    "token": "<CELO|cUSD|cEUR|cREAL>"
  },
  "confidence": <0.0 to 1.0>
}

If unclear or missing required info, return:
{ "action": "clarify", "message": "<ask the user what's missing>" }

Rules:
- amounts are in token units (NOT wei)
- addresses must start with 0x
- detect token from message: "5 CELO" → CELO, "10 cEUR" → cEUR, "2 cREAL" → cREAL, default → cUSD
- if user says "split X between A, B, C" → batchSend with equal amounts
- if user says "every week/month/day" → createSchedule with intervalDays
- if the user wants to receive money, request payment, or show their QR code/address (e.g. "receive 10 CELO from 0x...", "minta 5 cUSD dari 0x...", "request payment", "show address", "terima uang") → return action: "receive"
- if the user asks about your capabilities, what you can do, or asks for help/instructions (e.g. "what can you do?", "help", "action apa saja?", "bisa melakukan apa saja?", "fitur apa saja?"), return action "clarify" with a friendly, detailed and structured bulleted list of all supported actions (Send Payment, Split Bill/Batch Send, Group Payment, Schedule Payment, Check Balance, Receive Payment, and History) with usage examples, in the same language the user used.
- respond in the same language the user used`;

export async function parseIntent(userMessage: string): Promise<AgentAction> {
  const res = await fetch("/api/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage }),
  });

  if (!res.ok) {
    throw new Error(`Agent API error: ${res.status}`);
  }

  return res.json();
}

export { SYSTEM_PROMPT };
