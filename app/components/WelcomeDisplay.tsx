import { Button, Link } from '@nextui-org/react';
import { dmSerifText } from '../shared/fonts';
import WebApp from '@twa-dev/sdk';
import { useEffect } from 'react';
import { useDynamicContext, useTelegramLogin } from '@dynamic-labs/sdk-react-core';

interface WelcomeDisplayProps {
    title: string;
    changeDisplay: (page: string) => void;
}

export function WelcomeDisplay({ title, changeDisplay }: WelcomeDisplayProps) {
    return (<div className='w-3/4 flex flex-col gap-12'>
        <h1 className={`${dmSerifText.className} text-lightGreen text-3xl `}>{title}</h1>
        <Button className='bg-lightGreen text-darkGreen font-bold w-full' onClick={() => {
            WebApp.HapticFeedback.impactOccurred('heavy');
            changeDisplay('setup');
        }}>Start</Button>
    </div>);
}