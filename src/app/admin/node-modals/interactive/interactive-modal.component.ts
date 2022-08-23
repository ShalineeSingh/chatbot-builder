import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface ICardNode {
  nextNode?: INextNode,
  content: ICard[],
}

interface INextNode {
  nextNodeId: number,
  nextNodeName: string,
  valid: boolean,
}
interface ICard {
  cardId: number,
  fileObject: string,
  previewUrl: SafeUrl,
  content: string;
  footer: string;
  footerAction: string;
}

// headerMediaType
// bodyContent
// footerContent
// nodeType
// buttonList
// sectionList

@Component({
  selector: 'interactive-modal',
  styleUrls: ['./interactive-modal.component.scss'],
  templateUrl: './interactive-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class InterativeModalComponent {
  @Input() interactiveNode;
  supportedHeaders = ['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT'];
  headerContent: string;
  interactiveOptions = [
    {
      type: 'url',
      label: 'Visit Website'
    }, {
      type: 'call',
      label: 'Call Phone Number'
    }, {
      type: 'node',
      label: 'Next Node'
    },
  ]

  nodeName: string;
  nextNode: INextNode = { nextNodeId: null, nextNodeName: null, valid: false };
  mediaList: ICard[] = [];
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

  currentBtnId: number = 1;

  tempNode;
  htmlText: string;
  quillConfig = {
    toolbar: {
      container: [
        ['italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
      ],
    },
  }
  buttonText: string;
  buttonUrl: string;


  constructor(public activeModal: NgbActiveModal, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
   
   
    if (this.interactiveNode) {
      this.nodeName = this.interactiveNode.name;
      this.nextNode = this.interactiveNode.nextNode;
      this.mediaList = this.interactiveNode.content;
      this.expectsUserInput = this.interactiveNode.expectsUserInput;
      this.isShowTyping = this.interactiveNode.isShowTyping;
      this.isRootNode = this.interactiveNode.rootNode;
    } else {
      this.interactiveNode = {
        headerMediaType: 'TEXT',
        nodeType: 'list',
        buttonList: [],
        sectionList:[{rows:[{title: null}]}],
      };
    }
    for (let i = 0; i < 3; i++) {
      this.interactiveNode.buttonList.push({
        actionType: this.interactiveOptions[0]
      })
    }
  }

  public changeMediaType(type) {
    this.interactiveNode.headerMediaType = type;
  }

  public changeButtonActionType(type, index){
    this.interactiveNode.buttonList[index].actionType = type;
  }

  public addNewRow(type: string, sectionIndex?: number): void {
    if (type === 'section_row'){
      if (this.interactiveNode.sectionList[sectionIndex].rows.findIndex(v => !v.title) === -1) {
        this.interactiveNode.sectionList[sectionIndex].rows.push({ title: null });
      }
    }else if(type === 'section'){
      if (this.interactiveNode.sectionList.findIndex(v => !v.title) === -1) {
        this.interactiveNode.sectionList.push({ rows: [{ title: null }] });
      }
    }
   
  }


  public onSaveNode(): void {
    // TODO: add validity
    // if (this.tempNextNodeId && !this.nextNodeValid) return;
    this.interactiveNode = {
      name: this.nodeName,
      content: this.mediaList,
      // type: this.mediaType,
      nextNode: this.nextNode,
      expectsUserInput: this.expectsUserInput,
      id: this.interactiveNode ? this.interactiveNode.id : null,
      isShowTyping: this.isShowTyping,
    }

    this.activeModal.close(this.interactiveNode)
  }

  public onSaveMedia() {
    this.mediaList[this.currentBtnId - 1] = {
      cardId: this.currentBtnId,
      fileObject: null,
      previewUrl: null,
      content: this.htmlText,
      footer: this.buttonText,
      footerAction: this.buttonUrl,
    }
    this.currentBtnId++;
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