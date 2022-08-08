import { Directive, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import Drawflow from 'drawflow';
import { NodeType } from '../../admin/dashboard/dashboard.component';
import { ITextNode } from '../../admin/node-modals/text/text-modal.component';
const event = new Event('build');

export interface IBaseNode {
  name: string;
  type: NodeType;
  pos_X?: number;
  pos_Y?: number;
  id?: number;
}
export interface INode {
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
  @Input() nodes: INode[];
  @Input() connections: IConnection[];
  @Output() onEditNode: EventEmitter<any>= new EventEmitter();
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
        this.editor.on('contextmenu', () => {
          console.log("contextmenu");
        });
        this.editor.on('nodeSelected', (nodeId) => {
          console.log('nodeSelected', nodeId)
          this.selectedNode = nodeId;
          console.log(this.action);
          if (this.action === 'delete') {
            this.deleteNode();
          } else if (this.action === 'edit') {
            this.editNode();
          }
        });
      
        this.editor.on('click', (e) => {
          let deleteElement: HTMLElement = e.target as HTMLElement;
          if (deleteElement.className.indexOf('btn-trash') > -1 || deleteElement.className.indexOf('bi-trash')> -1) {
            this.action = 'delete';
          } else if (deleteElement.className.indexOf('btn-edit') >-1 || deleteElement.className.indexOf('bi-pencil')> -1) {
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

  // public ngOnChanges(changes) {
  //   if (changes && changes.nodes && changes.nodes.currentValue) {
  //     changes.nodes.currentValue.forEach((node: INode) => {
  //       this.editor.addNode(node.name, node.inputs, node.outputs, node.posx, node.posy, node.className, node.data, node.html, node.typenode);
  //     });
  //   }
  //   if (changes && changes.connections && changes.connections.currentValue) {
  //     changes.connections.currentValue.forEach((connection: IConnection) => {
  //       this.editor.addConnection(connection.outputNodeId, connection.inputNodeId, connection.outputName, connection.inputName);
  //     });
  //   }
  // }

  public addNode(node: INode): number {
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
  deleteNode() {
    if (this.selectedNode) {
      this.editor.removeNodeId('node-' + this.selectedNode);
    }
  }

  public editNode() {
    this.onEditNode.emit(this.selectedNode);

  }
}