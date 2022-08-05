import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import Drawflow from 'drawflow';

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
        // this.editor.drawflow = {}
        this.editor.start();
      } else {
        console.error('Drawflow host element does not exist');
      }

    } catch (exception) {
      console.error('Unable to start Drawflow', exception);
    }
  }

  public ngOnChanges(changes) {
    if (changes && changes.nodes && changes.nodes.currentValue) {
      changes.nodes.currentValue.forEach((node: INode) => {
        this.editor.addNode(node.name, node.inputs, node.outputs, node.posx, node.posy, node.className, node.data, node.html, node.typenode);
      });
    }
    if (changes && changes.connections && changes.connections.currentValue) {
      changes.connections.currentValue.forEach((connection: IConnection) => {
        this.editor.addConnection(connection.outputNodeId, connection.inputNodeId, connection.outputName, connection.inputName);
      });
    }

  }
}