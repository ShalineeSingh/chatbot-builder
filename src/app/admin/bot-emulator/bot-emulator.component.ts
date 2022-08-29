import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NodeService } from '../node-select/node-list.service';
import { BotEditorService } from '../bot-editor/bot-editor.service';
@Component({
  selector: 'ngbd-modal-content',
  styleUrls: ['./bot-emulator.component.scss'],
  templateUrl: './bot-emulator.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [BotEditorService],
})
export class BotEmulatorComponent {
  @Input() botId: number;
  @Input() tenantId: number;
  botResponseError: boolean;

  nodeList: any[];
  rootNode: any;
  convo: any[] = [];
 
  nodeMap = {};
  userInput: string;
  constructor(public activeModal: NgbActiveModal, private botEditorService: BotEditorService) { }


  ngOnInit() {
    this.getBotResponse();
  }

  sendUserInput(){
    this.convo.push({ type: 'text',content: this.userInput});
    this.getBotResponse(this.userInput);
    this.userInput = null;
  }
  public getBotResponse(intent:string = 'hi'){
   let params = {  leadId: 1, intent};
    this.botResponseError = false;
    this.botEditorService.getResponse(this.tenantId, this.botId,params).subscribe(res => {
      let response = this.transformNode(res);
      this.convo = [...this.convo, ...response];
    }, (error) => {
      this.botResponseError = true;
    });
  }

  transformNode(nodes) {
    let res =[];
   nodes.forEach(element => {
     res.push({
       type: 'text',
       content: element,
     })
   }); 
   return res;
  }
  
}