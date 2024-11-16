import { dmSerifText } from "@/app/shared/fonts";
import Image from "next/image";

export function AppCard({ img, title, description }: { img: string, title: string, description: string }) {
    return <div className="w-1/3 flex flex-col gap-2 flex-between p-4 border-t border-mediumGreen rounded-lg h-[200px]">
        <Image src={`/apps/${img}`} alt='logo' width={20} height={20} className='rounded-lg' />
        <h3 className={`${dmSerifText.className} text-md font-bold`}>{title}</h3>
        <p className={`text-sm`}>{description}</p>
    </div>
}