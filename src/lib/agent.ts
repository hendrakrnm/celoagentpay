export type AgentAction =
  | { action: "sendPayment"; params: { to: string; amount: number; memo: string } }
  | { action: "batchSend"; params: { payments: { to: string; amount: number }[] } }
  | { action: "createGroup"; params: { recipient: string; targetAmount: number; description: string; deadlineHours: number } }
  | { action: "contribute"; params: { groupId: number; amount: number } }
  | { action: "createSchedule"; params: { recipient: string; amount: number; intervalDays: number; memo: string } }
  | { action: "getBalance"; params: Record<string, never> }
  | { action: "getHistory"; params: Record<string, never> }
  | { action: "clarify"; message: string };

const SYSTEM_PROMPT = `You are a crypto payment assistant for Celo blockchain. Parse the user's message and return ONLY a valid JSON object — no explanation, no markdown, no code blocks.

Supported actions:
- sendPayment: send cUSD to one address
- batchSend: send cUSD to multiple addresses (split bill)
- createGroup: create a collaborative payment pool
- contribute: join/contribute to an existing group by groupId
- createSchedule: set up a recurring payment
- getBalance: check wallet balance
- getHistory: show recent transactions

JSON schema to return:
{
  "action": "<one of the above>",
  "params": {
    // sendPayment:
    "to": "0x...",
    "amount": <number in cUSD>,
    "memo": "<string>",

    // batchSend:
    "payments": [{ "to": "0x...", "amount": <number> }],

    // createGroup:
    "recipient": "0x...",
    "targetAmount": <number>,
    "description": "<string>",
    "deadlineHours": <number, default 168>,

    // contribute:
    "groupId": <number>,
    "amount": <number>,

    // createSchedule:
    "recipient": "0x...",
    "amount": <number>,
    "intervalDays": <number>,
    "memo": "<string>"
  },
  "confidence": <0.0 to 1.0>
}

If unclear or missing required info, return:
{ "action": "clarify", "message": "<ask the user what's missing>" }

Rules:
- amounts are always in cUSD (NOT wei)
- addresses must start with 0x
- if user says "split X between A, B, C" → batchSend with equal amounts
- if user says "every week/month/day" → createSchedule with intervalDays
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
