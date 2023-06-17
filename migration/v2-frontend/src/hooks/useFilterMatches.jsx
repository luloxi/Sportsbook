import React, { useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';
import { ABI } from '../../constants/abi';
import contract from '../../constants/contract';

export const useFilterMatches = (filter) => {
    const { data, isError, isLoading } = useContractRead({
        address: contract,
        abi: ABI,
        functionName: 'getAllMatches',
    });

    const [dataFiltered, setDataFiltered] = useState([]);

    useEffect(() => {
        if (data) {
            switch (filter) {
                case 'PENDING':
                    data.map((value) => {
                        if (value.matchStatus === 0) {
                            dataFiltered.push(value);
                        }
                    });
                    break;

                case 'ACCEPTED':
                    data.map((value) => {
                        if (value.matchStatus === 1) {
                            dataFiltered.push(value);
                        }
                    });
                    break;

                case 'STARTED':
                    data.map((value) => {
                        if (value.matchStatus === 2) {
                            dataFiltered.push(value);
                        }
                    });
                    break;

                case 'ENDED':
                    data.map((value) => {
                        if (value.matchStatus === 3) {
                            dataFiltered.push(value);
                        }
                    });
                    break;

                default:
                    break;
            }
        }
    }, []);

    return { dataFiltered };
};
