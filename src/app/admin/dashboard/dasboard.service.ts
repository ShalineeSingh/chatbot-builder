import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";


interface IBotServerResponse {
  bots: {
    id: number;
    tenant_id: number;
    name: string;
    description: string;
    image: string;
    version: number;
    created_date: string;
    last_modified_date: string;
    last_modified_by: string;
  }[];
}

interface IApiServerResponse {
  apis: IApiServer[];
}

export interface IApiServer {
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
}

@Injectable()
export class DashboardService {
  constructor(public http: HttpClient) { }

  public getBotList(params = null): Observable<IBot[]> {
    return this.http.get('../assets/mock-data/botList.json')
      .pipe(
        map(this.transformBotList.bind(this)),
      );
  }

  public getApiList(params = null): Observable<IApi[]> {
    return this.http.get('../assets/mock-data/apiList.json')
      .pipe(
        map(this.transformApiList.bind(this)),
      );
  }

  public saveBot(body, params = null): Observable<IBot[]> {
    return this.http.get('../assets/mock-data/botList.json')
      .pipe(
        map(this.transformBotList.bind(this)),
      );
  }

  public deleteBot(params = null): Observable<IBot[]> {
    return this.http.get('../assets/mock-data/botList.json')
      .pipe(
        map(this.transformBotList.bind(this)),
      );
  }

  public deleteApi(params = null): Observable<IBot[]> {
    return this.http.get('../assets/mock-data/botList.json')
      .pipe(
        map(this.transformBotList.bind(this)),
      );
  }

  public saveApi(body, params = null): Observable<IBot[]> {
    return this.http.get('../assets/mock-data/botList.json')
      .pipe(
        map(this.transformBotList.bind(this)),
      );
  }

  public testGetApi(url: string, params: any = null, headers: any = null, auth: any = null): Observable<any> {
    return this.http.get(url, { headers, params });
  }
  public testPostApi(url: string, params: any = null, headers: any = null, body: any = null, auth: any = null) {
    return this.http.post(url, body, { headers, params });
  }

  private transformBotList(data: IBotServerResponse): IBot[] {
    return data.bots.map((bot) => {
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
  private transformApiList(data: IApiServerResponse): IApi[] {
    return data.apis.map((api) => {
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
      }
    });
  }
}