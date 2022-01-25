type RESPONSE_STATUS = 'ERROR' | 'SUCCESS';

export enum RES_STATUS {
  'ERROR' = 'ERROR',
  'SUCCESS' = 'SUCCESS'
}

export interface IServerResponse {
  dataType: any;
  dataName: any;
  status: RESPONSE_STATUS;
  message: string;
  errors: any;
}

