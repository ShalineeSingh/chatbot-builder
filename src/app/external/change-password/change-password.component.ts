import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertConfigModel } from 'src/app/common/alert/alert-config.model';
import { AlertService } from 'src/app/common/alert/alert.service';
import { ExternalService } from '../external.service';
import { INewPassword } from './change-password.interface';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [ExternalService]
})
export class ChangePasswordComponent implements OnInit {
  public buttonLoader: boolean;
  public password: string;
  public repeatPassword: string;
  public confirmationCode: number;
  public email: string;
  constructor(private router: Router, 
    private externalService: ExternalService,
     private alertService: AlertService,
     private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams.email;
    if(!this.email) this.router.navigate(['login']);
  }

  onSubmit() {
    this.buttonLoader = true;
    let body: INewPassword = {
      verificationCode: this.confirmationCode,
      userName: this.email,
      password: this.password,
    }
    this.externalService.newPassword(body).subscribe((res: boolean) => {
      const config: AlertConfigModel = {
        type: 'primary',
        message: "Password changed successfully"
      };
      this.alertService.configSubject.next(config);
      this.router.navigate(['/user']);
    },
      (error) => {
        const config: AlertConfigModel = {
          type: 'danger',
          message: error
        };
        this.alertService.configSubject.next(config);
      }).add(() => this.buttonLoader = false);
  }

}
