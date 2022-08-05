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

type NodeType = 'text' | 'button' | 'image' | 'video' | 'document' | 'card' | 'api';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  public nodes: INode[];
  public connections: IConnection[];

  constructor(private cdr: ChangeDetectorRef, private modalService: NgbModal) {
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
    let modalRef: NgbModalRef;
    switch (type) {
      case 'text':
        modalRef = this.modalService.open(TextModalComponent, { backdrop: 'static', size:'xl' });
        modalRef.closed.subscribe(res => console.log(res));
        break;
      case 'button':
        modalRef = this.modalService.open(ButtonModalComponent, { backdrop: 'static' });
        modalRef.closed.subscribe(res => console.log(res));
        break;
      case 'image':
        modalRef = this.modalService.open(ImageModalComponent, { backdrop: 'static' });
        modalRef.closed.subscribe(res => console.log(res));
        break;
      case 'video':
        modalRef = this.modalService.open(VideoModalComponent, { backdrop: 'static' });
        modalRef.closed.subscribe(res => console.log(res));
        break;
      case 'document':
        modalRef = this.modalService.open(DocumentModalComponent, { backdrop: 'static' });
        modalRef.closed.subscribe(res => console.log(res));
        break;
      case 'card':
        modalRef = this.modalService.open(CardModalComponent, { backdrop: 'static' });
        modalRef.closed.subscribe(res => console.log(res));
        break;
      case 'api':
        modalRef = this.modalService.open(ApiModalComponent, { backdrop: 'static' });
        modalRef.closed.subscribe(res => console.log(res));
        break;
    }
  }
}
