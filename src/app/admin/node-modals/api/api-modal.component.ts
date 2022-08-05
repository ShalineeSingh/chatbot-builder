import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'api-modal',
  styleUrls: ['./api-modal.component.scss'],
  templateUrl: './api-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ApiModalComponent {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) { }
}