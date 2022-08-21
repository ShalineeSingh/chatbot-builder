import { Injectable } from "@angular/core";
const APIPrefix = 'http://192.168.29.107:8080/api/cai/';
@Injectable({
  providedIn: 'root'
})
export class Session {
  private tenantId: number = 1;

  constructor() { }

  public getTenantId(): number {
    return this.tenantId;
  }

  public getAPIPrefix() {
    return APIPrefix;
  }

}