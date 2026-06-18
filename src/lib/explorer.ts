import { IS_TESTNET } from "./celo";

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string; // formatted decimal string
  tokenSymbol: string;
  timestamp: number; // unix timestamp in seconds
  isOut: boolean;
  explorerUrl: string;
}

const EXPLORER_BASE = IS_TESTNET
  ? "https://celo-sepolia.blockscout.com"
  : "https://celo.blockscout.com";

interface RawExplorerTx {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  isError?: string;
  tokenSymbol?: string;
  tokenDecimal?: string;
}

export async function fetchTransactionHistory(address: string): Promise<Transaction[]> {
  if (!address) return [];

  const lowerAddress = address.toLowerCase();
  const txlistUrl = `${EXPLORER_BASE}/api?module=account&action=txlist&address=${address}&sort=desc`;
  const tokentxUrl = `${EXPLORER_BASE}/api?module=account&action=tokentx&address=${address}&sort=desc`;

  try {
    // Fetch native CELO transfers and ERC20 token transfers in parallel
    const [nativeRes, tokenRes] = await Promise.all([
      fetch(txlistUrl).then((r) => r.json()).catch((e) => {
        console.error("Failed to fetch native txs", e);
        return { result: [] };
      }),
      fetch(tokentxUrl).then((r) => r.json()).catch((e) => {
        console.error("Failed to fetch token txs", e);
        return { result: [] };
      }),
    ]);

    const nativeList: RawExplorerTx[] = Array.isArray(nativeRes?.result) ? nativeRes.result : [];
    const tokenList: RawExplorerTx[] = Array.isArray(tokenRes?.result) ? tokenRes.result : [];

    const formattedTxs: Transaction[] = [];

    // Process Native CELO transactions
    for (const tx of nativeList) {
      // Filter out transaction failures or 0-value contract interactions
      if (tx.isError === "1" || tx.value === "0" || !tx.value) {
        continue;
      }

      const valBigInt = BigInt(tx.value);
      // CELO has 18 decimals
      const formattedValue = (Number(valBigInt) / 1e18).toFixed(4);

      formattedTxs.push({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: parseFloat(formattedValue).toString(), // Remove trailing zeros
        tokenSymbol: "CELO",
        timestamp: parseInt(tx.timeStamp, 10),
        isOut: tx.from.toLowerCase() === lowerAddress,
        explorerUrl: `${EXPLORER_BASE}/tx/${tx.hash}`,
      });
    }

    // Process Token transactions (cUSD, cEUR, cREAL, etc.)
    for (const tx of tokenList) {
      if (!tx.value || tx.value === "0") continue;

      const decimals = parseInt(tx.tokenDecimal || "18", 10);
      const divider = Math.pow(10, decimals);
      const valBigInt = BigInt(tx.value);
      const formattedValue = (Number(valBigInt) / divider).toFixed(4);

      formattedTxs.push({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: parseFloat(formattedValue).toString(), // Remove trailing zeros
        tokenSymbol: tx.tokenSymbol || "Unknown",
        timestamp: parseInt(tx.timeStamp, 10),
        isOut: tx.from.toLowerCase() === lowerAddress,
        explorerUrl: `${EXPLORER_BASE}/tx/${tx.hash}`,
      });
    }

    // Sort combined transactions by timestamp descending
    return formattedTxs.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    throw error;
  }
}
