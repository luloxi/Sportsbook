// import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import "./theme/styles.css";

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.hardhat,
    // chain.goerli,
    // chain.mainnet,
    // chain.polygon,
    // chain.optimism,
    // chain.arbitrum,
    // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
    //   ? [chain.goerli]
    //   : []),
  ],
  [
    alchemyProvider({
      apiKey: "rqT_KFKGdRBE32ilCs08Lbo4V5kFWL3A",
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
