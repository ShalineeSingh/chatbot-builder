import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { IBot, IApi } from '../../dashboard/dasboard.service';
import { INode } from '../../node-select/node-list.service';
import { QUILL_CONFIG } from '../../../common/utils';

@Component({
  selector: 'api-modal',
  styleUrls: ['./api-modal.component.scss'],
  templateUrl: './api-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ApiModalComponent {
  @Input() apiNode: INode;
  @Input() apiList: IApi[] = [];
  @Input() botId: number;
  @Input() tenantId: number;
  previousNodeValid: boolean;
  previousNode: INode;
  intentDisabled: boolean;
  previousNodeEdited: boolean;
  availableIntents;
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  invalidNode: boolean;
  selectedApi: IApi;
  submitAttempt: boolean;
  quillConfig = QUILL_CONFIG;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    if (!this.apiNode) {
      this.apiNode = {
        type: 'api',
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
    } else {
      console.log(this.apiNode.api_id);
      this.selectedApi = this.apiList.find(v => v.id === this.apiNode.api_id);
    }
  }
  public onSaveNode() {
    this.apiNode.api_id = this.selectedApi.id;
    if (this.previousNode) {
      if (!this.previousNodeValid) return;
      else {
        this.apiNode.previous_node_id = this.previousNode.node_id;
        this.apiNode.previous_node_name = this.previousNode.node_name;
        if (this.previousNode.type === 'text') {
          this.previousNode.total_response_node_count = this.previousNode.total_response_node_count + 1;
          this.apiNode.sequence = this.previousNode.total_response_node_count;
          this.previousNode.state = this.previousNode.id ? 'EDITED' : 'CREATED';
        }
      }
    }
    this.activeModal.close({ node: this.apiNode, previousNode: this.previousNode, previousNodeEdited: this.previousNodeEdited });
  }

  public onNextNodeSelect(node: INode): void {
    this.previousNode = node;
    this.previousNodeEdited = true;
    if (node.type === 'text') {
      this.apiNode.intent = node.response.text.body;
      this.intentDisabled = true;
    } else if (node.type === 'interactive') {
      this.apiNode.intent = null;
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
    this.apiNode.intent = intent.title;
  }
  public isNextNodeValid(isValid: boolean): void {
    this.previousNodeValid = isValid;
  }

  search: OperatorFunction<string, readonly IApi[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => {
        this.previousNodeValid = false;
        return (term === '' ? this.apiList
          : this.apiList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10)
      })
    );
  };

  public formatter = (result: IBot) => result.name;

  public checkValidity(nodename: string): void {
    if (nodename && nodename !== '') {
      const nodeIndex = this.apiList.findIndex(v => v.name === nodename);
      if (nodeIndex === -1) this.invalidNode = true;
      else this.invalidNode = false;
      // this.isNextNodeValid.emit(!this.invalidNode);
    }
  }
}