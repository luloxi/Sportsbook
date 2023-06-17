import Head from 'next/head';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import football from '../assets/img/football.png';
import basketball from '../assets/img/basketball.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import style from './home.module.css';
import { useState, useEffect } from 'react';

export default function Home() {
    const [showButton, setShowButton] = useState(false);
    const { address } = useAccount();

    useEffect(() => {
        setShowButton(!!address);
    }, [address]);

    return (
        <>
            <Head>
                <title>SPORTSBOOK</title>
                <meta name="description" content="Sportsbook is a dApp" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="bg-fondoImg min-h-screen bg-no-repeat bg-cover bg-fixed ">
                <div className={`${style.container} flex-col md:flex-row`}>
                    <div className={`${style.title1}`}>
                        <h1 className={`${style.title} pr-0 md:pr-16`}>SPORTSBOOK</h1>
                        <div className={style.green}></div>
                    </div>
                    {showButton ? (
                        <Link href="/history" className="bg-orange-600 p-3 text-xl rounded-xl">
                            Launch App
                        </Link>
                    ) : (
                        <ConnectButton />
                    )}
                </div>
                <div className={`${style.sub} ml-0 md:ml-16 pr-0 md:pr-12 text-center md:text-left`}>
                    <h1>SOCIAL, MATCHMAKING AND BETTING DAPP</h1>
                </div>

                <div className="flex flex-col md:flex-row justify-evenly mt-12 gap-12 md:gap-0">
                    <div className={style.img1}>
                        <img src={football.src} alt="football" />
                        <div className={style.center}>
                            <h1>Chat , Share, Collect NFTs</h1>
                            <h2>
                                Find players and teams for the sport you like, share your stats, and showcase your past matches as
                                NFT s!
                            </h2>
                        </div>
                    </div>
                    <div className={style.img1}>
                        <img src={basketball.src} alt="football" />
                        <div className={style.center}>
                            <h1>Challenge another team</h1>
                            <h2>
                                Find and challenge other teams on your area, pay and reserve for location , and bet on the outcome
                                of the match
                            </h2>
                        </div>
                    </div>
                </div>
                <footer className={style.footer}>
                    <img
                        src="https://wows-wowsp-global.gcdn.co/media/ceph-image/30efdfbc-7037-11ea-9a7e-38eaa735f4cc.png"
                        className={style.redes}
                    />
                    <img
                        src="https://www.fgc.cat/wp-content/uploads/2017/07/preview-full-youtube-logo-300x242.png"
                        className={style.redes}
                    />
                    <img src="https://pngimg.com/uploads/twitter/twitter_PNG15.png" className={style.redes} />
                </footer>
            </main>
        </>
    );
}
