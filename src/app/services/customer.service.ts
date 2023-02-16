import { query } from '@angular/animations';
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
    return this.http.get(`${this.baseUrl}/currencies`, {headers: {
      'Authorization':
      'Bearer ' + localStorage.getItem('token')
    }});
  }

  depositWithdraw(payload: any, loginId: string) {
    return this.http.post(`${this.baseUrl}/wallets/${loginId}`, payload, {headers: {
      'Authorization':
      'Bearer ' + localStorage.getItem('token')
    }})
  }

  getUsers() {
    return this.http.get(`${this.baseUrl}/customers/?page=0&size=100`, {headers: {
      'Authorization':
      'Bearer ' + localStorage.getItem('token')
    }})
  }

  submitSmartTrade(payload: any) {
    return this.http.post(`${this.baseUrl}/smart-trades`, payload, {headers: {
      'Authorization':
      'Bearer ' + localStorage.getItem('token')
    }})
  }

  getSmartTrades() {
    return this.http.get(`${this.baseUrl}/smart-trades`, {headers: {
      'Authorization':
      'Bearer ' + localStorage.getItem('token')
    }})
  }

  settleSmartTrade(payload: any, id: string) {
    return this.http.patch(`${this.baseUrl}/smart-trades/${id}`, payload, {headers: {
      'Authorization':
      'Bearer ' + localStorage.getItem('token')
    }})
  }
}
