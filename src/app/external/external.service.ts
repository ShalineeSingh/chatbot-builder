import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { ISignup, ISignupResponse } from './signup/signup.interface';
import { ILogin, ILoginResponse, ILoginServerResponse } from './login/login.interface';
import { map } from 'rxjs/operators';
import { IResetPassword } from "./reset-password/reset-password.interface";
import { checkServerErrors } from "../common/utils";
import { INewPassword } from "./change-password/change-password.interface";
import { IVerifyAccount } from "./verify-account/verify-account.interface";

@Injectable()
export class ExternalService {
  private url ='https://csgdev.chetnainfotech.com';
  constructor(private httpClient: HttpClient) { }

  signup(body: ISignup): Observable<boolean> {
    return this.httpClient.post(this.url + '/public/auth/signup', body)
      .pipe(
        map(checkServerErrors),
        map(this.transformData.bind(this)),
      )
  }

  login(body: ILogin): Observable<ILoginResponse> {
    // return this.httpClient.post(this.url + '/public/auth/login', body)
    //   .pipe(
    //     map(checkServerErrors),
    //     map(this.transformLoginData.bind(this)),
    //   )
    return of({sessionToken: 'ABCD', expiration: Date.now() + 60*60*60})
  }

  verify(body: IVerifyAccount): Observable<boolean> {
    return this.httpClient.post(this.url + '/public/auth/cofnirmSignup', body)
      .pipe(
        map(checkServerErrors),
        map(this.transformData.bind(this)),
      )
  }

  reset(body: IResetPassword): Observable<boolean> {
    return this.httpClient.post(this.url + '/public/auth/forgotPassword', body)
      .pipe(
        map(checkServerErrors),
        map(this.transformData.bind(this)),
      )
  }

  newPassword(body: INewPassword): Observable<boolean> {
    return this.httpClient.post(this.url + '/public/auth/confirmForgotPassword', body)
      .pipe(
        map(checkServerErrors),
        map(this.transformData.bind(this)),
      )
  }

  healthCheck():Observable<any> {
    return this.httpClient.get(this.url + '/public/auth/check');
  }

  private transformData(response: ISignupResponse): boolean {
    if (response) return true;
  }
  private transformLoginData(response: ILoginServerResponse): ILoginResponse {
    if (response) {
      return {
        sessionToken: response.data.credentials.sessionToken,
        expiration: response.data.credentials.expiration,
      };
    }
  }

}
