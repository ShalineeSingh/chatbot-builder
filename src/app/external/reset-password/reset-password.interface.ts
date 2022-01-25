import { IServerResponse } from '../../common/server-response.interface';

export interface IResetPassword {
  userName: string;
}

export interface IResetPasswordServerResponse extends IServerResponse {
  data: any;
}