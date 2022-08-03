import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { INode, IConnection } from '../../common/directives/app-drawflow.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BotEmulatorComponent } from '../bot-emulator/bot-emulator.component';

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
  }

  public openEmulator(){
    const modalRef = this.modalService.open(BotEmulatorComponent);
    modalRef.componentInstance.name = 'World';
  }
}
