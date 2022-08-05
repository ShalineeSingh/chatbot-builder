import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'button-modal',
  styleUrls: ['./button-modal.component.scss'],
  templateUrl: './button-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ButtonModalComponent {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) { }
}