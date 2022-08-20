import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class Session {
  tenantId: number = 1;
  constructor() { }

  public getTenantId(): number {
    return this.tenantId;
  }

}