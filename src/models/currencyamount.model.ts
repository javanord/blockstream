export interface CurrencyAmount {
    currencyCode: string;
    amount: number;
    transType?: 'deposit' | 'withdraw'; 
}