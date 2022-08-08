import { LabelType, Options } from '@angular-slider/ngx-slider';
import { Component, Input, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IBaseNode } from '../../../common/directives/app-drawflow.directive';

export interface ITextNode extends IBaseNode {
  nextNodeName?: string;
  nextNodeId?: number;
  content: string;
  expectsUserInput?: boolean;
  data: {
    nodeName: string;
    htmlText: string;
    tempNextNodeId: string;
    expectsUserInput: boolean;
    isShowTyping: boolean;
    sliderValue: number;
    rootNode?: boolean;
  };
}
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
  nodeDetails: ITextNode;
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
  // atValues = [
  //   { id: 1, value: 'Fredrik Sundqvist', link: 'https://google.com' },
  //   { id: 2, value: 'Patrik Sjölin' }
  // ];
  // hashValues = [
  //   { id: 3, value: 'Fredrik Sundqvist 2' },
  //   { id: 4, value: 'Patrik Sjölin 2' }
  // ]

  quillConfig = {
    //toolbar: '.toolbar',
    toolbar: {
      container: [
        ['italic', 'underline'],        // toggled buttons
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
      ],
    },
    // autoLink: true,

    // mention: {
    //   allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
    //   mentionDenotationChars: ["@", "#"],
    //   source: (searchTerm, renderList, mentionChar) => {
    //     let values;

    //     if (mentionChar === "@") {
    //       values = this.atValues;
    //     } else {
    //       values = this.hashValues;
    //     }

    //     if (searchTerm.length === 0) {
    //       renderList(values, searchTerm);
    //     } else {
    //       const matches = [];
    //       for (var i = 0; i < values.length; i++)
    //         if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i]);
    //       renderList(matches, searchTerm);
    //     }
    //   },
    // },

  }
  // test = (event) => {
  //   console.log(event.keyCode);
  // }

  // onSelectionChanged = (event) => {
  //   if (event.oldRange == null) {
  //     this.onFocus();
  //   }
  //   if (event.range == null) {
  //     this.onBlur();
  //   }
  // }

  // onContentChanged = (event) => {
  //console.log(event.html);
  // }

  constructor(public activeModal: NgbActiveModal) { }
  ngOnInit(): void {
    if (this.data) {
      this.nodeName = this.data.nodeName;
      this.htmlText = this.data.htmlText;
      this.tempNextNodeId = this.data.tempNextNodeId;
      this.expectsUserInput = this.data.expectsUserInput;
      this.isShowTyping = this.data.isShowTyping;
      this.sliderValue = this.data.sliderValue;
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
      data: {
        nodeName: this.nodeName,
        htmlText: this.htmlText,
        tempNextNodeId: this.tempNextNodeId,
        expectsUserInput: this.expectsUserInput,
        isShowTyping: this.isShowTyping,
        sliderValue: this.sliderValue,
      }
    }
    this.activeModal.close(this.nodeDetails)
  }

  public onNextNodeSelect(node): void {
    this.tempNextNodeId = node.name;
    
  }

  public isNextNodeValid(isValid: boolean): void {
    this.nextNodeValid = isValid;
  }
}