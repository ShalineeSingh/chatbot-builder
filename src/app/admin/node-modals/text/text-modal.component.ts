import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { INode } from '../node.service';
import { QUILL_CONFIG } from '../../../common/utils';

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
        total_response_node_count: 1,
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
      }
    }
    this.activeModal.close(this.textNode);
  }

  public onNextNodeSelect(node): void {
    this.previousNode = node;
  }

  public isNextNodeValid(isValid: boolean): void {
    this.previousNodeValid = isValid;
  }
}