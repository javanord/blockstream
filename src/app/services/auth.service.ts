import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiEndpoints = {}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public login(username: string, password: string) {
    return this.http.post(`${this.baseUrl}/authenticate`, {
      username,
      password,
      rememberMe: false
    })
  }

  public createUser(user: any) {
    return this.http.post(`${this.baseUrl}/admin/users`, {...user, authorities: 
      ["ROLE_USER"]}, {headers: {
      'Authorization':
      'Bearer ' + localStorage.getItem('token')
    }});
  };

  public getUser(login: string) {
    //return this.http.get(`${this.baseUrl}/admin/users/${login}`, {headers: {
      return this.http.get(`${this.baseUrl}/customers/${login}`, {headers: {
      'Authorization':
      'Bearer ' + localStorage.getItem('token')
    }});
  }
}
