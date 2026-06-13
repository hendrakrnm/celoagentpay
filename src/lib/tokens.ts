// Token registry for Celo Sepolia testnet (chainId 11142220)
// Mainnet addresses follow the same symbols but different addresses
export type TokenSymbol = "CELO" | "cUSD" | "cEUR" | "cREAL";

export interface Token {
  symbol: TokenSymbol;
  name: string;
  address: `0x${string}` | null; // null = native CELO
  decimals: number;
  isNative: boolean;
  emoji: string;
}

export const TOKENS_SEPOLIA: Record<TokenSymbol, Token> = {
  CELO: {
    symbol: "CELO",
    name: "Celo",
    address: null,
    decimals: 18,
    isNative: true,
    emoji: "🟡",
  },
  cUSD: {
    symbol: "cUSD",
    name: "Celo Dollar",
    address: "0xEF4d55D6dE8e8d73232827Cd1e9b2F2dBb45bC80",
    decimals: 18,
    isNative: false,
    emoji: "💵",
  },
  cEUR: {
    symbol: "cEUR",
    name: "Celo Euro",
    address: "0x6B172e333e2978484261D7eCC3DE491E79764BbC",
    decimals: 18,
    isNative: false,
    emoji: "💶",
  },
  cREAL: {
    symbol: "cREAL",
    name: "Celo Real",
    address: "0x13d68A1Bf4a8cB7d9feF54EF70401871b666269c",
    decimals: 18,
    isNative: false,
    emoji: "💴",
  },
};

export const TOKENS_MAINNET: Record<TokenSymbol, Token> = {
  CELO: { symbol: "CELO", name: "Celo", address: null, decimals: 18, isNative: true, emoji: "🟡" },
  cUSD: {
    symbol: "cUSD",
    name: "Celo Dollar",
    address: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
    decimals: 18,
    isNative: false,
    emoji: "💵",
  },
  cEUR: {
    symbol: "cEUR",
    name: "Celo Euro",
    address: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
    decimals: 18,
    isNative: false,
    emoji: "💶",
  },
  cREAL: {
    symbol: "cREAL",
    name: "Celo Real",
    address: "0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787",
    decimals: 18,
    isNative: false,
    emoji: "💴",
  },
};

const IS_TESTNET = process.env.NEXT_PUBLIC_NETWORK !== "mainnet";
export const TOKENS: Record<TokenSymbol, Token> = IS_TESTNET ? TOKENS_SEPOLIA : TOKENS_MAINNET;

export function getToken(symbol: string): Token {
  const key = symbol.toUpperCase() as TokenSymbol;
  return TOKENS[key] ?? TOKENS.cUSD;
}

export const TOKEN_SYMBOLS = Object.keys(TOKENS) as TokenSymbol[];
