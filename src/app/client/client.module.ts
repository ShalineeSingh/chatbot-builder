
import { NgModule } from '@angular/core';

import { ClientRoutingModule, ClientRoutingComponents } from './client-routing.module';
import { ClientComponent } from './client.component';

@NgModule({
  declarations: [
    ClientComponent,
    ClientRoutingComponents,
  ],
  imports: [
    ClientRoutingModule,
  ],
  providers: [],
})
export class ClientModule { }
