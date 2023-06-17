import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';

export default function MainLayout(props) {
    const [openOptions, setOpenOptions] = useState(false);
    const { address } = useAccount();
    const router = useRouter();

    useEffect(() => {
        if (!address) {
            router.push('/');
        }
    }, [address]);

    const toggleShowOptions = () => {
        setOpenOptions((prev) => !prev);
    };

    return (
        <div className="flex flex-col bg-fondoImg bg-no-repeat bg-fixed bg-cover min-h-screen w-screen">
            <ToastContainer />
            <header className="flex flex-col gap-3 md:flex-row md:gap-0 justify-around items-center bg-green-800 bg-opacity-70 py-2">
                <div className="hidden items-center gap-6 md:flex">
                    <a href="https://discord.com/" target="_blank">
                        <img
                            src="https://cdn.logojoy.com/wp-content/uploads/20210422104926/Discord-Logo-White.png"
                            alt="Discord Icon"
                            className="h-14 w-14"
                        />
                    </a>
                    <a href="https://twitter.com/?lang=es" target="_blank">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/81/81725.png"
                            alt="Twitter Icon"
                            className="invert h-10 w-10"
                        />
                    </a>
                    <a href="https://www.youtube.com/" target="_blank">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/49/49411.png"
                            alt="Youtube Icon"
                            className="w-11 invert"
                        />
                    </a>
                </div>
                <div className="text-center flex flex-col gap-1">
                    <p className="text-4xl font-bold tracking-wider">SPORTSBOOK</p>
                    <p className="bg-orange-600 px-3">SOCIAL, MATCHMAKING AND BETTING APP</p>
                </div>
                <ConnectButton chainStatus="none" />
            </header>
            <main className="flex flex-1 flex-col md:flex-row w-full py-8 px-4 md:p-8 gap-8 backdrop-brightness-50">
                <aside className="md:w-1/4 flex items-center flex-col w-full gap-8">
                    <div className="flex justify-center w-full md:flex-col gap-8">
                        <button className="bg-lime-600 rounded-full text-2xl py-2 px-4 md:px-0">Social</button>
                        <button className="bg-orange-600 rounded-full text-2xl py-2 px-4 md:px-0">Matchmaking</button>
                    </div>
                    <button
                        onClick={toggleShowOptions}
                        className="block md:hidden bg-black bg-opacity-50 w-full py-3 text-xl relative"
                    >
                        Options <span>{openOptions ? '▼' : '►'}</span>
                    </button>
                    {openOptions && (
                        <div className="flex flex-col gap-8 md:hidden">
                            <Link href="/newMatch" className="text-2xl flex gap-8">
                                <span className="block w-14 text-center">&#9658;</span>
                                <span>New Match</span>
                            </Link>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src="http://cdn.onlinewebfonts.com/svg/img_500848.png"
                                        alt="Question Img"
                                        className="w-14 invert"
                                    />
                                    <div className="w-4 h-4 bg-red-500 rounded-full absolute -right-1 bottom-1"></div>
                                </div>
                                <Link href="/acceptOrDecline" className="text-2xl">
                                    Accept/Decline
                                </Link>
                            </div>
                            <div className="flex items-center gap-4">
                                <img
                                    src="https://cdn1.iconfinder.com/data/icons/material-core/21/history-512.png"
                                    alt="History Icon"
                                    className="invert w-14"
                                />
                                <Link href="/history" className="text-2xl">
                                    History
                                </Link>
                            </div>
                        </div>
                    )}
                    <div className="hidden md:flex md:flex-col gap-8">
                        <Link href="/newMatch" className="text-2xl flex gap-8">
                            <span className="block w-14 text-center">&#9658;</span>
                            <span>New Match</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src="http://cdn.onlinewebfonts.com/svg/img_500848.png"
                                    alt="Question Img"
                                    className="w-14 invert"
                                />
                                <div className="w-4 h-4 bg-red-500 rounded-full absolute -right-1 bottom-1"></div>
                            </div>
                            <Link href="/acceptOrDecline" className="text-2xl">
                                Accept/Decline
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <img
                                src="https://cdn1.iconfinder.com/data/icons/material-core/21/history-512.png"
                                alt="History Icon"
                                className="invert w-14"
                            />
                            <Link href="/history" className="text-2xl">
                                History
                            </Link>
                        </div>
                    </div>
                </aside>
                <div className="bg-black bg-opacity-60 rounded-3xl py-8 w-full px-4 md:px-8">{props.children}</div>
            </main>
        </div>
    );
}
