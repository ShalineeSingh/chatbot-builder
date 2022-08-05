import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'document-modal',
  styleUrls: ['./document-modal.component.scss'],
  templateUrl: './document-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DocumentModalComponent {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) { }
}