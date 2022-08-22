import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Session } from "src/app/common/session";

export interface INodeDataServerResponse {
  tenant_id: number;
  bot_id: number;
  node_id: number;
  type: string;
  next_node_id: number;
  next_node_type: string;
  root_node: boolean;
  deleted: boolean;
  response: any;
}

@Injectable()
export class BotEditorService {
  apiPrefix: string;
  tenantId: number;

  constructor(public http: HttpClient, private session: Session) {
    this.apiPrefix = this.session.getAPIPrefix();
    this.tenantId = this.session.getTenantId();
  }

  public saveNode(body: INodeDataServerResponse): Observable<any> {
    // return this.http.get('../assets/mock-data/botList.json')
    return this.http.post(`${this.apiPrefix}nodedata/createOne`, body)
      .pipe(
        map(this.transformNode.bind(this)),
      );
  }
  private transformNode(res) {
    return res;
  }
}