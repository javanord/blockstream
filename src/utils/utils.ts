import { Wallet } from "src/models/wallet.model";

export const findCurrency = (userWallet: Wallet, currencyCode: string, amount: number, transType: string): Wallet => {
    switch(currencyCode) {
        case 'GBP':
            const updatedAmountGBP = userWallet.gbp + amount;
            if (updatedAmountGBP >= 0) {
                userWallet.gbp = updatedAmountGBP
            } else {
                userWallet.gbp = 0;
            }
            return userWallet;
        case 'INR':
            const updatedAmountINR = userWallet.inr + amount;
            if (updatedAmountINR >= 0) {
                userWallet.inr = updatedAmountINR
            } else {
                userWallet.inr = 0;
            }
            return userWallet;
        default:
            return userWallet;
    }
}

export const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

export const updateWallet = (walletDetails: any[]): Wallet => {
    const updatedWallet = walletDetails.reduce((acc, item) => {
        const { currencyCode, amount } = item;
        switch(currencyCode) {
            case 'GBP':
                const updatedAmountGBP = acc.gbp + amount;
                acc.gbp = updatedAmountGBP;
                return acc;
            case 'INR':
                const updatedAmountINR = acc.inr + amount;
                acc.inr = updatedAmountINR;
                return acc;
            default:
                return acc;
            
        }
    }, {inr: 0, gbp: 0})
    return updatedWallet;
}