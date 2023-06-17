import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useFilterMatches } from '../../hooks/useFilterMatches';

export default function History() {
    const [openDetails, setOpenDetails] = useState(null);
    const [data, setData] = useState(null);
    const { dataFiltered } = useFilterMatches('PENDING');

    useEffect(() => {
        setData(dataFiltered);
        console.log(dataFiltered);
    }, [dataFiltered]);

    const handleOpenDetails = (index) => {
        if (openDetails === index) {
            setOpenDetails(null);
        } else {
            setOpenDetails(index);
        }
    };

    return (
        <MainLayout>
            <div className="w-full  overflow-hidden overflow-x-scroll md:overflow-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="border-b-4 text-2xl">
                            <th className="px-5 md:px-0"></th>
                            <th className="px-5 md:px-0">Date</th>
                            <th className="px-5 md:px-0">Time</th>
                            <th className="px-5 md:px-0">Location</th>
                            <th className="px-5 md:px-0">Fee</th>
                            <th className="px-5 md:px-0">Bet?</th>
                        </tr>
                    </thead>
                    <tbody className="text-center text-2xl">
                        {!!dataFiltered ? (
                            dataFiltered.map((match, index) => (
                                <>
                                    <tr key={index} className="cursor-pointer" onClick={() => handleOpenDetails(index)}>
                                        <td className="flex justify-between font-bold py-3">
                                            {openDetails === index ? <span>▼</span> : <span>►</span>}
                                            <p>{`${match.team1.substring(0, 4)}...${match.team1.substring(
                                                match.team1.length - 4
                                            )}`}</p>
                                        </td>
                                        <td className="text-orange-500">22/09/22</td>
                                        <td className="text-orange-500">19:00</td>
                                        <td className="text-orange-500">Lujan Club</td>
                                        <td className="font-bold">$100</td>
                                        <td className="text-lime-500 font-bold">
                                            {`${parseInt(match.amount._hex) / 1000000000000000000} MATIC`}
                                        </td>
                                    </tr>
                                    {openDetails === index && (
                                        <tr key={index + index} className="bg-neutral-500 text-white">
                                            <td className="flex flex-col gap-3 p-3 px-5 md:px-3">
                                                <div>
                                                    <p>
                                                        Sport: <span className="font-semibold">Football</span>
                                                    </p>
                                                </div>
                                                <div className="flex justify-evenly">
                                                    <div>
                                                        <p>K. SHARKS</p>
                                                        <p className="font-bold text-4xl">3</p>
                                                    </div>

                                                    <div>
                                                        <p>L.I. DOLPHINS</p>
                                                        <p className="font-bold text-4xl">1</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 font-semibold">
                                                <p className="text-center">Goals</p>
                                                <ul>
                                                    <li>C. Richards 13'</li>
                                                    <li>R. Kaufman 25'</li>
                                                    <li>M. Rastafa 62'</li>
                                                    <li>G. Gaizen 78'</li>
                                                </ul>
                                            </td>
                                            <td></td>
                                            <td>
                                                <button className="bg-orange-600 px-5 py-1 rounded-full hover:bg-orange-700 transition-colors">
                                                    Rematch!
                                                </button>
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    )}
                                </>
                            ))
                        ) : (
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                No matches found
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}
