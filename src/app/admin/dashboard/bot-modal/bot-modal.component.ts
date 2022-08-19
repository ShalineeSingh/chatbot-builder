import { Component, Input, ViewEncapsulation } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FileUploader } from "ng2-file-upload";
import { AlertConfigModel } from "src/app/common/alert/alert-config.model";
import { DashboardService } from '../dasboard.service';
import { AlertService } from '../../../common/alert/alert.service';

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

  constructor(
    public activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer,
    private dashboardService: DashboardService,
    private alertService: AlertService,
  ) {
    this.uploader = new FileUploader({
      url: URL,
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
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
    this.buttonLoader = true;
    let body = {
      name: this.botName,
      description: this.botDesc,
      image: this.currentFile,
    }
    this.dashboardService.saveBot(body).subscribe(res => {
      this.activeModal.close(body);
      const config: AlertConfigModel = {
        type: 'success',
        message: "Bot saved successfully",
      };
      this.alertService.configSubject.next(config);
    }, (error) => {
      const config: AlertConfigModel = {
        type: 'danger',
        message: error.error,
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