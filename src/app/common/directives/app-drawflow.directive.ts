import { Directive, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import Drawflow from 'drawflow';
import { NodeType } from '../../admin/bot-editor/bot-editor.component';

export interface IDrawflowNode {
  name: string, inputs: number, outputs: number, posx: number, posy: number, className: string, data: any, html: string, typenode: string | boolean
}

export interface IConnection {
  outputNodeId: string | number, inputNodeId: string | number, outputName: string, inputName: string
}

@Directive({
  selector: '[appNgDrawFlow]'
})
export class DrawflowDirective implements OnInit {
  editor: Drawflow | undefined;
  @Input() nodes: IDrawflowNode[];
  @Input() connections: IConnection[];
  @Output() onEditNode: EventEmitter<any> = new EventEmitter();
  private selectedNode: number;
  private action: 'edit' | 'delete';

  constructor(private hostElRef: ElementRef) { }

  ngOnInit() {
    if (!!this.hostElRef?.nativeElement) {
      const { nativeElement } = this.hostElRef;
      this.initDrawFlow(nativeElement);
    }
  }

  private initDrawFlow(el: HTMLElement): void {
    try {
      if (!!el) {
        this.editor = new Drawflow(el);
        this.editor.reroute = true;
        this.editor.editor_mode = 'edit';
        this.editor.start();
        this.editor.on('nodeMoved', () => {
          console.log("nodeMoved");
        });
        this.editor.on('nodeSelected', (nodeId) => {
          this.selectedNode = nodeId;
          setTimeout(() => {
            if (this.action === 'delete') {
              this.deleteNode();
            } else if (this.action === 'edit') {
              this.editNode();
            }
          }, 0)

        });

        this.editor.on('click', (e) => {
          let deleteElement: HTMLElement = e.target as HTMLElement;
          if (deleteElement.className.indexOf('btn-trash') > -1 || deleteElement.className.indexOf('bi-trash') > -1) {
            this.action = 'delete';
          } else if (deleteElement.className.indexOf('btn-edit') > -1 || deleteElement.className.indexOf('bi-pencil') > -1) {
            this.action = 'edit';
          } else this.action = null;
        });
      } else {
        console.error('Drawflow host element does not exist');
      }

    } catch (exception) {
      console.error('Unable to start Drawflow', exception);
    }
  }


  public addNode(node: IDrawflowNode): number {
    node.data = {};
    return this.editor.addNode(node.name, node.inputs, node.outputs, node.posx, node.posy, node.className, node.data, node.html, node.typenode);
  }

  public addConnection(connection: IConnection) {
    this.editor.addConnection(connection.outputNodeId, connection.inputNodeId, connection.outputName, connection.inputName);
  }

  public addNodeInput(nodeId: number) {
    this.editor.addNodeInput(nodeId);
  }
  public addNodeOutput(nodeId: number) {
    this.editor.addNodeOutput(nodeId);
  }

  public updateNode(node: IDrawflowNode) {
    this.editor.updateNodeDataFromId(node.data.id, node.data);
    let el = this.hostElRef.nativeElement as HTMLElement
    el.querySelector(`#node-${node.data.id} .node-heading span`).innerHTML = node.name;
    el.querySelector(`#node-${node.data.id} .node-body`).innerHTML = node.data.htmlText;
  }

  // not working
  unselectNode(nodeId) {
    let el = this.hostElRef.nativeElement as HTMLElement
    el.querySelector('#node-' + nodeId).classList.remove('selected');

    let evt = new MouseEvent('nodeMoved', {
      view: window,
      bubbles: true,
      cancelable: false,
    });
    document.querySelector(`#node-${nodeId} .drawflow_content_node`).dispatchEvent(evt);
  }

  deleteNode() {
    if (this.selectedNode) {
      this.editor.removeNodeId('node-' + this.selectedNode);
    }
  }

  public editNode() {
    this.onEditNode.emit(this.selectedNode);
  }

  public updateNodeConnections(nodeId) {
    this.editor.updateConnectionNodes('node-' + nodeId);
  }

  public getNodeInputOutput(nodeId){
    return [this.editor.getNodeFromId(nodeId).inputs, this.editor.getNodeFromId(nodeId).outputs];
  }
  public export() {
   console.log(this.editor.export());
  }

}