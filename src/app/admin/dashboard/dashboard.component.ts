import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { INode, IConnection, DrawflowDirective } from '../../common/directives/app-drawflow.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BotEmulatorComponent } from '../bot-emulator/bot-emulator.component';
import { TextModalComponent } from '../node-modals/text/text-modal.component';
import { ButtonModalComponent } from '../node-modals/button/button-modal.component';
import { ImageModalComponent } from '../node-modals/image/image-modal.component';
import { VideoModalComponent } from '../node-modals/video/video-modal.component';
import { DocumentModalComponent } from '../node-modals/document/document-modal.component';
import { CardModalComponent } from '../node-modals/card/card-modal.component';
import { ApiModalComponent } from '../node-modals/api/api-modal.component';
import { NodeService } from '../node-select/node-list.service';
import { convertToDrawflowConnection, convertToDrawflowNode } from '../node-select/node-utils';
import { Subscription } from 'rxjs';

export type NodeType = 'text' | 'button' | 'image' | 'video' | 'document' | 'card' | 'api';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  public nodes: INode[];
  public connections: IConnection[] = [];
  @ViewChild(DrawflowDirective, { static: true }) drawflow: DrawflowDirective;
  nodeServiceSubscription: Subscription;
  constructor(private cdr: ChangeDetectorRef, private modalService: NgbModal, private nodeService: NodeService) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.nodeServiceSubscription = this.nodeService.updateInitialNodeList.subscribe((nodeList) => {
      nodeList.forEach(node => {
        node.id = this.drawflow.addNode(convertToDrawflowNode(node, this.nodeService.getDisconnectedNodes()));
        this.nodeService.updateNode(node);
      });
      nodeList.forEach(node => {
        if (this.nodeService.getPreviousNode(node)) {
          let inputId = nodeList.find(v => v.name === node.nextNodeName).id;
          this.drawflow.addNodeInput(this.nodeService.getPreviousNode(node).id);
          this.drawflow.addNodeOutput(node.id);
          this.drawflow.addConnection(convertToDrawflowConnection(node, inputId));
        }
      });
    });
  }

  public openEmulator() {
    const modalRef = this.modalService.open(BotEmulatorComponent, { modalDialogClass: 'chat-box' });
    modalRef.componentInstance.name = 'World';
  }

  public openNodeModal(type: NodeType) {
    let component;
    switch (type) {
      case 'text':
        component = TextModalComponent;
        break;
      case 'button':
        component = ButtonModalComponent;
        break;
      case 'image':
        component = ImageModalComponent;
        break;
      case 'video':
        component = VideoModalComponent;
        break;
      case 'document':
        component = DocumentModalComponent;
        break;
      case 'card':
        component = CardModalComponent;
        break;
      case 'api':
        component = ApiModalComponent;
        break;
    }
    const modalRef = this.modalService.open(component, { backdrop: 'static', size: 'lg' });
    modalRef.closed.subscribe(res => {
      this.addNode(res);
    });
  }

  private addNode(node: any) {
    this.nodeService.onAddNode(node);
    node.id = this.drawflow.addNode(convertToDrawflowNode(node, this.nodeService.getDisconnectedNodes()));
    this.nodeService.updateNode(node);
    if (this.nodeService.getPreviousNode(node)) {
      let inputId = this.nodeService.getNodes().find(v => v.name === node.nextNodeName).id;
      this.drawflow.addNodeInput(this.nodeService.getPreviousNode(node).id);
      this.drawflow.addNodeOutput(node.id);
      this.drawflow.addConnection(convertToDrawflowConnection(node, inputId));
    }
  }
  editNode(nodeId: number){
   const currentNode = this.nodeService.getNodes().find(v=>v.id === Number(nodeId));
   if(currentNode){
     const modalRef = this.modalService.open(TextModalComponent, { backdrop: 'static', size: 'lg' });
     modalRef.componentInstance.data = currentNode.data;
     modalRef.closed.subscribe(res => {
      //  this.addNode(res);
     });
   }
  }
}
