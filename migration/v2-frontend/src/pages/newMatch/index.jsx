import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import style from './newMach.module.css';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useAccount } from 'wagmi';
import { ethers, BigNumber } from 'ethers';
import { toast } from 'react-toastify';
import abi from '../../../constants/abi.json';
import contract from '../../../constants/contract';

export default function NewMatch() {
    const [locationProvider, setLocationProvider] = useState('');
    const [challengedTeam, setChallengedTeam] = useState('');
    const [bet, setBet] = useState(0.002);
    const { address } = useAccount();

    // const contractAddress = "0xa3Ce41430f671e0F7BCa3BeE6550dEf2D484C3eD";
    // const contractAddress = '0x29403A5Ce562879e08C22b814F5C1Bd8C0a4dC70';
    const contractAddress = contract;

    const { config } = usePrepareContractWrite({
        address: contractAddress,
        abi: abi,
        functionName: 'createChallenge',
        args: [
            challengedTeam,
            locationProvider,
            // BigNumber.from(uint256 variable),
            {
                value: ethers.utils.parseEther(bet.toString()),
            },
        ],
    });

    const { data, write, error } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    const onChangeLocationProvider = (e) => {
        setLocationProvider(e.target.value);
    };

    const onChangeChallengedTeam = (e) => {
        setChallengedTeam(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (bet >= 0.002) {
            write?.();
        }
    };

    useEffect(() => {
        if (isLoading) {
            toast.info('Cargando creación del challenge', { theme: 'dark' });
        }
        if (isSuccess) {
            toast.success('¡Challenge creado!', { theme: 'dark' });
        }
        if (error) {
            toast.error('¡Ups! Algo salió mal', { theme: 'dark' });
        }
    }, [isLoading, isSuccess, error]);

    return (
        <MainLayout>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className={style.title1}>
                    <h1 className="text-3xl">Create New Match</h1>
                </div>

                <div className={style.names}>
                    <div className={style.mount}>
                        <p className="text-xl">OPPONENT</p>
                        <input
                            type="text"
                            name="rival"
                            placeholder="Opponent's wallet"
                            onChange={(e) => onChangeChallengedTeam(e)}
                            className={style.name}
                        />
                    </div>
                    <div className={style.mount}>
                        <p className="text-xl">REFEREE</p>
                        <input
                            type="text"
                            name="referi"
                            placeholder="Referee's wallet"
                            onChange={(e) => onChangeLocationProvider(e)}
                            className={style.name}
                        />
                    </div>
                </div>
                <div className={style.mount}>
                    <p className="text-xl">BET AMOUNT</p>
                    <input type="text" name="bet" value={bet} onChange={(e) => setBet(e.target.value)} className={style.name} />
                    <span>Minimo 0.002 para crear el challenge</span>
                </div>
                <div className={style.button1}>
                    <button type="submit" className={style.button}>
                        SUBMIT
                    </button>
                </div>
            </form>
        </MainLayout>
    );
}
