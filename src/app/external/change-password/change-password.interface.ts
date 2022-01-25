import { IServerResponse } from '../../common/server-response.interface';

export interface INewPassword {
  verificationCode: number;
  userName: string;
  password: string;
}

export interface INewPasswordServerResponse extends IServerResponse {
  data: any
}