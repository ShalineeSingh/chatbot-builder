import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ILogin, ILoginResponse } from './login.interface';
import { ExternalService } from '../external.service';
import { AlertService } from '../../common/alert/alert.service';
import { AlertConfigModel } from '../../common/alert/alert-config.model';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ExternalService]
})
export class LoginComponent implements OnInit {
  public buttonLoader: boolean;
  public email: string;
  public password: string;
  public rememberMe: boolean;
  constructor(private router: Router,
    private externalService: ExternalService,
    private alertService: AlertService,
    private appService: AppService) { }

  ngOnInit(): void {
    this.externalService.healthCheck().subscribe(res=>console.log(res));
  }

  public goToSignup() {
    this.router.navigate(['/signup']);
  }

  public goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  public onSubmit() {
    this.buttonLoader = true;
    let body: ILogin = {
      userName: this.email,
      password: this.password,
    }
    this.externalService.login(body).subscribe((res: ILoginResponse) => {
      const config: AlertConfigModel = {
        type: 'primary',
        message: "Login Successful"
      };
      this.alertService.configSubject.next(config);
      if (this.rememberMe) this.appService.setSession(res.sessionToken, res.expiration);
      else this.appService.setTempSession(res.sessionToken, res.expiration);

      this.router.navigate(['admin']);
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
