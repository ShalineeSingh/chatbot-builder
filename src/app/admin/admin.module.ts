
import { NgModule } from '@angular/core';

import { AdminRoutingModule, AdminRoutingComponents } from './admin-routing.module';
import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminRoutingComponents,
  ],
  imports: [
    AdminRoutingModule,
  ],
  providers: [],
})
export class AdminModule { }
