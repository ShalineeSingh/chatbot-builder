import { Component, EventEmitter, Input, Output, SimpleChange, ViewChild } from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, OperatorFunction, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NodeService } from './node-list.service';
import { INode } from '../node-modals/node.service';

@Component({
  selector: 'node-select',
  templateUrl: './node-select.html',
})
export class NodeSelectComponent {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  selectedNode: INode;
  
  @Input() currentNodeName: string;
  @Input() nodeId: number;
  @Input() nodeName: string;
  
  nodeList: INode[];
  nodeServiceSubscription: Subscription;
  invalidNode: boolean;
  @Output() onNextNodeSelect: EventEmitter<any> = new EventEmitter();
  @Output() isNextNodeValid: EventEmitter<boolean> = new EventEmitter();

  constructor(private nodeService: NodeService) {
    this.nodeList = this.nodeService.getNodes();
    this.nodeServiceSubscription = this.nodeService.updateNodeList.subscribe((value) => {
     if(value) this.nodeList = [...value];
    });
    
  }

  ngOnInit(){
    if (this.nodeId) {
      this.selectedNode = this.nodeList.find(v=>v.node_id === this.nodeId);
      this.checkValidity(this.selectedNode.node_name);
    }
  }

  public ngOnChanges(changes: SimpleChange) {
    if (changes['currentNodeName'] && changes['currentNodeName'].currentValue) {
      if (this.currentNodeName && this.currentNodeName !== '') {
        const current = this.nodeList.findIndex(v => v.node_name === this.currentNodeName);
        if (current > -1) {
          this.nodeList.splice(current, 1);
          this.checkValidity(this.selectedNode && this.selectedNode.node_name);
        }
      }
    }
  }

  ngOnDestroy() {
    this.nodeServiceSubscription.unsubscribe();
  }

  search: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => {
        this.invalidNode = false;
        return (term === '' ? this.nodeList
          : this.nodeList.filter(v => v.node_name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10)
      })
    );
  };

  public formatter = (result: any) => result.node_name;

  public onUpdateValue(event) {
    this.onNextNodeSelect.emit(event.item);
  }

  public checkValidity(nodename: string): void {
    if (nodename && nodename !== '') {
      const nodeIndex = this.nodeList.findIndex(v => v.node_name === nodename);
      if (nodeIndex === -1) this.invalidNode = true;
      else this.invalidNode = false;
      this.isNextNodeValid.emit(!this.invalidNode);
    }
  }
}