import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'Card-modal',
  styleUrls: ['./Card-modal.component.scss'],
  templateUrl: './Card-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CardModalComponent {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) { }
}