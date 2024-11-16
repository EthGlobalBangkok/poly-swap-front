import { dmSerifText } from '../shared/fonts';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';

export function WelcomeDisplay() {
    return (
        <div className="flex flex-col items-center gap-6">
            {/* Card */}
            <div
                className="w-[188px] h-[270px] rounded-[5px] flex flex-col justify-center items-center text-white"
                style={{
                    background: "linear-gradient(180deg, #DB4E66 0%, #A24688 50%, #4E3ABA 100%)",
                }}
            >
                {/* Circular Icon */}
                <div className="w-8 h-8 bg-white rounded-full mb-4"></div>

                {/* Text Content */}
                <h1 className={`${dmSerifText.className} text-white text-lg`}>PolySwap</h1>
                <p className="text-center text-sm opacity-80">
                    Build automated swap strategy from polymarket
                </p>
            </div>

            {/* Connect Wallet */}
            <DynamicWidget />
        </div>
    );
}
