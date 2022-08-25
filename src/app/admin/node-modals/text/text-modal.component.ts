import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QUILL_CONFIG } from '../../../common/utils';
import { INode } from '../../node-select/node-list.service';

@Component({
  selector: 'text-modal',
  styleUrls: ['./text-modal.component.scss'],
  templateUrl: './text-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TextModalComponent {
  @Input() textNode: INode;
  @Input() botId: number;
  @Input() tenantId: number;
  submitAttempt: boolean;
  quillConfig = QUILL_CONFIG;
  previousNodeValid: boolean;
  previousNode: INode;
  intentDisabled: boolean;
  previousNodeEdited: boolean;
  availableIntents;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    if (!this.textNode) {
      this.textNode = {
        type: 'text',
        bot_id: this.botId,
        tenant_id: this.tenantId,
        deleted: false,
        node_name: '',
        response: {
          text: {
            body: ''
          }
        },
        total_response_node_count: 0,
        sequence: 1,
      }
    }
  }

  public onSaveNode(): void {
    if (this.previousNode) {
      if (!this.previousNodeValid) return;
      else {
        this.textNode.previous_node_id = this.previousNode.node_id;
        this.textNode.previous_node_name = this.previousNode.node_name;
        if (this.previousNode.type === 'text') {
          this.previousNode.total_response_node_count = this.previousNode.total_response_node_count + 1;
          this.textNode.sequence = this.previousNode.total_response_node_count;
          this.previousNode.state = this.previousNode.id ? 'EDITED' : 'CREATED';
        }
      }
    }
    this.activeModal.close({ node: this.textNode, previousNode: this.previousNode, previousNodeEdited: this.previousNodeEdited });
  }

  public onNextNodeSelect(node: INode): void {
    this.previousNode = node;
    this.previousNodeEdited = true;
    if (node.type === 'text') {
      this.textNode.intent = node.response.text.body;
      this.intentDisabled = true;
    } else if (node.type === 'interactive') {
      this.textNode.intent = null;
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
    this.textNode.intent = intent.title;
  }
  public isNextNodeValid(isValid: boolean): void {
    this.previousNodeValid = isValid;
  }
}