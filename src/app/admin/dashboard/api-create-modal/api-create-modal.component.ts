import { Component, Input, ViewEncapsulation } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AlertConfigModel } from "src/app/common/alert/alert-config.model";
import { DashboardService, IApi, IApiServerResponse } from '../dasboard.service';
import { AlertService } from '../../../common/alert/alert.service';
import { Session } from '../../../common/session';

@Component({
  selector: 'api-create-modal',
  styleUrls: ['./api-create-modal.component.scss'],
  templateUrl: './api-create-modal.component.html',
  providers: [DashboardService],
  encapsulation: ViewEncapsulation.None
})
export class ApiCreateModalComponent {
  @Input() apiDetails: IApi;
  submitAttempt: boolean;
  apiName: string;
  buttonLoader: boolean;
  apiButtonLoader: boolean;
  authDetails: {
    authType: 'NO_AUTH' | 'BASIC_AUTH',
    username?: string,
    password?: string,
  }
  authTypeMap = {
    'NO_AUTH': 'No Auth',
    'BASIC_AUTH': 'Basic auth',
  }
  apiResponse: any;

  constructor(
    public activeModal: NgbActiveModal,
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private session: Session,
  ) {
  }

  ngOnInit() {
    if (!this.apiDetails) {
      this.apiDetails = {
        tenantId: this.session.getTenantId(),
        name: null,
        requestType: 'GET',
        requestUrl: null,
        queryParam: [{ key: null }],
        headers: [{ key: null }],
        response: [{ key: null }],
        deleted: false,
      }
    }else {
      let paramArray = [];
      let headerArray = [];
      let responseArray = [];
      for (let key in this.apiDetails.queryParam) {
        if (this.apiDetails.queryParam.hasOwnProperty(key)) {
          paramArray.push({
            key,
            value: this.apiDetails.queryParam[key]
          });
        }
      }
      for (let key in this.apiDetails.headers) {
        if (this.apiDetails.headers.hasOwnProperty(key)) {
          headerArray.push({
            key,
            value: this.apiDetails.headers[key]
          });
        }
      }
      for (let key in this.apiDetails.response) {
        if (this.apiDetails.response.hasOwnProperty(key)) {
          responseArray.push({
            key,
            value: this.apiDetails.response[key]
          });
        }
      }
      this.apiDetails.headers = headerArray;
      this.apiDetails.queryParam = paramArray;
      this.apiDetails.response = responseArray;
      this.apiDetails.body = JSON.stringify(this.apiDetails.body, undefined, 4);
    }
  }

  public prettifyJson() {
    let text = JSON.parse(this.apiDetails.body);
    this.apiDetails.body = JSON.stringify(text, undefined, 4);
  }

  public checkResponseValue(index: number) {
    if (this.apiDetails.response[index].value && this.apiResponse) {
      const identifier = this.apiDetails.response[index].value.split('.');
      console.log(identifier);
      if (identifier[0] !== 'response') {
        this.apiDetails.response[index].error = true;
      } else {
        let value = { response: JSON.parse(this.apiResponse) };
        identifier.forEach(element => {
          value = value[element];
        });
        this.apiDetails.response[index].tempValue = value;
      }
    }
  }

  public deleteParamRow(type: string, index: number): void {
    if (this.apiDetails[type].length === 1) {
      this.apiDetails[type][0].key = null;
      this.apiDetails[type][0].value = null;
    } else {
      this.apiDetails[type].splice(index, 1);
    }
  }
  public addNewParamRow(type: string): void {
    if (this.apiDetails[type].findIndex(v => v.key === null) === -1) {
      this.apiDetails[type].push({ key: null });
      if (type === 'response') {
        this.checkResponseValue(this.apiDetails.response.length - 1);
      }
    }
  }
  public onSaveApi(): void {
    this.buttonLoader = true;
    let body: IApiServerResponse = { // add auth here too
      tenant_id: this.session.getTenantId(),
      name: this.apiDetails.name,
      request_type: this.apiDetails.requestType,
      request_url: this.apiDetails.requestUrl,
      headers: this.convertArrayToMap('headers'),
      query_param: this.convertArrayToMap('queryParam'),
      body: this.apiDetails.body ? JSON.parse(this.apiDetails.body) : {},
      response: this.convertArrayToMap('response'),
      deleted: false,
      authorisation: this.authDetails,
    }
    this.dashboardService.saveApi(body).subscribe(res => {
      this.activeModal.close(res);
      const config: AlertConfigModel = {
        type: 'success',
        message: "API saved successfully",
      };
      this.alertService.configSubject.next(config);
    }, (error) => {
      const config: AlertConfigModel = {
        type: 'danger',
        message: error.message,
      };
      this.alertService.configSubject.next(config);
    }).add(() => this.buttonLoader = false)
  }

  public changeRequestType(type) {
    this.apiDetails.requestType = type;
  }
  public changeAuthType(type) {
    if (this.authDetails) this.authDetails.authType = type;
    else this.authDetails = { authType: type };
  }

  public testApi() {
    this.apiButtonLoader = true;
    const headers = this.convertArrayToMap('headers');
    const params = this.convertArrayToMap('queryParam');
    let serviceToCall;

    if (this.apiDetails.headers.length) {
      this.apiDetails.headers.forEach(element => {
        if (element['key']) headers[element['key']] = element.value;
      });
    }
    if (this.apiDetails.requestType === 'GET') {// add auth values
      serviceToCall = this.dashboardService.testGetApi(this.apiDetails.requestUrl, params, headers);

    } else if (this.apiDetails.requestType === 'POST') {
      serviceToCall = this.dashboardService.testPostApi(this.apiDetails.requestUrl, params, headers, this.apiDetails.body);
    }
    serviceToCall.subscribe(res => {
      this.apiResponse = JSON.stringify(res, undefined, 4);
    }, (error) => {
      const config: AlertConfigModel = {
        type: 'danger',
        message: error.message,
      };
      this.alertService.configSubject.next(config);
    }).add(() => this.apiButtonLoader = false)
  }

  private convertArrayToMap(context: string) {
    let map = {};
    if (this.apiDetails[context].length) {
      this.apiDetails[context].forEach(element => {
        if (element['key']) map[element['key']] = element.value;
      });
    }
    return map;
  }
}