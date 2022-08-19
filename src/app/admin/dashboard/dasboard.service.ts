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
export interface IBot {
  id: number;
  customerId: number;
  name: string;
  description?: string;
  image?: string;
  updatedAt: string;
  updatedBy: string;
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

  public saveBot(body,params = null): Observable<IBot[]> {
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

  private transformBotList(data: IBotServerResponse): IBot[] {
    return data.bots.map((bot) => {
      return {
        id: bot.id,
        customerId: bot.tenant_id,
        name: bot.name,
        description: bot.description,
        image: bot.image,
        updatedAt: bot.last_modified_date,
        updatedBy: bot.last_modified_by,
      }
    });
  }
}