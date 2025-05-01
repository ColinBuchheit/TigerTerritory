import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthModel } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  handleAuth(auth: AuthModel, is_register: boolean) {
    var api = '/api/auth'
    if (is_register) { api.concat('/register');}
    else { api.concat('/login');}

    this.http.post(api, auth).subscribe(res => {
      console.log("Hello World!");
    })
  }




}
