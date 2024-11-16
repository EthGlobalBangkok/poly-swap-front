import { Token } from "../../../types/token";

interface SetupDisplayProps {
    tokens: Token[];
    click: (token: Token | null) => void;
}

export default function SetupDisplay({ tokens, click: changeDisplay }: SetupDisplayProps) {
    
    return (
        <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
                <button className='text-2xl' onClick={() => changeDisplay(null)}>Back</button>
            </div>
            <div className='flex flex-col gap-2'>
                <h1 className='text-4xl'>Setup</h1>
                <h2 className='text-2xl'>Select the tokens you want to manage</h2>
                <div className='flex flex-col gap-2'>
                    {tokens.map((token) => (
                        <div key={token.chainId} className='flex items-center gap-2' onClick={() => changeDisplay(token)}>
                            <img src={token.logo} alt={token.chainId.toString()} className='w-8 h-8' />
                            <span>{token.chainId}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}