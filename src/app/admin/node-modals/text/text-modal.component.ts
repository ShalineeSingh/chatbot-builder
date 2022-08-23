import { LabelType, Options } from '@angular-slider/ngx-slider';
import { Component, Input, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'text-modal',
  styleUrls: ['./text-modal.component.scss'],
  templateUrl: './text-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TextModalComponent {
  @Input() data;
  nodeName: string;
  submitAttempt: boolean;
  htmlText: string;
  nodeDetails;
  tempNextNodeId: string;
  nextNodeValid: boolean;
  expectsUserInput: boolean = false;
  isShowTyping: boolean = false;
  sliderValue: number = 2;
  sliderOptions: Options = {
    showTicksValues: true,
    ceil: 10,
    floor: 1,
    translate: (value: number, label: LabelType): string => {
      return value + 's';
    }
  };
  isRootNode: boolean;
  quillConfig = {
    toolbar: {
      container: [
        ['italic', 'underline', 'strike']
      ],
    },
  }

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    if (this.data) {
      this.nodeName = this.data.nodeName;
      this.htmlText = this.data.htmlText;
      this.tempNextNodeId = this.data.tempNextNodeId;
      this.expectsUserInput = this.data.expectsUserInput;
      this.isShowTyping = this.data.isShowTyping;
      this.sliderValue = this.data.sliderValue;
      this.isRootNode = this.data.rootNode;
    }
  }

  public onSaveNode(): void {
    if (this.tempNextNodeId && !this.nextNodeValid) return;
    this.nodeDetails = {
      name: this.nodeName,
      content: this.htmlText,
      type: 'text',
      nextNodeName: this.tempNextNodeId || null,
      expectsUserInput: this.expectsUserInput,
      id: this.data ? this.data.id : null,
      isShowTyping: this.isShowTyping,
      data: {
        nodeName: this.nodeName,
        htmlText: this.htmlText,
        tempNextNodeId: this.tempNextNodeId,
        expectsUserInput: this.expectsUserInput,
        isShowTyping: this.isShowTyping,
        sliderValue: this.sliderValue,
        id: this.data ? this.data.id : null,
        rootNode:this.isRootNode,
      }
    }
    this.activeModal.close(this.nodeDetails);
  }

  public onNextNodeSelect(node): void {
    this.tempNextNodeId = node.name;
  }

  public isNextNodeValid(isValid: boolean): void {
    this.nextNodeValid = isValid;
  }


}