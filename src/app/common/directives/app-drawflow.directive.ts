import { Directive, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import Drawflow from 'drawflow';

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
  @Output() onEditNode: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteNode: EventEmitter<any> = new EventEmitter();
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
    if (node.data.previous_node_id) {
      const pos = this.getUpdatedPosition(node.data.previous_node_id);
      node.posx = pos.x;
      node.posy = pos.y;
    }
    return this.editor.addNode(node.name, node.inputs, node.outputs, node.posx, node.posy, node.className, node.data, node.html, node.typenode);
  }

  public addConnection(connection: IConnection) {
    this.editor.addConnection(connection.outputNodeId, connection.inputNodeId, connection.outputName, connection.inputName);
  }

  public addNodeInput(nodeId: number): string {
    this.editor.addNodeInput(nodeId);
    return Object.keys(this.editor.getNodeFromId(nodeId).inputs).pop();
  }
  public addNodeOutput(nodeId: number): string {
    this.editor.addNodeOutput(nodeId);
    return Object.keys(this.editor.getNodeFromId(nodeId).outputs).pop();
  }

  public removeNodeOutput(nodeId: number, outputName: string) {
    this.editor.removeNodeOutput(nodeId, outputName);
  }

  public updateNode(node: IDrawflowNode) {
    this.editor.updateNodeDataFromId(node.data.node_id, node.data);
    let el = this.hostElRef.nativeElement as HTMLElement
    const type = node.data.type.charAt(0).toUpperCase() + node.data.type.slice(1);
    el.querySelector(`#node-${node.data.node_id} .node-heading span`).innerHTML = node.name;
    el.querySelector(`#node-${node.data.node_id} .node-body`).innerHTML = `<p>Type: ${type}</p>Intent: ${node.data.intent ? node.data.intent : '-'}`;
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
      const canvasObjects = this.export();
      let data = canvasObjects['drawflow']['Home']['data'][this.selectedNode];
      let outputValue = data['inputs']['input_1'] ? data['inputs']['input_1'].connections[0] : null;   
      for (let key in data['outputs']){
        let inputValue = data['outputs'][key].connections[0];
        if (inputValue) this.editor.removeNodeInput(inputValue.node, inputValue['output']);
      }     
      if (outputValue) this.editor.removeNodeOutput(outputValue.node, outputValue.input);
      this.editor.removeNodeId('node-' + this.selectedNode);
      this.onDeleteNode.emit(this.selectedNode);
    }
  }

  getUpdatedPosition(previousNodeId: number) {
    const canvasObjects = this.editor.export();
    let data = canvasObjects['drawflow']['Home']['data'];
    let prevNode = data[previousNodeId];
    return { x: prevNode.pos_x + 300, y: prevNode.pos_y };

  }

  public editNode() {
    this.onEditNode.emit(this.selectedNode);
  }

  public updateNodeConnections(nodeId) {
    this.editor.updateConnectionNodes('node-' + nodeId);
  }

  public getNodeInputOutput(nodeId) {
    return [this.editor.getNodeFromId(nodeId).inputs, this.editor.getNodeFromId(nodeId).outputs];
  }
  public export() {
    return this.editor.export();
  }

  public import(res) {
    this.editor.import(res);
  }

  public zoomIn() {
    this.editor.zoom_in();
    // zoom_refresh
  }
  public zoomOut() {
    this.editor.zoom_out();
  }

  public zoomReset() {
    this.editor.zoom_reset();
  }


}