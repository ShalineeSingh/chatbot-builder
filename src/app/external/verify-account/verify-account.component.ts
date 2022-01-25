import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertConfigModel } from 'src/app/common/alert/alert-config.model';
import { AlertService } from 'src/app/common/alert/alert.service';
import { ExternalService } from '../external.service';
import { IVerifyAccount } from './verify-account.interface';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  providers: [ExternalService]
})
export class VerifyAccountComponent implements OnInit {
  public buttonLoader: boolean;
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
    let body: IVerifyAccount = {
      verificationCode: this.confirmationCode,
      userName: this.email,
    }
    this.externalService.verify(body).subscribe((res: boolean) => {
      const config: AlertConfigModel = {
        type: 'primary',
        message: "Account verified successfully"
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
