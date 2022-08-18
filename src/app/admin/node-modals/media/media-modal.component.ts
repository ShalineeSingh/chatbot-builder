import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IBaseNode } from 'src/app/common/directives/app-drawflow.directive';
import { FileUploader } from 'ng2-file-upload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

const URL = '/api/';

export interface IMediaNode extends IBaseNode {
  nextNode?: INextNode,
  content: IMedia[],
}

interface INextNode {
  nextNodeId: number,
  nextNodeName: string,
  valid: boolean,
}
interface IMedia {
  mediaId: number,
  fileObject: string,
  previewUrl: SafeUrl,
}

@Component({
  selector: 'media-modal',
  styleUrls: ['./media-modal.component.scss'],
  templateUrl: './media-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MediaModalComponent {
  @Input() data: IMediaNode;
  @Input() mediaType: 'image' | 'document' | 'video';
  nodeName: string;
  nextNode: INextNode = { nextNodeId: null, nextNodeName: null, valid: false };
  mediaList: IMedia[] = [];
  isRootNode: boolean;
  expectsUserInput: boolean = false;
  isShowTyping: boolean = false;
  submitAttempt: boolean;
  sliderValue: number = 2;
  sliderOptions: Options = {
    showTicksValues: true,
    ceil: 10,
    floor: 1,
    translate: (value: number): string => {
      return value + 's';
    }
  };
  currentFile: any;
  mediaEdit: boolean;
  currentBtnId: number = 1;

  tempNode;
  mediaTypeMap = {
    'image': {
      name: 'Image',
      accept: '.jpg,.jpeg,.png,.gif'
    },
    'document': {
      name: 'Document',
      accept: '.pdf',
    },
    'video': {
      name: 'Video',
      accept: '.mp4'
    }
  }
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  public previewPath: any;

  constructor(public activeModal: NgbActiveModal, private sanitizer: DomSanitizer) {
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
      if (fileItem._file.type === 'application/pdf') this.previewPath = this.createPdfPreviewUrl(fileItem._file);
      else  this.previewPath = this.createPreviewUrl(fileItem._file);
    }
  }

  ngOnInit(): void {
    if (this.data) {
      this.nodeName = this.data.name;
      this.nextNode = this.data.nextNode;
      this.mediaList = this.data.content;
      this.expectsUserInput = this.data.expectsUserInput;
      this.isShowTyping = this.data.isShowTyping;
      this.isRootNode = this.data.rootNode;
    } else {
      this.mediaEdit = true;
    }
  }

  createPreviewUrl(file): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file)));
  }

  createPdfPreviewUrl(file){
    return this.sanitizer.bypassSecurityTrustResourceUrl((window.URL.createObjectURL(file)));
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public dropped(e: any): void {
    console.log(e);
  }

  public removeMedia(mediaId?: number) {
    if (mediaId) {
      const index = this.mediaList.findIndex(v => v.mediaId === mediaId);
      if (index > -1) this.mediaList.splice(index, 1);
    } else this.previewPath = null;
    this.currentBtnId = this.mediaList.length + 1;
  }

  public onSaveNode(): void {
    // TODO: add validity
    // if (this.tempNextNodeId && !this.nextNodeValid) return;
    this.data = {
      name: this.nodeName,
      content: this.mediaList,
      type: this.mediaType,
      nextNode: this.nextNode,
      expectsUserInput: this.expectsUserInput,
      id: this.data ? this.data.id : null,
      isShowTyping: this.isShowTyping,
    }

    this.activeModal.close(this.data)
  }

  public onSaveMedia() {
    this.mediaList[this.currentBtnId - 1] = {
      mediaId: this.currentBtnId,
      fileObject: this.currentFile._file,
      previewUrl: this.createPreviewUrl(this.currentFile._file),
    }
    this.currentBtnId++;
    this.mediaEdit = false;
    // this.uploader.uploadAll();
  }

  public addNewFile() {
    this.currentFile = '';
    this.previewPath = null;
    this.submitAttempt = false;
    this.mediaEdit = true;
  }

  public editButton(btn: IMedia) {
    this.currentBtnId = btn.mediaId;
    this.currentFile = btn.fileObject;
    this.mediaEdit = true;
    this.submitAttempt = false;
  }
  public onNextNodeSelect(node): void {
    this.nextNode = {
      nextNodeName: node.name,
      nextNodeId: node.id,
      valid: true,
    }
  }

  public isNextNodeValid(isValid: boolean): void {
    this.nextNode.valid = isValid;
  }

  setNodeNext(node: INextNode) {
    node.nextNodeName = this.nextNode.nextNodeName;
    node.nextNodeId = this.nextNode.nextNodeId;
  }

  setNodeValidity(node: INextNode) {
    node.valid = this.nextNode.valid;
  }
}