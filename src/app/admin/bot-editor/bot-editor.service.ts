import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Session } from "src/app/common/session";
import { IApi } from "../dashboard/dasboard.service";
import { INode } from "../node-select/node-list.service";


@Injectable()
export class BotEditorService {
  apiPrefix: string;
  tenantId: number;

  constructor(public http: HttpClient, private session: Session) {
    this.apiPrefix = this.session.getAPIPrefix();
    this.tenantId = this.session.getTenantId();
  }

  // public saveNode(body: INode): Observable<any> {
  //   // return this.http.get('../assets/mock-data/botList.json')
  //   return this.http.post(`${this.apiPrefix}nodedata/createOne`, body)
  //     .pipe(
  //       map(this.transformNode.bind(this)),
  //     );
  // }

  public saveBotWorkflow(body: any): Observable<any> {
    return this.http.post(`${this.apiPrefix}botdesigner/create`, body)
  }

  public updateBotWorkflow(body: any, id: number): Observable<any> {
    return this.http.put(`${this.apiPrefix}botdesigner/update/${id}`, body)
  }

  public getBotWorkflow(tenantId: number, botId: number): Observable<any> {
    // return this.http.get('../assets/mock-data/botList.json')
    return this.http.get(`${this.apiPrefix}botdesigner/list/${tenantId}/${botId}`)
  }

  public getApiList(tenantId: number): Observable<any> {
    return this.http.get(`${this.apiPrefix}api/list/${tenantId}`)
  }

  public getResponse(tenantId:number, botId: number, params):Observable<any>{
    return this.http.get(`${this.apiPrefix}botengine/getBotResponse/${tenantId}/${botId}`,{params});
  }

  // private transformNode(res) {
  //   return res;
  // }
}