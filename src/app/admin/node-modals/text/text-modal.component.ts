import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IBaseNode } from '../../../common/directives/app-drawflow.directive';

export interface ITextNode extends IBaseNode {
  nextNodeId?: string;
  content: string;
}
@Component({
  selector: 'text-modal',
  styleUrls: ['./text-modal.component.scss'],
  templateUrl: './text-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TextModalComponent {
  nodeName: string;
  submitAttempt: boolean;
  htmlText: string;
  nodeDetails: ITextNode;
  tempNextNodeId: string;
  nextNodeValid: boolean;
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
        ['bold', 'italic', 'underline'],        // toggled buttons
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
  ngOnInit(): void { }

  public onSaveNode(): void {
    if (!this.nextNodeValid) return;
    console.log(this.nextNodeValid);
    this.nodeDetails = {
      name: this.nodeName,
      content: this.htmlText,
      type: 'text',
      nextNodeId: this.tempNextNodeId || null,
    }
    this.activeModal.close(this.nodeDetails)
  }

  public onNextNodeSelect(node){
    this.tempNextNodeId = node.name;
  }

  public isNextNodeValid(isValid: boolean){
    this.nextNodeValid = isValid;
  }
}