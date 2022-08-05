import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'image-modal',
  styleUrls: ['./image-modal.component.scss'],
  templateUrl: './image-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ImageModalComponent {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) { }
}