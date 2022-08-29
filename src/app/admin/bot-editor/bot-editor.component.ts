import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IDrawflowNode, IConnection, DrawflowDirective } from '../../common/directives/app-drawflow.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BotEmulatorComponent } from '../bot-emulator/bot-emulator.component';
import { TextModalComponent } from '../node-modals/text/text-modal.component';
import { InterativeModalComponent } from '../node-modals/interactive/interactive-modal.component';
import { ApiModalComponent } from '../node-modals/api/api-modal.component';
import { INode, NodeService } from '../node-select/node-list.service';
import { convertToDrawflowConnection, convertToDrawflowNode } from '../node-select/node-utils';
import { Subscription } from 'rxjs';
import { MediaModalComponent } from '../node-modals/media/media-modal.component';
import { BotEditorService } from './bot-editor.service';
import { Session } from '../../common/session';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertConfigModel } from 'src/app/common/alert/alert-config.model';
import { AlertService } from '../../common/alert/alert.service';
import { IApi } from '../dashboard/dasboard.service';

export type NodeType = 'text' | 'button' | 'image' | 'video' | 'document' | 'card' | 'api';
@Component({
  selector: 'app-dashboard',
  templateUrl: './bot-editor.component.html',
  styleUrls: ['./bot-editor.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BotEditorService],
})
export class BotEditorComponent implements OnInit {
  botId: number;
  tenantId: number;
  saveButtonLoader: boolean;
  loading: boolean;
  @ViewChild(DrawflowDirective, { static: true }) drawflow: DrawflowDirective;
  nodeServiceSubscription: Subscription;
  workflowId: number;
  nodeList: INode[];
  unsavedChanges: boolean;
  apiList: IApi[];
  viewMode: boolean;
  activeTab: string = 'config';
  botName: string;
  constructor(
    private modalService: NgbModal,
    private botEditorService: BotEditorService,
    private session: Session,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private nodeService: NodeService,
    private router: Router,
  ) {
    this.tenantId = this.session.getTenantId();
  }

  ngOnInit(): void {
    this.botId = this.route.snapshot.params.id;
    this.route.queryParamMap.subscribe(params => {
      this.viewMode = params.get('view') ? true : false;
      this.botName = params.get('name');
    })
    // this.getNodeList();
    // this.getApiList();
    // this.getBotWorkflow();
  }

  ngAfterViewInit() {
    // this.openEmulator();
    // const modalRef = this.modalService.open(InterativeModalComponent, { backdrop: 'static', size: 'xl' });
  }

  public openEmulator() {
    const modalRef = this.modalService.open(BotEmulatorComponent, { modalDialogClass: 'chat-box' });
    modalRef.componentInstance.botId = this.botId;
    modalRef.componentInstance.tenantId = this.tenantId;
  }

  public editBot(){
    this.viewMode = false;
    this.router.navigate([`./bot/${this.botId}`]);
  }

  public zoomIn(){
    this.drawflow.zoomIn();
  }
  public zoomOut(){
    this.drawflow.zoomOut();
  }
  public zoomReset(){
    this.drawflow.zoomReset();
  }

  public changeTab(type:string){
    this.activeTab = type;
  }

  public openNodeModal(type: NodeType) {
    this.activeTab = 'botEditor';
    let component;
    let mediaType;
    switch (type) {
      case 'text':
        component = TextModalComponent;
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
        component = InterativeModalComponent;
        break;
      case 'api':
        component = ApiModalComponent;
        break;
    }
    const modalRef = this.modalService.open(component, { backdrop: 'static', size: 'lg' });
    if (mediaType) modalRef.componentInstance.mediaType = mediaType;
    modalRef.componentInstance.botId = this.botId;
    modalRef.componentInstance.tenantId = this.tenantId;
    if (type === 'api') modalRef.componentInstance.apiList = this.apiList;
    modalRef.closed.subscribe(res => {
      if (res !== 'close') this.addNode(res.node, res.previousNode, res.previousNodeEdited);
    });
  }

  private addNode(node: INode, previousNode: INode, previousNodeEdited: boolean) {
    this.unsavedChanges = true;
    node.state = 'CREATED';
    node.node_id = this.drawflow.addNode(convertToDrawflowNode(node, this.nodeService.getDisconnectedNodes()));
    this.nodeService.onAddNode(node);
    if (previousNode) {
      this.createConnection(node);
      if (previousNodeEdited) this.nodeService.updateNode(previousNode);
    }
  }
  private updateNode(node: INode, previousNode: INode, previousNodeEdited: boolean) {
    this.unsavedChanges = true;
    if (!node.state) node.state = 'EDITED';
    else node.state = 'CREATED';
    this.drawflow.updateNode(convertToDrawflowNode(node, this.nodeService.getDisconnectedNodes()));
    this.nodeService.updateNode(node);
    if (previousNode) {
      if (previousNodeEdited) {
        this.nodeService.updateNode(previousNode);
        let inputs = this.drawflow.getNodeInputOutput(node.node_id)[0];
        let outputId;
        let outputNodeId;
        if (inputs['input_1']) {
          outputId = inputs['input_1'].connections[0].input;
          outputNodeId = inputs['input_1'].connections[0].node;
        } else {
          this.drawflow.addNodeInput(node.node_id);
        }
        let outputs = this.drawflow.getNodeInputOutput(previousNode.node_id)[1];
        let connectionChanged = true;
        for (let key in outputs) {
          for (let i = 0; i < outputs[key]['connections'].length; i++) {
            if (Number(outputs[key]['connections'][i].node) === node.node_id) {
              connectionChanged = false;
              break;
            }
          }
        }
        if (connectionChanged) {
          if (outputId) this.drawflow.removeNodeOutput(Number(outputNodeId), outputId);
          if (previousNode.node_id) {
            const outputKey = this.drawflow.addNodeOutput(previousNode.node_id);
            this.drawflow.addConnection(convertToDrawflowConnection(node.node_id, previousNode.node_id, 'input_1', outputKey));
          }
        }
      }
    }
  }

  public editNode(nodeId: number) {
    const currentNode = this.nodeService.getNodeById(nodeId);
    if (currentNode) {
      let modalRef;
      switch (currentNode.type) {
        case 'text':
          modalRef = this.modalService.open(TextModalComponent, { backdrop: 'static', size: 'lg' });
          modalRef.componentInstance.textNode = currentNode;
          break;
        case 'image':
          modalRef = this.modalService.open(MediaModalComponent, { backdrop: 'static', size: 'lg' });
          modalRef.componentInstance.mediaType = 'image';
          break;
        case 'video':
          modalRef = this.modalService.open(MediaModalComponent, { backdrop: 'static', size: 'lg' });
          modalRef.componentInstance.mediaType = 'video';
          break;
        case 'document':
          modalRef = this.modalService.open(MediaModalComponent, { backdrop: 'static', size: 'lg' });
          modalRef.componentInstance.mediaType = 'document';
          break;
        case 'interactive':
          modalRef = this.modalService.open(InterativeModalComponent, { backdrop: 'static', size: 'lg' });
          modalRef.componentInstance.interactiveNode = currentNode;
          break;
        case 'api':
          modalRef = this.modalService.open(ApiModalComponent, { backdrop: 'static', size: 'lg' });
          modalRef.componentInstance.apiNode = currentNode;
          modalRef.componentInstance.apiList = this.apiList;
          break;
        default:
          break;
      }
      modalRef.componentInstance.data = currentNode;
      modalRef.closed.subscribe(res => {
        if (res !== 'close') this.updateNode(res.node, res.previousNode, res.previousNodeEdited);
      });
    }
  }

  public deleteNode(nodeId: number){
    const currentNode = this.nodeService.getNodeById(nodeId);
    if (currentNode) {
      console.log(this.drawflow.export());
      currentNode.deleted =true;
      currentNode.state = 'EDITED';
      this.nodeService.deleteNode(currentNode);
    }
  }

  public saveBotWorkflow() {
    this.nodeService.saveNodes();
    this.saveButtonLoader = true;
    let body = {
      tenant_id: this.tenantId,
      bot_id: this.botId,
      design: this.drawflow.export(),
      status: 'DRAFT',
      deleted: false
    }
    let serviceToCall = this.workflowId ? this.botEditorService.updateBotWorkflow(body, this.workflowId) : this.botEditorService.saveBotWorkflow(body);
    serviceToCall.subscribe(res => {
      this.unsavedChanges = false;
      const config: AlertConfigModel = {
        type: 'success',
        message: this.workflowId ? "Workflow updated successfully" : "Workflow saved successfully",
      };
      this.alertService.configSubject.next(config);
    }, (error) => {
      const config: AlertConfigModel = {
        type: 'danger',
        message: error.message,
      };
      this.alertService.configSubject.next(config);
    }, ()=>this.saveButtonLoader = false);
  }

  public saveConfigurations(){
    // todo: implement this
  }
  private getBotWorkflow() {
    this.loading = true;
    this.botEditorService.getBotWorkflow(this.tenantId, this.botId).subscribe(res => {
      this.workflowId = res.id;
      this.drawflow.import(res.design);
    }, (error) => {
      const config: AlertConfigModel = {
        type: 'danger',
        message: error.message,
      };
      this.alertService.configSubject.next(config);
    }).add(() => this.loading = false)
  }

  private getNodeList() {
    this.nodeService.getNodeList(this.botId).subscribe(res => {
      this.nodeList = res;
      this.nodeService.updateInitialNodes(this.nodeList);
    }, (error) => {
      const config: AlertConfigModel = {
        type: 'danger',
        message: error.message,
      };
      this.alertService.configSubject.next(config);
    });
  }

  private getApiList() {
    this.botEditorService.getApiList(this.tenantId).subscribe(res => {
      this.apiList = res;
    }, (error) => {
      const config: AlertConfigModel = {
        type: 'danger',
        message: error.message,
      };
      this.alertService.configSubject.next(config);
    });
  }
  

  private createConnection(node: INode) {
    let previousNodeId = this.nodeService.getPreviousNode(node).node_id;
    const inputKey = this.drawflow.addNodeInput(node.node_id);
    const outputKey = this.drawflow.addNodeOutput(previousNodeId);
    // let inputOutput = this.drawflow.getNodeInputOutput(previousNodeId);
    if (previousNodeId)
      this.drawflow.addConnection(convertToDrawflowConnection(node.node_id, previousNodeId, inputKey, outputKey));
  }
}
