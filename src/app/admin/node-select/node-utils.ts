import { INode } from "src/app/common/directives/app-drawflow.directive";
import { ITextNode } from '../node-modals/text/text-modal.component';
import { IConnection } from '../../common/directives/app-drawflow.directive';

export function convertToDrawflowNode(node: ITextNode, disconnectedNodes: ITextNode[]): INode {
  let index = disconnectedNodes.findIndex(v => v.name === node.name);
  return {
    name: node.name,
    inputs: 0,
    outputs: 0,
    posx: !(index === -1 || node.pos_X) ? calculatePosition(node.name, index, disconnectedNodes).x : node.pos_X,
    posy: !(index === -1 || node.pos_Y) ? calculatePosition(node.name, index, disconnectedNodes).y : node.pos_Y,
    className: 'text-node',
    data: {},
    html: createTextCanvasContent(node),
    typenode: false,
  }
}

export function convertToDrawflowConnection(node: ITextNode, previousId: number): IConnection {
  return {
    outputNodeId: node.id,
    inputNodeId: previousId,
    outputName: 'output_1',
    inputName: 'input_1'
  }

}
export function createTextCanvasContent(node: ITextNode): string {
  let content = ` <div class="canvas-node" data-node="${node.name}">
      <div class="node-heading">
        <span>${node.name}</span>
        <span class="float-end px-2 pointer btn-trash" title="delete node"> <i class="fs-6 bi-trash"></i></span>
        <span class="float-end px-2 pointer btn-edit" title="edit node"> <i class="fs-6 bi-pencil"></i></span>
      </div>
      <div class="node-body">
        ${node.content}
      </div>
    </div>`;

  return content;
}

function calculatePosition(name: string, nodeIndex: number, nodes: ITextNode[]): { x: number, y: number } {
  const cardWidth = 250; //textnode
  const cardHeight = 100; // approx
  let row = Math.floor(nodeIndex / 5);
  let col = (nodeIndex % 5);
  let x = (cardWidth * col) + 10;
  let y = (cardHeight * row) + 10;
  return { x, y }
}