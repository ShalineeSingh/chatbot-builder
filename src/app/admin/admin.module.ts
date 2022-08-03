
import { NgModule } from '@angular/core';
import { DrawflowDirective } from '../common/directives/app-drawflow.directive';

import { AdminRoutingModule, AdminRoutingComponents } from './admin-routing.module';
import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminRoutingComponents,
    DrawflowDirective,
  ],
  imports: [
    AdminRoutingModule,
  ],
  providers: [],
})
export class AdminModule { }
