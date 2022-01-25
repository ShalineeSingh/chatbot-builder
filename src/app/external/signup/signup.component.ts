import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalService } from '../external.service';
import { ISignup } from './signup.interface';
import { AlertConfigModel } from '../../common/alert/alert-config.model';
import { AlertService } from '../../common/alert/alert.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [ExternalService]
})
export class SignupComponent implements OnInit {
  public userFirstName: string;
  public userLastName: string;
  public email: string;
  public password: string;
  public phoneNumber: string;
  public repeatPassword: string;
  public buttonLoader: boolean;
  constructor(private router: Router, private externalService: ExternalService, private alertService: AlertService) { }

  ngOnInit(): void {
  }

  public goToLogin() {
    this.router.navigate(['login']);
  }

  public onSubmit(){
    this.buttonLoader = true;
    let body: ISignup = {
      userName: this.email,
      password: this.password,
      firstName: (this.userFirstName + ' ' + this.userLastName).trim(),
    }
    this.externalService.signup(body).subscribe((res: boolean) => {
      const config: AlertConfigModel = {
        type: 'primary',
        message: "Signup Successful"
      };
      this.alertService.configSubject.next(config);
      this.router.navigate(['verify'], {queryParams: {email: this.email}});
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
