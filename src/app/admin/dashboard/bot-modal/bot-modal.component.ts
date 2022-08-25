import { Component, Input, ViewEncapsulation } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FileUploader } from "ng2-file-upload";
import { AlertConfigModel } from "src/app/common/alert/alert-config.model";
import { DashboardService } from '../dasboard.service';
import { AlertService } from '../../../common/alert/alert.service';
import { Session } from "src/app/common/session";

const URL = '/api';
@Component({
  selector: 'bot-modal',
  styleUrls: ['./bot-modal.component.scss'],
  templateUrl: './bot-modal.component.html',
  providers: [DashboardService],
  encapsulation: ViewEncapsulation.None
})
export class BotModalComponent {
  @Input() botDetails;
  submitAttempt: boolean;
  botName: string;
  botDesc: string;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  public previewPath: any;
  currentFile: any;
  buttonLoader: boolean;
  tenantId: number;

  constructor(
    public activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer,
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private session:Session,
  ) {
    this.tenantId = this.session.getTenantId();
    this.uploader = new FileUploader({
      url: URL,
      disableMultipart: true,
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        return new Promise((resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });
    this.uploader.response.subscribe(res => console.log(res));
    this.uploader.onAfterAddingFile = (fileItem) => {
      this.currentFile = fileItem;
      this.previewPath = this.createPreviewUrl(fileItem._file);
    }
  }

  ngOnInit(){
    if(this.botDetails) {
      this.botName = this.botDetails.name;
      this.botDesc = this.botDetails.description;
      this.previewPath = this.botDetails.image;
    }
  }
  public onSaveBot(): void {
    let serviceToCall;
    let successMsg: string = "Bot saved successfully";
    this.buttonLoader = true;
    let body = {
      name: this.botName,
      tenant_id: this.tenantId,
      description: this.botDesc,
      image: this.currentFile,
      status: "DRAFT",
      deleted: false
    }
    if(this.botDetails){
      serviceToCall = this.dashboardService.updateBot(body, this.botDetails.id);
      successMsg = "Bot updated successfully";
    }else {
      serviceToCall = this.dashboardService.saveBot(body);
    }
    serviceToCall.subscribe(res => {
      this.activeModal.close(res);
      const config: AlertConfigModel = {
        type: 'success',
        message: successMsg,
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

  public removeMedia() {
    this.previewPath = null;
  }
  private createPreviewUrl(file): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file)));
  }
}