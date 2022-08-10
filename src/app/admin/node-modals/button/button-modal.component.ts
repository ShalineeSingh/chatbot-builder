import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IBaseNode } from '../../../common/directives/app-drawflow.directive';

export interface IButtonNode extends IBaseNode {
  nextNodes?: INextNode[],
  content: IButton[],
}

interface INextNode {
    buttonId: number,
    nextNodeId: number,
    nextNodeName: string,
    externalUrl: string,
    valid: boolean,
}
interface IButton {
  buttonId: number,
  buttonText: string,
}
@Component({
  selector: 'button-modal',
  styleUrls: ['./button-modal.component.scss'],
  templateUrl: './button-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ButtonModalComponent {
  @Input() data: IButtonNode;
  nodeName: string;
  nextNodes: INextNode[] = [];
  buttonList: IButton[] = [];
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
  buttonText: string;
  buttonEdit: boolean;
  currentBtnId:number= 1;
  tempNode;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data) {
      this.nodeName = this.data.name;
      this.nextNodes = this.data.nextNodes;
      this.buttonList = this.data.content;
      this.expectsUserInput = this.data.expectsUserInput;
      this.isShowTyping = this.data.isShowTyping;
      this.isRootNode = this.data.rootNode;
    }else {
      this.buttonEdit = true;
    }
  }

  public onSaveNode(): void {
    console.log('submit');
    // TODO: add validity
    // if (this.tempNextNodeId && !this.nextNodeValid) return;
    this.data = {
      name: this.nodeName,
      content: this.buttonList,
      type: 'button',
      nextNodes: this.nextNodes,
      expectsUserInput: this.expectsUserInput,
      id: this.data ? this.data.id : null,
      isShowTyping: this.isShowTyping,
    }
   
    this.activeModal.close(this.data)
  }

  public onSaveButton(){
    this.buttonList[this.currentBtnId - 1] = {
      buttonId: this.currentBtnId,
      buttonText: this.buttonText,
    }
    this.nextNodes[this.currentBtnId - 1] = this.nextNodes[this.currentBtnId - 1] ? {
      valid: this.nextNodes[this.currentBtnId - 1].valid,
      nextNodeId: this.nextNodes[this.currentBtnId - 1].nextNodeId,
      nextNodeName: this.nextNodes[this.currentBtnId - 1].nextNodeName,
      externalUrl: this.nextNodes[this.currentBtnId - 1].externalUrl,
      buttonId: this.currentBtnId,
    } : {
      valid: false,
      nextNodeId: null,
      nextNodeName: null,
      externalUrl: null,
      buttonId: this.currentBtnId,
    }
    this.currentBtnId++;
    this.buttonEdit = false;  
  }

  public addNewButton(){
    this.buttonText ='';
    this.submitAttempt =false;
    this.buttonEdit = true;
  }

  public editButton(btn: IButton){
    this.currentBtnId = btn.buttonId;
    this.buttonText = btn.buttonText;
    this.buttonEdit = true;
    this.submitAttempt = false;
  }
  public onNextNodeSelect(node, buttonNode: INextNode): void {
    this.tempNode = {
      name: node.name,
      id: node.id
    }
  }

  public isNextNodeValid(isValid: boolean, buttonNode: INextNode): void {
    this.tempNode.valid = isValid;
  }

  setNodeNext(buttonNode: INextNode){
    buttonNode.nextNodeName = this.tempNode.name;
    buttonNode.nextNodeId = this.tempNode.id;
  }

  setNodeValidity(buttonNode: INextNode){
    buttonNode.valid = this.tempNode.isValid;
  }
}