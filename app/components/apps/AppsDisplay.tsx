'use client';

import { Safe } from "../../../types/token";
import Image from "next/image";
import { dmSerifText } from "../../shared/fonts";
import { AppCard } from "./components/AppCard";

export default function AppsDisplay() {
    return (
        <div className='p-4'>
            <div className="w-full flex flex-wrap items-center justify-center gap-4">
                <AppCard img={"bitrefill.png"} title={"Bitregill"} description={"Stake to confirm your participation."} />
                <AppCard img={"ethglobal.jpg"} title={"ETHGlobal"} description={"Stake for ETHGlobal San Franscico 2024."} />
                <AppCard img={"gnosis_pay.png"} title={"Gnosis Pay"} description={"Tap up your Gnosis Card."} />
                <AppCard img={"ens.png"} title={"ENS"} description={"Register your .eth."} />
                <AppCard img={"request.png"} title={"Request"} description={"Pay your bills in one click."} />
                <AppCard img={"ledger.png"} title={"Ledger"} description={"Connect your hardware wallet."} />
            </div>
        </div>
    );
}
