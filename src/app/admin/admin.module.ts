
import { NgModule } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
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
    NgbDropdownModule,
  ],
  providers: [],
})
export class AdminModule { }
