import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuardService } from './guards/role.guard';
import { AuthGuardService } from './guards/auth.guard';
import { SessionGuardService } from './guards/session.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import("./admin/admin.module").then(m => m.AdminModule),
    // canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService, RoleGuardService, SessionGuardService]
})

export class AppRoutingModule { }
export const RoutingComponents = [];
