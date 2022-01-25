import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

const TOKEN = 'token';
const EXPIRATION = 'expiration';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private httpClient: HttpClient) { }

  setSession(token, expiration) {
    localStorage.setItem(TOKEN, token);
    localStorage.setItem(EXPIRATION, expiration.toString());
  }

  setTempSession(token, expiration) {
    sessionStorage.setItem(TOKEN, token);
    sessionStorage.setItem(EXPIRATION, expiration.toString());
  }

  clearSession() {
    localStorage.removeItem('token')
    localStorage.removeItem(EXPIRATION);
    sessionStorage.removeItem('token')
    sessionStorage.removeItem(EXPIRATION);

  }

  isLoggedIn() {
    let tempSession = sessionStorage.getItem('token') !== null && Number(sessionStorage.getItem(EXPIRATION)) > Date.now();
    let session = localStorage.getItem('token') !== null && Number(localStorage.getItem(EXPIRATION)) > Date.now();
    return tempSession || session;
  }

}