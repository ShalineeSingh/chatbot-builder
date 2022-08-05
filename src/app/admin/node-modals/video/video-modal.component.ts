import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'video-modal',
  styleUrls: ['./video-modal.component.scss'],
  templateUrl: './video-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class VideoModalComponent {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) { }
}