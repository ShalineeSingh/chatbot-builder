import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Router } from '@angular/router';
import { AlertConfigModel } from './alert-config.model';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AlertComponent implements OnInit {
  constructor(private alertService: AlertService, private router: Router) { }
  public alertConfig: AlertConfigModel;
  public alert_icon: string;
  public alert_type: string;
  public alert_message: string;

  public customclass: string;
  public generic_alerts = ['success', 'warning', 'danger', 'primary'];
  public is_timeout_available = true;
  ngOnInit() {
    this.alertService.configObservable.subscribe(data => {
      this.alertConfig = data;
      this.updateAlert();
    });
    this.router.events.subscribe(() => {
      if (this.alertConfig && this.alertConfig.type === 'danger') {
        this.closeAlert();
      }
    });
  }

  public updateAlert() {
    this.alert_message = this.alertConfig.message;
    this.alert_type = 'show-alert ' + this.alertConfig.type;
    if (this.alertConfig.type === 'warning') {
      this.alert_icon = 'exclamation-circle';
    } else if (this.alertConfig.type === 'danger') {
      this.alert_icon = 'exclamation-triangle';
    } else if (this.alertConfig.type === 'success') {
      this.alert_icon = 'check-circle';
    } else if (this.alertConfig.type === 'primary') {
      this.alert_icon = 'check-circle-fill';
    }
    setTimeout(() => {
      this.closeAlert();
    }, 10000);
  }

  public closeAlert() {
    this.alertConfig = undefined;
  }
}