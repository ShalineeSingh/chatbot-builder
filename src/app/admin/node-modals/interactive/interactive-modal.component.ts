import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QUILL_CONFIG } from '../../../common/utils';
import { INode, IInteractiveResponse } from '../node.service';


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
  @Input() interactiveNode: INode;
  @Input() botId: number;
  @Input() tenantId: number;
  supportedHeaders = ['text', 'image', 'video', 'document'];
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
  ];
  previousNodeValid: boolean;
  submitAttempt: boolean;
  quillConfig = QUILL_CONFIG;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    if (!this.interactiveNode) {
      let interactiveResponse: IInteractiveResponse = {
        type: 'button',
        header: {
          type: 'text',
        },
        body: {
          text: ''
        },
        footer: {
          text: ''
        },
        action: {
          sections: [
            {
              title: '',
              rows: [{
                title: '',
                id: 'dummy',
              }]
            }
          ],
          buttons: [],
        },

      }
      this.interactiveNode = {
        tenant_id: this.tenantId,
        bot_id: this.botId,
        node_name: '',
        type: 'interactive',
        deleted: false,
        response: interactiveResponse,
        total_response_node_count: 1,
        sequence: 1,
      };
    }
    for (let i = 0; i < 3; i++) {
      this.interactiveNode.response.action.buttons.push({
        // actionType: this.interactiveOptions[0]
        title: null,
      })
    }
  }

  public changeMediaType(type) {
    this.interactiveNode.response.header.type = type;
  }

  public changeMsgType() {
    if (this.interactiveNode.response.type === 'button') {
      this.supportedHeaders = ['text', 'image', 'video', 'document'];
    } else {
      this.supportedHeaders = ['text'];
      this.interactiveNode.response.header.type = 'text';
    }
  }

  public changeButtonActionType(type, index) {
    this.interactiveNode.response.action.buttons[index].actionType = type;
  }

  public addNewRow(type: string, sectionIndex?: number): void {
    if (type === 'section_row') {
      if (this.interactiveNode.response.action.sections[sectionIndex].rows.findIndex(v => !v.title) === -1) {
        this.interactiveNode.response.action.sections[sectionIndex].rows.push({ title: null });
      }
    } else if (type === 'section') {
      if (this.interactiveNode.response.action.sections.findIndex(v => !v.title) === -1) {
        this.interactiveNode.response.action.sections.push({ rows: [{ title: null }] });
      }
    }

  }


  public onSaveNode(): void {
    if (this.interactiveNode.previous_node_id && !this.previousNodeValid) return;
    console.log(this.interactiveNode);
    this.sanitiseNodeData();
    this.activeModal.close(this.interactiveNode)
  }

  public onPreviousNodeSelect(node: INode): void {
    this.interactiveNode.previous_node_id = node.node_id;
    this.interactiveNode.previous_node_name = node.node_name;
  }

  public isPreviousNodeValid(isValid: boolean): void {
    this.previousNodeValid = isValid;
  }

  private sanitiseNodeData() {
    if (!this.interactiveNode.response.footer.text) delete this.interactiveNode.response.footer;
    if (this.interactiveNode.response.header.type === 'text' && !this.interactiveNode.response.header.text) {
      delete this.interactiveNode.response.header;
    }
    if (this.interactiveNode.response.header && this.interactiveNode.response.header.type !== 'text') {
      if (this.interactiveNode.response.header.text) {
        this.interactiveNode.response.header[this.interactiveNode.response.header.type] = {
          link: this.interactiveNode.response.header.text
        }
        delete this.interactiveNode.response.header.text;
      } else {
        delete this.interactiveNode.response.header;
      }
    }
    if (this.interactiveNode.response.type === 'button') {
      delete this.interactiveNode.response.action.sections;
      this.interactiveNode.response.action.buttons = this.interactiveNode.response.action.buttons.filter(v => v.title);
    } else if (this.interactiveNode.response.type === 'list') {
      delete this.interactiveNode.response.action.buttons;
      this.interactiveNode.response.action.sections = this.interactiveNode.response.action.sections.filter(v => v.title);
      this.interactiveNode.response.action.sections.forEach((element, index) => {
        this.interactiveNode.response.action.sections[index].rows = this.interactiveNode.response.action.sections[index].rows.filter(v => v.title);
        for (let i = 0; i < this.interactiveNode.response.action.sections[index].rows.length; i++) {
          this.interactiveNode.response.action.sections[index].rows[i].id = i;
        }
      });
    }
  }
}