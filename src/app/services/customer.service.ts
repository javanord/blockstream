import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCurrencies() {
    return this.http.get(`${this.baseUrl}/currencies`);
  }

  depositWithdraw(payload: any) {
    return this.http.post(`${this.baseUrl}/wallets`, payload)
  }
}
