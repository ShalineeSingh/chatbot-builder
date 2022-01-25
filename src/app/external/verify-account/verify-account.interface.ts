import { IServerResponse } from '../../common/server-response.interface';

export interface IVerifyAccount {
  verificationCode: number;
  userName: string;
}

export interface IVerifyAccountServerResponse extends IServerResponse {
  data: any
}