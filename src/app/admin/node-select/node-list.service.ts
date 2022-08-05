import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ITextNode } from '../node-modals/text/text-modal.component';

@Injectable()
export class NodeService {
  private nodes: ITextNode[] = [
    {
      nextNodeId: 'node2',
      content: "hello there",
      name: 'node1',
      type: 'text'
    },
    {
      nextNodeId: 'node3',
      content: "hello there",
      name: 'node2',
      type: 'text'
    }
  ];
  updateNodes: Subject<any> = new Subject<any>();

  constructor() { }

  onAddNode(data: ITextNode) {
    this.nodes.push(data);
    this.updateNodes.next(this.nodes);
  }

  getNodes(): ITextNode[] {
    return this.nodes;
  }
}