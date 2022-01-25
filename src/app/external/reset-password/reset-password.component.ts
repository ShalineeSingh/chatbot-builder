import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertConfigModel } from '../../common/alert/alert-config.model';
import { AlertService } from '../../common/alert/alert.service';
import { IResetPassword } from './reset-password.interface';
import { ExternalService } from '../external.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [ExternalService]
})
export class ResetPasswordComponent implements OnInit {
  public buttonLoader: boolean;
  public email: string;
  constructor(private router: Router, private alertService: AlertService, public externalService: ExternalService) { }

  ngOnInit(): void {
  }

  public onSubmit() {
    this.buttonLoader = true;
    let body: IResetPassword = {
      userName: this.email
    }
    this.externalService.reset(body).subscribe((res: boolean) => {
      const config: AlertConfigModel = {
        type: 'primary',
        message: "Link sent to the email address"
      };
      this.alertService.configSubject.next(config);
      this.router.navigate(['/change-password'], { queryParams: { email: this.email } });
    },
      (error) => {
        const config: AlertConfigModel = {
          type: 'danger',
          message: error
        };
        this.alertService.configSubject.next(config);
      }).add(() => this.buttonLoader = false);
  }

  public goToLogin() {
    this.router.navigate(['login']);
  }
}
