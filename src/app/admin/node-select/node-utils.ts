import { IDrawflowNode } from "src/app/common/directives/app-drawflow.directive";
import { IConnection } from '../../common/directives/app-drawflow.directive';
import { INode } from '../node-modals/node.service';

export function convertToDrawflowNode(node: INode, disconnectedNodes: INode[]): IDrawflowNode {
  let index = disconnectedNodes.findIndex(v => v.node_name === node.node_name);
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

export function convertToDrawflowConnection(node: any, previousId: number, index: number): IConnection {
  return {
    outputNodeId: node.id,
    inputNodeId: previousId,
    outputName: 'output_' + index,
    inputName: 'input_1'
  }
}
export function createTextCanvasContent(node: INode): string {
  let content = `<div class="canvas-node" data-node="${node.node_name}">
      <div class="node-heading">
        <span>${node.node_name}</span>
        <span class="float-end px-2 pointer btn-trash" title="delete node"> <i class="fs-6 bi-trash"></i></span>
        <span class="float-end px-2 pointer btn-edit" title="edit node"> <i class="fs-6 bi-pencil"></i></span>
      </div>
      <div class="node-body">`;
  switch (node.type) {
    case 'text':
      content += `${node.response.text.body}`;
      break;
    // case 'image':
    //   for (let i = 0; i < node.content.length; i++) {
    //     // TODO: fix edit here and add image here
    //     content += `image_${i}`
    //   }
    //   break;
  }
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