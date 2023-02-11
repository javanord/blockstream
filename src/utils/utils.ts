import { Wallet } from "src/models/wallet.model";

export const findCurrency = (userWallet: Wallet, currencyCode: string, amount: number, transType: string): Wallet => {
    console.log('##utils', userWallet, transType, currencyCode, amount);
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
        case 'USD':
            const updatedAmountUSD = userWallet.usd + amount;
            if (updatedAmountUSD >= 0) {
                userWallet.usd = updatedAmountUSD
            } else {
                userWallet.usd = 0;
            }
            return userWallet;
        default:
            return userWallet;
    }
}