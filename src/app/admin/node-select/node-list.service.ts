import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ITextNode } from '../node-modals/text/text-modal.component';

@Injectable()
export class NodeService {
  private nodes: ITextNode[] = [];
  private disconnectedNodes: ITextNode[] = [];
  updateNodes: BehaviorSubject<ITextNode> = new BehaviorSubject<ITextNode>(null);
  updateNodeList: BehaviorSubject<ITextNode[]> = new BehaviorSubject<ITextNode[]>(null);
  updateInitialNodeList: BehaviorSubject<ITextNode[]> = new BehaviorSubject<ITextNode[]>(null);

  tempNodes: ITextNode[] = [
    {
      nextNodeName: null,
      content: "hello there",
      name: 'node1',
      type: 'text',
      pos_X: 150,
      pos_Y: 100,
      data:{
        nodeName: 'node1',
        htmlText: "hello there",
        tempNextNodeId: null,
        expectsUserInput: true,
        isShowTyping: true,
        sliderValue: 5,
        rootNode: true,
        id: 1,
      }
    },
    {
      content: "how are you?",
      name: 'node2',
      type: 'text',
      pos_X: 450,
      pos_Y: 100,
      data: {
        nodeName: 'node2',
        htmlText: "how are you?",
        tempNextNodeId: null,
        expectsUserInput: true,
        isShowTyping: true,
        sliderValue: 5,
        id:2,
      }
    }
  ]
  constructor() {
    this.onAddNodeList(this.tempNodes);
  }

  onAddNode(data: ITextNode) {
    this.nodes.push(data);
    if (!data.nextNodeName || data.nextNodeName === '') {
      this.disconnectedNodes.push(data);
    }
    this.updateNodeList.next(this.nodes);
    this.updateNodes.next(data);
  }

  onAddNodeList(nodes: ITextNode[]) {
    this.nodes = [...this.nodes, ...nodes];
    nodes.forEach(data => {
      if (!data.nextNodeName || data.nextNodeName === '') {
        this.disconnectedNodes.push(data);
      }
    });
    this.updateInitialNodeList.next(this.nodes);
  }

  getNodes(): ITextNode[] {
    return this.nodes;
  }

  getDisconnectedNodes(): ITextNode[] {
    return this.disconnectedNodes;
  }

  updateNode(data: ITextNode) {
    let index = this.nodes.findIndex(v => v.name === data.name);
    this.nodes[index] = data;
    this.updateNodeList.next(this.nodes);
  }

  getNextNode(node) {
    return this.nodes.find(v => v.name === node.nextNodeName);
  }
}