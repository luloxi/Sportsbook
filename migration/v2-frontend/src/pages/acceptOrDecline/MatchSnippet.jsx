import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useAccount } from 'wagmi';
import { BigNumber } from 'ethers';

export default function MatchSnippet({ gameData }) {
    const [openDetails, setOpenDetails] = useState(false);
    const [opponent, setOpponent] = useState('');
    const { address } = useAccount();

    const toggleOpenDetails = () => {
        setOpenDetails((prev) => !prev);
    };

    console.log(gameData);

    return (
        <>
            <tr className="cursor-pointer" onClick={toggleOpenDetails}>
                <td className="flex justify-between font-bold py-3">
                    {openDetails ? <span>▼</span> : <span>►</span>}
                    <p>{gameData.team1.slice(0, 8)}</p>
                </td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td className="font-bold">{gameData.locationProvider.slice(0, 8)}</td>
                <td className="text-lime-500 font-bold">{`${parseInt(gameData.amount._hex) / 1000000000000000000} MATIC`}</td>
            </tr>
            {openDetails && (
                <tr className="bg-neutral-500 text-white">
                    <td>
                        <div className="flex flex-col items-center gap-4">
                            <div>
                                <p>Accept</p>
                                <p>Challenge</p>
                            </div>
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/001/186/943/non_2x/green-play-button-png.png"
                                alt="Play Button"
                                className="w-20"
                            />
                        </div>
                    </td>
                    <td>
                        <div className="flex flex-col items-center gap-4">
                            <div>
                                <p>Decline</p>
                                <p>Challenge</p>
                            </div>
                            <div className="w-20 h-20 bg-white rounded-full">
                                <img
                                    src="https://uxwing.com/wp-content/themes/uxwing/download/checkmark-cross/red-x-icon.png"
                                    alt="Reject Button"
                                    className="w-20"
                                />
                            </div>
                        </div>
                    </td>
                    <td></td>
                </tr>
            )}
        </>
    );
}
