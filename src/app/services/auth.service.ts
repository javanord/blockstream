import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from 'src/models/user.model';

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

  public createUser(user: User) {
    return this.http.post(`${this.baseUrl}/admin/users`, user);
  }
}
