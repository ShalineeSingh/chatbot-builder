import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Session } from '../../common/session';


interface IBotServerResponse {
  id: number;
  tenant_id: number;
  name: string;
  description: string;
  image: string;
  version: number;
  created_date: string;
  last_modified_date: string;
  last_modified_by: string;
}
export interface IApiServerResponse {
  id?: number;
  tenant_id: number;
  name: string;
  request_type: string;
  request_url: string;
  authorisation?: any;
  headers?: any;
  query_param?: any;
  body?: any;
  response: any;
  deleted: boolean;
}

export interface IBot {
  id: number;
  tenantId: number;
  name: string;
  description?: string;
  image?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface IApi {
  id?: number;
  tenantId: number;
  name: string;
  requestType: string;
  requestUrl: string;
  authorisation?: any;
  headers?: any;
  queryParam?: any;
  body?: any;
  response: any;
  deleted: boolean;
}

@Injectable()
export class DashboardService {
  apiPrefix: string;
  tenantId: number;
  constructor(public http: HttpClient, private session: Session) {
    this.apiPrefix = this.session.getAPIPrefix();
    this.tenantId = this.session.getTenantId();
  }

  public getBotList(): Observable<IBot[]> {
    return this.http.get('../assets/mock-data/botList.json')
    // return this.http.get(`${this.apiPrefix}bot/list/${this.tenantId}`)
      .pipe(
        map(this.transformBotList.bind(this)),
      );
  }

  public saveBot(body): Observable<IBot> {
    // return this.http.get('../assets/mock-data/botList.json')
    return this.http.post(`${this.apiPrefix}bot/create`, body)
      .pipe(
        map(this.transformBot.bind(this)),
      );
  }

  public updateBot(body, botId: number): Observable<IBot> {
    // return this.http.get('../assets/mock-data/botList.json')
    return this.http.put(`${this.apiPrefix}bot/update/${botId}`, body)
      .pipe(
        map(this.transformBot.bind(this)),
      );
  }

  public deleteBot(botId: number): Observable<any> {
    return this.http.put(`${this.apiPrefix}bot/delete/${botId}`, {})
  }

  public getApiList(): Observable<IApi[]> {
    return this.http.get(`${this.apiPrefix}api/list/${this.tenantId}`)
      .pipe(
        map(this.transformApiList.bind(this)),
      );
  }

  public saveApi(body): Observable<IBot[]> {
    return this.http.post(`${this.apiPrefix}api/create`, body)
      .pipe(
        map(this.transformAPI.bind(this)),
      );
  }


  public updateApi(body, apiId: number): Observable<IBot> {
    // return this.http.get('../assets/mock-data/botList.json')
    return this.http.put(`${this.apiPrefix}api/update/${apiId}`, body)
      .pipe(
        map(this.transformAPI.bind(this)),
      );
  }

  public deleteApi(apiId: number): Observable<any> {
    return this.http.put(`${this.apiPrefix}api/delete/${apiId}`, {});
  }

  public testGetApi(url: string, params: any = null, headers: any = null, auth: any = null): Observable<any> {
    return this.http.get(url, { headers, params });
  }
  public testPostApi(url: string, params: any = null, headers: any = null, body: any = null, auth: any = null) {
    return this.http.post(url, body, { headers, params });
  }

  private transformBot(bot: IBotServerResponse): IBot {
    return {
      id: bot.id,
      tenantId: bot.tenant_id,
      name: bot.name,
      description: bot.description,
      image: bot.image,
      updatedAt: bot.last_modified_date,
      updatedBy: bot.last_modified_by,
    }
  }
  private transformAPI(api: IApiServerResponse): IApi {
    return {
      id: api.id,
      tenantId: api.tenant_id,
      name: api.name,
      requestType: api.request_type,
      requestUrl: api.request_url,
      authorisation: api.authorisation,
      headers: api.headers,
      queryParam: api.query_param,
      body: api.body,
      response: api.response,
      deleted: api.deleted,
    }
  }

  private transformBotList(data: IBotServerResponse[]): IBot[] {
    return data.map((bot) => {
      return {
        id: bot.id,
        tenantId: bot.tenant_id,
        name: bot.name,
        description: bot.description,
        image: bot.image,
        updatedAt: bot.last_modified_date,
        updatedBy: bot.last_modified_by,
      }
    });
  }
  private transformApiList(data: IApiServerResponse[]): IApi[] {
    return data.map((api) => {
      return {
        id: api.id,
        tenantId: api.tenant_id,
        name: api.name,
        requestType: api.request_type,
        requestUrl: api.request_url,
        authorisation: api.authorisation,
        headers: api.headers,
        queryParam: api.query_param,
        body: api.body,
        response: api.response,
        deleted: api.deleted,
      }
    });
  }
}