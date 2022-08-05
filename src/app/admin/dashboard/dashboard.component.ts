import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { INode, IConnection } from '../../common/directives/app-drawflow.directive';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BotEmulatorComponent } from '../bot-emulator/bot-emulator.component';
import { TextModalComponent } from '../node-modals/text/text-modal.component';
import { ButtonModalComponent } from '../node-modals/button/button-modal.component';
import { ImageModalComponent } from '../node-modals/image/image-modal.component';
import { VideoModalComponent } from '../node-modals/video/video-modal.component';
import { DocumentModalComponent } from '../node-modals/document/document-modal.component';
import { CardModalComponent } from '../node-modals/card/card-modal.component';
import { ApiModalComponent } from '../node-modals/api/api-modal.component';
import { NodeService } from '../node-select/node-list.service';

export type NodeType = 'text' | 'button' | 'image' | 'video' | 'document' | 'card' | 'api';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  public nodes: INode[];
  public connections: IConnection[];

  constructor(private cdr: ChangeDetectorRef, private modalService: NgbModal, private nodeService: NodeService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const data = {
      name: ''
    };
    this.nodes = [];
    this.connections = [];
    this.nodes.push({ name: 'foo', inputs: 1, outputs: 2, posx: 100, posy: 200, className: 'foo', data: data, html: 'Foo', typenode: false });
    this.nodes.push({ name: 'bar', inputs: 1, outputs: 1, posx: 400, posy: 100, className: 'bar', data: data, html: 'Bar A', typenode: false });
    this.nodes.push({ name: 'bar', inputs: 1, outputs: 1, posx: 400, posy: 300, className: 'bar', data: data, html: 'Bar B', typenode: false });

    this.connections.push({ outputNodeId: 1, inputNodeId: 2, outputName: "output_1", inputName: "input_1" });
    this.connections.push({ outputNodeId: 1, inputNodeId: 3, outputName: "output_1", inputName: "input_1" });
    this.cdr.detectChanges();
    this.modalService.open(TextModalComponent, { backdrop: 'static', size: 'lg' });
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
  }
}
