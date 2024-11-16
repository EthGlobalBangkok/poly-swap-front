
import { dmSerifText } from '../shared/fonts';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';


export function WelcomeDisplay() {
    return (<div className='w-3/4 flex flex-col gap-12'>
        <h1 className={`${dmSerifText.className} text-lightGreen text-3xl `}>PolySwap</h1>
        <h2 className='text-2xl'>Build automated swaps strategies from polymarket</h2>
        <DynamicWidget />
    </div>);
}