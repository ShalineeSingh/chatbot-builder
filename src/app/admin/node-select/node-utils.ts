import { INode } from "src/app/common/directives/app-drawflow.directive";
import { IConnection } from '../../common/directives/app-drawflow.directive';

export function convertToDrawflowNode(node: any, disconnectedNodes: any[]): INode {
  let index = disconnectedNodes.findIndex(v => v.name === node.name);
  return {
    name: node.name,
    inputs: 0,
    outputs: 0,
    posx: !(index === -1 || node.pos_X) ? calculatePosition(node.name, index, disconnectedNodes).x : node.pos_X,
    posy: !(index === -1 || node.pos_Y) ? calculatePosition(node.name, index, disconnectedNodes).y : node.pos_Y,
    className: 'node',
    data: node.data || node, // TODO: check if data can be removed completely
    html: createTextCanvasContent(node),
    typenode: false,
  }
}

export function convertToDrawflowConnection(node: any, previousId: number, index: number): IConnection {
  return {
    outputNodeId: node.id,
    inputNodeId: previousId,
    outputName: 'output_' + index,
    inputName: 'input_1'
  }
}
export function createTextCanvasContent(node: any): string {
  let content = `<div class="canvas-node" data-node="${node.name}">
      <div class="node-heading">
        <span>${node.name}</span>
        <span class="float-end px-2 pointer btn-trash" title="delete node"> <i class="fs-6 bi-trash"></i></span>
        <span class="float-end px-2 pointer btn-edit" title="edit node"> <i class="fs-6 bi-pencil"></i></span>
      </div>
      <div class="node-body">`;
  switch (node.type) {
    case 'text':
      content += `${node.data.htmlText}`;
      break;
    case 'button':
      for (let i = 0; i < node.content.length; i++) {
        // TODO: fix edit here
        content += `<button type="button" class="btn btn-primary cursor-auto mb-1 d-block">${node.content[i].buttonText}</button>`;
      }
      break;
    case 'image':
      for (let i = 0; i < node.content.length; i++) {
        // TODO: fix edit here and add image here
        content += `image_${i}`
      }
      break;
  }
  content += `</div></div>`;

  return content;
}

function calculatePosition(name: string, nodeIndex: number, nodes: any[]): { x: number, y: number } {
  const cardWidth = 250; //textnode
  const cardHeight = 100; // approx
  let row = Math.floor(nodeIndex / 5);
  let col = (nodeIndex % 5);
  let x = (cardWidth * col) + 10;
  let y = (cardHeight * row) + 10;
  return { x, y }
}