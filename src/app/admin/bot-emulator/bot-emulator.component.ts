import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NodeService } from '../node-select/node-list.service';

/* ---NEEDED for bot to show
 [nodeId]:  {
type
content
nextNodName - this can be array
isShowTyping
sliderValue
  }
  */

@Component({
  selector: 'ngbd-modal-content',
  styleUrls: ['./bot-emulator.component.scss'],
  templateUrl: './bot-emulator.component.html',
  encapsulation: ViewEncapsulation.None
})
export class BotEmulatorComponent {
  nodeList: any[];
  rootNode: any;
  convo: any[] = [];
  showTyping: boolean = false;
  nodeMap = {};
  userInput: string;
  constructor(public activeModal: NgbActiveModal, private nodeService: NodeService) { }
  ngOnInit() {
    this.nodeList = this.nodeService.getNodes();

    this.rootNode = this.nodeList.filter(v => v.data.rootNode)[0];
    if (this.rootNode) {
      this.transformNode(this.rootNode);
      this.convo.push(this.nodeMap[this.rootNode.name]);
      if (this.rootNode.data.isShowTyping) this.addTyping(this.rootNode.data.sliderValue, this.rootNode.nextNodeName);
    }
  }

  addTyping(delay: number, nodeName: string) {
    this.showTyping = true;
    setTimeout(() => {
      this.showTyping = false;
      if (nodeName) this.getNextNode(nodeName);
    }, delay * 1000)
  }

  transformNode(node) {
   this.nodeMap[node.name] = {
      'type': node.type,
      'content': node.content,
      'nextNodeName': node.nextNodeName,
      'isShowTyping': node.data.isShowTyping,
      'sliderValue': node.data.sliderValue,
    }
  }
  getNextNode(nodeName: string) {
    // get node details from BE
    this.showTyping = false;
    const nextNode = this.nodeList.find(v => v.name === nodeName);
    this.transformNode(nextNode);
    this.convo.push(this.nodeMap[nodeName]);
    if (this.nodeMap[nodeName].isShowTyping) {
      setTimeout(() => {
        this.addTyping(this.nodeMap[nodeName].sliderValue, this.nodeMap[nodeName].nextNodeName);
      }, 1000)
    }
  }
}