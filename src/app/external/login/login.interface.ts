import { IServerResponse } from '../../common/server-response.interface';
export interface ILogin {
  userName: string;
  password: string;
}
export interface ILoginServerResponse extends IServerResponse {
  data: {
    credentials: {
      expiration: number;
      sessionToken: string;
    }
  };
}

export interface ILoginResponse {
  expiration: number;
  sessionToken: string;
}