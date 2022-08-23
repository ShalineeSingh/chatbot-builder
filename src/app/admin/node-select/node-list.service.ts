import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class NodeService {
  private nodes: any[] = [];
  private disconnectedNodes: any[] = [];
  updateNodes: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  updateNodeList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
  updateInitialNodeList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);

  tempNodes: any[] = [
    {
      nextNodeName: 'greeting1',
      content: "Hi Shalinee",
      name: 'greeting',
      type: 'text',
      pos_X: 150,
      pos_Y: 100,
      expectsUserInput: true,
      isShowTyping: true,
      data: {
        nodeName: 'greeting',
        htmlText: "Hi Shalinee",
        tempNextNodeId: 'greeting1',
        expectsUserInput: true,
        isShowTyping: true,
        sliderValue: 5,
        rootNode: true,
        id: 1,
        // previousNode
      }
    },
    {
      content: "how are you?",
      name: 'greeting1',
      type: 'text',
      pos_X: 450,
      pos_Y: 100,
      expectsUserInput: true,
      isShowTyping: true,
      nextNodeName: 'welcome_node',
      data: {
        nodeName: 'greeting1',
        htmlText: "how are you?",
        tempNextNodeId: 'welcome_node',
        expectsUserInput: true,
        isShowTyping: true,
        sliderValue: 5,
        id: 2,
      }
    },
    {
      content: "Welcome to bot builder",
      name: 'welcome_node',
      type: 'text',
      pos_X: 750,
      pos_Y: 100,
      expectsUserInput: true,
      isShowTyping: true,
      data: {
        nodeName: 'welcome_node',
        htmlText: "Welcome to bot builder",
        tempNextNodeId: null,
        expectsUserInput: true,
        isShowTyping: true,
        sliderValue: 5,
        id: 3,
      }
    }
  ]
  constructor() {
    this.onAddNodeList(this.tempNodes);
  }

  onAddNode(data: any) {
    this.nodes.push(data);
    if (!data.nextNodeName || data.nextNodeName === '') {
      this.disconnectedNodes.push(data);
    }
    this.updateNodeList.next(this.nodes);
    this.updateNodes.next(data);
  }

  onAddNodeList(nodes: any[]) {
    this.nodes = [...this.nodes, ...nodes];
    nodes.forEach(data => {
      if (!data.nextNodeName || data.nextNodeName === '') {
        this.disconnectedNodes.push(data);
      }
    });
    this.updateInitialNodeList.next(this.nodes);
  }

  getNodes(): any[] {
    return this.nodes;
  }

  getDisconnectedNodes(): any[] {
    return this.disconnectedNodes;
  }

  updateNode(data: any) {
    let index = this.nodes.findIndex(v => v.name === data.name);
    this.nodes[index] = data;
    this.updateNodeList.next(this.nodes);
  }

  getNextNode(node) {
    if (node.type === 'text') {
      return this.nodes.find(v => v.name === node.nextNodeName);
    } else if (node.type === 'image' || node.type === 'document' || node.type === 'video'){
      return this.nodes.find(v => v.name === node.nextNode.nextNodeName);
    } 
    else {
      return node.nextNodes.length;
    }
  }
}