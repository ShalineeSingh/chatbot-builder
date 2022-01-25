import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AlertConfigModel } from './alert-config.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  public configSubject: Subject<AlertConfigModel>;
  public configObservable: Observable<AlertConfigModel>;
  constructor() {
    this.configSubject = new Subject<AlertConfigModel>();
    this.configObservable = this.configSubject.asObservable();
  }
}