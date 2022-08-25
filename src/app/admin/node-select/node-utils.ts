import { IDrawflowNode } from "src/app/common/directives/app-drawflow.directive";
import { IConnection } from '../../common/directives/app-drawflow.directive';
import { INode } from "./node-list.service";

export function convertToDrawflowNode(node: INode, disconnectedNodes: INode[]): IDrawflowNode {
  let index = disconnectedNodes.length;
  return {
    name: node.node_name,
    inputs: 0,
    outputs: 0,
    posx: calculatePosition(index).x,
    posy: calculatePosition(index).y,
    className: 'node',
    data: node,
    html: createTextCanvasContent(node),
    typenode: false,
  }
}

export function convertToDrawflowConnection(input: number, output: number, inputIndex: string, outputIndex: string): IConnection {
  return {
    outputNodeId: output,
    inputNodeId: input,
    outputName: outputIndex,
    inputName: inputIndex,
  }
}
export function createTextCanvasContent(node: INode): string {
  const type = node.type.charAt(0).toUpperCase() + node.type.slice(1);
  let content = `<div class="canvas-node" data-node="${node.node_name}">
      <div class="node-heading">
        <span>${node.node_name}</span>
        <span class="float-end px-2 pointer btn-trash" title="delete node"> <i class="fs-6 bi-trash"></i></span>
        <span class="float-end px-2 pointer btn-edit" title="edit node"> <i class="fs-6 bi-pencil"></i></span>
      </div>
      <div class="node-body very-small">`;
  content += `<p>Type: ${type}</p>`;
  content += `Intent: ${node.intent ? node.intent : '-'}`;
  content += `</div></div>`;
  return content;
}

function calculatePosition(nodeIndex: number): { x: number, y: number } {
  const cardWidth = 250; //textnode
  const cardHeight = 100; // approx
  let row = Math.floor(nodeIndex / 5);
  let col = (nodeIndex % 5);
  let x = (cardWidth * col) + 10;
  let y = (cardHeight * row) + 10;
  return { x, y }
}