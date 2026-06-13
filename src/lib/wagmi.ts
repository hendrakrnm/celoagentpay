import { createConfig, http } from "wagmi";
import { celo, celoSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const testnetConfig = createConfig({
  chains: [celoSepolia],
  connectors: [injected()],
  transports: { [celoSepolia.id]: http("https://forno.celo-sepolia.celo-testnet.org") },
  ssr: true,
});

const mainnetConfig = createConfig({
  chains: [celo],
  connectors: [injected()],
  transports: { [celo.id]: http("https://forno.celo.org") },
  ssr: true,
});

const IS_TESTNET = process.env.NEXT_PUBLIC_NETWORK !== "mainnet";

export const wagmiConfig = IS_TESTNET ? testnetConfig : mainnetConfig;
