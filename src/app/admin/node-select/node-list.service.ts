import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Session } from 'src/app/common/session';

export interface INode {
  id?: number;
  tenant_id: number;
  bot_id: number;
  node_id?: number;
  node_name: string;
  type: 'interactive' | 'text' | 'image' | 'video' | 'document' | 'api';
  deleted: boolean;
  response: any;
  total_response_node_count: number;
  sequence: number;
  intent?: string;
  previous_node_id?: number;
  previous_node_name?: string;
  api_id?: number;
  state?: 'CREATED' | 'EDITED';
}

export interface ITextRepsonse {
  text: {
    body: string
  }
}

interface IMedia {
  link: string;
  provider?: {
    name: string; // additional configurations like a bearer token
  }
  caption?: string;  // 1024 chars
}

export interface IImageResponse {
  image: IMedia[];
}

export interface IVideoResponse {
  video: IMedia[];
}
export interface IDocumnentResponse {
  document: IMedia[];
}

export interface IInteractiveResponse {
  type: 'list' | 'button';
  header?: {
    type: 'text' | 'image' | 'video' | 'document';
    document?: IMedia;
    image?: IMedia;
    video?: IMedia;
    text?: string;
  },
  body: {
    text: string; //1024 chars
  },
  footer?: {
    text: string;
  },
  action: {
    button?: string; // 20 chars - required for list

    buttons?: {   // Required for Reply Button Messages.
      type: 'reply';
      reply: {
        title: string; // 20 chars
        id: string;
      }
    }[];

    sections?: { // Required for List Messages
      title: string;
      rows: {
        title: string; // 24 chars
        id: string; // 200 chars
        description?: string; // 72 chars
      }[]
    }[];

  }
}

@Injectable()
export class NodeService {
  apiPrefix: string;
  tenantId: number;

  constructor(public http: HttpClient, private session: Session) {
    this.apiPrefix = this.session.getAPIPrefix();
    this.tenantId = this.session.getTenantId();
  }

  private nodes: INode[] = [];
  private disconnectedNodes: INode[] = [];
  private deletedNodes: INode[] = [];
  updateNodes: BehaviorSubject<INode> = new BehaviorSubject<INode>(null);
  updateNodeList: BehaviorSubject<INode[]> = new BehaviorSubject<INode[]>(null);


  onAddNode(data: INode) {
    this.nodes.push(data);
    if (!data.previous_node_id) {
      this.disconnectedNodes.push(data);
    }
    this.updateNodeList.next(this.nodes);
    this.updateNodes.next(data);
  }

  getNodes(): INode[] {
    return this.nodes;
  }

  getNodeById(nodeId: number): INode {
    return this.nodes.find(v => v.node_id === Number(nodeId));
  }

  getDisconnectedNodes(): INode[] {
    return this.disconnectedNodes;
  }

  updateNode(data: INode) {
    let index = this.nodes.findIndex(v => v.node_id === data.node_id);
    this.nodes[index] = data;
    this.updateNodeList.next(this.nodes);
  }

  deleteNode(node: INode) {
    this.deletedNodes.push(node);
    let index = this.nodes.findIndex(v => v.node_id === node.node_id);
    if (index > -1) {
      this.nodes.splice(index, 1);
    }
  }

  updateInitialNodes(nodes: INode[]) {
    this.nodes = nodes;
    this.updateNodeList.next(this.nodes);
  }

  getPreviousNode(node: INode): INode {
    return this.nodes.find(v => v.node_id === node.previous_node_id);
  }

  public saveNodes() {
    const newNodes = this.nodes.filter(v => v.state === 'CREATED');
    let editedNodes = this.nodes.filter(v => v.state === 'EDITED');
    console.log(newNodes);
    console.log(editedNodes);
    if (this.deletedNodes.length) editedNodes = [...editedNodes, ...this.deletedNodes];
    if (newNodes.length) this.saveNodeListToDb(newNodes).subscribe(res => {
      for (let i = 0; i < res.length; i++) {
        let nodeIndex = this.nodes.findIndex(v => v.node_id === res[i].node_id);
        if (nodeIndex > -1) this.nodes[nodeIndex] = res[i];
      }
      this.updateNodeList.next(this.nodes);
    });
    if (editedNodes.length) this.updateNodeListToDb(editedNodes).subscribe(res => {
      for (let i = 0; i < res.length; i++) {
        let nodeIndex = this.nodes.findIndex(v => v.node_id === res[i].node_id);
        if (nodeIndex > -1) this.nodes[nodeIndex] = res[i];
      }
      this.updateNodeList.next(this.nodes);
    });
  }

  public getNodeList(botId: number): Observable<INode[]> {
    return this.http.get(`${this.apiPrefix}nodedata/list/${this.tenantId}/${botId}`)
      .pipe(
        map(this.transformNodeList.bind(this)),
      );
  }

  private saveNodeListToDb(nodes: INode[]): Observable<any> {
    return this.http.post(`${this.apiPrefix}nodedata/create`, { nodeDataCreateDTO: nodes });
  }

  private updateNodeListToDb(nodes: INode[]): Observable<any> {
    return this.http.put(`${this.apiPrefix}nodedata/update`, { nodeDataCreateDTO: nodes });
  }
  private transformNodeList(nodes: INode[]): INode[] {
    return nodes;
  }
}