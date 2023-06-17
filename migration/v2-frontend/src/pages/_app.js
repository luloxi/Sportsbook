import '@rainbow-me/rainbowkit/styles.css';

import { darkTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig, chain } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, hardhat, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/globals.css';

const { chains, provider, webSocketProvider } = configureChains(
    [polygonMumbai],
    [
        alchemyProvider({
            apiKey: 'rqT_KFKGdRBE32ilCs08Lbo4V5kFWL3A',
        }),
        publicProvider(),
    ]
);

const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
});

export default function App({ Component, pageProps }) {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
                theme={darkTheme({
                    accentColor: '#ea580c',
                })}
                chains={chains}
            >
                <Component {...pageProps} />
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
