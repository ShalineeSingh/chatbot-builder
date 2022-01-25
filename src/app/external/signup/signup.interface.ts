import { IServerResponse } from '../../common/server-response.interface';

export interface ISignup {
  firstName:string,
  userName: string,
  password: string,
}

export interface ISignupResponse extends IServerResponse {
  data: any;
}