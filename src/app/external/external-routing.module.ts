import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ExternalComponent } from './external.component';
import { LoginComponent } from './login/login.component';
import { VerifyAccountComponent } from "./verify-account/verify-account.component";

const routes: Routes = [
  {
    path: '',
    component: ExternalComponent,
    children: [{
      path: 'signup',
      component: SignupComponent,
    },
    {
      path: 'login',
      component: LoginComponent,
    },
    {
      path: 'reset-password',
      component: ResetPasswordComponent
    },
    {
      path: 'change-password',
      component: ChangePasswordComponent
    },
    {
      path: 'verify',
      component: VerifyAccountComponent
    }]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ExternalRoutingModule { }
export const ExternalRoutingComponents = [
  SignupComponent,
  ResetPasswordComponent,
  ChangePasswordComponent,
  LoginComponent,
  VerifyAccountComponent];