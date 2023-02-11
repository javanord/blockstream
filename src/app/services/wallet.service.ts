import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CurrencyAmount } from 'src/models/currencyamount.model';
import { Wallet } from 'src/models/wallet.model';
import { WalletDetails } from 'src/models/walletdetails.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  userWallet = new BehaviorSubject<Wallet>({
    inr: 0,
    gbp: 0,
    usd: 0
  })

  currencyAmount = new BehaviorSubject<CurrencyAmount>({
    currencyCode: '',
    amount: 0,
  });

  userId = new BehaviorSubject<string>('');

  getUserWalletDetails(userId: string) {
    return this.httpClient.get(`${this.baseUrl}/wallets/${userId}`);
  }

  getUserWalletsDetails() {
    return this.httpClient.get(`${this.baseUrl}/wallets`, {headers: {
      'Authorization':
      'Bearer ' + localStorage.getItem('token')
    }});
  }
}
