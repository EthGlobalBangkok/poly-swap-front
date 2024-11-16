'use client';

import { useEffect, useState } from 'react';
import { Button, Link } from "@nextui-org/react";
import Image from "next/image";
import { dmSerifText } from "../shared/fonts";
import WebApp from "@twa-dev/sdk";
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export default function SendDisplay({ toAddress, amount, fromChain }: { toAddress: string, amount: number, fromChain: number }) {
    const { primaryWallet } = useDynamicContext();

    const [transaction, setTransaction] = useState({
        amountInUSD: amount,
        direction: 'out',
        chainId: fromChain,
        to: {
            username: 'pybast',
            address: toAddress
        }
    });

    async function signMessage(fromAddress: string, toAddress: string, fromChain: number, toChain: number, amountInWei: number) {
        if (!primaryWallet) return;

        let signature;

        try {
            signature = await primaryWallet.signMessage(`${fromAddress}-${toAddress}-${fromChain}-${toChain}-${amountInWei}`);
        } catch (err) {
            // TODO Set error handling
        }

        // TODO Do something with the signature
        WebApp.showPopup({
            title: 'Signature',
            message: signature ?? 'Error'
        })
    }

    return (
        <div className='p-4 m-auto'>
            <div className="w-full flex flex-col gap-4 justify-between">
                <div>
                    <h1 className={`${dmSerifText.className} text-2xl`}>Confirm transaction?</h1>
                    <h2 className={`${dmSerifText.className} ${transaction.direction === 'out' ? 'text-lightRed' : 'text-mediumGreen'} text-3xl`}>{transaction.direction === 'out' ? '-' : '+'}${transaction.amountInUSD}</h2>
                </div>
                <div className="flex gap-2">
                    <h4>To</h4>
                    <div className="w-1/2 rounded-xl flex gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <p className="text-md">@{transaction.to.username} on</p>
                            <Image src={'/chains/ethereum.svg'} alt="Ethereum" width={10} height={10} />
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link className='w-full w-1/2' onClick={() => {
                        WebApp.HapticFeedback.impactOccurred('heavy');
                        signMessage('0x1', '0x2', 1, 2, 1000);
                    }}><Button className='bg-darkGreen text-lightGreen font-bold w-full'>Send</Button></Link>
                    <Link className="text-darkGreen w-1/2 flex justify-center" onClick={() => { WebApp.HapticFeedback.impactOccurred('light'); }}>Back</Link>
                </div>
            </div>
        </div>
    );
}
