import { dmSerifText } from "@/app/shared/fonts";
import { Button, Link } from "@nextui-org/react";
import { CircleAlert, CircleAlertIcon } from 'lucide-react';

interface NoSafeErrorDisplay {
    changeDisplay: (page: string) => void;
}

export function NoSafeErrorDisplay({ changeDisplay }: NoSafeErrorDisplay) {
    return (<div className='w-3/4 min-h-screen flex flex-col gap-12 m-auto'>
        <div className="flex flex-col gap-6">
            <CircleAlert className="text-lightGreen" size={36} strokeWidth={1.5} />
            <h1 className={`${dmSerifText.className} text-lightGreen text-3xl `}>No SafeWallet found.</h1>
        </div>
        <div className="flex gap-2">
            <Button className='bg-lightGreen text-darkGreen font-bold w-1/2'>Add</Button>
            <Link className="text-lightGreen w-1/2 flex justify-center" onClick={() => changeDisplay('welcome')}>Back</Link>
        </div>
    </div>);
}