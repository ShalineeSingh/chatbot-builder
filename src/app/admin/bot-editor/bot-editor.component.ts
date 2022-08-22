import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { INode, IConnection, DrawflowDirective } from '../../common/directives/app-drawflow.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BotEmulatorComponent } from '../bot-emulator/bot-emulator.component';
import { TextModalComponent } from '../node-modals/text/text-modal.component';
import { ButtonModalComponent } from '../node-modals/button/button-modal.component';
import { CardModalComponent } from '../node-modals/card/card-modal.component';
import { ApiModalComponent } from '../node-modals/api/api-modal.component';
import { NodeService } from '../node-select/node-list.service';
import { convertToDrawflowConnection, convertToDrawflowNode } from '../node-select/node-utils';
import { Subscription } from 'rxjs';
import { MediaModalComponent } from '../node-modals/media/media-modal.component';
import { BotEditorService, INodeDataServerResponse } from './bot-editor.service';
import { Session } from '../../common/session';
import { ActivatedRoute } from '@angular/router';

export type NodeType = 'text' | 'button' | 'image' | 'video' | 'document' | 'card' | 'api';
@Component({
  selector: 'app-dashboard',
  templateUrl: './bot-editor.component.html',
  styleUrls: ['./bot-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BotEditorService],
})
export class BotEditorComponent implements OnInit {
  public nodes: INode[];
  public connections: IConnection[] = [];
  botId: number;
  @ViewChild(DrawflowDirective, { static: true }) drawflow: DrawflowDirective;
  nodeServiceSubscription: Subscription;
  constructor(private cdr: ChangeDetectorRef,
     private modalService: NgbModal,
    private botEditorService: BotEditorService,
    private session: Session,
    private route:ActivatedRoute,
      private nodeService: NodeService) {

  }

  ngOnInit(): void {
    this.botId = this.route.snapshot.params.id;
  }

  ngAfterViewInit() {
    this.nodeServiceSubscription = this.nodeService.updateInitialNodeList.subscribe((nodeList) => {
      if (nodeList) nodeList.forEach(node => {
        node.id = this.drawflow.addNode(convertToDrawflowNode(node, this.nodeService.getDisconnectedNodes()));
        this.nodeService.updateNode(node);
      });
      if (nodeList) nodeList.forEach(node => {
        if (this.nodeService.getNextNode(node)) {
          let inputId = nodeList.find(v => v.name === node.nextNodeName).id;
          this.drawflow.addNodeInput(this.nodeService.getNextNode(node).id);
          this.drawflow.addNodeOutput(node.id);
          this.drawflow.addConnection(convertToDrawflowConnection(node, inputId, 1));
        }
      });
    });
    // this.openEmulator();
    // const modalRef = this.modalService.open(CardModalComponent, { backdrop: 'static', size: 'lg' });
  }

  public openEmulator() {
    const modalRef = this.modalService.open(BotEmulatorComponent, { modalDialogClass: 'chat-box' });
  }

  public openNodeModal(type: NodeType) {
    let component;
    let mediaType;
    switch (type) {
      case 'text':
        component = TextModalComponent;
        break;
      case 'button':
        component = ButtonModalComponent;
        break;
      case 'image':
        mediaType = 'image';
        component = MediaModalComponent;
        break;
      case 'video':
        mediaType = 'video';
        component = MediaModalComponent;
        break;
      case 'document':
        mediaType = 'document';
        component = MediaModalComponent;
        break;
      case 'card':
        component = CardModalComponent;
        break;
      case 'api':
        component = ApiModalComponent;
        break;
    }
    const modalRef = this.modalService.open(component, { backdrop: 'static', size: 'lg' });
    if (mediaType) modalRef.componentInstance.mediaType = mediaType;
    modalRef.closed.subscribe(res => {
      if (res !== 'close') this.addNode(res);
    });
  }

  private addNode(node: any) {
    this.nodeService.onAddNode(node);

    node.id = this.drawflow.addNode(convertToDrawflowNode(node, this.nodeService.getDisconnectedNodes()));
    this.saveNodeToDb(node);
    if (this.nodeService.getNextNode(node)) {
      this.createConnection(node);
    }
  }

  private saveNodeToDb(node){
    let body: INodeDataServerResponse = {
      tenant_id: this.session.getTenantId(),
      bot_id: this.botId,
      node_id: node.id,
      type: node.type,
      next_node_id: 2,
      next_node_type: 'text',
      root_node: node.data.rootNode,
      deleted: false,
      response: "{}",
    }
    this.botEditorService.saveNode(body).subscribe(res => {
      console.log(res);
    })
  }

  public editNode(nodeId: number) {
    const currentNode = this.nodeService.getNodes().find(v => v.id === Number(nodeId));
    if (currentNode) {
      console.log(currentNode);
      let modalRef;
      switch (currentNode.type) {
        case 'text':
          modalRef = this.modalService.open(TextModalComponent, { backdrop: 'static', size: 'lg' });
          modalRef.componentInstance.data = currentNode.data;
          break;
        case 'button':
          modalRef = this.modalService.open(ButtonModalComponent, { backdrop: 'static', size: 'lg' });
          modalRef.componentInstance.data = currentNode;
          break;
        case 'image':
          modalRef = this.modalService.open(MediaModalComponent, { backdrop: 'static', size: 'lg' });
          modalRef.componentInstance.data = currentNode;
          modalRef.componentInstance.mediaType = 'image';
          break;
        case 'video':
          modalRef = this.modalService.open(MediaModalComponent, { backdrop: 'static', size: 'lg' });
          modalRef.componentInstance.data = currentNode;
          modalRef.componentInstance.mediaType = 'video';
          break;
        case 'document':
          modalRef = this.modalService.open(MediaModalComponent, { backdrop: 'static', size: 'lg' });
          modalRef.componentInstance.data = currentNode;
          modalRef.componentInstance.mediaType = 'document';
          break;

      }

      modalRef.closed.subscribe(node => {
        if (node !== 'close') {
          this.drawflow.updateNode(convertToDrawflowNode(node, this.nodeService.getDisconnectedNodes()));
          this.nodeService.updateNode(node);
          const nextNode = this.nodeService.getNextNode(node);
          console.log(nextNode);
          if (nextNode) {
            this.drawflow.export();
            let in_out = this.drawflow.getNodeInputOutput(node.id);
            if (!in_out[1].output_1 || in_out[1].output_1.connections.findIndex(v => Number(v.node) === nextNode.id) === -1) {
              this.createConnection(node);
            }
          }
        }
      });
    }
  }

  private createConnection(node) {
    if (node.type === 'text' || node.type === 'image' || node.type === 'document' || node.type === 'video' ) {
      let inputId = this.nodeService.getNextNode(node).id;
      this.drawflow.addNodeInput(inputId);
      this.drawflow.addNodeOutput(node.id);
      if (inputId) this.drawflow.addConnection(convertToDrawflowConnection(node, inputId, 1));
    } else {
      for (let i = 0; i < node.nextNodes.length; i++) {
        let inputId = node.nextNodes[i].nextNodeId;
        if (inputId) {
          this.drawflow.addNodeInput(inputId);
          this.drawflow.addNodeOutput(node.id);
          this.drawflow.addConnection(convertToDrawflowConnection(node, inputId, i + 1));
        }
      }
    }
  }
}
