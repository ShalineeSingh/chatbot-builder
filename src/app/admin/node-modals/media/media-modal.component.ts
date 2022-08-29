import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { INode } from '../../node-select/node-list.service';
import { QUILL_CONFIG } from 'src/app/common/utils';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'media-modal',
  styleUrls: ['./media-modal.component.scss'],
  templateUrl: './media-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MediaModalComponent {
  @Input() mediaNode: INode;
  @Input() botId: number;
  @Input() tenantId: number;
  @Input() mediaType: 'image' | 'document' | 'video';
  submitAttempt: boolean;
  quillConfig = QUILL_CONFIG;
  previousNodeValid: boolean;
  previousNode: INode;
  intentDisabled: boolean;
  previousNodeEdited: boolean;
  availableIntents;
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

  constructor(public activeModal: NgbActiveModal, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    if (!this.mediaNode) {
      this.mediaNode = {
        type: this.mediaType,
        bot_id: this.botId,
        tenant_id: this.tenantId,
        deleted: false,
        node_name: '',
        response: {
          [this.mediaType]: [
            {
              link: null,
              caption: ''
            }
          ]
        },
        total_response_node_count: 1,
        sequence: 1,
      }
    }
  }
  public addNewRow(): void {
    if (this.mediaNode.response[this.mediaType].findIndex(v => !v.link) === -1) {
      this.mediaNode.response[this.mediaType].push({ rows: [{ link: null }] });
    }
  }
  createPdfPreviewUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public onSaveNode(): void {
    if (this.previousNode) {
      if (!this.previousNodeValid) return;
      else {
        this.mediaNode.previous_node_id = this.previousNode.node_id;
        this.mediaNode.previous_node_name = this.previousNode.node_name;
        if (this.previousNode.type === 'text') {
          this.previousNode.total_response_node_count = this.previousNode.total_response_node_count + 1;
          this.mediaNode.sequence = this.previousNode.total_response_node_count;
          this.previousNode.state = this.previousNode.id ? 'EDITED' : 'CREATED';
          console.log(this.previousNode);
        }
      }
    }
    this.activeModal.close({ node: this.mediaNode, previousNode: this.previousNode, previousNodeEdited: this.previousNodeEdited });
  }

  public onNextNodeSelect(node: INode): void {
    this.previousNode = node;
    this.previousNodeEdited = true;
    if (node.type === 'text') {
      // this.mediaNode.intent = node.response.text.body;
      // this.intentDisabled = true;
    } else if (node.type === 'interactive') {
      this.mediaNode.intent = null;
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
    this.mediaNode.intent = intent.title;
  }
  public isNextNodeValid(isValid: boolean): void {
    this.previousNodeValid = isValid;
  }

}