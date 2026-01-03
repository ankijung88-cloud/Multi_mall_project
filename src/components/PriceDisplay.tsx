import React from 'react';

const EXCHANGE_RATE = 1450;

interface PriceDisplayProps {
    amount: number;
    className?: string;
    showOriginal?: boolean; // if true, shows just the converted amount in parens, if false shows both
}

export const convertToKrw = (amount: number) => Math.round(amount * EXCHANGE_RATE);

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ amount, className = "" }) => {
    return (
        <span className={className}>
            ${amount.toLocaleString()}
            <span className="text-0.9em text-gray-500 ml-1 font-normal">
                (₩{convertToKrw(amount).toLocaleString()})
            </span>
        </span>
    );
};

export { EXCHANGE_RATE };
