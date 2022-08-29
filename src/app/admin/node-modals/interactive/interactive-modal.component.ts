import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QUILL_CONFIG } from '../../../common/utils';
import { INode, IInteractiveResponse } from '../../node-select/node-list.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  intentDisabled: boolean;
  previousNode: INode;
  previousNodeEdited: boolean;
  availableIntents;

  constructor(public activeModal: NgbActiveModal, public sanitizer: DomSanitizer) { }

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

      for (let i = 0; i < 3; i++) {
        this.interactiveNode.response.action.buttons.push({
          // actionType: this.interactiveOptions[0]
          title: null,
        })
      }
    } else {
      if (!this.interactiveNode.response.header) this.interactiveNode.response.header = { type: 'text' };
      if (!this.interactiveNode.response.footer) this.interactiveNode.response.footer = { type: 'text' };
      if (!this.interactiveNode.response.action.sections) {
        this.interactiveNode.response.action.sections = [
          {
            title: '',
            rows: [{
              title: '',
              id: 'dummy',
            }]
          }
        ];
      }
      if (!this.interactiveNode.response.action.buttons) {
        this.interactiveNode.response.action.buttons = [];
        for (let i = 0; i < 3; i++) {
          this.interactiveNode.response.action.buttons.push({
            // actionType: this.interactiveOptions[0]
            title: null,
          })
        }
      } else if (this.interactiveNode.response.action.buttons.length < 3) {
        while (this.interactiveNode.response.action.buttons.length < 3) {
          this.interactiveNode.response.action.buttons.push({
            title: null,
          })
        }
      }
    }
  }
  createPdfPreviewUrl(url) {
   if(url) return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
    if (this.previousNode) {
      if (!this.previousNodeValid) return;
      this.interactiveNode.previous_node_id = this.previousNode.node_id;
      this.interactiveNode.previous_node_name = this.previousNode.node_name;
      if (this.previousNode.type === 'text') {
        this.previousNode.total_response_node_count = this.previousNode.total_response_node_count + 1;
        this.interactiveNode.sequence = this.previousNode.total_response_node_count;
        this.previousNode.state = this.previousNode.id ? 'EDITED' : 'CREATED';
        this.previousNodeEdited = true;
      }
    }
    this.sanitiseNodeData();
    this.activeModal.close({ node: this.interactiveNode, previousNode: this.previousNode, previousNodeEdited: this.previousNodeEdited })
  }

  public onPreviousNodeSelect(node: INode): void {
    this.previousNode = node;
    if (node.type === 'text') {
      this.interactiveNode.intent = node.response.text.body;
      this.intentDisabled = true;
    } else if (node.type === 'interactive') {
      this.interactiveNode.intent = null;
      if (node.response.type === 'list') {
        this.availableIntents = [];
        node.response.action.sections.forEach(section => {
          this.availableIntents.push(...section.rows);
        });
      } else {
        this.availableIntents = node.response.action.buttons;
      }
    }
  }
  public changeIntent(intent) {
    this.interactiveNode.intent = intent.title;
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
      this.interactiveNode.response.action.sections = this.interactiveNode.response.action.sections.filter(v => v.rows.length > 0);
      console.log(this.interactiveNode.response.action.sections);
      this.interactiveNode.response.action.sections.forEach((element, index) => {
        this.interactiveNode.response.action.sections[index].rows = this.interactiveNode.response.action.sections[index].rows.filter(v => v.title);
        for (let i = 0; i < this.interactiveNode.response.action.sections[index].rows.length; i++) {
          this.interactiveNode.response.action.sections[index].rows[i].id = i;
        }
      });
    }
  }
}