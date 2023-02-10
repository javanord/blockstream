import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WalletI } from '../models/wallet';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  userWallet = new BehaviorSubject<WalletI>({
    inr: '',
    gbp: '',
    usd: ''
  })

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
